import React, { useState } from 'react';
import { TweetFormData, Tweet } from '../../types';
import { TAG_SUGGESTIONS } from '../../utils/constants';
import { X } from 'lucide-react';

interface TweetFormProps {
  initialData?: Partial<TweetFormData>;
  onSubmit: (data: TweetFormData) => Promise<void>;
  isSubmitting: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const TweetForm: React.FC<TweetFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  isEditMode = false,
  onCancel
}) => {
  const [formData, setFormData] = useState<TweetFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    tags: initialData?.tags || []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      
      // Clear form if not editing
      if (!isEditMode) {
        setFormData({
          title: '',
          description: '',
          tags: []
        });
      }
    } catch (error) {
      console.error('Error submitting tweet:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <h3 className="text-lg font-semibold mb-4">
        {isEditMode ? 'Edit Post' : 'Create a Post'}
      </h3>
      
      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title <span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input ${errors.title ? 'border-error' : ''}`}
          placeholder="Add a title for your post"
        />
        {errors.title && <p className="mt-1 text-sm text-error">{errors.title}</p>}
      </div>
      
      {/* Description */}
      <div className="mb-4">
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
          placeholder="Share your thoughts with the community"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-error">{errors.description}</p>}
      </div>
      
      {/* Tags */}
      <div className="mb-5">
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
      
      {/* Submit buttons */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span className="ml-2">{isEditMode ? 'Updating...' : 'Post'}</span>
            </>
          ) : (
            isEditMode ? 'Update Post' : 'Post'
          )}
        </button>
      </div>
    </form>
  );
};

export default TweetForm;