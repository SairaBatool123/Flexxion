import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import usePostStore from '../store/postStore';

const CreatePost = ({ onPostCreated }) => {
  const { createPost, isLoading } = usePostStore();
  const [formData, setFormData] = useState({
    text: '',
    image: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Post text is required';
    } else if (formData.text.trim().length > 1000) {
      newErrors.text = 'Post text must be less than 1000 characters';
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createPost(
        formData.text.trim(),
        formData.image.trim() || null
      );
      
      toast.success('Post created successfully!');
      
      // Blank form when the post is created
      setFormData({
        text: '',
        image: ''
      });
      
      // Callback to parent component
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Create a Post
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="form-label">
            What's on your mind?
          </label>
          <textarea
            id="text"
            name="text"
            rows="3"
            required
            className={`input-field resize-none border-bl ${
              errors.text ? "border-red-500" : ""
            }`}
            placeholder="Share your thoughts..."
            value={formData.text}
            onChange={handleChange}
            maxLength="1000"
          />
          {errors.text && (
            <p className="mt-1 text-sm text-red-600">{errors.text}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.text.length}/1000 characters
          </p>
        </div>

        <div>
          <label htmlFor="image" className="form-label">
            Image URL (Optional)
          </label>
          <input
            id="image"
            name="image"
            type="url"
            className={`input-field ${errors.image ? "border-red-500" : ""}`}
            placeholder="https:/image.jpg"
            value={formData.image}
            onChange={handleChange}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !formData.text.trim()}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
