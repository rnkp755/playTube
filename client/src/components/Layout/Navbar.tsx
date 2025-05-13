import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Upload, Menu, X, Moon, Sun, Bell, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to search results
    console.log('Searching for:', searchQuery);
    // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button 
              className="lg:hidden mr-2 p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 7l-9-5-9 5v10l9 5 9-5V7z M12 18l-6-3V9l6 3l6-3v6l-6 3z" />
              </svg>
              <span className="hidden sm:block">VidShare</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search videos..."
                className="input pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Search className="h-5 w-5 text-muted" />
              </button>
            </form>
          </div>

          {/* Nav actions */}
          <div className="flex items-center">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-card-hover"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Upload button */}
                <Link 
                  to="/upload" 
                  className="hidden sm:flex btn btn-primary ml-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>

                {/* Notifications */}
                <button className="p-2 ml-2 rounded-full hover:bg-card-hover">
                  <Bell className="h-5 w-5" />
                </button>

                {/* User menu */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center"
                  >
                    <img
                      src={user?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'}
                      alt={user?.username || 'User'}
                      className="h-8 w-8 rounded-full object-cover border border-border"
                    />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border">
                      <div className="py-1">
                        <Link
                          to={`/profile/${user?.username}`}
                          className="block px-4 py-2 text-sm hover:bg-card-hover"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/upload"
                          className="block px-4 py-2 text-sm hover:bg-card-hover sm:hidden"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Upload Video
                        </Link>
                        <Link
                          to="/community"
                          className="block px-4 py-2 text-sm hover:bg-card-hover"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Community
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-card-hover"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary ml-2">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md hover:bg-card-hover"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to={`/profile/${user?.username}`}
                  className="block px-3 py-2 rounded-md hover:bg-card-hover"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/upload"
                  className="block px-3 py-2 rounded-md hover:bg-card-hover"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Upload Video
                </Link>
                <Link
                  to="/community"
                  className="block px-3 py-2 rounded-md hover:bg-card-hover"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Community
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;