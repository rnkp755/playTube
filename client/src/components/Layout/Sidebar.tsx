import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Clock, ThumbsUp, PlaySquare, ListVideo, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [showSubscriptions, setShowSubscriptions] = useState(false);

  // For demo purposes
  const subscriptions = [
    { id: 'user2', name: 'Jane Doe', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
    { id: 'user3', name: 'Mike Ross', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
    { id: 'user4', name: 'Sarah Wilson', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="hidden lg:block w-64 border-r border-border overflow-y-auto">
      <div className="p-4">
        <div className="space-y-1">
          <Link
            to="/"
            className={`flex items-center px-4 py-2 rounded-md ${
              isActive('/') ? 'bg-card-hover font-medium' : 'hover:bg-card-hover'
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Home</span>
          </Link>
          <Link
            to="/explore"
            className={`flex items-center px-4 py-2 rounded-md ${
              isActive('/explore') ? 'bg-card-hover font-medium' : 'hover:bg-card-hover'
            }`}
          >
            <Compass className="h-5 w-5 mr-3" />
            <span>Explore</span>
          </Link>
        </div>

        {isAuthenticated && (
          <>
            <hr className="my-4 border-border" />
            <div className="space-y-1">
              <Link
                to={`/profile/${user?.username}`}
                className={`flex items-center px-4 py-2 rounded-md ${
                  location.pathname.includes('/profile/') 
                    ? 'bg-card-hover font-medium' 
                    : 'hover:bg-card-hover'
                }`}
              >
                <PlaySquare className="h-5 w-5 mr-3" />
                <span>Your Videos</span>
              </Link>
              <Link
                to="/history"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive('/history') ? 'bg-card-hover font-medium' : 'hover:bg-card-hover'
                }`}
              >
                <Clock className="h-5 w-5 mr-3" />
                <span>History</span>
              </Link>
              <Link
                to="/liked"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive('/liked') ? 'bg-card-hover font-medium' : 'hover:bg-card-hover'
                }`}
              >
                <ThumbsUp className="h-5 w-5 mr-3" />
                <span>Liked Videos</span>
              </Link>
              <Link
                to="/playlists"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive('/playlists') ? 'bg-card-hover font-medium' : 'hover:bg-card-hover'
                }`}
              >
                <ListVideo className="h-5 w-5 mr-3" />
                <span>Your Playlists</span>
              </Link>
              <Link
                to="/community"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive('/community') ? 'bg-card-hover font-medium' : 'hover:bg-card-hover'
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                <span>Community</span>
              </Link>
            </div>

            <hr className="my-4 border-border" />
            <div>
              <button 
                className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-card-hover"
                onClick={() => setShowSubscriptions(!showSubscriptions)}
              >
                <span className="font-medium">Subscriptions</span>
                {showSubscriptions ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              
              {showSubscriptions && (
                <div className="mt-2 space-y-1">
                  {subscriptions.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/channel/${sub.id}`}
                      className="flex items-center px-4 py-2 rounded-md hover:bg-card-hover"
                    >
                      <img 
                        src={sub.avatar} 
                        alt={sub.name} 
                        className="h-6 w-6 rounded-full mr-3 object-cover"
                      />
                      <span className="truncate">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;