import asyncHandler from '../utils/asyncHandler.js'
import { APIError } from '../utils/apiError.js'
import { APIResponse } from '../utils/APIResponse.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { User } from '../models/user.model.js'
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
      try {
            const user = await User.findById(userId)
            const accessToken = await user.generateAccessToken()
            const refreshToken = await user.generateRefreshToken()

            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })

            return { accessToken, refreshToken }

      } catch (error) {
            throw new APIError(500, "Something went wrong while generating Tokens")
      }
}

const registerUser = asyncHandler(async (req, res) => {
      const { username, email, fullName, password } = req.body
      if (
            [username, email, fullName, password].includes(undefined) || [username, email, fullName, password].trim().includes("")
      ) {
            throw new APIError(400, "Please provide all the required fields")
      }
      // Other Validations

      const existedUser = await User.findOne({
            $or: [
                  { username },
                  { email }
            ]
      })
      if (existedUser) {
            throw new APIError(400, "User already exists")
      }

      const avatarLocalPath = req.files?.avatar[0]?.path;

      let coverImgLocalPath;
      if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImgLocalPath = await req.files.coverImage[0].path;
            console.log("Control is in if block");
      }
      console.log(coverImgLocalPath);
      if (!avatarLocalPath) {
            throw new APIError(400, "Avatar is required !!")
      }

      const avatar = await uploadOnCloudinary(avatarLocalPath)
      const coverImage = await uploadOnCloudinary(coverImgLocalPath)

      if (!avatar) throw new APIError(500, "Something went wrong while uploading avatar")

      const user = await User.create({
            username: username.toLowerCase(),
            email,
            fullName,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || ""
      })

      const newUser = await User.findById(user._id).select(
            "-password -watchHistory -refreshToken -__v -createdAt -updatedAt"
      )

      if (!newUser) throw new APIError(500, "Something went wrong while creating user")

      return res.status(201).json(new APIResponse(201, newUser, "User Registered Successfully"))

})

const loginUser = asyncHandler(async (req, res) => {
      const { username, email, password } = req.body
      console.log("Username", req.body);

      if (!username && !email) {
            throw new APIError(400, "Email or username is required")
      }

      if (password === undefined || password === "") {
            throw new APIError(400, "Password is required")
      }

      const user = await User.findOne({
            $or: [
                  { username },
                  { email }
            ]
      })

      if (!user) throw new APIError(404, "User doesn't exist")

      const isPasswordValid = await user.isPasswordcorrect(password)

      if (!isPasswordValid) throw new APIError(401, "Invalid User Credentials")

      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

      user.refreshToken = refreshToken

      const loggedInUser = user.toObject()
      delete loggedInUser['_id']
      delete loggedInUser['password']
      delete loggedInUser['createdAt']
      delete loggedInUser['updatedAt']
      delete loggedInUser['__v']

      console.log(loggedInUser);

      const options = {
            httpOnly: true,
            secure: true
      }

      return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                  new APIResponse(
                        200,
                        {
                              user
                        },
                        "User logged in successfully"
                  )
            )
})

const logoutUser = asyncHandler(async (req, res) => {
      const user = User.findByIdAndUpdate(
            req.user._id,
            {
                  $unset: {
                        refreshToken: 1
                  }
            },
            {
                  new: true
            }
      )

      const options = {
            httpOnly: true,
            secure: true
      }

      return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(
                  new APIResponse(
                        200,
                        {},
                        "User logged out successfully"
                  )
            )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

      if (!incomingRefreshToken) throw new APIError(401, "Unathorized Access")

      const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
      )

      if (!decodedToken || !decodedToken['_id']) throw new APIError(401, "Unathorized Access")

      const user = await User.findById(decodedToken._id)

      if (!user) throw new APIError(401, "Invalid refresh token")

      if (incomingRefreshToken !== user?.refreshToken) throw new APIError(401, "Refesh Token Invalid or Expired")

      try {
            const { newAccessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
            console.log("New Access Token", newAccessToken);

            const options = {
                  httpOnly: true,
                  secure: true
            }

            return res
                  .status(200)
                  .cookie("accessToken", newAccessToken, options)
                  .cookie("refreshToken", newRefreshToken, options)
                  .json(
                        new APIResponse(
                              200,
                              {
                                    username: user.username,
                                    email: user.email,
                                    fullName: user.fullName,
                                    avatar: user.avatar,
                                    coverImage: user.coverImage,
                                    watchHistory: user.watchHistory,
                                    accessToken: newAccessToken,
                                    refreshToken: newRefreshToken
                              },
                              "Session restored Successfully"
                        )
                  )
      } catch (error) {
            throw new APIError(501, error?.message || "Error while restarting session")
      }
})

