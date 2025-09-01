import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage synchronously
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  let initialUser = null;
  let initialAuthenticated = false;

  if (storedToken && storedUser) {
    try {
      initialUser = JSON.parse(storedUser);
      initialAuthenticated = initialUser?.role === 'GovAdmin' || initialUser?.role === 'GovStaff';// Only admins are authenticated
      console.log('AuthProvider: Initial auth from localStorage', {
        storedToken,
        initialUser,
        initialAuthenticated,
      }); // Debugging
    } catch (error) {
      console.error('AuthProvider: Error parsing stored user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(storedToken);
  const [isLoading, setIsLoading] = useState(!!storedToken); // Loading if token exists
  const navigate = useNavigate();

  console.log('AuthProvider: Initialized', { isAuthenticated, user, token, isLoading }); // Debugging

  // Validate token on mount if it exists
  useEffect(() => {
    const validateToken = async () => {
      if (storedToken && initialUser) {
        try {
          const data = await apiClient.get('/auth/validate', storedToken);
          if (data.valid && (data.user.role === 'GovAdmin' || data.user.role === 'GovStaff')) {
            console.log('AuthProvider: Token validated', data.user); // Debugging
            setIsAuthenticated(true);
            setUser(data.user);
            setToken(storedToken);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            console.log('AuthProvider: Invalid or non-admin token', { data }); // Debugging
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }
        } catch (error) {
          console.error('AuthProvider: Token validation error:', error.message);
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
      setIsLoading(false);
    };

    if (storedToken) {
      validateToken();
    } else {
      setIsLoading(false);
      console.log('AuthProvider: No token found, skipping validation'); // Debugging
    }
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      if (data.user.role !== 'GovAdmin' && data.user.role !== 'GovStaff') {
        throw new Error('Access denied: Government Authority Admins or staff only');
      }
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('AuthProvider: Login successful', data.user); // Debugging
      navigate('/');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('AuthProvider: Login error:', error.message); // Debugging
      throw new Error(error.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('AuthProvider: Logged out'); // Debugging
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};