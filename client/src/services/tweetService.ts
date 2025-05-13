import { Tweet, TweetFormData } from '../types';
import { API_ENDPOINTS, TWEETS } from '../utils/constants';

// Helper to simulate API delay
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

export const tweetService = {
  // Get all tweets
  async getTweets() {
    // Simulate API call to get tweets
    return simulateApiCall(TWEETS);
  },
  
  // Get tweets by user ID
  async getUserTweets(userId: string) {
    // Simulate API call to get user tweets
    const tweets = TWEETS.filter(tweet => tweet.owner._id === userId);
    return simulateApiCall(tweets);
  },
  
  // Get tweet by ID
  async getTweetById(tweetId: string) {
    // Simulate API call to get tweet
    const tweet = TWEETS.find(t => t._id === tweetId);
    
    if (!tweet) {
      return simulateApiCall(Promise.reject(new Error('Tweet not found')));
    }
    
    return simulateApiCall(tweet);
  },
  
  // Create a new tweet
  async createTweet(tweetData: TweetFormData, userId: string) {
    // Create a new tweet
    const user = TWEETS[0].owner; // Mock user (in real app, would be current user)
    
    const newTweet: Tweet = {
      _id: `tweet${TWEETS.length + 1}`,
      title: tweetData.title,
      description: tweetData.description,
      tags: tweetData.tags,
      owner: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to tweets array
    TWEETS.push(newTweet);
    
    return simulateApiCall(newTweet);
  },
  
  // Update a tweet
  async updateTweet(tweetId: string, tweetData: Partial<TweetFormData>, userId: string) {
    // Find tweet
    const tweetIndex = TWEETS.findIndex(t => t._id === tweetId);
    
    if (tweetIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Tweet not found')));
    }
    
    // Check ownership
    if (TWEETS[tweetIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Update tweet
    TWEETS[tweetIndex] = {
      ...TWEETS[tweetIndex],
      title: tweetData.title || TWEETS[tweetIndex].title,
      description: tweetData.description || TWEETS[tweetIndex].description,
      tags: tweetData.tags || TWEETS[tweetIndex].tags,
      updatedAt: new Date().toISOString()
    };
    
    return simulateApiCall(TWEETS[tweetIndex]);
  },
  
  // Delete a tweet
  async deleteTweet(tweetId: string, userId: string) {
    // Find tweet
    const tweetIndex = TWEETS.findIndex(t => t._id === tweetId);
    
    if (tweetIndex === -1) {
      return simulateApiCall(Promise.reject(new Error('Tweet not found')));
    }
    
    // Check ownership
    if (TWEETS[tweetIndex].owner._id !== userId) {
      return simulateApiCall(Promise.reject(new Error('Unauthorized')));
    }
    
    // Remove tweet
    TWEETS.splice(tweetIndex, 1);
    
    return simulateApiCall({ success: true });
  }
};