import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import usePostStore from '../store/postStore';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuthStore();
  const { posts, isLoading, fetchUserPosts, pagination } = usePostStore();
  
  const [profileUser, setProfileUser] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);

  // Check if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === currentUser?._id;

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        if (isOwnProfile) {
          setProfileUser(currentUser);
        } else {
          // Fetch other user's profile
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('User not found');
          }

          const data = await response.json();
          setProfileUser(data.user);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to load profile');
        navigate('/feed');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (currentUser) {
      loadProfile();
    }
  }, [userId, currentUser, isOwnProfile, navigate]);

  useEffect(() => {
    if (profileUser) {
      fetchUserPosts(profileUser._id, currentPage);
    }
  }, [profileUser, currentPage, fetchUserPosts]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setProfileUser(updatedUser);
    if (isOwnProfile) {
      // Update current user in auth store
      // This would typically be handled by the auth store
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
          <button
            onClick={() => navigate('/feed')}
            className="btn-secondary"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/feed')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isOwnProfile ? 'My Profile' : `${profileUser.name}'s Profile`}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {currentUser.profileImage && (
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {currentUser.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-gray text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={profileUser.profileImage}
                    alt={profileUser.name}
                    className="w-24 h-24 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/120x120?text=U';
                    }}
                  />
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="absolute bottom-0 right-0 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                      title="Edit Profile"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profileUser.name}</h2>
                  <p className="text-gray-600">{profileUser.email}</p>
                  {profileUser.bio && (
                    <p className="text-gray-700 mt-2">{profileUser.bio}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                    {profileUser.isAdmin && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn-secondary"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {isOwnProfile ? 'My Posts' : `${profileUser.name}'s Posts`}
            </h3>
            <span className="text-sm text-gray-500">
              {pagination.totalPosts} {pagination.totalPosts === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {isLoading && posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isOwnProfile ? 'No posts yet' : 'No posts yet'}
              </h3>
              <p className="text-gray-600">
                {isOwnProfile 
                  ? 'Start sharing your thoughts with the world!' 
                  : `${profileUser.name} hasn't posted anything yet.`
                }
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/feed')}
                  className="btn-secondary mt-4"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
              
              {/* Load More Button */}
              {pagination.hasNextPage && (
                <div className="text-center py-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      'Load More Posts'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default Profile;
