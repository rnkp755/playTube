import { Video, VideoFormData, Comment, User } from "../types";
import { VIDEOS, COMMENTS, VIDEO_CACHE_DURATION } from "../utils/constants";
import API from "../utils/axios";

// Helper to simulate API delay
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(data);
		}, delay);
	});
};

// Helper function to map VIDEOS data to Video type
const mapToVideo = (videoData: any): Video => ({
	...videoData,
	videoOwner: videoData.owner,
});

// Helper function to map Video type back to VIDEOS format
const mapFromVideo = (video: Video): any => ({
	...video,
	owner: video.videoOwner,
});

// Helper function to map USERS data to User type
const mapToUser = (userData: any): User => ({
	...userData,
	fullName: userData.fullname,
});

// Cache management
const videoCache = {
	data: null as Video[] | null,
	timestamp: 0,
};

export const videoService = {
	// Get all videos with caching
	async getVideos() {
		const currentTime = Date.now();

		// Check if cache is valid
		if (
			videoCache.data &&
			currentTime - videoCache.timestamp < VIDEO_CACHE_DURATION
		) {
			return Promise.resolve(videoCache.data);
		}

		// Simulate API call to get videos
		try {
			// In a real app, this would fetch from the server
			const rawVideos = VIDEOS.filter((video) => video.isPublished);
			const videos = rawVideos.map(mapToVideo);

			// Update cache
			videoCache.data = videos;
			videoCache.timestamp = currentTime;

			// Save to localStorage as well
			localStorage.setItem(
				"videosCache",
				JSON.stringify({
					data: videos,
					timestamp: currentTime,
				})
			);

			return simulateApiCall(videos);
		} catch (error) {
			// If API fails, try to use localStorage cache regardless of timestamp
			const cachedData = localStorage.getItem("videosCache");
			if (cachedData) {
				const parsed = JSON.parse(cachedData);
				return Promise.resolve(parsed.data);
			}

			return Promise.reject(error);
		}
	},

	// Get video by ID
	async getVideoById(videoId: string) {
		// Check cache first
		if (videoCache.data) {
			const cachedVideo = videoCache.data.find((v) => v._id === videoId);
			if (cachedVideo) {
				return Promise.resolve(cachedVideo);
			}
		}

		// If not in cache, simulate API call
		const rawVideo = VIDEOS.find((v) => v._id === videoId);

		if (!rawVideo) {
			return simulateApiCall(
				Promise.reject(new Error("Video not found")),
				300
			);
		}

		// Increment view count (in a real app, this would be done on the server)
		rawVideo.views += 1;

		const video = mapToVideo(rawVideo);
		return simulateApiCall(video);
	},

	// Get video suggestions (not the current video)
	async getVideoSuggestions(currentVideoId: string, limit = 10) {
		// Simulate API call to get video suggestions
		const rawSuggestions = VIDEOS.filter(
			(video) => video._id !== currentVideoId && video.isPublished
		).slice(0, limit);

		const suggestions = rawSuggestions.map(mapToVideo);
		return simulateApiCall(suggestions);
	},

	// Upload a new video
	async uploadVideo(videoData: VideoFormData, _userId: string) {
		// In a real app, this would upload files to server/storage

		// Create a new video object
		const newVideo: Video = {
			_id: `video${VIDEOS.length + 1}`,
			title: videoData.title,
			description: videoData.description,
			videofile: videoData.videoFile
				? URL.createObjectURL(videoData.videoFile)
				: "https://example.com/placeholder.mp4",
			thumbnail: videoData.thumbnail
				? URL.createObjectURL(videoData.thumbnail)
				: "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg",
			duration: Math.floor(Math.random() * 1200) + 180, // Random duration between 3-23 minutes
			views: 0,
			isPublished: videoData.isPublished,
			videoOwner: mapToVideo(VIDEOS[0]).videoOwner, // Use a mock user (in real app, would be current user)
			tags: videoData.tags,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Add to videos array (in real app, would be saved to database)
		VIDEOS.push(mapFromVideo(newVideo) as any);

		// Invalidate cache
		videoCache.data = null;
		videoCache.timestamp = 0;
		localStorage.removeItem("videosCache");

		return simulateApiCall(newVideo, 1500); // Longer delay to simulate upload
	},

	// Update a video
	async updateVideo(
		videoId: string,
		videoData: Partial<VideoFormData>,
		userId: string
	) {
		// Find video
		const videoIndex = VIDEOS.findIndex((v) => v._id === videoId);

		if (videoIndex === -1) {
			return simulateApiCall(
				Promise.reject(new Error("Video not found"))
			);
		}

		// Check ownership (in real app, would be done on server)
		if (VIDEOS[videoIndex].owner._id !== userId) {
			return simulateApiCall(Promise.reject(new Error("Unauthorized")));
		}

		// Update video
		VIDEOS[videoIndex] = {
			...VIDEOS[videoIndex],
			title: videoData.title || VIDEOS[videoIndex].title,
			description:
				videoData.description || VIDEOS[videoIndex].description,
			isPublished:
				videoData.isPublished !== undefined
					? videoData.isPublished
					: VIDEOS[videoIndex].isPublished,
			tags: videoData.tags || VIDEOS[videoIndex].tags,
			updatedAt: new Date().toISOString(),
		};

		// Invalidate cache
		videoCache.data = null;
		videoCache.timestamp = 0;
		localStorage.removeItem("videosCache");

		return simulateApiCall(mapToVideo(VIDEOS[videoIndex]));
	},

	// Delete a video
	async deleteVideo(videoId: string, userId: string) {
		// Find video
		const videoIndex = VIDEOS.findIndex((v) => v._id === videoId);

		if (videoIndex === -1) {
			return simulateApiCall(
				Promise.reject(new Error("Video not found"))
			);
		}

		// Check ownership (in real app, would be done on server)
		if (VIDEOS[videoIndex].owner._id !== userId) {
			return simulateApiCall(Promise.reject(new Error("Unauthorized")));
		}

		// Remove video
		VIDEOS.splice(videoIndex, 1);

		// Invalidate cache
		videoCache.data = null;
		videoCache.timestamp = 0;
		localStorage.removeItem("videosCache");

		return simulateApiCall({ success: true });
	},

	// Get video comments
	async getVideoComments(videoId: string) {
		// Simulate API call to get comments
		const comments = COMMENTS.filter((c) => c.video === videoId);
		return simulateApiCall(comments);
	},

	// Add a comment
	async addComment(videoId: string, content: string, _userId: string) {
		// Create a new comment
		const rawUser = VIDEOS[0].owner; // Mock user (in real app, would be current user)
		const user = mapToUser(rawUser);

		const newComment: Comment = {
			_id: `comment${COMMENTS.length + 1}`,
			content,
			video: videoId,
			owner: user,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Add to comments array (cast to any to bypass type checking for COMMENTS structure)
		COMMENTS.push(newComment as any);

		return simulateApiCall(newComment);
	},

	// Update a comment
	async updateComment(commentId: string, content: string, userId: string) {
		// Find comment
		const commentIndex = COMMENTS.findIndex((c) => c._id === commentId);

		if (commentIndex === -1) {
			return simulateApiCall(
				Promise.reject(new Error("Comment not found"))
			);
		}

		// Check ownership
		if (COMMENTS[commentIndex].owner._id !== userId) {
			return simulateApiCall(Promise.reject(new Error("Unauthorized")));
		}

		// Update comment
		COMMENTS[commentIndex] = {
			...COMMENTS[commentIndex],
			content,
			updatedAt: new Date().toISOString(),
		};

		return simulateApiCall(COMMENTS[commentIndex]);
	},

	// Delete a comment
	async deleteComment(commentId: string, userId: string) {
		// Find comment
		const commentIndex = COMMENTS.findIndex((c) => c._id === commentId);

		if (commentIndex === -1) {
			return simulateApiCall(
				Promise.reject(new Error("Comment not found"))
			);
		}

		// Check ownership
		if (COMMENTS[commentIndex].owner._id !== userId) {
			return simulateApiCall(Promise.reject(new Error("Unauthorized")));
		}

		// Remove comment
		COMMENTS.splice(commentIndex, 1);

		return simulateApiCall({ success: true });
	},

	// Chat with AI about the video
	async chatWithAI(videoId: string, message: string) {
		try {
			const response = await API.post("/ai/query", {
				query: message,
				videoId: videoId,
			});

			// Parse the AI response JSON
			const aiData = JSON.parse(response.data.data);

			// Convert timestamp from hh:mm:ss to seconds if present
			let timestampData = null;
			if (aiData.timestamp) {
				const timeString = aiData.timestamp;
				const timeParts = timeString.split(":");
				const seconds =
					timeParts.length === 3
						? parseInt(timeParts[0]) * 3600 +
						  parseInt(timeParts[1]) * 60 +
						  parseInt(timeParts[2])
						: timeParts.length === 2
						? parseInt(timeParts[0]) * 60 + parseInt(timeParts[1])
						: parseInt(timeParts[0]);

				timestampData = {
					text: timeString,
					seconds: seconds,
				};
			}

			return {
				content: aiData.answer,
				timestamp: timestampData,
			};
		} catch (error) {
			console.error("Error calling AI API:", error);
			throw new Error("Failed to get AI response");
		}
	},
};
