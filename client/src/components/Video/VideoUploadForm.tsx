import React, { useState, useRef } from 'react';
import { VideoFormData, Playlist } from '../../types';
import { TAG_SUGGESTIONS } from '../../utils/constants';
import { X, Upload, Plus, Image } from 'lucide-react';

interface VideoUploadFormProps {
  initialData?: Partial<VideoFormData>;
  playlists: Playlist[];
  onCreatePlaylist: (name: string, description: string) => Promise<Playlist>;
  onSubmit: (data: VideoFormData) => Promise<void>;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  initialData,
  playlists,
  onCreatePlaylist,
  onSubmit,
  isSubmitting,
  isEditMode = false
}) => {
  const [formData, setFormData] = useState<VideoFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    tags: initialData?.tags || [],
    videoFile: null,
    thumbnail: null,
    playlist: initialData?.playlist || null,
    isPublished: initialData?.isPublished ?? true
  });
  
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [newPlaylistMode, setNewPlaylistMode] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isPublished' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle video file selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type and size
      if (!file.type.startsWith('video/')) {
        setErrors(prev => ({ ...prev, videoFile: 'Please select a valid video file' }));
        return;
      }
      
      if (file.size > 100 * 1024 * 1024) { // 100MB limit for demo
        setErrors(prev => ({ ...prev, videoFile: 'Video file size must be less than 100MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, videoFile: file }));
      setVideoPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, videoFile: '' }));
    }
  };

  // Handle thumbnail selection
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type and size
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, thumbnail: 'Please select a valid image file' }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, thumbnail: 'Image file size must be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, thumbnail: '' }));
    }
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    setShowTagSuggestions(e.target.value.length > 0);
  };

  // Add a tag
  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  // Remove a tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Handle tag key down (Enter to add)
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Filter tag suggestions based on input
  const filteredTagSuggestions = TAG_SUGGESTIONS.filter(
    tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags.includes(tag)
  );

  // Handle playlist selection
  const handlePlaylistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'new') {
      setNewPlaylistMode(true);
      setFormData(prev => ({ ...prev, playlist: null }));
    } else {
      setFormData(prev => ({ ...prev, playlist: value || null }));
    }
  };

  // Handle new playlist input change
  const handleNewPlaylistChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPlaylist(prev => ({ ...prev, [name]: value }));
  };

  // Create new playlist
  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name.trim()) {
      setErrors(prev => ({ ...prev, playlistName: 'Playlist name is required' }));
      return;
    }
    
    try {
      const playlist = await onCreatePlaylist(newPlaylist.name, newPlaylist.description);
      setFormData(prev => ({ ...prev, playlist: playlist._id }));
      setNewPlaylistMode(false);
      setNewPlaylist({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  // Cancel new playlist creation
  const cancelNewPlaylist = () => {
    setNewPlaylistMode(false);
    setNewPlaylist({ name: '', description: '' });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!isEditMode && !formData.videoFile) {
      newErrors.videoFile = 'Video file is required';
    }
    
    if (!isEditMode && !formData.thumbnail) {
      newErrors.thumbnail = 'Thumbnail is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Video Title <span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input ${errors.title ? 'border-error' : ''}`}
          placeholder="Enter a descriptive title"
        />
        {errors.title && <p className="mt-1 text-sm text-error">{errors.title}</p>}
      </div>
      
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description <span className="text-error">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`input ${errors.description ? 'border-error' : ''}`}
          placeholder="Describe your video"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-error">{errors.description}</p>}
      </div>
      
      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags
        </label>
        <div className="relative">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyDown}
            onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
            onFocus={() => tagInput && setShowTagSuggestions(true)}
            className="input"
            placeholder="Add tags and press Enter"
          />
          
          {showTagSuggestions && filteredTagSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredTagSuggestions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className="block w-full text-left px-4 py-2 hover:bg-card-hover"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map(tag => (
            <div 
              key={tag} 
              className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 text-primary/70 hover:text-primary"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Video Upload */}
      {!isEditMode && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Video File <span className="text-error">*</span>
          </label>
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center ${
              errors.videoFile ? 'border-error' : 'border-border'
            } ${videoPreview ? 'border-success' : ''}`}
          >
            {videoPreview ? (
              <div>
                <video 
                  src={videoPreview} 
                  controls 
                  className="max-h-48 mx-auto mb-2"
                ></video>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoPreview(null);
                      setFormData(prev => ({ ...prev, videoFile: null }));
                    }}
                    className="btn btn-outline text-sm px-3 py-1"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="btn btn-outline text-sm px-3 py-1"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-muted mb-2" />
                <p className="text-sm mb-2">Drag and drop a video file or click to browse</p>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="btn btn-primary"
                >
                  Select Video
                </button>
              </div>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
            />
          </div>
          {errors.videoFile && <p className="mt-1 text-sm text-error">{errors.videoFile}</p>}
        </div>
      )}
      
      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Thumbnail {!isEditMode && <span className="text-error">*</span>}
        </label>
        <div 
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            errors.thumbnail ? 'border-error' : 'border-border'
          } ${thumbnailPreview ? 'border-success' : ''}`}
        >
          {thumbnailPreview ? (
            <div>
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                className="max-h-48 mx-auto mb-2 object-contain"
              />
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailPreview(null);
                    setFormData(prev => ({ ...prev, thumbnail: null }));
                  }}
                  className="btn btn-outline text-sm px-3 py-1"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="btn btn-outline text-sm px-3 py-1"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Image className="mx-auto h-12 w-12 text-muted mb-2" />
              <p className="text-sm mb-2">Upload a thumbnail image for your video</p>
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="btn btn-primary"
              >
                Select Thumbnail
              </button>
            </div>
          )}
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailSelect}
            className="hidden"
          />
        </div>
        {errors.thumbnail && <p className="mt-1 text-sm text-error">{errors.thumbnail}</p>}
      </div>
      
      {/* Playlist Selection */}
      <div>
        <label htmlFor="playlist" className="block text-sm font-medium mb-1">
          Add to Playlist
        </label>
        
        {newPlaylistMode ? (
          <div className="space-y-3 p-4 border border-border rounded-lg">
            <div>
              <label htmlFor="playlistName" className="block text-sm font-medium mb-1">
                Playlist Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="playlistName"
                name="name"
                value={newPlaylist.name}
                onChange={handleNewPlaylistChange}
                className={`input ${errors.playlistName ? 'border-error' : ''}`}
                placeholder="Enter playlist name"
              />
              {errors.playlistName && <p className="mt-1 text-sm text-error">{errors.playlistName}</p>}
            </div>
            
            <div>
              <label htmlFor="playlistDescription" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="playlistDescription"
                name="description"
                value={newPlaylist.description}
                onChange={handleNewPlaylistChange}
                rows={2}
                className="input"
                placeholder="Describe your playlist (optional)"
              ></textarea>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreatePlaylist}
                className="btn btn-primary"
              >
                Create Playlist
              </button>
              <button
                type="button"
                onClick={cancelNewPlaylist}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <select
              id="playlist"
              name="playlist"
              value={formData.playlist || ''}
              onChange={handlePlaylistChange}
              className="input flex-1"
            >
              <option value="">None</option>
              {playlists.map(playlist => (
                <option key={playlist._id} value={playlist._id}>
                  {playlist.name}
                </option>
              ))}
              <option value="new">+ Create new playlist</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Publish Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          checked={formData.isPublished}
          onChange={e => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="isPublished" className="ml-2 block text-sm">
          Make this video public
        </label>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span className="ml-2">{isEditMode ? 'Updating...' : 'Uploading...'}</span>
            </>
          ) : (
            isEditMode ? 'Update Video' : 'Publish Video'
          )}
        </button>
      </div>
    </form>
  );
};

export default VideoUploadForm;