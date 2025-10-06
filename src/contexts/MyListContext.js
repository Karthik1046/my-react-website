import React, { createContext, useContext, useState, useEffect } from 'react';

const MyListContext = createContext();

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('movieflix_token');
};

// Helper function for API calls
const apiCall = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const fullUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Something went wrong');
  }

  return response.json();
};

export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState({
    movies: [],
    tvShows: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data on mount - try server first, fallback to localStorage
  useEffect(() => {
    console.log('Initializing MyList context...');
    
    const loadMyList = async () => {
      const token = getAuthToken();
      console.log('Auth token exists:', !!token);
      
      if (token) {
        // User is logged in, try to load from server
        try {
          setLoading(true);
          console.log('Fetching watchlist from server...');
          const response = await apiCall('/api/watchlist');
          console.log('Server watchlist response:', response);
          
          // Convert server watchlist format to local format
          const serverList = {
            movies: response.data.filter(item => item.movie.category !== 'tv-show').map(item => ({
              id: item.movie._id,
              title: item.movie.title,
              poster_path: item.movie.image,
              release_date: item.movie.year.toString(),
              overview: item.movie.description,
              vote_average: item.movie.rating,
              genre: item.movie.genre,
              addedDate: item.addedAt.split('T')[0],
              type: 'movie',
              serverItem: true, // Flag to indicate this came from server
              watchlistId: item._id
            })),
            tvShows: response.data.filter(item => item.movie.category === 'tv-show').map(item => ({
              id: item.movie._id,
              title: item.movie.title,
              poster_path: item.movie.image,
              first_air_date: item.movie.year.toString(),
              overview: item.movie.description,
              vote_average: item.movie.rating,
              genre: item.movie.genre,
              addedDate: item.addedAt.split('T')[0],
              type: 'tv',
              serverItem: true,
              watchlistId: item._id
            }))
          };
          
          console.log('Setting server watchlist:', serverList);
          setMyList(serverList);
        } catch (error) {
          console.error('Failed to load watchlist from server:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        } finally {
          setLoading(false);
        }
      } else {
        // User not logged in, load from localStorage
        console.log('No auth token, loading from localStorage');
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      console.log('Loading from localStorage...');
      try {
        const savedList = localStorage.getItem('myList');
        console.log('Raw saved list from localStorage:', savedList);
        
        if (savedList) {
          const parsedList = JSON.parse(savedList);
          console.log('Parsed list from localStorage:', parsedList);
          
          // Ensure the parsed list has the correct structure
          const validatedList = {
            movies: Array.isArray(parsedList.movies) ? parsedList.movies : [],
            tvShows: Array.isArray(parsedList.tvShows) ? parsedList.tvShows : []
          };
          
          console.log('Setting validated list to state:', validatedList);
          setMyList(validatedList);
          
          // Verify the state was set correctly
          const verifyState = () => {
            const currentState = JSON.parse(localStorage.getItem('myList') || '{}');
            console.log('Verifying state - localStorage:', currentState);
            console.log('Verifying state - React state:', myList);
          };
          
          // Verify after a short delay to allow state to update
          setTimeout(verifyState, 100);
        } else {
          console.log('No saved list found in localStorage, initializing empty');
          // Initialize with a fresh empty object with the correct structure
          const emptyList = { movies: [], tvShows: [] };
          console.log('Initializing with empty list:', emptyList);
          setMyList(emptyList);
          // Don't save empty list to localStorage here, let the effect handle it
        }
      } catch (error) {
        console.error('Error in loadFromLocalStorage:', error);
        // Initialize with empty lists if any error occurs
        const emptyList = { movies: [], tvShows: [] };
        console.error('Initializing with empty list due to error');
        setMyList(emptyList);
      }
    };

    loadMyList();
    
    // Log any changes to myList
    const unsubscribe = () => {
      console.log('MyList state updated:', myList);
    };
    
    return () => {
      console.log('Cleaning up MyList context');
      unsubscribe();
    };
  }, [myList]);

  // Save to localStorage whenever myList changes (for offline support)
  useEffect(() => {
    // Skip the initial render or empty state
    if (myList.movies.length === 0 && myList.tvShows.length === 0) {
      console.log('Skipping initial empty state save');
      return;
    }
    
    console.log('Saving to localStorage:', myList);
    try {
      localStorage.setItem('myList', JSON.stringify({
        movies: myList.movies || [],
        tvShows: myList.tvShows || []
      }));
      console.log('Successfully saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // If saving fails, try to clear localStorage and save again
      try {
        console.log('Attempting to clear localStorage and retry...');
        localStorage.clear();
        localStorage.setItem('myList', JSON.stringify({
          movies: myList.movies || [],
          tvShows: myList.tvShows || []
        }));
        console.log('Successfully saved after clearing localStorage');
      } catch (retryError) {
        console.error('Failed to save after clearing localStorage:', retryError);
      }
    }
  }, [myList]);

  const addToMyList = async (item, type = 'movie') => {
    const token = getAuthToken();
    
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have a valid ID
      if (!item.id) {
        const error = new Error('Cannot add item without an ID');
        console.error(error.message, item);
        throw error;
      }
      
      // Normalize the ID to string for consistency
      const normalizedId = item.id.toString();
      
      // Create a new item with all required fields first
      const itemWithId = {
        ...item,
        id: normalizedId,
        type: type,
        addedDate: new Date().toISOString().split('T')[0],
        // Ensure all required fields have default values
        title: item.title || 'Untitled',
        poster_path: item.poster_path || item.image || '',
        overview: item.overview || item.description || '',
        vote_average: item.vote_average || item.rating || 0,
        release_date: item.release_date || (item.year ? item.year.toString() : '')
      };
      
      // First check if item already exists in the current state
      const currentItems = type === 'movie' ? [...myList.movies] : [...myList.tvShows];
      const exists = currentItems.some(i => 
        (i.id && i.id.toString() === normalizedId) || 
        (i._id && i._id.toString() === normalizedId)
      );
      
      if (exists) {
        console.log('Item already in list:', normalizedId);
        return Promise.resolve();
      }
      
      console.log('Adding item to list:', itemWithId);
      
      // Create the new state first
      const newState = {
        ...myList,
        [type === 'movie' ? 'movies' : 'tvShows']: [
          ...currentItems,
          itemWithId
        ]
      };
      
      // Save to localStorage first
      try {
        localStorage.setItem('myList', JSON.stringify(newState));
        console.log('Successfully saved to localStorage');
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
        throw new Error('Failed to save to local storage');
      }
      
      // If user is logged in, try to sync with server
      if (token) {
        try {
          await apiCall(`/api/watchlist/${normalizedId}`, {
            method: 'POST',
            body: JSON.stringify({
              priority: 'medium'
            })
          });
          console.log('Successfully added to server watchlist');
        } catch (serverError) {
          console.error('Failed to add to server watchlist, keeping local changes:', serverError);
          // Don't throw error here, we want to keep the local changes
        }
      }
      
      // Update the state after all operations are complete
      setMyList(newState);
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding to list:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromMyList = async (id, type) => {
    const token = getAuthToken();
    
    try {
      setLoading(true);
      setError(null);
      
      // Normalize the ID to string for consistency
      const normalizedId = id.toString();
      
      if (token) {
        // User is logged in, remove from server first
        try {
          await apiCall(`/api/watchlist/${normalizedId}`, {
            method: 'DELETE'
          });
        } catch (serverError) {
          console.error('Failed to remove from server watchlist:', serverError);
          // Continue with local removal as fallback
        }
      }
      
      console.log('Removing item from list:', { id: normalizedId, type });
      
      // Remove from local state
      setMyList(prev => {
        if (type === 'movie') {
          return {
            ...prev,
            movies: prev.movies.filter(movie => 
              movie.id.toString() !== normalizedId && movie.id !== normalizedId
            )
          };
        } else {
          return {
            ...prev,
            tvShows: prev.tvShows.filter(show => 
              show.id.toString() !== normalizedId && show.id !== normalizedId
            )
          };
        }
      });
    } catch (error) {
      console.error('Error removing from list:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isInMyList = (id, type) => {
    // Convert id to string for consistent comparison
    const idStr = id.toString();
    
    if (type === 'movie') {
      return myList.movies.some(movie => {
        // Check both string and number representations of the ID
        const movieId = movie.id ? movie.id.toString() : null;
        return movieId === idStr || movieId === id;
      });
    } else {
      return myList.tvShows.some(show => {
        const showId = show.id ? show.id.toString() : null;
        return showId === idStr || showId === id;
      });
    }
  };

  const toggleMyList = (item, type = 'movie') => {
    return new Promise((resolve, reject) => {
      try {
        if (isInMyList(item.id, type)) {
          removeFromMyList(item.id, type)
            .then(() => resolve())
            .catch(error => reject(error));
        } else {
          addToMyList(item, type)
            .then(() => resolve())
            .catch(error => reject(error));
        }
      } catch (error) {
        console.error('Error in toggleMyList:', error);
        reject(error);
      }
    });
  };

  const clearMyList = () => {
    setMyList({ movies: [], tvShows: [] });
  };

  const value = {
    myList,
    addToMyList,
    removeFromMyList,
    isInMyList,
    toggleMyList,
    clearMyList,
    loading,
    error
  };

  return (
    <MyListContext.Provider value={value}>
      {children}
    </MyListContext.Provider>
  );
};
