import { Playlist } from '../types';
import { API_ENDPOINTS, PLAYLISTS, VIDEOS } from '../utils/constants';

// Helper to simulate API delay
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

export const playlistService = {
  // Get all playlists for a user
  async getUserPlaylists(userId: string) {
    // Simulate API call to get playlists
    const playlists = PLAYLISTS.filter(playlist => 
      typeof playlist.owner === 'object' && playlist.owner._id === userId
    );
    
    return simulateApiCall(playlists);
  },
  
  // Get playlist by ID
  async getPlaylistById(playlistId: string) {
    // Simulate API call to get playlist
    const playlist = PLAYLISTS.find(p => p._id === playlistId);
    
    if (!playlist) {
      return simulateApiCall(Promise.reject(new Error('Playlist not found')));
    }
    
    return simulateApiCall(playlist);
  },
  
  // Create a new playlist
  async createPlaylist(name: string, description: string, userId: string) {
    // Create a new playlist
    const user = VIDEOS[0].owner; // Mock user (in real app, would be current user)
    
    const newPlaylist: Playlist = {
      _id: `playlist${PLAYLISTS.length + 1}`,
      name,
      description,
      videos: [],
      owner: user,
      createdAt: new Date().toISOString()
    };
    
    // Add to playlists array
    PLAYLISTS.push(newPlaylist);
    
    return simulateApiCall(newPlaylist);
  },
  
  // Update a playlist
  async updatePlaylist(playlistId: string, data: { name?: string; description?: string }, userId: string) {
    // Find playlist
    const playlistIndex = PLAYLISTS.findIndex(p => p._id === playlistId);
    
    if (playlistIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Playlist not found')));
    }
    
    // Check ownership
    if (typeof PLAYLISTS[playlistIndex].owner === 'object' && 
        PLAYLISTS[playlistIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Update playlist
    PLAYLISTS[playlistIndex] = {
      ...PLAYLISTS[playlistIndex],
      name: data.name || PLAYLISTS[playlistIndex].name,
      description: data.description !== undefined ? data.description : PLAYLISTS[playlistIndex].description
    };
    
    return simulateApiCall(PLAYLISTS[playlistIndex]);
  },
  
  // Delete a playlist
  async deletePlaylist(playlistId: string, userId: string) {
    // Find playlist
    const playlistIndex = PLAYLISTS.findIndex(p => p._id === playlistId);
    
    if (playlistIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Playlist not found')));
    }
    
    // Check ownership
    if (typeof PLAYLISTS[playlistIndex].owner === 'object' && 
        PLAYLISTS[playlistIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Remove playlist
    PLAYLISTS.splice(playlistIndex, 1);
    
    return simulateApiCall({ success: true });
  },
  
  // Add video to playlist
  async addVideoToPlaylist(playlistId: string, videoId: string, userId: string) {
    // Find playlist
    const playlistIndex = PLAYLISTS.findIndex(p => p._id === playlistId);
    
    if (playlistIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Playlist not found')));
    }
    
    // Check ownership
    if (typeof PLAYLISTS[playlistIndex].owner === 'object' && 
        PLAYLISTS[playlistIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Find video
    const video = VIDEOS.find(v => v._id === videoId);
    
    if (!video) {
      return simulateApiCall(Promise.reject(new Error('Video not found')));
    }
    
    // Add video to playlist if not already there
    const videos = PLAYLISTS[playlistIndex].videos;
    const videoIds = videos.map(v => typeof v === 'object' ? v._id : v);
    
    if (!videoIds.includes(videoId)) {
      PLAYLISTS[playlistIndex].videos = [...videos, video];
    }
    
    return simulateApiCall(PLAYLISTS[playlistIndex]);
  },
  
  // Remove video from playlist
  async removeVideoFromPlaylist(playlistId: string, videoId: string, userId: string) {
    // Find playlist
    const playlistIndex = PLAYLISTS.findIndex(p => p._id === playlistId);
    
    if (playlistIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Playlist not found')));
    }
    
    // Check ownership
    if (typeof PLAYLISTS[playlistIndex].owner === 'object' && 
        PLAYLISTS[playlistIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Remove video from playlist
    PLAYLISTS[playlistIndex].videos = PLAYLISTS[playlistIndex].videos.filter(v => 
      typeof v === 'object' ? v._id !== videoId : v !== videoId
    );
    
    return simulateApiCall(PLAYLISTS[playlistIndex]);
  }
};