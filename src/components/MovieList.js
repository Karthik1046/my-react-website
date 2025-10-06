import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Box, Card, CardContent, CardMedia, Chip, Button, Fab, Tooltip,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Menu, MenuItem, Snackbar, Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddMovieForm from './AddMovieForm';
import { 
  getInitialMovieData, 
  addMovieToStorage, 
  updateMovieInStorage, 
  deleteMovieFromStorage,
  initializeStorage 
} from '../utils/movieStorage';
import { getResponsiveImageContainerStyles, getStandardCardStyles } from '../styles/imageConstants';
import { saveMoviesToStorage } from '../utils/movieStorage';


const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const { category = 'popular' } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, movie: null });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initialize storage and load movies
    const fetchMovies = async () => {
      setLoading(true);
      initializeStorage();
      
      // Determine storage category based on route category
      const storageCategory = category === 'trending' ? 'TRENDING_MOVIES' : 'POPULAR_MOVIES';
      
      // Simulate API call delay
      setTimeout(() => {
        let loadedMovies = getInitialMovieData(storageCategory);

        // One-time cleanup: remove any anime entries like Naruto, then add Hollywood titles
        const beforeCount = loadedMovies.length;
        const cleaned = loadedMovies.filter(m => {
          const title = (m.title || '').toLowerCase();
          const hasAnimeGenre = (m.genre || []).some(g => /anime|animation/i.test(g));
          return !title.includes('naruto') && !title.includes('shippuden') && !hasAnimeGenre;
        });

        if (cleaned.length !== beforeCount) {
          // Add a few Hollywood replacements
          const additions = [
            {
              title: 'Mission: Impossible – Dead Reckoning',
              image: 'https://m.media-amazon.com/images/M/MV5BNDZiZThmNzItMjc2ZC00YTg0LTk2NDUtYjYyMzYzNTE1MDc3XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg',
              year: 2023,
              rating: 4.3,
              genre: ['Action', 'Thriller'],
              director: 'Christopher McQuarrie',
              duration: '2h 43m'
            },
            {
              title: 'John Wick: Chapter 4',
              image: 'https://m.media-amazon.com/images/M/MV5BNTI3MjU0MzktZjQ5MC00N2Q2LWFkOWQtNTk2ODc4NjM2N2Q3XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg',
              year: 2023,
              rating: 4.5,
              genre: ['Action', 'Crime', 'Thriller'],
              director: 'Chad Stahelski',
              duration: '2h 49m'
            },
            {
              title: 'Dune: Part Two',
              image: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI3NjYzYjkzXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
              year: 2024,
              rating: 4.8,
              genre: ['Sci-Fi', 'Adventure'],
              director: 'Denis Villeneuve',
              duration: '2h 46m'
            }
          ];

          // Ensure unique ids
          const maxId = Math.max(0, ...cleaned.map(m => m.id || 0));
          const withIds = additions.map((a, idx) => ({ id: maxId + idx + 1, ...a }));
          loadedMovies = [...withIds, ...cleaned];
          // Persist the cleaned and updated list
          saveMoviesToStorage(storageCategory, loadedMovies);
        } else {
          loadedMovies = cleaned;
        }

        setMovies(loadedMovies);
        setLoading(false);
      }, 500);
    };

    fetchMovies();
  }, [category]);

  const handleAddSuccess = (newMovie) => {
    // Add the new movie to storage and update state
    if (newMovie) {
      const storageCategory = category === 'trending' ? 'TRENDING_MOVIES' : 'POPULAR_MOVIES';
      const updatedMovies = addMovieToStorage(storageCategory, newMovie);
      setMovies(updatedMovies);
    }
  };
  
  const handleMenuOpen = (event, movie) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMovie(movie);
  };
  
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedMovie(null);
  };
  
  const handleEdit = () => {
    if (selectedMovie) {
      setEditingMovie(selectedMovie);
      setShowEditForm(true);
      handleMenuClose();
    }
  };
  
  const handleDelete = () => {
    if (selectedMovie) {
      setDeleteDialog({ open: true, movie: selectedMovie });
      handleMenuClose();
    }
  };
  
  const confirmDelete = () => {
    if (deleteDialog.movie) {
      const storageCategory = category === 'trending' ? 'TRENDING_MOVIES' : 'POPULAR_MOVIES';
      const updatedMovies = deleteMovieFromStorage(storageCategory, deleteDialog.movie.id);
      setMovies(updatedMovies);
      
      setSnackbar({ 
        open: true, 
        message: `Movie "${deleteDialog.movie.title}" deleted successfully!`, 
        severity: 'success' 
      });
      
      setDeleteDialog({ open: false, movie: null });
    }
  };
  
  const handleEditSuccess = (updatedMovie) => {
    if (updatedMovie && editingMovie) {
      const storageCategory = category === 'trending' ? 'TRENDING_MOVIES' : 'POPULAR_MOVIES';
      const updatedMovies = updateMovieInStorage(storageCategory, updatedMovie);
      setMovies(updatedMovies);
      
      setSnackbar({ 
        open: true, 
        message: `Movie "${updatedMovie.title}" updated successfully!`, 
        severity: 'success' 
      });
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

      <Grid container spacing={4} justifyContent="center">
        {movies.map((movie) => (
          <Grid item key={movie.id}>
            <Card sx={getStandardCardStyles()}>
              <Box sx={getResponsiveImageContainerStyles()}>
                <img
                  src={movie.image}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box sx={{
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
                  
                  {currentUser && currentUser.role === 'admin' && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, movie)}
                      sx={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
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
                    onClick={() => navigate(`/movies/${movie.id}`)}
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
      
      {/* Add Movie FAB - Only show for admin users */}
      {currentUser && currentUser.role === 'admin' && (
        <Tooltip title={`Add ${category === 'trending' ? 'Trending Movie' : 'Movie'}`} placement="left">
          <Fab
            color="primary"
            aria-label="add movie"
            onClick={() => setShowAddForm(true)}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff3333, #e6b523)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease',
              zIndex: 1000
            }}
          >
            <AddIcon />
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
          Edit Movie
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ff4d4d' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete Movie
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, movie: null })}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a2e',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ff4d4d', fontWeight: 'bold' }}>
          Delete Movie
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Are you sure you want to delete "{deleteDialog.movie?.title}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, movie: null })}
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

      {/* Add Movie Form Dialog */}
      <AddMovieForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        category={category === 'trending' ? 'trending' : 'movie'}
        onSuccess={handleAddSuccess}
      />
      
      {/* Edit Movie Form Dialog */}
      <AddMovieForm
        open={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingMovie(null);
        }}
        category={category === 'trending' ? 'trending' : 'movie'}
        onSuccess={handleEditSuccess}
        editMode={true}
        initialData={editingMovie}
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

export default MovieList;
