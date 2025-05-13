import React, { useState, useEffect } from 'react';
import { Comment, User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { videoService } from '../../services/videoService';
import { MoreVertical, Edit, Trash, X } from 'lucide-react';

interface CommentSectionProps {
  videoId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ videoId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const comments = await videoService.getVideoComments(videoId);
        setComments(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

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
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else if (diffInDays < 365) {
      return `${Math.floor(diffInDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffInDays / 365)} years ago`;
    }
  };

  // Add comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentInput.trim() || !isAuthenticated || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newComment = await videoService.addComment(videoId, commentInput, user?._id || '');
      setComments(prev => [newComment, ...prev]);
      setCommentInput('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const updatedComment = await videoService.updateComment(commentId, editContent, user?._id || '');
      setComments(prev => 
        prev.map(comment => comment._id === commentId ? updatedComment : comment)
      );
      setEditingCommentId(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await videoService.deleteComment(commentId, user?._id || '');
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Start editing a comment
  const startEditingComment = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
    setMenuOpenId(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  // Toggle comment menu
  const toggleMenu = (commentId: string) => {
    setMenuOpenId(prev => prev === commentId ? null : commentId);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h3>
      
      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex gap-3">
            <img 
              src={user?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'} 
              alt={user?.username || 'User'} 
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="input w-full resize-none"
                rows={2}
              ></textarea>
              <div className="flex justify-end mt-2 gap-2">
                <button 
                  type="button" 
                  onClick={() => setCommentInput('')}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!commentInput.trim() || isSubmitting}
                  className={`btn btn-primary ${(!commentInput.trim() || isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-card-hover rounded-lg mb-6 text-center">
          <p>Please sign in to comment on this video.</p>
        </div>
      )}
      
      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center p-4">
            <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center p-4 text-muted">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="flex gap-3">
              <img 
                src={comment.owner.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'} 
                alt={comment.owner.username} 
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{comment.owner.username}</h4>
                    <p className="text-xs text-muted">{formatDate(comment.createdAt)}</p>
                  </div>
                  
                  {user && user._id === comment.owner._id && (
                    <div className="relative">
                      <button 
                        onClick={() => toggleMenu(comment._id)}
                        className="p-1 rounded-full hover:bg-card-hover"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {menuOpenId === comment._id && (
                        <div className="absolute right-0 mt-1 w-32 bg-card rounded-md shadow-lg border border-border z-10">
                          <button
                            onClick={() => startEditingComment(comment)}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-card-hover"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
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
                
                {editingCommentId === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="input w-full resize-none"
                      rows={2}
                    ></textarea>
                    <div className="flex justify-end mt-2 gap-2">
                      <button 
                        onClick={cancelEditing}
                        className="btn btn-outline text-sm px-3 py-1"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleEditComment(comment._id)}
                        disabled={!editContent.trim() || isSubmitting}
                        className={`btn btn-primary text-sm px-3 py-1 ${(!editContent.trim() || isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1">{comment.content}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;