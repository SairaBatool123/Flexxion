import { create } from 'zustand';

const usePostStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false
  },

  // Get all posts
  fetchPosts: async (page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }

      set({
        posts: data.posts,
        pagination: data.pagination,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Get user's posts
  fetchUserPosts: async (userId, page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/posts/user/${userId}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user posts');
      }

      set({
        posts: data.posts,
        pagination: data.pagination,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Create new post
  createPost: async (text, image = null) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text, image }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      // Add new post to the beginning of the list
      set(state => ({
        posts: [data.post, ...state.posts],
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }

      // Remove post from the list
      set(state => ({
        posts: state.posts.filter(post => post._id !== postId),
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Like/Unlike post
  toggleLike: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to like post');
      }

      // Update post in the list
      set(state => ({
        posts: state.posts.map(post => 
          post._id === postId 
            ? { ...post, likes: data.likes, likeCount: data.likeCount }
            : post
        ),
      }));

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Add comment
  addComment: async (postId, text) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }

      // Update post with new comment
      set(state => ({
        posts: state.posts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                comments: [...post.comments, data.comment],
                commentCount: post.commentCount + 1
              }
            : post
        ),
      }));

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (postId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/posts/${postId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete comment');
      }

      // Remove comment from post
      set(state => ({
        posts: state.posts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                comments: post.comments.filter(comment => comment._id !== commentId),
                commentCount: post.commentCount - 1
              }
            : post
        ),
      }));

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get single post
  fetchPost: async (postId) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch post');
      }

      set({
        currentPost: data,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Clear current post
  clearCurrentPost: () => {
    set({ currentPost: null });
  },

  // Check if user liked a post
  isLikedByUser: (post, userId) => {
    return post.likes.includes(userId);
  },

  // Check if user can delete a post
  canDeletePost: (post, userId) => {
    return post.userId._id === userId;
  },

  // Check if user can delete a comment
  canDeleteComment: (comment, post, userId) => {
    return comment.userId === userId || post.userId._id === userId;
  },
}));

export default usePostStore;