const changeUserPassword = asyncHandler(async (req, res) => {
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(req.user?._id)
      if (!user.isPasswordcorrect(oldPassword)) throw new APIError(400, "Old Password is incorrect")

      user.password = newPassword;
      await user.save({ validateBeforeSave: true })

      return res
            .status(200)
            .json(new APIResponse(200, {}, "Password Updated Successfully"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
      return res
            .status(200)
            .json(new APIResponse(200, req.user, "User Data retrieved Successfully"))
})

const updateUserDetails = asyncHandler(async (req, res) => {
      const { fullName, username } = req.body

      if (!username && !fullName) throw new APIError(401, "Atleast one field is required")

      const updateFields = {};
      if (fullName) updateFields.fullName = fullName;
      if (username) updateFields.username = username;

      const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true }
      ).select("-password -watchHistory -refreshToken -__v -createdAt -updatedAt");

      return res
            .status(200)
            .json(new APIResponse(200, { updatedUser }, "User Details updated Successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
      const avatarLocalPath = req.file?.avatar;

      if (!avatarLocalPath) throw new APIError(401, "Avatar file not found")

      const avatar = await uploadOnCloudinary(avatarLocalPath)

      if (!avatar?.url) throw new APIError(500, "Error while uploading Avatar on Database")

      const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                  $set: {
                        avatar: avatar.url
                  }
            },
            {
                  new: true
            }
      ).select("-password -watchHistory -refreshToken -__v -createdAt -updatedAt");

      return res
            .status(200)
            .json(new APIResponse(
                  200,
                  { user },
                  "Avatar updated Successfully"
            ))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
      const coverImageLocalPath = req.file?.coverimage;

      if (!coverImageLocalPath) throw new APIError(401, "Cover Image not found")

      const coverImage = await uploadOnCloudinary(coverImageLocalPath)

      if (!coverImage?.url) throw new APIError(500, "Error while uploading Cover image on Database")

      const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                  $set: {
                        coverImage: coverImage.url
                  }
            },
            {
                  new: true
            }
      ).select("-password -watchHistory -refreshToken -__v -createdAt -updatedAt");

      return res
            .status(200)
            .json(new APIResponse(
                  200,
                  { user },
                  "Cover Image updated Successfully"
            ))
})

const getChannelDetails = asyncHandler(async (req, res) => {
      const { username } = req.params

      if (!username?.trim()) throw new APIError(404, "User doesn't exist")

      const channel = await User.aggregate([
            {
                  $match: {
                        username: username?.toLowerCase()
                  }
            },
            {
                  $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "channel",
                        as: "subscribers"
                  }
            },
            {
                  $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "subscriber",
                        as: "subscribedByMe"
                  }
            },
            {
                  $addFields: {
                        subscribersCount: {
                              $size: "$subscribers"
                        },
                        channelsSubscriberByMeCount: {
                              $size: "$subscribedByMe"
                        },
                        isSubscribed: {
                              $cond: {
                                    if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                                    then: true,
                                    else: false
                              }
                        }
                  }
            },
            {
                  $project: {
                        username: 1,
                        email: 1,
                        fullName: 1,
                        avatar: 1,
                        coverImage: 1,
                        subscribersCount: 1,
                        channelsSubscriberByMeCount: 1
                  }
            }
      ])

      if (!channel?.length) throw new APIError(404, "User doesn't exist")

      return res
            .status(200)
            .json(new APIResponse(200, channel[0], "Channel Details fetched Successfully"))
})

export {
      registerUser,
      loginUser,
      logoutUser,
      refreshAccessToken,
      changeUserPassword,
      getCurrentUser,
      updateUserDetails,
      updateUserAvatar,
      updateUserCoverImage,
      getChannelDetails
}