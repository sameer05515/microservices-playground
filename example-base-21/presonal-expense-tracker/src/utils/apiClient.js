import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
apiClient.interceptors.request.use(
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

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('Network error. Please check if the backend server is running.'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

// Expense API methods
export const expenseAPI = {
  // Get all expenses with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await apiClient.get(`/expenses?${params.toString()}`);
    return response.data.data || response.data; // Handle both response formats
  },

  // Get single expense
  getById: async (id) => {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data.data || response.data;
  },

  // Create expense
  create: async (expenseData) => {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data.data || response.data;
  },

  // Update expense
  update: async (id, expenseData) => {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return response.data.data || response.data;
  },

  // Delete expense
  delete: async (id) => {
    await apiClient.delete(`/expenses/${id}`);
    return true;
  },

  // Get statistics
  getStats: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get(`/expenses/stats/summary?${params.toString()}`);
    return response.data.data || response.data;
  },
};

// Income API (same shape as expenses; backend: /api/incomes)
export const incomeAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await apiClient.get(`/incomes?${params.toString()}`);
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/incomes/${id}`);
    return response.data.data || response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/incomes', data);
    return response.data.data || response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/incomes/${id}`, data);
    return response.data.data || response.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/incomes/${id}`);
    return true;
  },

  getStats: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get(`/incomes/stats/summary?${params.toString()}`);
    return response.data.data || response.data;
  },
};

// Auth API methods (optional, for future use)
export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not available');
  }
};

export default apiClient;

