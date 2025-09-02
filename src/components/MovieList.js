import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, CardMedia, Chip, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';

// Mock data - in a real app, this would come from an API
const mockMovies = {
  trending: [
    {
      id: 1,
      title: 'Dune: Part Two',
      image: 'https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmQ2LTljNDYtMmZjNTc5MDUxMzViXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
      year: 2024,
      rating: 4.8,
      genre: ['Sci-Fi', 'Adventure'],
      director: 'Denis Villeneuve',
      duration: '2h 46m'
    },
    // Add more trending movies...
  ],
  popular: [
    {
      id: 2,
      title: 'The Batman',
      image: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_.jpg',
      year: 2022,
      rating: 4.7,
      genre: ['Action', 'Crime', 'Drama'],
      director: 'Matt Reeves',
      duration: '2h 56m'
    },
    // Add more popular movies...
  ]
};

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const { category = 'popular' } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchMovies = async () => {
      setLoading(true);
      // In a real app, you would fetch from an API like:
      // const response = await fetch(`/api/movies/${category}`);
      // const data = await response.json();
      
      // For now, use mock data
      setTimeout(() => {
        setMovies(mockMovies[category] || mockMovies.popular);
        setLoading(false);
      }, 500);
    };

    fetchMovies();
  }, [category]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading movies...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold', background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {category === 'trending' ? 'Trending Now' : 'Popular Movies'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {category === 'trending' 
            ? 'Check out the hottest movies right now' 
            : 'Discover the most popular movies of all time'}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
              }
            }}>
              <Box sx={{ position: 'relative', paddingTop: '150%' }}>
                <CardMedia
                  component="img"
                  image={movie.image}
                  alt={movie.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  <StarIcon sx={{ color: 'gold', fontSize: '1rem', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {movie.rating}
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{ 
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {movie.title}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {movie.genre.map((genre, index) => (
                    <Chip 
                      key={index}
                      label={genre}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="body2" color="text.secondary">
                    {movie.year} • {movie.duration}
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    color="primary"
                    href={`/movies/${movie.id}`}
                    sx={{ 
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      padding: '4px 12px',
                      minWidth: '100px'
                    }}
                  >
                    Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieList;
