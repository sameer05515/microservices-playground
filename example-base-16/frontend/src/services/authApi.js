import axios from 'axios';

const API_BASE_URL = '/api';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token for authenticated endpoints
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.url.includes('/auth/change-password')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.includes('/auth/change-password')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (username, password, email) => {
    try {
      const response = await authApi.post('/auth/register', {
        username,
        password,
        email,
      });
      return response.data;
    } catch (error) {
      // Handle validation errors and other HTTP errors
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  login: async (username, password) => {
    try {
      const response = await authApi.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      // Handle authentication errors and other HTTP errors
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await authApi.post('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.data) {
        return {
          success: false,
          error: error.response.data.message || 'Failed to change password',
        };
      }
      return {
        success: false,
        error: error.message || 'Failed to change password',
      };
    }
  },
};

export default authApi;

