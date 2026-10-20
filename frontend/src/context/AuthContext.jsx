import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('electromart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('electromart_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load current user profile from backend on app mount
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('electromart_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('electromart_user', JSON.stringify(data.user));
      }
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('electromart_token');
      localStorage.removeItem('electromart_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('electromart_token', data.token);
        localStorage.setItem('electromart_user', JSON.stringify(data.user));
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('electromart_token', data.token);
        localStorage.setItem('electromart_user', JSON.stringify(data.user));
        showToast('Registration successful! Welcome to ElectroMart.', 'success');
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('electromart_token');
    localStorage.removeItem('electromart_user');
    showToast('You have been logged out.', 'info');
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      if (data.success) {
        setUser((prev) => ({ ...prev, ...data.user }));
        localStorage.setItem('electromart_user', JSON.stringify({ ...user, ...data.user }));
        showToast('Profile updated successfully', 'success');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update profile';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Address management
  const addAddress = async (addressData) => {
    try {
      const { data } = await api.post('/auth/addresses', addressData);
      if (data.success) {
        setUser((prev) => ({ ...prev, addresses: data.addresses }));
        showToast('Address added successfully', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add address';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const updateAddress = async (id, addressData) => {
    try {
      const { data } = await api.put(`/auth/addresses/${id}`, addressData);
      if (data.success) {
        setUser((prev) => ({ ...prev, addresses: data.addresses }));
        showToast('Address updated successfully', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update address';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await api.delete(`/auth/addresses/${id}`);
      if (data.success) {
        setUser((prev) => ({ ...prev, addresses: data.addresses }));
        showToast('Address removed', 'info');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove address';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
