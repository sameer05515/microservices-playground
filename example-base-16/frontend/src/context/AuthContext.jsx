import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user and token are stored in localStorage on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      if (response.success && response.token) {
        setUser(response);
        setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        return { success: true, data: response };
      }
      return { success: false, error: response.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  const register = async (username, password, email) => {
    try {
      const response = await authService.register(username, password, email);
      if (response.success) {
        setUser(response);
        if (response.token) {
          setToken(response.token);
          localStorage.setItem('token', response.token);
        }
        localStorage.setItem('user', JSON.stringify(response));
        return { success: true, data: response };
      }
      return { success: false, error: response.message || 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

