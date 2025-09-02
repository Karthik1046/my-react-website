import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, CardMedia, Chip, Button, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';

// Mock data - in a real app, this would come from an API
const mockTVShows = {
  popular: [
    {
      id: 1,
      title: 'Stranger Things',
      image: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZDE1MzhlYzZiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
      year: '2016-Present',
      rating: 4.8,
      genre: ['Drama', 'Fantasy', 'Horror'],
      seasons: 4,
      description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.'
    },
    {
      id: 2,
      title: 'The Mandalorian',
      image: 'https://m.media-amazon.com/images/M/MV5BZDhlMzY0ZGItZTcyNS00ZTAxLWIyMmYtZGQ2ODg5OWZiYmJkXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_.jpg',
      year: '2019-Present',
      rating: 4.7,
      genre: ['Action', 'Adventure', 'Sci-Fi'],
      seasons: 3,
      description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.'
    },
    {
      id: 3,
      title: 'The Witcher',
      image: 'https://m.media-amazon.com/images/M/MV5BN2EyZjNmZTUtODNiYy00YjY0LThkN2UtYzM5N2Y0Y2VmYjYyXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg',
      year: '2019-Present',
      rating: 4.5,
      genre: ['Action', 'Adventure', 'Drama'],
      seasons: 3,
      description: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.'
    },
    {
      id: 4,
      title: 'The Crown',
      image: 'https://m.media-amazon.com/images/M/MV5BZTE1NjZlYzgtNjMyNS00YTEwLTgyYmUtNjYxN2Q1N2U5YzU4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg',
      year: '2016-2023',
      rating: 4.6,
      genre: ['Biography', 'Drama', 'History'],
      seasons: 6,
      description: 'This drama follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century.'
    },
  ],
  trending: [
    {
      id: 5,
      title: 'House of the Dragon',
      image: 'https://m.media-amazon.com/images/M/MV5BZjBiOGIyY2YtOTA3OC00YzY1LThkYjktM2Y0MzNmN2E5MzU0XkEyXkFqcGdeQXVyMTE1NDI5MDQx._V1_.jpg',
      year: '2022-Present',
      rating: 4.7,
      genre: ['Action', 'Adventure', 'Drama'],
      seasons: 1,
      description: 'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke.'
    },
    // Add more TV shows...
  ]
};

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#ff4d4d',
    height: '3px',
  },
  marginBottom: '24px',
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

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Simulate API call
    const fetchTVShows = async () => {
      setLoading(true);
      // In a real app, you would fetch from an API like:
      // const response = await fetch('/api/tv-shows/popular');
      // const data = await response.json();
      
      // For now, use mock data
      setTimeout(() => {
        setShows(mockTVShows.popular);
        setLoading(false);
      }, 500);
    };

    fetchTVShows();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // In a real app, you would fetch different data based on the selected tab
    setLoading(true);
    setTimeout(() => {
      setShows(newValue === 0 ? mockTVShows.popular : mockTVShows.trending);
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading TV shows...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold', background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TV Shows
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover the most popular and trending TV shows
        </Typography>
      </Box>

      <StyledTabs 
        value={tabValue} 
        onChange={handleTabChange}
        centered
        sx={{ mb: 4 }}
      >
        <StyledTab label="Popular" />
        <StyledTab label="Trending Now" />
        <StyledTab label="Top Rated" />
        <StyledTab label="Airing Today" />
      </StyledTabs>

      <Grid container spacing={4}>
        {shows.map((show) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={show.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 10px 25px rgba(255, 77, 77, 0.3)'
              }
            }}>
              <Box sx={{ position: 'relative', paddingTop: '150%' }}>
                <CardMedia
                  component="img"
                  image={show.image}
                  alt={show.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.9)'
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
                  borderRadius: '4px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <StarIcon sx={{ color: 'gold', fontSize: '1rem', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {show.rating}
                  </Typography>
                </Box>
                
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                  }}
                >
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<PlayArrowIcon />}
                    fullWidth
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                      mt: 1
                    }}
                  >
                    Watch Now
                  </Button>
                </Box>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      pr: 1
                    }}
                  >
                    {show.title}
                  </Typography>
                  <Chip 
                    label={`${show.seasons} ${show.seasons === 1 ? 'Season' : 'Seasons'}`}
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255,77,77,0.2)',
                      color: '#ff4d4d',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      height: '20px'
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                  {show.genre.slice(0, 2).map((genre, index) => (
                    <Chip 
                      key={index}
                      label={genre}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: '20px',
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  ))}
                  {show.genre.length > 2 && (
                    <Chip 
                      label={`+${show.genre.length - 2}`}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.7rem',
                        height: '20px',
                        '& .MuiChip-label': {
                          px: 0.5
                        }
                      }}
                    />
                  )}
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mb: 1.5,
                    fontSize: '0.85rem',
                    lineHeight: 1.4
                  }}
                >
                  {show.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="caption" color="text.secondary">
                    {show.year}
                  </Typography>
                  <Button 
                    size="small" 
                    startIcon={<AddIcon />}
                    sx={{ 
                      color: '#ff4d4d',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 77, 77, 0.1)'
                      }
                    }}
                  >
                    My List
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
        <Button 
          variant="outlined" 
          sx={{
            borderColor: '#ff4d4d',
            color: '#ff4d4d',
            px: 4,
            py: 1.5,
            borderRadius: '25px',
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: 'rgba(255, 77, 77, 0.1)',
              borderColor: '#ff4d4d',
            }
          }}
        >
          Load More
        </Button>
      </Box>
    </Container>
  );
};

export default TVShows;
