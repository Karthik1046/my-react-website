// Movie API utility functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Movie API functions
export const movieApi = {
  // Get all movies with optional filtering
  getMovies: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/movies${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return await handleApiError(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  // Get movies by category
  getMoviesByCategory: async (category, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/movies/category/${category}${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return await handleApiError(response);
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
      throw error;
    }
  },

  // Get single movie by ID
  getMovie: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return await handleApiError(response);
    } catch (error) {
      console.error(`Error fetching movie ${id}:`, error);
      throw error;
    }
  },

  // Create new movie (Admin only)
  createMovie: async (movieData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(movieData)
      });
      return await handleApiError(response);
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  },

  // Update movie (Admin only)
  updateMovie: async (id, movieData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(movieData)
      });
      return await handleApiError(response);
    } catch (error) {
      console.error(`Error updating movie ${id}:`, error);
      throw error;
    }
  },

  // Delete movie (Admin only)
  deleteMovie: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleApiError(response);
    } catch (error) {
      console.error(`Error deleting movie ${id}:`, error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query, filters = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append('search', query);
    
    // Add additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/movies?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return await handleApiError(response);
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }
};

// Convenience functions for different categories
export const getFeaturedMovies = (filters = {}) => 
  movieApi.getMoviesByCategory('movie', filters);

export const getTrendingMovies = (filters = {}) => 
  movieApi.getMoviesByCategory('trending', filters);

export const getPopularMovies = (filters = {}) => 
  movieApi.getMovies({ ...filters, limit: 20 });

export const getTVShows = (filters = {}) => 
  movieApi.getMoviesByCategory('tv-show', filters);

// Data seeding function (for initial setup)
export const seedDefaultMovies = async () => {
  try {
    // Import default data
    const { defaultFeaturedMovies, defaultTrendingMovies, defaultPopularMovies } = 
      await import('./movieStorage');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found. Cannot seed movies.');
      return false;
    }

    // Helper to create movies with proper category
    const createMovieWithCategory = async (movie, category) => {
      try {
        const movieData = {
          ...movie,
          category,
          description: movie.description || `${movie.title} is a ${movie.genre.join(', ')} film directed by ${movie.director}.`
        };
        delete movieData.id; // Remove frontend ID
        await movieApi.createMovie(movieData);
        return true;
      } catch (error) {
        console.warn(`Failed to seed movie: ${movie.title}`, error.message);
        return false;
      }
    };

    // Check if any movies exist
    const existingMovies = await movieApi.getMovies({ limit: 1 });
    if (existingMovies.data.length > 0) {
      console.log('Movies already exist in database. Skipping seeding.');
      return true;
    }

    console.log('Seeding default movies to database...');
    
    // Seed featured movies as regular movies
    const featuredResults = await Promise.all(
      defaultFeaturedMovies.map(movie => createMovieWithCategory(movie, 'movie'))
    );

    // Seed trending movies
    const trendingResults = await Promise.all(
      defaultTrendingMovies.map(movie => createMovieWithCategory(movie, 'trending'))
    );

    const successCount = featuredResults.filter(r => r).length + trendingResults.filter(r => r).length;
    console.log(`Successfully seeded ${successCount} movies to database.`);
    
    return true;
  } catch (error) {
    console.error('Error seeding movies:', error);
    return false;
  }
};

export default movieApi;