import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Grid, Card, CardContent, CardMedia, 
  IconButton, Tabs, Tab, Button, Snackbar, Alert, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../contexts/AuthContext';

// Mock data
const mockMyList = {
  movies: [
    {
      id: 1,
      title: 'Dune: Part Two',
      image: 'https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmQ2LTljNDYtMmZjNTc5MDUxMzViXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
      year: 2024,
      rating: 4.8,
      genre: ['Sci-Fi', 'Adventure'],
      addedDate: '2024-03-15',
      type: 'movie'
    }
  ],
  tvShows: [
    {
      id: 101,
      title: 'Stranger Things',
      image: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZDE1MzhlYzZiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
      year: '2016-Present',
      rating: 4.8,
      genre: ['Drama', 'Fantasy', 'Horror'],
      addedDate: '2024-03-05',
      type: 'tv',
      seasons: 4
    }
  ]
};

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': { backgroundColor: '#ff4d4d', height: '3px' },
  marginBottom: '24px',
});

const StyledTab = styled(Tab)({
  color: '#fff',
  fontWeight: '500',
  textTransform: 'none',
  '&.Mui-selected': { color: '#ff4d4d' },
});

const MyList = () => {
  const [tabValue, setTabValue] = useState(0);
  const [myList, setMyList] = useState({ movies: [], tvShows: [] });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyList = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setMyList(mockMyList);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to load your list.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchMyList();
  }, [currentUser]);

  const handleRemoveItem = (id, type) => {
    if (type === 'movie') {
      setMyList(prev => ({
        ...prev,
        movies: prev.movies.filter(movie => movie.id !== id)
      }));
    } else {
      setMyList(prev => ({
        ...prev,
        tvShows: prev.tvShows.filter(show => show.id !== id)
      }));
    }
    
    setSnackbar({
      open: true,
      message: 'Item removed from your list',
      severity: 'success'
    });
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Sign In to View Your List</Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/login')}
          sx={{
            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'all 0.3s ease',
          }}
        >
          Sign In
        </Button>
      </Container>
    );
  }

  const items = tabValue === 0 ? myList.movies : myList.tvShows;

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>My List</Typography>
      
      <StyledTabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
        <StyledTab label={`Movies (${myList.movies.length})`} />
        <StyledTab label={`TV Shows (${myList.tvShows.length})`} />
      </StyledTabs>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Loading your list...</Typography>
        </Box>
      ) : items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your {tabValue === 0 ? 'movies' : 'TV shows'} list is empty
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate(tabValue === 0 ? '/movies' : '/tv-shows')}
            sx={{
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
              '&:hover': { transform: 'translateY(-2px)' },
              transition: 'all 0.3s ease',
            }}
          >
            Browse {tabValue === 0 ? 'Movies' : 'TV Shows'}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${item.type}-${item.id}`}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1a1a1a' }}>
                <Box sx={{ pt: '150%', position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveItem(item.id, item.type)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,77,77,0.8)' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <CardContent>
                  <Typography variant="subtitle1" noWrap sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {item.genre.slice(0, 2).map((g, i) => (
                      <Chip key={i} label={g} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {item.year}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ color: 'gold', fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="caption">{item.rating}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyList;
