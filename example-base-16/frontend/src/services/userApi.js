import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with interceptors for token
const userApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await userApi.get('/users');
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Access denied. Admin role required.',
        };
      }
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Unauthorized. Please login again.',
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch users',
      };
    }
  },

  resetPassword: async (username, newPassword) => {
    try {
      const response = await userApi.post('/users/reset-password', {
        username,
        newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Access denied. Admin role required.',
        };
      }
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Unauthorized. Please login again.',
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to reset password',
      };
    }
  },
};

export default userApi;

