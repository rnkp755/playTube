import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoFormData, Playlist } from '../../types';
import { videoService } from '../../services/videoService';
import { playlistService } from '../../services/playlistService';
import { useAuth } from '../../contexts/AuthContext';
import VideoUploadForm from '../../components/Video/VideoUploadForm';
import Loader from '../../components/Common/Loader';

const Upload: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        if (user) {
          const userPlaylists = await playlistService.getUserPlaylists(user._id);
          setPlaylists(userPlaylists);
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [user]);

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
      if (user) {
        const newVideo = await videoService.uploadVideo(data, user._id);
        
        // If video was added to a playlist
        if (data.playlist) {
          await playlistService.addVideoToPlaylist(data.playlist, newVideo._id, user._id);
        }
        
        navigate(`/video/${newVideo._id}`);
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video. Please try again.');
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

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      {error && (
        <div className="p-4 bg-error/10 rounded-lg text-center mb-6">
          <p className="text-error">{error}</p>
        </div>
      )}
      
      <VideoUploadForm
        playlists={playlists}
        onCreatePlaylist={handleCreatePlaylist}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Upload;