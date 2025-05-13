import React, { useState, useEffect } from 'react';
import { Tweet, TweetFormData } from '../../types';
import { tweetService } from '../../services/tweetService';
import { useAuth } from '../../contexts/AuthContext';
import TweetForm from '../../components/Tweet/TweetForm';
import TweetCard from '../../components/Tweet/TweetCard';
import Loader from '../../components/Common/Loader';

const Community: React.FC = () => {
  const { user } = useAuth();
  
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);

  // Fetch tweets
  useEffect(() => {
    const fetchTweets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const tweetsData = await tweetService.getTweets();
        setTweets(tweetsData);
      } catch (error) {
        console.error('Error fetching tweets:', error);
        setError('Failed to load community posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweets();
  }, []);

  // Create tweet
  const handleCreateTweet = async (data: TweetFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (user) {
        const newTweet = await tweetService.createTweet(data, user._id);
        setTweets(prev => [newTweet, ...prev]);
      }
    } catch (error) {
      console.error('Error creating tweet:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update tweet
  const handleUpdateTweet = async (data: TweetFormData) => {
    if (!editingTweet || !user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const updatedTweet = await tweetService.updateTweet(editingTweet._id, data, user._id);
      setTweets(prev => 
        prev.map(tweet => tweet._id === updatedTweet._id ? updatedTweet : tweet)
      );
      setEditingTweet(null);
    } catch (error) {
      console.error('Error updating tweet:', error);
      setError('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete tweet
  const handleDeleteTweet = async (tweetId: string) => {
    if (!user) return;
    
    try {
      await tweetService.deleteTweet(tweetId, user._id);
      setTweets(prev => prev.filter(tweet => tweet._id !== tweetId));
    } catch (error) {
      console.error('Error deleting tweet:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Community</h1>
      
      {error && (
        <div className="p-4 bg-error/10 rounded-lg text-center mb-6">
          <p className="text-error">{error}</p>
        </div>
      )}
      
      {editingTweet ? (
        <div className="mb-6">
          <TweetForm
            initialData={{
              title: editingTweet.title,
              description: editingTweet.description,
              tags: editingTweet.tags
            }}
            onSubmit={handleUpdateTweet}
            isSubmitting={isSubmitting}
            isEditMode={true}
            onCancel={() => setEditingTweet(null)}
          />
        </div>
      ) : (
        <div className="mb-6">
          <TweetForm
            onSubmit={handleCreateTweet}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader size="lg" />
        </div>
      ) : tweets.length === 0 ? (
        <div className="text-center p-8 bg-card rounded-lg">
          <p className="text-lg">No community posts yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map(tweet => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              onEdit={user && user._id === tweet.owner._id ? setEditingTweet : undefined}
              onDelete={user && user._id === tweet.owner._id ? handleDeleteTweet : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;