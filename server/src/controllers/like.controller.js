import asyncHandler from '../utils/asyncHandler.js'
import { APIError } from '../utils/apiError.js'
import { APIResponse } from '../utils/APIResponse.js'
import { User } from '../models/user.model.js'
import { Like } from '../models/like.model.js'

const toggleVideoLike = asyncHandler(async (req, res) => {
      const { videoId } = req.params
      const userId = await req.user?._id

      if (!userId) throw new APIError(401, 'Unauthorized request')

      const user = await User.findById(userId)
      if (!user) throw new APIError(401, 'Unauthorized request')

      const likeVideoData = {
            video: videoId,
            likedBy: userId
      }

      const currentStatus = await Like.findOneAndDelete(likeVideoData)

      if (!currentStatus) {
            await Like.create(likeVideoData)
            return res.status(201).json(new APIResponse(201, videoId, 'Video Liked'))
      }
      else {
            return res.status(201).json(new APIResponse(201, videoId, 'Video Disliked'))
      }
})
const toggleCommentLike = asyncHandler(async (req, res) => {
      const { commentId } = req.params
      const userId = await req.user?._id

      if (!userId) throw new APIError(401, 'Unauthorized request')

      const user = await User.findById(userId)
      if (!user) throw new APIError(401, 'Unauthorized request')

      const likeCommentData = {
            comment: commentId,
            likedBy: userId
      }

      const currentStatus = await Like.findOneAndDelete(likeCommentData)

      if (!currentStatus) {
            await Like.create(likeCommentData)
            return res.status(201).json(new APIResponse(201, commentId, 'Comment Liked'))
      }
      else {
            return res.status(201).json(new APIResponse(201, commentId, 'Comment Disliked'))
      }
})
const toggleTweetLike = asyncHandler(async (req, res) => {
      const { tweetId } = req.params
      const userId = await req.user?._id

      if (!userId) throw new APIError(401, 'Unauthorized request')

      const user = await User.findById(userId)
      if (!user) throw new APIError(401, 'Unauthorized request')

      const likeTweetData = {
            tweet: tweetId,
            likedBy: userId
      }

      const currentStatus = await Like.findOneAndDelete(likeTweetData)

      if (!currentStatus) {
            await Like.create(likeTweetData)
            return res.status(201).json(new APIResponse(201, tweetId, 'Liked'))
      }
      else {
            return res.status(201).json(new APIResponse(201, tweetId, 'Disliked'))
      }
})
const getAllLikedVideos = asyncHandler(async (req, res) => {
      const userId = await req.user?._id
      if (!userId) throw new APIError(401, 'Unauthorized request')

      const user = await User.findById(userId)
      if (!user) throw new APIError(401, 'Unauthorized request')

      const likedVideos = await Like.find({ likedBy: userId }).populate('video').select(
            '-_id -updatedAt -createdAt -__v -likedBy'
      )

      if (!likedVideos) throw new APIError(404, 'No liked videos found')

      return res.status(200).json(new APIResponse(200, likedVideos, 'Liked Videos fetched successfully'))
})

export {
      toggleVideoLike,
      toggleCommentLike,
      toggleTweetLike,
      getAllLikedVideos
}