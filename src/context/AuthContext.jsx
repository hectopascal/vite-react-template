import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children, initialState = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize auth state from localStorage or provided initialState
  useEffect(() => {
    const initializeAuth = () => {
      try {
        setLoading(true);
        
        // Check for stored auth data
        const storedUser = localStorage.getItem('authUser');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } else if (initialState) {
          // Use provided initial state if available
          setCurrentUser(initialState.currentUser);
          setIsAuthenticated(initialState.isAuthenticated);
          
          // Store the initial state in localStorage for persistence
          localStorage.setItem('authUser', JSON.stringify(initialState.currentUser));
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [initialState]);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError('');
      
      // In a real app, this would call an API
      // For demo, we'll simulate a successful login with mock data
      if (email && password) {
        const mockUser = {
          id: '1',
          name: 'John Smith',
          email: email,
          level: 'Intermediate',
          profileImage: '/assets/images/default-avatar.png'
        };
        
        // Store user data
        localStorage.setItem('authUser', JSON.stringify(mockUser));
        
        setCurrentUser(mockUser);
        setIsAuthenticated(true);
        return mockUser;
      } else {
        throw new Error('Email and password are required');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (name, email, password) => {
    try {
      setLoading(true);
      setError('');
      
      // In a real app, this would call an API
      // For demo, we'll simulate a successful registration
      if (name && email && password) {
        const mockUser = {
          id: Math.floor(Math.random() * 1000).toString(),
          name,
          email,
          level: 'Beginner',
          profileImage: '/assets/images/default-avatar.png'
        };
        
        // Store user data
        localStorage.setItem('authUser', JSON.stringify(mockUser));
        
        setCurrentUser(mockUser);
        setIsAuthenticated(true);
        return mockUser;
      } else {
        throw new Error('All fields are required');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('authUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      
      // In a real app, this would call an API
      // For demo, we'll update the stored user data
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = {
          ...userData,
          ...profileData
        };
        
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        return updatedUser;
      } else {
        throw new Error('No authenticated user');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated,
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};