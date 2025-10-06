import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Box, Card, CardContent, CardMedia, Chip, Button, Tabs, Tab, Fab, Tooltip,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
  Menu, MenuItem, Snackbar, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddMovieForm from './AddMovieForm';
import { getTVShowCardStyles, TV_POSTER_DIMENSIONS, getStandardImageContainerStyles } from '../styles/imageConstants';

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
    {
      id: 6,
      title: 'Breaking Bad',
      image: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg',
      year: '2008-2013',
      rating: 4.9,
      genre: ['Crime', 'Drama', 'Thriller'],
      seasons: 5,
      description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.'
    },
    {
      id: 7,
      title: 'Game of Thrones',
      image: 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg',
      year: '2011-2019',
      rating: 4.7,
      genre: ['Action', 'Adventure', 'Drama'],
      seasons: 8,
      description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.'
    },
    {
      id: 8,
      title: 'The Office',
      image: 'https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4ZTktYTc0NzhhNWIzNzJiXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_.jpg',
      year: '2005-2013',
      rating: 4.8,
      genre: ['Comedy', 'Drama'],
      seasons: 9,
      description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.'
    },
    {
      id: 9,
      title: 'Friends',
      image: 'https://m.media-amazon.com/images/M/MV5BNDVkYjU0MzctMWRmZi00NTkxLTgwZWEtOWVhYjZlYjllYmU4XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg',
      year: '1994-2004',
      rating: 4.6,
      genre: ['Comedy', 'Romance'],
      seasons: 10,
      description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.'
    },
    {
      id: 10,
      title: 'The Sopranos',
      image: 'https://m.media-amazon.com/images/M/MV5BZGJjYzhjYTYtMDBjYy00OWU1LTg5OTYtNmYwOTZmZjE3ZDdhXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg',
      year: '1999-2007',
      rating: 4.8,
      genre: ['Crime', 'Drama'],
      seasons: 6,
      description: 'New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life.'
    },
    {
      id: 11,
      title: 'Sherlock',
      image: 'https://m.media-amazon.com/images/M/MV5BMWY3NTljMjEtYzRiMi00NWM2LTkzNjItZTVmZjE0MTdjMjJhL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTQ4NTc5OTU@._V1_.jpg',
      year: '2010-2017',
      rating: 4.7,
      genre: ['Crime', 'Drama', 'Mystery'],
      seasons: 4,
      description: 'A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.'
    },
    {
      id: 12,
      title: 'The Walking Dead',
      image: 'https://m.media-amazon.com/images/M/MV5BZmFlMTA0MmUtNWVmOC00ZmE1LWFmMDYtZTJhYjJhNGVjYTU5XkEyXkFqcGdeQXVyMTAzMDM4MjM0._V1_.jpg',
      year: '2010-2022',
      rating: 4.4,
      genre: ['Drama', 'Horror', 'Thriller'],
      seasons: 11,
      description: 'Sheriff Deputy Rick Grimes wakes up from a coma to learn the world is in ruins and must lead a group of survivors.'
    }
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
    {
      id: 13,
      title: 'Wednesday',
      image: 'https://m.media-amazon.com/images/M/MV5BM2ZmMjEyZmYtOGM4YS00YTNhLWE3ZDMtNzQxM2RhNjBlODIyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
      year: '2022-Present',
      rating: 4.5,
      genre: ['Comedy', 'Fantasy', 'Horror'],
      seasons: 1,
      description: 'Follows Wednesday Addams\' years as a student at Nevermore Academy, where she attempts to master her emerging psychic ability.'
    },
    {
      id: 14,
      title: 'Euphoria',
      image: 'https://m.media-amazon.com/images/M/MV5BMDMzZDkyNzEtYTY5Zi00YTk1LTg4OGYtM2Q2OTIzMWQxMmZlXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
      year: '2019-Present',
      rating: 4.3,
      genre: ['Drama'],
      seasons: 2,
      description: 'A look at life for a group of high school students as they grapple with issues of drugs, sex, and violence.'
    },
    {
      id: 15,
      title: 'The Bear',
      image: 'https://m.media-amazon.com/images/M/MV5BNTgxMjk5NjEtN2Y3NS00ZTY0LWE3MzMtMTQ2MzQzODI3MjU1XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_.jpg',
      year: '2022-Present',
      rating: 4.6,
      genre: ['Comedy', 'Drama'],
      seasons: 2,
      description: 'A young chef from the fine dining world returns to Chicago to run his deceased brother\'s Italian beef sandwich shop.'
    },
    {
      id: 16,
      title: 'Squid Game',
      image: 'https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_.jpg',
      year: '2021-Present',
      rating: 4.2,
      genre: ['Action', 'Drama', 'Mystery'],
      seasons: 1,
      description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games for a tempting prize.'
    },
    {
      id: 17,
      title: 'The Last of Us',
      image: 'https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUyLWI4ODEtN2Q3ZGJlYzhhZjU3XkEyXkFqcGdeQXVyNTM0OTY1OQ@@._V1_.jpg',
      year: '2023-Present',
      rating: 4.8,
      genre: ['Action', 'Adventure', 'Drama'],
      seasons: 1,
      description: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope.'
    },
    {
      id: 18,
      title: 'Abbott Elementary',
      image: 'https://m.media-amazon.com/images/M/MV5BNjIxMDQwNDYxNF5BMl5BanBnXkFtZTgwNTE4NDI0OTE@._V1_.jpg',
      year: '2021-Present',
      rating: 4.4,
      genre: ['Comedy'],
      seasons: 3,
      description: 'A workplace comedy centered around a group of dedicated teachers and a tone-deaf principal in a Philadelphia public school.'
    }
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreShows, setHasMoreShows] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, show: null });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { currentUser } = useAuth();
  
  const SHOWS_PER_PAGE = 6; // Show 6 shows initially, then load 6 more each time
  const STORAGE_KEY_POPULAR = 'movieflix_tvshows_popular';
  const STORAGE_KEY_TRENDING = 'movieflix_tvshows_trending';

  const readStoredShows = (which) => {
    try {
      const key = which === 'popular' ? STORAGE_KEY_POPULAR : STORAGE_KEY_TRENDING;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };

  const writeStoredShows = (which, data) => {
    try {
      const key = which === 'popular' ? STORAGE_KEY_POPULAR : STORAGE_KEY_TRENDING;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (_) {
      // ignore quota errors
    }
  };

  useEffect(() => {
    // Seed localStorage once if empty
    const existingPopular = readStoredShows('popular');
    const existingTrending = readStoredShows('trending');
    if (!existingPopular) writeStoredShows('popular', mockTVShows.popular);
    if (!existingTrending) writeStoredShows('trending', mockTVShows.trending);

    // Load initial tab from storage
    const load = () => {
      setLoading(true);
      setCurrentPage(1);
      const all = tabValue === 0 ? readStoredShows('popular') || [] : readStoredShows('trending') || [];
      const initialShows = all.slice(0, SHOWS_PER_PAGE);
      setShows(initialShows);
      setHasMoreShows(all.length > SHOWS_PER_PAGE);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSuccess = (newShow) => {
    // Add the new TV show to the current list
    if (newShow) {
      // Ensure it has an id for local usage
      const withId = newShow.id ? newShow : { ...newShow, id: Date.now() };
      setShows(prevShows => [withId, ...prevShows]);

      // Update localStorage bucket
      if (tabValue === 0) {
        const list = readStoredShows('popular') || [];
        list.unshift(withId);
        writeStoredShows('popular', list);
      } else {
        const list = readStoredShows('trending') || [];
        list.unshift(withId);
        writeStoredShows('trending', list);
      }
    }
  };
  
  const handleLoadMore = () => {
    setLoadingMore(true);
    
    setTimeout(() => {
      const currentData = tabValue === 0 ? (readStoredShows('popular') || []) : (readStoredShows('trending') || []);
      const nextPage = currentPage + 1;
      const startIndex = currentPage * SHOWS_PER_PAGE;
      const endIndex = startIndex + SHOWS_PER_PAGE;
      const newShows = currentData.slice(startIndex, endIndex);
      
      if (newShows.length > 0) {
        setShows(prevShows => [...prevShows, ...newShows]);
        setCurrentPage(nextPage);
      }
      
      // Check if there are more shows to load
      setHasMoreShows(endIndex < currentData.length);
      setLoadingMore(false);
    }, 800); // Simulate loading delay
  };
  
  const handleMenuOpen = (event, show) => {
    setMenuAnchor(event.currentTarget);
    setSelectedShow(show);
  };
  
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedShow(null);
  };
  
  const handleEdit = () => {
    if (selectedShow) {
      setEditingShow(selectedShow);
      setShowEditForm(true);
      handleMenuClose();
    }
  };
  
  const handleDelete = () => {
    if (selectedShow) {
      setDeleteDialog({ open: true, show: selectedShow });
      handleMenuClose();
    }
  };
  
  const confirmDelete = () => {
    if (deleteDialog.show) {
      // Remove from current shows list
      setShows(prevShows => prevShows.filter(show => show.id !== deleteDialog.show.id));
      // Remove from storage
      if (tabValue === 0) {
        const list = (readStoredShows('popular') || []).filter(show => show.id !== deleteDialog.show.id);
        writeStoredShows('popular', list);
      } else {
        const list = (readStoredShows('trending') || []).filter(show => show.id !== deleteDialog.show.id);
        writeStoredShows('trending', list);
      }
      
      setSnackbar({ 
        open: true, 
        message: `TV show "${deleteDialog.show.title}" deleted successfully!`, 
        severity: 'success' 
      });
      
      setDeleteDialog({ open: false, show: null });
    }
  };
  
  const handleEditSuccess = (updatedShow) => {
    if (updatedShow && editingShow) {
      // Update current shows list
      setShows(prevShows => 
        prevShows.map(show => 
          show.id === editingShow.id ? updatedShow : show
        )
      );
      // Update storage
      if (tabValue === 0) {
        const list = (readStoredShows('popular') || []).map(show => show.id === editingShow.id ? { ...show, ...updatedShow } : show);
        writeStoredShows('popular', list);
      } else {
        const list = (readStoredShows('trending') || []).map(show => show.id === editingShow.id ? { ...show, ...updatedShow } : show);
        writeStoredShows('trending', list);
      }
      
      setSnackbar({ 
        open: true, 
        message: `TV show "${updatedShow.title}" updated successfully!`, 
        severity: 'success' 
      });
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
    
    // In a real app, you would fetch different data based on the selected tab
    setLoading(true);
    setTimeout(() => {
      const currentData = newValue === 0 ? (readStoredShows('popular') || []) : (readStoredShows('trending') || []);
      const initialShows = currentData.slice(0, SHOWS_PER_PAGE);
      setShows(initialShows);
      setHasMoreShows(currentData.length > SHOWS_PER_PAGE);
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, minHeight: '100vh' }}>
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              mb: 2, 
              fontWeight: 'bold', 
              fontSize: { xs: '2rem', md: '3rem' },
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}
          >
            TV Shows
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '1rem', md: '1.1rem' },
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Discover the most popular and trending TV shows
          </Typography>
        </Box>
        
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
          <StyledTabs 
            value={tabValue} 
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <StyledTab label="Popular" />
            <StyledTab label="Trending Now" />
            <StyledTab label="Top Rated" />
            <StyledTab label="Airing Today" />
          </StyledTabs>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '40vh', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            Loading TV shows...
          </Typography>
          <Box sx={{ 
            width: 60, 
            height: 60, 
            border: '4px solid rgba(255, 77, 77, 0.1)', 
            borderTop: '4px solid #ff4d4d', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, minHeight: '100vh' }}>
      <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 2, 
            fontWeight: 'bold', 
            fontSize: { xs: '2rem', md: '3rem' },
            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}
        >
          TV Shows
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Discover the most popular and trending TV shows
        </Typography>
      </Box>

      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
        <StyledTabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            '& .MuiTabs-flexContainer': {
              gap: { xs: 0, sm: 2 }
            },
            '& .MuiTab-root': {
              minWidth: { xs: 'auto', sm: 120 },
              px: { xs: 2, sm: 3 }
            }
          }}
        >
          <StyledTab label="Popular" />
          <StyledTab label="Trending Now" />
          <StyledTab label="Top Rated" />
          <StyledTab label="Airing Today" />
        </StyledTabs>
      </Box>

      {shows.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '40vh',
          textAlign: 'center',
          py: 8
        }}>
          <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
            No TV shows available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '400px' }}>
            We couldn't find any TV shows in this category. Try switching to another tab or check back later.
          </Typography>
          {currentUser && currentUser.role === 'admin' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddForm(true)}
              sx={{
                background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #ff3333, #e6b523)',
                }
              }}
            >
              Add First TV Show
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center" sx={{ px: { xs: 1, sm: 0 } }}>
          {shows.map((show) => (
          <Grid item key={show.id} xs={12} sm={12} md={10} lg={8} xl={6}>
            <Card sx={getTVShowCardStyles()}>
              <Box sx={{
                ...getStandardImageContainerStyles(TV_POSTER_DIMENSIONS),
                borderRadius: '12px 0 0 12px',
                '& img': {
                  ...getStandardImageContainerStyles(TV_POSTER_DIMENSIONS)['& img'],
                  filter: 'brightness(0.95)'
                }
              }}>
                <img
                  src={show.image}
                  alt={show.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/${TV_POSTER_DIMENSIONS.width}x${TV_POSTER_DIMENSIONS.height}?text=No+Image`;
                  }}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  right: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: '6px 10px',
                    borderRadius: '20px',
                    backdropFilter: 'blur(4px)'
                  }}>
                    <StarIcon sx={{ color: 'gold', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {show.rating}
                    </Typography>
                  </Box>
                  
                  {currentUser && currentUser.role === 'admin' && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, show)}
                      sx={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
              
              <CardContent sx={{ 
                flexGrow: 1, 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                height: '100%',
                width: '55%'
              }}>
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      lineHeight: 1.2,
                      mb: 1,
                      color: '#fff'
                    }}
                  >
                    {show.title}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {show.genre.slice(0, 3).map((genre, index) => (
                    <Chip 
                      key={index}
                      label={genre}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '0.8rem',
                        height: '24px',
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          px: 1.5,
                          py: 0
                        }
                      }}
                    />
                  ))}
                </Box>
                
                <Box sx={{ flexGrow: 1, mb: 3 }}>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      mb: 2
                    }}
                  >
                    {show.description}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#fff'
                      }}
                    >
                      {show.year}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.9rem',
                        color: 'text.secondary'
                      }}
                    >
                      {show.seasons} {show.seasons === 1 ? 'Season' : 'Seasons'}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained"
                    onClick={() => navigate(`/tv-shows/${show.id}`)}
                    sx={{ 
                      background: 'linear-gradient(90deg, #f9cb28, #ff4d4d)',
                      color: '#000',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      px: 3,
                      py: 1,
                      borderRadius: '25px',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #e6b523, #ff3333)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(249, 203, 40, 0.4)'
                      },
                      transition: 'all 0.2s ease'
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
      
      {shows.length > 0 && hasMoreShows && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 6 }}>
          <Button 
            variant="outlined" 
            onClick={handleLoadMore}
            disabled={loadingMore}
            sx={{
              borderColor: '#ff4d4d',
              color: '#ff4d4d',
              px: 6,
              py: 2,
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              borderWidth: '2px',
              minWidth: '200px',
              '&:hover': {
                backgroundColor: 'rgba(255, 77, 77, 0.1)',
                borderColor: '#ff4d4d',
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(255, 77, 77, 0.2)'
              },
              '&:disabled': {
                borderColor: 'rgba(255, 77, 77, 0.5)',
                color: 'rgba(255, 77, 77, 0.5)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loadingMore ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  border: '2px solid rgba(255, 77, 77, 0.3)', 
                  borderTop: '2px solid #ff4d4d', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
                Loading...
              </Box>
            ) : (
              'Load More Shows'
            )}
          </Button>
        </Box>
      )}
      
      {shows.length > 0 && !hasMoreShows && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 6 }}>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              fontSize: '1rem',
              fontStyle: 'italic'
            }}
          >
            You've seen all available shows in this category! 🎬
          </Typography>
        </Box>
      )}
      
      {/* Add TV Show FAB - Only show for admin users */}
      {currentUser && currentUser.role === 'admin' && (
        <Tooltip title="Add TV Show" placement="left">
          <Fab
            color="primary"
            aria-label="add tv show"
            onClick={() => setShowAddForm(true)}
            sx={{
              position: 'fixed',
              bottom: { xs: 24, sm: 32 },
              right: { xs: 24, sm: 32 },
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
              boxShadow: '0 8px 20px rgba(255, 77, 77, 0.3)',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff3333, #e6b523)',
                transform: 'scale(1.1)',
                boxShadow: '0 12px 30px rgba(255, 77, 77, 0.4)'
              },
              transition: 'all 0.3s ease',
              zIndex: 1000
            }}
          >
            <AddIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
          </Fab>
        </Tooltip>
      )}
      
      {/* Edit/Delete Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ color: '#fff' }}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit Show
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ff4d4d' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete Show
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, show: null })}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a2e',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ff4d4d', fontWeight: 'bold' }}>
          Delete TV Show
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Are you sure you want to delete "{deleteDialog.show?.title}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, show: null })}
            sx={{ color: '#fff' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete}
            variant="contained"
            sx={{
              backgroundColor: '#ff4d4d',
              '&:hover': {
                backgroundColor: '#ff3333'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add TV Show Form Dialog */}
      <AddMovieForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        category="tv-show"
        onSuccess={handleAddSuccess}
      />
      
      {/* Edit TV Show Form Dialog */}
      <AddMovieForm
        open={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingShow(null);
        }}
        category="tv-show"
        onSuccess={handleEditSuccess}
        editMode={true}
        initialData={editingShow}
      />
      
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TVShows;
