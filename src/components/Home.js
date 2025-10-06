import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Paper, Chip, Fab, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MovieCarousel from './MovieCarousel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../contexts/AuthContext';
import AddMovieForm from './AddMovieForm';
import { getTrendingMovies, seedDefaultMovies } from '../utils/movieApi';
import { getResponsiveImageContainerStyles, getStandardCardStyles } from '../styles/imageConstants';


const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load trending movies from API on component mount
  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get trending movies from API
        const response = await getTrendingMovies({ limit: 12 });
        
        if (response.data && response.data.length > 0) {
          setTrendingMovies(response.data);
        } else {
          // If no movies exist and user is admin, seed default data
          if (currentUser && currentUser.role === 'admin') {
            console.log('No movies found. Attempting to seed default data...');
            const seeded = await seedDefaultMovies();
            if (seeded) {
              // Reload movies after seeding
              const retryResponse = await getTrendingMovies({ limit: 12 });
              setTrendingMovies(retryResponse.data || []);
            }
          }
        }
      } catch (error) {
        console.error('Error loading trending movies:', error);
        setError(error.message);
        // Fall back to empty array if API fails
        setTrendingMovies([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTrendingMovies();
  }, [currentUser]);
  
  const handleAddSuccess = async (newMovie) => {
    // Reload trending movies from API after successful add/edit
    if (newMovie) {
      try {
        const response = await getTrendingMovies({ limit: 12 });
        setTrendingMovies(response.data || []);
        console.log('Trending movie added/updated successfully!', newMovie);
      } catch (error) {
        console.error('Error reloading movies after add:', error);
        // If reload fails, just add the movie to current state
        setTrendingMovies(prev => [newMovie, ...prev.slice(0, 11)]);
      }
    }
  };
  
  return (
    <Box sx={{ backgroundColor: '#0f0f1a', color: 'white' }}>
      <Box sx={{ 
        background: 'linear-gradient(rgba(15, 15, 26, 0.8), rgba(15, 15, 26, 0.9)), url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 0 60px',
        marginBottom: '40px'
      }}>
        <Container maxWidth="lg">
          {currentUser && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h3" component="h2" sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Welcome back, {currentUser.name}! 👋
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.9)',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}>
                Ready to discover amazing movies and TV shows?
              </Typography>
            </Box>
          )}
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 3,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Discover Your Next Favorite Movie
          </Typography>
          <Typography variant="h5" sx={{ 
            maxWidth: '700px',
            mb: 4,
            color: 'rgba(255,255,255,0.9)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Personalized movie recommendations based on your taste. Find hidden gems and all-time classics.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            sx={{
              padding: '12px 32px',
              fontSize: '1.1rem',
              borderRadius: '30px',
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(249, 203, 40, 0.3)'
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
      {/* Hero Carousel */}
      <MovieCarousel />
      
      {/* Trending Now Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <TrendingUpIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            Trending Now
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <Typography variant="h6" sx={{ color: '#ccc' }}>Loading trending movies...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <Typography variant="h6" sx={{ color: '#ff4d4d' }}>Error loading movies: {error}</Typography>
          </Box>
        ) : trendingMovies.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <Typography variant="h6" sx={{ color: '#ccc' }}>No trending movies available</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {trendingMovies.map((movie) => (
              <Grid item key={movie._id || movie.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card sx={{ 
                  ...getStandardCardStyles(),
                  bgcolor: '#1a1a2e', 
                  color: 'white'
                }}>
                  <Box sx={getResponsiveImageContainerStyles()}>
                    <img 
                      src={trendingMovies.indexOf(movie) === 0 ? 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg' : movie.image} 
                      alt={movie.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: 'gold',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.9rem'
                    }}>
                      <StarIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {movie.rating}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3" sx={{ 
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {movie.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                      {movie.genre.map((g, i) => (
                        <Chip 
                          key={i} 
                          label={g} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.1)', 
                            color: 'white',
                            fontSize: '0.7rem',
                            height: '24px'
                          }} 
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {movie.year} • {movie.duration || movie.formattedDuration || (movie.category === 'tv-show' ? `${movie.seasons} Season${movie.seasons > 1 ? 's' : ''}` : 'N/A')}
                      </Typography>
                      <Button 
                        variant="contained" 
                        size="small" 
                        color="secondary"
                        onClick={() => navigate(`/movies/${movie._id || movie.id}`)}
                        sx={{ 
                          borderRadius: '15px',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          padding: '4px 12px',
                          minWidth: '80px'
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      
      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 6, backgroundColor: '#141424' }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ 
          fontWeight: 'bold', 
          mb: 6,
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
            margin: '15px auto 0',
            borderRadius: '2px'
          }
        }}>
          Movie Genres
        </Typography>
        
        <Grid container spacing={3}>
          {[
            { name: 'Action', count: 512, color: '#ff4d4d' },
            { name: 'Drama', count: 423, color: '#4d79ff' },
            { name: 'Comedy', count: 389, color: '#4dff4d' },
            { name: 'Thriller', count: 278, color: '#ff4dff' },
            { name: 'Sci-Fi', count: 198, color: '#ffa64d' },
            { name: 'Horror', count: 156, color: '#4d4d4d' },
            { name: 'Documentary', count: 132, color: '#4dffff' },
            { name: 'Romance', count: 245, color: '#ff66b3' },
          ].map((category, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper 
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: '#1a1a2e',
                  color: 'white',
                  borderLeft: `4px solid ${category.color}`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{category.name}</Typography>
                <Typography variant="body2" sx={{ color: '#aaa' }}>{category.count} Titles</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ 
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1633613286848-e6b4cafca0c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white', 
        py: 10,
        textAlign: 'center',
        position: 'relative',
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Unlimited Anime Streaming
          </Typography>
          <Typography variant="h6" component="p" sx={{ 
            mb: 4, 
            opacity: 0.9,
            maxWidth: '700px',
            mx: 'auto',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>
            Watch your favorite anime shows and movies anytime, anywhere. Join our community of anime lovers today!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link}
              to="/signup"
              sx={{ 
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              sx={{ 
                borderRadius: '30px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>
      
      
      {/* Add Trending Movie Form Dialog */}
      <AddMovieForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        category="trending"
        onSuccess={handleAddSuccess}
      />
    </Box>
  );
};

export default Home;
