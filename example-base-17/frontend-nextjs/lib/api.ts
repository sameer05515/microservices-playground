import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: async (data: { username: string; email: string; password: string; role?: string }) => {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', data)
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}

// Admin API
export const adminApi = {
  getUsers: async () => {
    const response = await api.get('/api/admin/users')
    return response.data
  },

  getUser: async (id: string) => {
    const response = await api.get(`/api/admin/users/${id}`)
    return response.data
  },

  updateUserRole: async (id: string, role: string) => {
    const response = await api.patch(`/api/admin/users/${id}/role`, { role })
    return response.data
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/admin/users/${id}`)
    return response.data
  },

  getDashboard: async () => {
    const response = await api.get('/api/admin/dashboard')
    return response.data
  },
}

// Manager API
export const managerApi = {
  getUsers: async () => {
    const response = await api.get('/api/manage/users')
    return response.data
  },

  updateUser: async (id: string, data: { username?: string; email?: string }) => {
    const response = await api.patch(`/api/manage/users/${id}`, data)
    return response.data
  },

  getDashboard: async () => {
    const response = await api.get('/api/manage/dashboard')
    return response.data
  },
}

// User API
export const userApi = {
  getProfile: async () => {
    const response = await api.get('/api/profile/profile')
    return response.data
  },

  updateProfile: async (data: { username?: string; email?: string }) => {
    const response = await api.patch('/api/profile/profile', data)
    return response.data
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.patch('/api/profile/password', data)
    return response.data
  },

  getDashboard: async () => {
    const response = await api.get('/api/profile/dashboard')
    return response.data
  },
}

// Health check
export const healthApi = {
  check: async () => {
    const response = await api.get('/api/health')
    return response.data
  },
}

export default api

