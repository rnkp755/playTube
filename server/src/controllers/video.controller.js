import asyncHandler from "../utils/asyncHandler.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import Fuse from "fuse.js";

const extractPublicIdFromUrl = (imageURL) => {
    try {
        const parts = imageURL.split("/").pop().split(".");
        // Ensure public ID format before returning
        if (parts.length === 2) {
            return parts[0];
        } else {
            throw new APIError(
                401,
                "Invalid URL format for extracting public ID"
            );
        }
    } catch (error) {
        throw new APIError(401, "Couldn't extract Public Id");
    }
};
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
        throw error;
    }
};

const postAVideo = asyncHandler(async (req, res) => {
    const { title, description, tags } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new APIError(401, "Unauthorized request");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new APIError(401, "Unauthorized request");
    }

    const videoLocalPath = await req.files?.video[0]?.["path"];
    const thumbnailLocalPath = await req.files?.thumbnail?.[0]?.["path"];

    console.log("Video local Path", videoLocalPath);
    console.log("Thumbnail local Path", thumbnailLocalPath);

    if (!videoLocalPath) {
        throw new APIError(400, "Video file is required");
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    console.log("Video", video);
    if (!video) {
        throw new APIError(500, "Failed to upload video");
    }

    let thumbnail;

    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail) {
            throw new APIError(500, "Failed to upload thumbnail");
        }
    }
    console.log("Thumbnail", thumbnail?.url);
    const thisVideo = await Video.create({
        title,
        description: description || "",
        duration: video.duration,
        tags: tags.split(",").map((tag) => tag.trim().toLowerCase()),
        videofile: video.url,
        thumbnail: thumbnail?.url || "",
        videoOwner: userId,
    });

    const newVideo = await Video.findById(thisVideo._id).select(
        "-__v -updatedAt -createdAt"
    );

    if (!newVideo) {
        throw new APIError(500, "Video Couldn't be uploaded");
    }

    return res
        .status(201)
        .json(new APIResponse(201, newVideo, "Video Uploaded Successfully"));
});
const deleteAVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!userId) throw new APIError(401, "Unauthorized request");

    const user = await User.findById(userId);
    if (!user) throw new APIError(401, "Unauthorized request");

    const video = await Video.findById(videoId);
    if (!video) throw new APIError(400, "Video doesn't exist");
    else if (!video.videoOwner.equals(userId))
        throw new APIError(401, "Unauthorized request");

    const cloudinaryPublicId = extractPublicIdFromUrl(video.videofile);
    deleteFromCloudinary(cloudinaryPublicId);

    if (video.thumbnail) {
        const cloudinaryPublicId = extractPublicIdFromUrl(video.thumbnail);
        deleteFromCloudinary(cloudinaryPublicId);
    }

    // Delete from the database
    await Video.deleteOne({ _id: videoId });

    return res
        .status(200)
        .json(new APIResponse(200, {}, "Video deleted successfully"));
});
const fetchAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
    } = req.query;

    const { username } = req.params;

    if (isNaN(page) || isNaN(limit)) {
        throw new APIError(400, "Invalid page or limit parameters");
    }

    // Step 1: Build base query to filter videos
    let baseQuery = {
        isPublished: true,
    };

    if (username) {
        const user = await User.findOne({ username });
        if (user._id) {
            baseQuery.videoOwner = user._id;
        }
    }

    const options = {
        skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: sortType === "asc" ? 1 : -1 },
    };

    // Step 2: Fetch all videos with basic query and options
    let videos = await Video.find(baseQuery, null, options)
        .populate({
            path: "videoOwner",
            select: "-password -refreshToken -settings -__v -createdAt -updatedAt -watchHistory",
            options: { lean: true },
        })
        .select("-__v -updatedAt")
        .lean();

    // Step 3: Apply Fuse.js fuzzy search if 'query' is present
    if (query) {
        const fuse = new Fuse(videos, {
            includeScore: true,
            keys: ["title", "description"],
        });
        videos = fuse.search(query).map((result) => result.item);
    }

    // Step 4: Count videos after filtering
    const totalVideos = videos.length;

    // Step 5: Apply pagination after fuzzy filtering
    const paginatedVideos = videos.slice(
        options.skip,
        options.skip + options.limit
    );

    // Step 6: Return response
    if (paginatedVideos.length === 0) {
        throw new APIError(400, "No Videos found");
    }

    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                { videos: paginatedVideos, totalVideos },
                "Videos fetched successfully"
            )
        );
});
const updateVideoDetails = asyncHandler(async (req, res) => {
    const { title, description, tags } = req.body;
    const { videoId } = req.params;
    const userId = req.user?._id;
    if (!userId) throw new APIError(401, "Unauthorized request");

    const user = await User.findById(userId);
    if (!user) throw new APIError(401, "Unauthorized request");

    const video = await Video.findById(videoId);
    if (!video) throw new APIError(400, "Video doesn't exist");
    else if (!video.videoOwner.equals(userId))
        throw new APIError(401, "Unauthorized request");

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (tags)
        updateFields.tags = tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase());

    const thumbnailLocalPath = req.file?.["path"];

    let thumbnail;

    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnail) throw new APIError(500, "Failed to upload thumbnail");
        updateFields["thumbnail"] = thumbnail.url;
        console.log(updateFields);
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { new: true }
    ).select("-__v -createdAt -updatedAt");

    if (!updatedVideo)
        throw new APIError(501, "Video couldn't be updated. Please try again");

    return res
        .status(201)
        .json(new APIResponse(201, updatedVideo, "Video updated Successfully"));
});
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!userId) throw new APIError(401, "Unauthorized request");

    const user = await User.findById(userId);
    if (!user) throw new APIError(401, "Unauthorized request");

    const video = await Video.findById(videoId);
    if (!video) throw new APIError(400, "Video doesn't exist");
    else if (!video.videoOwner.equals(userId))
        throw new APIError(401, "Unauthorized request");

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: { isPublished: !video.isPublished } },
        { new: true }
    ).select("-__v -createdAt -updatedAt");

    if (!updatedVideo)
        throw new APIError(501, "Video couldn't be updated. Please try again");

    return res
        .status(201)
        .json(new APIResponse(201, updatedVideo, "Video updated Successfully"));
});
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId)
        .populate({
            path: "videoOwner",
            select: "-password -refreshToken -settings -__v -createdAt -updatedAt -watchHistory",
            options: { lean: true },
        })
        .select("-__v -updatedAt")
        .lean();

    if (!video) {
        throw new APIError(404, "Video not found");
    }
    if (!video.isPublished) {
        throw new APIError(403, "Video is not published");
    }
    return res
        .status(200)
        .json(new APIResponse(200, video, "Video fetched successfully"));
});
const getVideoSuggestions = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new APIError(404, "Video not found");
    }

    const suggestions = await Video.find({
        _id: { $ne: videoId },
        tags: { $in: video.tags },
        isPublished: true,
    })
        .populate({
            path: "videoOwner",
            select: "-password -refreshToken -settings -__v -createdAt -updatedAt -watchHistory",
            options: { lean: true },
        })
        .select("-__v -updatedAt")
        .limit(10)
        .lean();
    return res
        .status(200)
        .json(
            new APIResponse(
                200,
                suggestions,
                "Video suggestions fetched successfully"
            )
        );
});

export {
    postAVideo,
    deleteAVideo,
    fetchAllVideos,
    updateVideoDetails,
    togglePublishStatus,
    getVideoById,
    getVideoSuggestions,
};
