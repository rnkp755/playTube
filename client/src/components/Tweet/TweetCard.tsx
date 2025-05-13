import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tweet } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { MoreVertical, Edit, Trash } from 'lucide-react';

interface TweetCardProps {
  tweet: Tweet;
  onEdit?: (tweet: Tweet) => void;
  onDelete?: (tweetId: string) => void;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Format date
  const formatDate = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      // Hours or minutes ago
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
      }
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return date.toLocaleDateString(undefined, options);
    }
  };
  
  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="card p-4">
      {/* Tweet header */}
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${tweet.owner.username}`}>
            <img 
              src={tweet.owner.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'} 
              alt={tweet.owner.username} 
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <Link to={`/profile/${tweet.owner.username}`} className="font-medium hover:underline">
              {tweet.owner.fullname}
            </Link>
            <p className="text-xs text-muted">
              <Link to={`/profile/${tweet.owner.username}`} className="hover:underline">
                @{tweet.owner.username}
              </Link>
              <span className="mx-1">•</span>
              <span>{formatDate(tweet.createdAt)}</span>
            </p>
          </div>
        </div>
        
        {user && user._id === tweet.owner._id && onEdit && onDelete && (
          <div className="relative">
            <button 
              onClick={toggleMenu}
              className="p-1 rounded-full hover:bg-card-hover"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-card rounded-md shadow-lg border border-border z-10">
                <button
                  onClick={() => {
                    onEdit(tweet);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-card-hover"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(tweet._id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-card-hover"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Tweet content */}
      <div>
        <h3 className="text-lg font-semibold mb-2">{tweet.title}</h3>
        <p className="mb-3">{tweet.description}</p>
        
        {/* Tags */}
        {tweet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {tweet.tags.map(tag => (
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
    </div>
  );
};

export default TweetCard;