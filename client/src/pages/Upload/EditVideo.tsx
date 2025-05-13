import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoFormData, Video, Playlist } from '../../types';
import { videoService } from '../../services/videoService';
import { playlistService } from '../../services/playlistService';
import { useAuth } from '../../contexts/AuthContext';
import VideoUploadForm from '../../components/Video/VideoUploadForm';
import Loader from '../../components/Common/Loader';

const EditVideo: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  // Fetch video and playlists
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!videoId || !user) {
          setNotFound(true);
          return;
        }
        
        // Fetch video
        const videoData = await videoService.getVideoById(videoId);
        
        // Check if user is the owner
        if (videoData.owner._id !== user._id) {
          setUnauthorized(true);
          return;
        }
        
        setVideo(videoData);
        
        // Fetch playlists
        const userPlaylists = await playlistService.getUserPlaylists(user._id);
        setPlaylists(userPlaylists);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoId, user]);

  // Create a new playlist
  const handleCreatePlaylist = async (name: string, description: string) => {
    try {
      if (user) {
        const newPlaylist = await playlistService.createPlaylist(name, description, user._id);
        setPlaylists(prev => [...prev, newPlaylist]);
        return newPlaylist;
      }
      throw new Error('User not authenticated');
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (data: VideoFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!user || !videoId) {
        throw new Error('Missing required data');
      }
      
      // Update video
      await videoService.updateVideo(videoId, data, user._id);
      
      // Handle playlist change if needed
      if (video?.playlist?._id !== data.playlist) {
        // Remove from old playlist if exists
        if (video?.playlist?._id) {
          await playlistService.removeVideoFromPlaylist(video.playlist._id, videoId, user._id);
        }
        
        // Add to new playlist if selected
        if (data.playlist) {
          await playlistService.addVideoToPlaylist(data.playlist, videoId, user._id);
        }
      }
      
      navigate(`/video/${videoId}`);
    } catch (error) {
      console.error('Error updating video:', error);
      setError('Failed to update video. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader size="lg" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Video Not Found</h2>
        <p className="mb-4">The video you're trying to edit doesn't exist or has been deleted.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Unauthorized</h2>
        <p className="mb-4">You don't have permission to edit this video.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  const initialData: Partial<VideoFormData> = {
    title: video.title,
    description: video.description,
    tags: video.tags,
    isPublished: video.isPublished,
    playlist: video.playlist?._id || null
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Video</h1>
      
      {error && (
        <div className="p-4 bg-error/10 rounded-lg text-center mb-6">
          <p className="text-error">{error}</p>
        </div>
      )}
      
      <VideoUploadForm
        initialData={initialData}
        playlists={playlists}
        onCreatePlaylist={handleCreatePlaylist}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={true}
      />
    </div>
  );
};

export default EditVideo;