import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Video, Comment } from '../../types';
import { videoService } from '../../services/videoService';
import { useAuth } from '../../contexts/AuthContext';
import VideoPlayer from '../../components/Video/VideoPlayer';
import VideoCard from '../../components/Video/VideoCard';
import CommentSection from '../../components/Video/CommentSection';
import VideoChatAI from '../../components/Video/VideoChatAI';
import Loader from '../../components/Common/Loader';
import { ThumbsUp, Bell, Share2, Edit, Trash, Clock, MessageCircle, Bot } from 'lucide-react';

const VideoDetail: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [suggestions, setSuggestions] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'comments' | 'chat'>('description');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [playerRef, setPlayerRef] = useState<HTMLVideoElement | null>(null);

  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format view count
  const formatViewCount = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    } else {
      return `${views} views`;
    }
  };

  // Fetch video and suggestions
  useEffect(() => {
    const fetchData = async () => {
      if (!videoId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch video
        const videoData = await videoService.getVideoById(videoId);
        setVideo(videoData);
        
        // Fetch suggestions
        const suggestionsData = await videoService.getVideoSuggestions(videoId);
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error('Error fetching video:', error);
        setError('Failed to load video. It may have been removed or is unavailable.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  // Handle video deletion
  const handleDeleteVideo = async () => {
    if (!videoId || !user) return;
    
    setIsDeleting(true);
    
    try {
      await videoService.deleteVideo(videoId, user._id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting video:', error);
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
    }
  };

  // Handle timestamp click in AI chat
  const handleTimestampClick = (seconds: number) => {
    if (playerRef) {
      playerRef.currentTime = seconds;
      playerRef.play();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Video Not Found</h2>
        <p className="mb-4">{error || 'This video doesn\'t exist or has been removed.'}</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="lg:w-2/3">
          {/* Video player */}
          <div className="rounded-lg overflow-hidden">
            <VideoPlayer 
              videoUrl={video.videoFile} 
              onTimeUpdate={(time) => {
                // Handle time updates if needed
              }}
            />
          </div>

          {/* Video info */}
          <div className="mt-4">
            <h1 className="text-xl font-bold">{video.title}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-muted">
                {formatViewCount(video.views)} • {formatDate(video.createdAt)}
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-card-hover">
                  <ThumbsUp className="w-5 h-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-card-hover">
                  <Bell className="w-5 h-5" />
                  <span>Subscribe</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-card-hover">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                
                {/* Edit/Delete buttons for owner */}
                {user && user._id === video.owner._id && (
                  <>
                    <Link 
                      to={`/video/edit/${video._id}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-card-hover"
                    >
                      <Edit className="w-5 h-5" />
                      <span>Edit</span>
                    </Link>
                    <button 
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-card-hover text-error"
                    >
                      <Trash className="w-5 h-5" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Channel info */}
          <div className="flex items-center justify-between mt-4 p-3 bg-card rounded-lg">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${video.owner.username}`}>
                <img 
                  src={video.owner.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'} 
                  alt={video.owner.username} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              </Link>
              <div>
                <Link to={`/profile/${video.owner.username}`} className="font-medium hover:underline">
                  {video.owner.fullname}
                </Link>
                <p className="text-sm text-muted">@{video.owner.username}</p>
              </div>
            </div>
            <button className="btn btn-primary">
              Subscribe
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-border">
            <div className="flex">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'description' 
                    ? 'border-b-2 border-primary' 
                    : 'text-muted hover:text-fg'
                }`}
                onClick={() => setActiveTab('description')}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                Description
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'comments' 
                    ? 'border-b-2 border-primary' 
                    : 'text-muted hover:text-fg'
                }`}
                onClick={() => setActiveTab('comments')}
              >
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Comments
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'chat' 
                    ? 'border-b-2 border-primary' 
                    : 'text-muted hover:text-fg'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                <Bot className="w-4 h-4 inline mr-1" />
                Chat with AI
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="mt-4">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{video.description}</p>
                
                {video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {video.tags.map(tag => (
                      <Link 
                        key={tag} 
                        to={`/explore?tag=${encodeURIComponent(tag)}`}
                        className="text-sm text-primary hover:underline"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'comments' && (
              <CommentSection videoId={video._id} />
            )}
            
            {activeTab === 'chat' && (
              <div className="h-96">
                <VideoChatAI videoId={video._id} onTimestampClick={handleTimestampClick} />
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="lg:w-1/3 space-y-4">
          <h3 className="font-semibold mb-2">Up next</h3>
          {suggestions.map(suggestion => (
            <VideoCard key={suggestion._id} video={suggestion} horizontal />
          ))}
        </div>
      </div>
      
      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Video</h3>
            <p className="mb-4">
              Are you sure you want to delete "{video.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVideo}
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span className="ml-2">Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetail;