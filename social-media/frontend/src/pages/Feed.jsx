import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
// import useAuthStore from '../store/authStore';
import usePostStore from '../store/postStore';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Feed = () => {
  const { posts, isLoading, fetchPosts, pagination } = usePostStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);



  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    fetchPosts(1);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
     
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoading && posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600">Be the first to share something!</p>
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
                      "Load More Posts"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feed;
