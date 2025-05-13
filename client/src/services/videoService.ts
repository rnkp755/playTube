import { Video, VideoFormData, Comment } from '../types';
import { API_ENDPOINTS, VIDEOS, COMMENTS, VIDEO_CACHE_DURATION } from '../utils/constants';

// Helper to simulate API delay
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Cache management
const videoCache = {
  data: null as Video[] | null,
  timestamp: 0
};

export const videoService = {
  // Get all videos with caching
  async getVideos() {
    const currentTime = Date.now();
    
    // Check if cache is valid
    if (videoCache.data && currentTime - videoCache.timestamp < VIDEO_CACHE_DURATION) {
      return Promise.resolve(videoCache.data);
    }
    
    // Simulate API call to get videos
    try {
      // In a real app, this would fetch from the server
      const videos = VIDEOS.filter(video => video.isPublished);
      
      // Update cache
      videoCache.data = videos;
      videoCache.timestamp = currentTime;
      
      // Save to localStorage as well
      localStorage.setItem('videosCache', JSON.stringify({
        data: videos,
        timestamp: currentTime
      }));
      
      return simulateApiCall(videos);
    } catch (error) {
      // If API fails, try to use localStorage cache regardless of timestamp
      const cachedData = localStorage.getItem('videosCache');
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
      const cachedVideo = videoCache.data.find(v => v._id === videoId);
      if (cachedVideo) {
        return Promise.resolve(cachedVideo);
      }
    }
    
    // If not in cache, simulate API call
    const video = VIDEOS.find(v => v._id === videoId);
    
    if (!video) {
      return simulateApiCall(Promise.reject(new Error('Video not found')), 300);
    }
    
    // Increment view count (in a real app, this would be done on the server)
    video.views += 1;
    
    return simulateApiCall(video);
  },
  
  // Get video suggestions (not the current video)
  async getVideoSuggestions(currentVideoId: string, limit = 10) {
    // Simulate API call to get video suggestions
    const suggestions = VIDEOS
      .filter(video => video._id !== currentVideoId && video.isPublished)
      .slice(0, limit);
    
    return simulateApiCall(suggestions);
  },
  
  // Upload a new video
  async uploadVideo(videoData: VideoFormData, userId: string) {
    // In a real app, this would upload files to server/storage
    
    // Create a new video object
    const newVideo: Video = {
      _id: `video${VIDEOS.length + 1}`,
      title: videoData.title,
      description: videoData.description,
      videoFile: videoData.videoFile ? URL.createObjectURL(videoData.videoFile) : 'https://example.com/placeholder.mp4',
      thumbnail: videoData.thumbnail ? URL.createObjectURL(videoData.thumbnail) : 'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg',
      duration: Math.floor(Math.random() * 1200) + 180, // Random duration between 3-23 minutes
      views: 0,
      isPublished: videoData.isPublished,
      owner: VIDEOS[0].owner, // Use a mock user (in real app, would be current user)
      tags: videoData.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to videos array (in real app, would be saved to database)
    VIDEOS.push(newVideo);
    
    // Invalidate cache
    videoCache.data = null;
    videoCache.timestamp = 0;
    localStorage.removeItem('videosCache');
    
    return simulateApiCall(newVideo, 1500); // Longer delay to simulate upload
  },
  
  // Update a video
  async updateVideo(videoId: string, videoData: Partial<VideoFormData>, userId: string) {
    // Find video
    const videoIndex = VIDEOS.findIndex(v => v._id === videoId);
    
    if (videoIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Video not found')));
    }
    
    // Check ownership (in real app, would be done on server)
    if (VIDEOS[videoIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Update video
    VIDEOS[videoIndex] = {
      ...VIDEOS[videoIndex],
      title: videoData.title || VIDEOS[videoIndex].title,
      description: videoData.description || VIDEOS[videoIndex].description,
      isPublished: videoData.isPublished !== undefined ? videoData.isPublished : VIDEOS[videoIndex].isPublished,
      tags: videoData.tags || VIDEOS[videoIndex].tags,
      updatedAt: new Date().toISOString()
    };
    
    // Invalidate cache
    videoCache.data = null;
    videoCache.timestamp = 0;
    localStorage.removeItem('videosCache');
    
    return simulateApiCall(VIDEOS[videoIndex]);
  },
  
  // Delete a video
  async deleteVideo(videoId: string, userId: string) {
    // Find video
    const videoIndex = VIDEOS.findIndex(v => v._id === videoId);
    
    if (videoIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Video not found')));
    }
    
    // Check ownership (in real app, would be done on server)
    if (VIDEOS[videoIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Remove video
    VIDEOS.splice(videoIndex, 1);
    
    // Invalidate cache
    videoCache.data = null;
    videoCache.timestamp = 0;
    localStorage.removeItem('videosCache');
    
    return simulateApiCall({ success: true });
  },
  
  // Get video comments
  async getVideoComments(videoId: string) {
    // Simulate API call to get comments
    const comments = COMMENTS.filter(c => c.video === videoId);
    return simulateApiCall(comments);
  },
  
  // Add a comment
  async addComment(videoId: string, content: string, userId: string) {
    // Create a new comment
    const user = VIDEOS[0].owner; // Mock user (in real app, would be current user)
    
    const newComment: Comment = {
      _id: `comment${COMMENTS.length + 1}`,
      content,
      video: videoId,
      owner: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to comments array
    COMMENTS.push(newComment);
    
    return simulateApiCall(newComment);
  },
  
  // Update a comment
  async updateComment(commentId: string, content: string, userId: string) {
    // Find comment
    const commentIndex = COMMENTS.findIndex(c => c._id === commentId);
    
    if (commentIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Comment not found')));
    }
    
    // Check ownership
    if (COMMENTS[commentIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Update comment
    COMMENTS[commentIndex] = {
      ...COMMENTS[commentIndex],
      content,
      updatedAt: new Date().toISOString()
    };
    
    return simulateApiCall(COMMENTS[commentIndex]);
  },
  
  // Delete a comment
  async deleteComment(commentId: string, userId: string) {
    // Find comment
    const commentIndex = COMMENTS.findIndex(c => c._id === commentId);
    
    if (commentIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Comment not found')));
    }
    
    // Check ownership
    if (COMMENTS[commentIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Remove comment
    COMMENTS.splice(commentIndex, 1);
    
    return simulateApiCall({ success: true });
  },
  
  // Chat with AI about the video
  async chatWithAI(videoId: string, message: string) {
    // Simulate AI response based on predefined responses in constants
    const videoResponses = AI_CHAT_RESPONSES[videoId as keyof typeof AI_CHAT_RESPONSES];
    
    if (!videoResponses) {
      return simulateApiCall({
        content: "I don't have specific information about this video. Can you ask me something else?",
        timestamp: null
      }, 1000);
    }
    
    // Find best response based on simple keyword matching
    const lowerMessage = message.toLowerCase();
    let bestResponse = null;
    
    for (const response of videoResponses) {
      if (lowerMessage.includes(response.question.toLowerCase())) {
        bestResponse = response;
        break;
      }
    }
    
    if (!bestResponse) {
      // Fallback to first response if no match
      bestResponse = videoResponses[0];
    }
    
    return simulateApiCall({
      content: bestResponse.answer,
      timestamp: bestResponse.timestamp
    }, 1500);
  }
};