import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Grid, 
  Paper, 
  IconButton,
  Rating,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Mock data - in a real app, this would come from an API
const mockMovieDetails = {
  1: {
    id: 1,
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    poster_path: 'https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmQ2LTljNDYtMmZjNTc5MDUxMzViXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    backdrop_path: 'https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmQ2LTljNDYtMmZjNTc5MDUxMzViXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    release_date: '2024-03-01',
    runtime: 166,
    vote_average: 8.5,
    vote_count: 4500,
    genres: [
      { id: 1, name: 'Science Fiction' },
      { id: 2, name: 'Adventure' },
      { id: 3, name: 'Drama' }
    ],
    director: 'Denis Villeneuve',
    cast: [
      { id: 1, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: 'https://image.tmdb.org/t/p/w200/7Bxpe8pBfTO9Vo1f7qFU4EiZ6o08.jpg' },
      { id: 2, name: 'Zendaya', character: 'Chani', profile_path: 'https://image.tmdb.org/t/p/w200/6TE2AlOUqcrs7CyJiWYgodmee1r.jpg' },
      { id: 3, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: 'https://image.tmdb.org/t/p/w200/9APD0Xw6NzJ3dHQM66qFVELhl5t.jpg' },
      { id: 4, name: 'Javier Bardem', character: 'Stilgar', profile_path: 'https://image.tmdb.org/t/p/w200/2CcyMVM0zBdT0fYT2zHfxRVrVQu.jpg' },
    ],
    similar_movies: [
      { id: 101, title: 'Dune', poster_path: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', year: 2021 },
      { id: 102, title: 'Blade Runner 2049', poster_path: 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg', year: 2017 },
      { id: 103, title: 'Interstellar', poster_path: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', year: 2014 },
    ]
  },
  // Add more movie details as needed
};

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#ff4d4d',
    height: '3px',
  },
});

const StyledTab = styled(Tab)({
  color: '#fff',
  fontWeight: '500',
  textTransform: 'none',
  fontSize: '1rem',
  '&.Mui-selected': {
    color: '#ff4d4d',
  },
});

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [rating, setRating] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchMovieDetails = async () => {
      setLoading(true);
      // In a real app, you would fetch from an API like:
      // const response = await fetch(`/api/movies/${id}`);
      // const data = await response.json();
      
      // For now, use mock data
      setTimeout(() => {
        setMovie(mockMovieDetails[id] || mockMovieDetails[1]);
        setLoading(false);
      }, 500);
    };

    fetchMovieDetails();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    // In a real app, you would save the rating to your backend
  };

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    // In a real app, you would update the user's watchlist in the backend
  };

  if (loading || !movie) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading movie details...</Typography>
      </Box>
    );
  }

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Box sx={{ 
      background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${movie.backdrop_path})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      color: 'white',
    }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white', mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Back to {tabValue === 0 ? 'Movies' : 'TV Shows'}</Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper 
              elevation={6} 
              sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s ease',
                }
              }}
            >
              <img 
                src={movie.poster_path} 
                alt={movie.title} 
                style={{ 
                  width: '100%', 
                  display: 'block',
                  borderRadius: '8px'
                }} 
              />
              <Box sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                borderRadius: '4px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                backdropFilter: 'blur(4px)'
              }}>
                <StarIcon sx={{ color: 'gold', fontSize: '1.2rem', mr: 0.5 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {movie.vote_average.toFixed(1)}
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                startIcon={<PlayArrowIcon />}
                fullWidth
                sx={{
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Watch Now
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={isInWatchlist ? <StarIcon /> : <AddIcon />}
                fullWidth
                onClick={toggleWatchlist}
                sx={{
                  mb: 2,
                  py: 1.5,
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: '#ff4d4d',
                    color: '#ff4d4d',
                    backgroundColor: 'rgba(255, 77, 77, 0.1)'
                  },
                }}
              >
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Typography component="legend" sx={{ mr: 1, alignSelf: 'center' }}>Rate:</Typography>
                <Rating
                  name="movie-rating"
                  value={rating}
                  onChange={handleRatingChange}
                  precision={0.5}
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  sx={{ color: '#ff4d4d' }}
                />
              </Box>
              
              <Button 
                variant="text" 
                startIcon={<ShareIcon />}
                fullWidth
                sx={{ color: 'white' }}
              >
                Share
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
                {movie.title}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {movie.genres.map((genre) => (
                  <Chip 
                    key={genre.id}
                    label={genre.name}
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,77,77,0.2)',
                      }
                    }}
                  />
                ))}
                <Chip 
                  label={movie.release_date.split('-')[0]}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                  }}
                />
                <Chip 
                  label={formatRuntime(movie.runtime)}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                  }}
                />
              </Box>
              
              <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 3, color: '#ccc' }}>
                {movie.tagline}
              </Typography>
              
              <StyledTabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{ mb: 3 }}
              >
                <StyledTab label="Overview" />
                <StyledTab label="Cast & Crew" />
                <StyledTab label="Similar Movies" />
              </StyledTabs>
              
              <Box sx={{ mb: 4 }}>
                {tabValue === 0 && (
                  <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                    {movie.overview}
                  </Typography>
                )}
                
                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Cast</Typography>
                    <Grid container spacing={2}>
                      {movie.cast.map((person) => (
                        <Grid item xs={6} sm={4} md={3} key={person.id}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box 
                              component="img"
                              src={person.profile_path}
                              alt={person.name}
                              sx={{
                                width: '100%',
                                borderRadius: '8px',
                                mb: 1,
                                aspectRatio: '2/3',
                                objectFit: 'cover',
                                '&:hover': {
                                  transform: 'scale(1.03)',
                                  transition: 'transform 0.3s ease',
                                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                }
                              }}
                            />
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{person.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{person.character}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>Director</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography>{movie.director}</Typography>
                    </Box>
                  </Box>
                )}
                
                {tabValue === 2 && (
                  <Grid container spacing={2}>
                    {movie.similar_movies.map((similar) => (
                      <Grid item xs={6} sm={4} md={3} key={similar.id}>
                        <Box 
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover .similar-movie-overlay': {
                              opacity: 1,
                            }
                          }}
                          onClick={() => navigate(`/movies/${similar.id}`)}
                        >
                          <Box sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                            <img 
                              src={similar.poster_path} 
                              alt={similar.title}
                              style={{ 
                                width: '100%', 
                                display: 'block',
                                aspectRatio: '2/3',
                                objectFit: 'cover',
                              }} 
                            />
                            <Box 
                              className="similar-movie-overlay"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: 2,
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                {similar.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#ccc' }}>
                                {similar.year}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetails;
