import asyncHandler from '../utils/asyncHandler.js'
import { APIError } from '../utils/apiError.js'
import { APIResponse } from '../utils/APIResponse.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { User } from '../models/user.model.js'
import { Video } from '../models/video.model.js'

const extractPublicIdFromUrl = (imageURL) => {
      try {
            const parts = imageURL.split("/").pop().split(".");
            // Ensure public ID format before returning
            if (parts.length === 2) {
                  return parts[0];
            } else {
                  throw new APIError(401, "Invalid URL format for extracting public ID");
            }
      } catch (error) {
            throw new APIError(401, "Couldn't extract Public Id")
      }
};
const deleteFromCloudinary = asyncHandler(async (publicId) => await cloudinary.v2.uploader.destroy(publicId))

const postAVideo = asyncHandler(async (req, res) => {
      const { title, description, tags } = req.body
      const userId = req.user?._id
      if (!userId) throw new APIError(401, 'Unauthorized request')

      const user = await User.findById(userId)
      if (!user) throw new APIError(401, 'Unauthorized request')

      const videoLocalPath = req.files?.Video[0]?.path;

      let thumbnailLocalPath;
      if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
            thumbnailLocalPath = await req.files.thumbnail[0].path;
      }

      console.log("Thumbnail local Path", thumbnailLocalPath);

      if (!videoLocalPath) {
            throw new APIError(400, "Video file is required")
      }

      const video = await uploadOnCloudinary(videoLocalPath)
      if (!video) throw new APIError(500, "Failed to upload video")
      if (thumbnailLocalPath) {
            const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
            if (!thumbnail) throw new APIError(500, "Failed to upload thumbnail")
      }

      const thisVideo = await Video.create({
            title,
            description: description || "",
            tags: tags.split(',').map(tag => tag.trim().toLowerCase()),
            videoUrl: video.url,
            thumbnailUrl: thumbnail?.url || "",
            videoOwner: userId
      })

      const newVideo = await Video.findById(thisVideo._id).select(
            "-__v -updatedAt -createdAt"
      )

      if (!newVideo) throw new APIError(500, "Video Couldn't be uploaded")

      return res.status(201).json(new APIResponse(201, newVideo, "Video Uploaded Successfully"))
})
const deleteAVideo = asyncHandler(async (req, res) => {
      const { videoId } = req.params
      const userId = req.user?._id

      if (!userId) throw new APIError(401, 'Unauthorized request')

      const user = await User.findById(userId)
      if (!user) throw new APIError(401, 'Unauthorized request')

      const video = await Video.findById(videoId);
      if (!video) throw new APIError(400, "Video doesn't exist");
      else if (!video.videoOwner.equals(userId)) throw new APIError(401, "Unauthorized request")

      if (video.videoUrl) {
            const cloudinaryPublicId = extractPublicIdFromUrl(video.videoUrl);
            await deleteFromCloudinary(cloudinaryPublicId);
      }

      // Delete from the database
      await video.remove();

      return res.status(200).json(new APIResponse(200, {}, "Video deleted successfully"));
})
const fetchAllVideos = asyncHandler(async (req, res) => {
      const { page = 1, limit = 10, query, sortBy, sortType, username } = req.query

      if (isNaN(page) || isNaN(limit)) {
            throw new APIError(400, 'Invalid page or limit parameters');
      }

      const user = await User.findOne({ username })
      if (!user) throw new APIError(401, 'Unauthorized request')

      const queryOptions = {
            videoOwner: user._id, // Filter by videoOwner using indexed field
            select: '-__v -updatedAt', // Exclude unwanted fields
      };

      // Add search query if provided
      if (query) {
            queryOptions.$text = { $search: query }; // Utilize text search index
      }

      const options = {
            page,
            limit,
            sort: {},
      };

      if (sortBy && sortType) {
            options.sort[sortBy] = sortType === 'asc' ? 1 : -1;
      }

      const [videos, totalVideos] = await Promise.all([
            Video.find(queryOptions, options),
            Video.countDocuments(queryOptions),
      ]);

      if (videos.length === 0) {
            throw new APIError(400, 'No videos found');
      }

      if (videos.length === 0) throw new APIError(400, "No Videos found")

      return res.status(201).json(new APIResponse(200, { videos, totalVideos }, "Videos fetched successfully"))
})
const updateVideoDetails = asyncHandler(async (req, res) => {
      const { title, description, tags } = req.body
      const { videoId } = req.params
      const userId = req.user?._id
      if (!userId) throw new APIError(401, 'Unauthorized request')

      const user = await User.findById(userId)
      if (!user) throw new APIError(401, 'Unauthorized request')

      const video = await Video.findById(videoId);
      if (!video) throw new APIError(400, "Video doesn't exist");
      else if (!video.videoOwner.equals(userId)) throw new APIError(401, "Unauthorized request")

      const thumbnailLocalPath = req.file?.thumbnail[0].path;
      if (thumbnailLocalPath) {
            thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
            if (!thumbnail) throw new APIError(500, "Failed to upload thumbnail")
            updateFields.thumbnail = thumbnail.url;
      }

      const updateFields = {};
      if (title) updateFields.title = title;
      if (description) updateFields.description = description;
      if (tags) updateFields.tags = tags.split(',').map(tag => tag.trim().toLowerCase());

      const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { $set: updateFields },
            { new: true }
      ).select("-__v -createdAt -updatedAt")

      if (!updatedVideo) throw new APIError(501, "Video couldn't be updated. Please try again");

      return res.status(201).json(new APIResponse(201, updatedVideo, "Video updated Successfully"))
})
const togglePublishStatus = asyncHandler(async (req, res) => {
      const { videoId } = req.params
      const userId = req.user?._id

      if (!userId) throw new APIError(401, 'Unauthorized request')

      const user = await User.findById(userId)
      if (!user) throw new APIError(401, 'Unauthorized request')

      const video = await Video.findById(videoId);
      if (!video) throw new APIError(400, "Video doesn't exist");
      else if (!video.videoOwner.equals(userId)) throw new APIError(401, "Unauthorized request")

      const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { $set: { isPublished: !video.isPublished } },
            { new: true }
      ).select("-__v -createdAt -updatedAt")

      if (!updatedVideo) throw new APIError(501, "Video couldn't be updated. Please try again");

      return res.status(201).json(new APIResponse(201, updatedVideo, "Video updated Successfully"))
})

export {
      postAVideo,
      deleteAVideo,
      fetchAllVideos,
      updateVideoDetails,
      togglePublishStatus
}