import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminContext = createContext();

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await api.adminVerify(token);
      if (response.success) {
        setAdmin(response.admin);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.adminLogin(username, password);
      if (response.success) {
        setToken(response.token);
        setAdmin(response.admin);
        localStorage.setItem('adminToken', response.token);
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      // Provide more helpful error messages
      let errorMessage = error.message || 'Request failed';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Make sure the backend is running on http://localhost:3000';
      }
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
  };

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!admin
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

