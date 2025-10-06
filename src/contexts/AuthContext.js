import React, { createContext, useState, useContext, useEffect } from 'react';
import { signInWithGoogle, signOut as firebaseSignOut } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('movieflix_user'));
    const token = localStorage.getItem('movieflix_token');
    const savedWatchlist = JSON.parse(localStorage.getItem('movieflix_watchlist')) || [];
    const savedFavorites = JSON.parse(localStorage.getItem('movieflix_favorites')) || [];
    
    if (user && token) {
      // Verify token with backend
      fetch('http://localhost:5000/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCurrentUser(data.user);
          setWatchlist(savedWatchlist);
          setFavorites(savedFavorites);
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('movieflix_user');
          localStorage.removeItem('movieflix_token');
        }
      })
      .catch(() => {
        // Network error, clear storage
        localStorage.removeItem('movieflix_user');
        localStorage.removeItem('movieflix_token');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('movieflix_user', JSON.stringify(data.user));
        localStorage.setItem('movieflix_token', data.token);
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to login. Please try again.' };
    }
  };

  const updateUser = async (userData) => {
    try {
      const token = localStorage.getItem('movieflix_token');
      if (!token) {
        console.error('No token found in localStorage');
        return { success: false, error: 'Not authenticated' };
      }

      console.log('Sending update request with data:', userData);
      
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      console.log('Update response:', data);
      
      if (data.success) {
        // Update local storage and state with new user data
        const updatedUser = {
          ...data.user,
          // Ensure avatar URL is absolute
          avatar: data.user.avatar && !data.user.avatar.startsWith('http')
            ? `http://localhost:5000${data.user.avatar}`
            : data.user.avatar
        };
        
        localStorage.setItem('movieflix_user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        return { success: true, user: updatedUser };
      } else {
        console.error('Update failed:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Update error:', error);
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('movieflix_user', JSON.stringify(data.user));
        localStorage.setItem('movieflix_token', data.token);
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Failed to register. Please try again.' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        // You can add additional logic here to save user data to your backend
        const user = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        };
        
        localStorage.setItem('movieflix_user', JSON.stringify(user));
        localStorage.setItem('movieflix_token', result.user.accessToken);
        setCurrentUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: 'Failed to sign in with Google.' };
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut();
    } catch (error) {
      console.error('Firebase sign out error:', error);
    }
    
    // Clear local storage and state
    localStorage.removeItem('movieflix_user');
    localStorage.removeItem('movieflix_token');
    localStorage.removeItem('movieflix_watchlist');
    localStorage.removeItem('movieflix_favorites');
    setCurrentUser(null);
    setWatchlist([]);
    setFavorites([]);
    return Promise.resolve();
  };

  const addToWatchlist = (item) => {
    const updatedWatchlist = [...watchlist, item];
    setWatchlist(updatedWatchlist);
    if (currentUser) {
      localStorage.setItem('movieflix_watchlist', JSON.stringify(updatedWatchlist));
    }
  };

  const removeFromWatchlist = (itemId) => {
    const updatedWatchlist = watchlist.filter(item => item.id !== itemId);
    setWatchlist(updatedWatchlist);
    if (currentUser) {
      localStorage.setItem('movieflix_watchlist', JSON.stringify(updatedWatchlist));
    }
  };

  const addToFavorites = (item) => {
    const updatedFavorites = [...favorites, item];
    setFavorites(updatedFavorites);
    if (currentUser) {
      localStorage.setItem('movieflix_favorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorites = (itemId) => {
    const updatedFavorites = favorites.filter(item => item.id !== itemId);
    setFavorites(updatedFavorites);
    if (currentUser) {
      localStorage.setItem('movieflix_favorites', JSON.stringify(updatedFavorites));
    }
  };

  const toggleWatchlist = (item) => {
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const toggleFavorite = (item) => {
    if (isInFavorites(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  const isInWatchlist = (itemId) => {
    return watchlist.some(item => item.id === itemId);
  };

  const isInFavorites = (itemId) => {
    return favorites.some(item => item.id === itemId);
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
    watchlist,
    toggleWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    favorites,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
