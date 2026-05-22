import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setUser(data);
      setStaff(null);
    } catch {
      try {
        const { data } = await api.get('/staff/profile');
        setStaff(data);
        setUser(null);
      } catch {
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (email, password, type = 'user') => {
    const endpoint = type === 'staff' ? '/staff/login' : '/users/login';
    const { data } = await api.post(endpoint, { email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    if (type === 'staff') {
      setStaff(data);
      setUser(null);
    } else {
      setUser(data);
      setStaff(null);
    }
    return data;
  };

  const register = async (formData, type = 'user') => {
    const endpoint = type === 'staff' ? '/staff/register' : '/users/register';
    const { data } = await api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (type !== 'staff') {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setStaff(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, staff, token, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
