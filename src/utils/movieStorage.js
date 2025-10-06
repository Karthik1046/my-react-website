// Movie data persistence utility
// Handles saving and loading movie data from localStorage

const STORAGE_KEYS = {
  FEATURED_MOVIES: 'movieApp_featuredMovies',
  TRENDING_MOVIES: 'movieApp_trendingMovies', 
  POPULAR_MOVIES: 'movieApp_popularMovies',
  TV_SHOWS_POPULAR: 'movieApp_tvShowsPopular',
  TV_SHOWS_TRENDING: 'movieApp_tvShowsTrending'
};

// Default movie data
export const defaultFeaturedMovies = [
  {
    id: 1,
    title: 'Inception',
    image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
    year: 2010,
    rating: 4.8,
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    director: 'Christopher Nolan',
    duration: '2h 28m'
  },
  {
    id: 14,
    title: 'Avatar',
    image: 'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY0NTM@._V1_FMjpg_UX1000_.jpg',
    year: 2009,
    rating: 4.8,
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    director: 'James Cameron',
    duration: '2h 42m'
  },
  {
    id: 2,
    title: 'The Shawshank Redemption',
    image: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg',
    year: 1994,
    rating: 4.9,
    genre: ['Drama'],
    director: 'Frank Darabont',
    duration: '2h 22m'
  },
  {
    id: 3,
    title: 'The Dark Knight',
    image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
    year: 2008,
    rating: 4.9,
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    duration: '2h 32m'
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    image: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    year: 1994,
    rating: 4.8,
    genre: ['Crime', 'Drama'],
    director: 'Quentin Tarantino',
    duration: '2h 34m'
  },
  {
    id: 5,
    title: 'The Godfather',
    image: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    year: 1972,
    rating: 4.9,
    genre: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    duration: '2h 55m'
  }
];

export const defaultTrendingMovies = [
  {
    id: 1,
    title: 'Dune: Part Two',
    image: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI3NjYzYjkzXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
    year: 2024,
    rating: 4.8,
    genre: ['Sci-Fi', 'Adventure'],
    director: 'Denis Villeneuve',
    duration: '2h 46m'
  },
  {
    id: 3,
    title: 'Oppenheimer',
    image: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
    year: 2023,
    rating: 4.9,
    genre: ['Biography', 'Drama', 'History'],
    director: 'Christopher Nolan',
    duration: '3h 0m'
  },
  {
    id: 4,
    title: 'Spider-Man: No Way Home',
    image: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
    year: 2021,
    rating: 4.6,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'Jon Watts',
    duration: '2h 28m'
  },
  {
    id: 5,
    title: 'Avatar: The Way of Water',
    image: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg',
    year: 2022,
    rating: 4.5,
    genre: ['Action', 'Adventure', 'Drama'],
    director: 'James Cameron',
    duration: '3h 12m'
  },
  {
    id: 6,
    title: 'Top Gun: Maverick',
    image: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
    year: 2022,
    rating: 4.7,
    genre: ['Action', 'Drama'],
    director: 'Joseph Kosinski',
    duration: '2h 11m'
  }
];

export const defaultPopularMovies = [
  {
    id: 2,
    title: 'The Batman',
    image: 'https://m.media-amazon.com/images/M/MV5BM2MyNTAwZGEtNTAxNC00ODVjLTgzZjUtYmU0YjAzNzE1MjY2XkEyXkFqcGdeQXVyNDc2NTg3NzA@._V1_FMjpg_UX1000_.jpg',
    year: 2022,
    rating: 4.7,
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Matt Reeves',
    duration: '2h 56m'
  },
  {
    id: 7,
    title: 'The Shawshank Redemption',
    image: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg',
    year: 1994,
    rating: 4.9,
    genre: ['Drama'],
    director: 'Frank Darabont',
    duration: '2h 22m'
  },
  {
    id: 8,
    title: 'The Dark Knight',
    image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
    year: 2008,
    rating: 4.9,
    genre: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    duration: '2h 32m'
  },
  {
    id: 9,
    title: 'The Godfather',
    image: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    year: 1972,
    rating: 4.8,
    genre: ['Crime', 'Drama'],
    director: 'Francis Ford Coppola',
    duration: '2h 55m'
  },
  {
    id: 10,
    title: 'Inception',
    image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
    year: 2010,
    rating: 4.8,
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    director: 'Christopher Nolan',
    duration: '2h 28m'
  },
  {
    id: 11,
    title: 'Pulp Fiction',
    image: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    year: 1994,
    rating: 4.7,
    genre: ['Crime', 'Drama'],
    director: 'Quentin Tarantino',
    duration: '2h 34m'
  },
  {
    id: 12,
    title: 'Forrest Gump',
    image: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg',
    year: 1994,
    rating: 4.6,
    genre: ['Drama', 'Romance'],
    director: 'Robert Zemeckis',
    duration: '2h 22m'
  },
  {
    id: 13,
    title: 'Goodfellas',
    image: 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjA4NDg3YmI1NzMxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    year: 1990,
    rating: 4.7,
    genre: ['Biography', 'Crime', 'Drama'],
    director: 'Martin Scorsese',
    duration: '2h 26m'
  }
];

// Utility functions
export const loadMoviesFromStorage = (category) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS[category]);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error(`Error loading ${category} from localStorage:`, error);
    return null;
  }
};

export const saveMoviesToStorage = (category, movies) => {
  try {
    localStorage.setItem(STORAGE_KEYS[category], JSON.stringify(movies));
  } catch (error) {
    console.error(`Error saving ${category} to localStorage:`, error);
  }
};

export const getInitialMovieData = (category) => {
  const stored = loadMoviesFromStorage(category);
  if (stored) return stored;
  
  // Return default data based on category
  switch (category) {
    case 'FEATURED_MOVIES':
      return [...defaultFeaturedMovies];
    case 'TRENDING_MOVIES':
      return [...defaultTrendingMovies];
    case 'POPULAR_MOVIES':
      return [...defaultPopularMovies];
    default:
      return [];
  }
};

export const addMovieToStorage = (category, movie) => {
  const currentMovies = getInitialMovieData(category);
  
  // Generate unique ID if not provided
  if (!movie.id) {
    const maxId = Math.max(...currentMovies.map(m => m.id || 0), 0);
    movie.id = maxId + 1;
  }
  
  const updatedMovies = [movie, ...currentMovies];
  saveMoviesToStorage(category, updatedMovies);
  return updatedMovies;
};

export const updateMovieInStorage = (category, updatedMovie) => {
  const currentMovies = getInitialMovieData(category);
  const updatedMovies = currentMovies.map(movie => 
    movie.id === updatedMovie.id ? updatedMovie : movie
  );
  saveMoviesToStorage(category, updatedMovies);
  return updatedMovies;
};

export const deleteMovieFromStorage = (category, movieId) => {
  const currentMovies = getInitialMovieData(category);
  const updatedMovies = currentMovies.filter(movie => movie.id !== movieId);
  saveMoviesToStorage(category, updatedMovies);
  return updatedMovies;
};

// Initialize storage with default data if empty
export const initializeStorage = () => {
  if (!loadMoviesFromStorage('FEATURED_MOVIES')) {
    saveMoviesToStorage('FEATURED_MOVIES', defaultFeaturedMovies);
  }
  if (!loadMoviesFromStorage('TRENDING_MOVIES')) {
    saveMoviesToStorage('TRENDING_MOVIES', defaultTrendingMovies);
  }
  if (!loadMoviesFromStorage('POPULAR_MOVIES')) {
    saveMoviesToStorage('POPULAR_MOVIES', defaultPopularMovies);
  }
};