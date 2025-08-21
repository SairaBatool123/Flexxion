import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import usePostStore from '../store/postStore';
import useAuthStore from '../store/authStore';
import CommentModal from './CommentModal';

const PostCard = ({ post }) => {
  const { user } = useAuthStore();
  const { toggleLike, deletePost, isLikedByUser, canDeletePost } = usePostStore();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    try {
      await toggleLike(post._id);
    } catch (error) {
      toast.error(error.message || 'Failed to like post');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(post._id);
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const isLiked = isLikedByUser(post, user._id);
  const canDelete = canDeletePost(post, user._id);

  return (
    <>
      <div className="bg-white rounded-lg shadow mb-6">
        {/* Post Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.userId.profileImage}
                alt={post.userId.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {post.userId.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete post"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.text}</p>

          {post.image && (
            <div className="mb-4">
              <img
                src={post.image}
                alt="Post"
                className="w-full rounded-lg object-cover max-h-96"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="px-4 py-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {post.likeCount || 0}{" "}
                  {post.likeCount === 1 ? "like" : "likes"}
                </span>
              </button>

              {/* Comment Button */}
              <button
                onClick={() => setShowCommentModal(true)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {post.commentCount || 0}{" "}
                  {post.commentCount === 1 ? "comment" : "comments"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Preview */}
        {post.comments && post.comments.length > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="space-y-2">
              {post.comments.slice(0, 2).map((comment) => (
                <div key={comment._id} className="flex items-start space-x-2">
                  <img
                    src={comment.userId?.profileImage}
                    alt={comment.userName}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium text-gray-900">
                        {comment.userName}
                      </span>
                      <span className="text-gray-700 ml-2">{comment.text}</span>
                    </p>
                  </div>
                </div>
              ))}
              {post.comments.length > 2 && (
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  View all {post.comments.length} comments
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <CommentModal post={post} onClose={() => setShowCommentModal(false)} />
      )}
    </>
  );
};

export default PostCard;
