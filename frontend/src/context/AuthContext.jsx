import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

/**
 * Decode JWT payload to extract user info (username, is_staff).
 * Does NOT verify the signature -- used for UI state only.
 */
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('access_token');
    return stored ? decodeToken(stored) : null;
  });
  const navigate = useNavigate();

  const login = (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setToken(access);
    setUser(decodeToken(access));
    navigate('/');
  };

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const isAuthenticated = !!token;
  const isStaff = !!user?.is_staff;
  const username = user?.username || '';

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, isStaff, username }}>
      {children}
    </AuthContext.Provider>
  );
};
