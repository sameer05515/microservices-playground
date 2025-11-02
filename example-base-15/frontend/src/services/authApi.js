import axios from 'axios';

const API_BASE_URL = '/api';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
};

export default authApi;

