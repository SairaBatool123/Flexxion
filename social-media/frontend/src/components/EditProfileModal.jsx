import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const EditProfileModal = ({ user, onClose, onProfileUpdated }) => {
  const { updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    profileImage: user.profileImage || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(user.profileImage || '');
  const fileInputRef = useRef(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      profileImage: url
    }));
    setImagePreview(url);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.profileImage && !isValidUrl(formData.profileImage) && !formData.profileImage.startsWith('data:')) {
      newErrors.profileImage = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = await updateUser(user._id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        bio: formData.bio.trim() || null,
        profileImage: formData.profileImage.trim() || null
      });

      toast.success('Profile updated successfully!');
      onProfileUpdated(updatedUser);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: ''
    }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
       
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

    
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Image Section */}
          <div>
            <label className="form-label">Profile Image</label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:-50 file:text-secondary-700 hover:file:bg-secondary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleImageUrlChange}
                    className={`input-field ${errors.profileImage ? 'border-red-500' : ''}`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.profileImage && (
                    <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Bio Field */}
          <div>
            <label htmlFor="bio" className="form-label">Bio (Optional)</label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              className={`input-field resize-none ${errors.bio ? 'border-red-500' : ''}`}
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
              maxLength="500"
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
