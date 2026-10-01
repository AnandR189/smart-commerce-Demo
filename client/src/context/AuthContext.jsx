import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sc_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveSession = (token, userData) => {
    localStorage.setItem('sc_token', token);
    localStorage.setItem('sc_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = useCallback(async (name, email, password) => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      saveSession(data.token, data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    } finally { setLoading(false); }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveSession(data.token, data.user);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      localStorage.setItem('sc_user', JSON.stringify(data.user));
      return data.user;
    } catch { return null; }
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, register, login, logout, refreshUser, isAdmin, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
