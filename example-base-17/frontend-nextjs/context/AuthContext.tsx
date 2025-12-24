'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/lib/api'

interface User {
  id: string
  username: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'USER'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token and user on mount
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        // Verify token is still valid
        refreshUser().catch(() => {
          logout()
        })
      } catch (error) {
        logout()
      }
    }
    setLoading(false)
  }, [])

  const refreshUser = async () => {
    try {
      const data = await authApi.getMe()
      const userData = data.user
      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (error) {
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password })
      const userData = data.user
      const token = data.token

      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (username: string, email: string, password: string, role?: string) => {
    try {
      const data = await authApi.register({ username, email, password, role })
      const userData = data.user
      const token = data.token

      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

