// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const navigate = useNavigate();

  const login = (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setToken(access);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};