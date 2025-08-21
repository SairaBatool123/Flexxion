import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login user
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store token in localStorage
          localStorage.setItem('token', data.token);
          
          return { success: true, data };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Register user
      signup: async (name, email, password, profileImage = null) => {
        set({ isLoading: true });
        try {
          const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, profileImage }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store token in localStorage
          localStorage.setItem('token', data.token);
          
          return { success: true, data };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Get current user
      getCurrentUser: async () => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            set({
              user: data.user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            get().logout();
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
          get().logout();
        }
      },

      // Logout user
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        localStorage.removeItem('token');
      },

      // Update user profile
      updateUser: async (userId, updateData) => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to update user');
          }

          // Update user in store if it's the current user
          set(state => ({
            user: state.user && state.user._id === userId ? data.user : state.user
          }));

          return data.user;
        } catch (error) {
          throw error;
        }
      },

      // Initialize auth state
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ token, isAuthenticated: true });
          get().getCurrentUser();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useAuthStore;
