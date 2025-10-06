import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
  LinearProgress
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

const GENRE_OPTIONS = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 
  'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
];

const AddMovieForm = ({ open, onClose, category = 'movie', onSuccess, editMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    rating: '',
    duration: '',
    director: '',
    image: '',
    genre: [],
    category: category, // 'movie', 'trending', 'tv-show'
    seasons: category === 'tv-show' ? 1 : undefined
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Effect to populate form data when in edit mode
  React.useEffect(() => {
    if (editMode && initialData && open) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        year: initialData.year || new Date().getFullYear(),
        rating: initialData.rating || '',
        duration: initialData.duration || '',
        director: initialData.director || '',
        image: initialData.image || '',
        genre: initialData.genre || [],
        category: category,
        seasons: category === 'tv-show' ? initialData.seasons || 1 : undefined
      });
    } else if (!editMode) {
      // Reset form when not in edit mode
      setFormData({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        rating: '',
        duration: '',
        director: '',
        image: '',
        genre: [],
        category: category,
        seasons: category === 'tv-show' ? 1 : undefined
      });
    }
  }, [editMode, initialData, open, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGenreChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      genre: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const removeGenre = (genreToRemove) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter(genre => genre !== genreToRemove)
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.year || formData.year < 1900 || formData.year > 2030) {
      newErrors.year = 'Please enter a valid year (1900-2030)';
    }
    if (!formData.rating || formData.rating < 0 || formData.rating > 10) {
      newErrors.rating = 'Rating must be between 0 and 10';
    }
    if (category !== 'tv-show' && !formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }
    if (!formData.director.trim()) newErrors.director = 'Director is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (formData.genre.length === 0) newErrors.genre = 'At least one genre is required';
    if (category === 'tv-show' && (!formData.seasons || formData.seasons < 1)) {
      newErrors.seasons = 'Number of seasons must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Create the request payload
      const itemData = {
        title: formData.title,
        description: formData.description,
        year: parseInt(formData.year),
        rating: parseFloat(formData.rating),
        genre: formData.genre,
        director: formData.director,
        image: formData.image,
        category: formData.category
      };
      
      // Add category-specific fields
      if (category === 'tv-show') {
        itemData.seasons = parseInt(formData.seasons);
      } else {
        itemData.duration = formData.duration;
      }
      
      // Get auth token from localStorage (consistent with AuthContext)
      const token = localStorage.getItem('movieflix_token');
      
      // If we're in edit mode but editing a mock item (no _id), skip API and return locally
      const isMockEdit = editMode && initialData && !initialData._id;

      let result;
      if (!isMockEdit) {
        if (!token) {
          throw new Error('Authentication required');
        }
        // Make API call to backend
        const url = editMode && initialData && initialData._id
          ? `http://localhost:5000/api/movies/${initialData._id}`
          : 'http://localhost:5000/api/movies';
        
        const method = editMode ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(itemData)
        });
        
        result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || `Failed to ${editMode ? 'update' : 'create'} movie`);
        }

        setSnackbar({ 
          open: true, 
          message: result.message || `${category === 'tv-show' ? 'TV Show' : 'Movie'} "${formData.title}" ${editMode ? 'updated' : 'added'} successfully!`, 
          severity: 'success' 
        });

        // Call the success callback with the API response data
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        // Local edit: merge and send back to parent for mock data update
        const merged = { ...initialData, ...itemData };
        setSnackbar({ 
          open: true, 
          message: `${category === 'tv-show' ? 'TV Show' : 'Movie'} "${formData.title}" updated successfully!`, 
          severity: 'success' 
        });
        if (onSuccess) {
          onSuccess(merged);
        }
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        rating: '',
        duration: '',
        director: '',
        image: '',
        genre: [],
        category: category,
        seasons: category === 'tv-show' ? 1 : undefined
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving movie:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || `Failed to ${editMode ? 'update' : 'add'} movie. Please try again.`, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        year: new Date().getFullYear(),
        rating: '',
        duration: '',
        director: '',
        image: '',
        genre: [],
        category: category,
        seasons: category === 'tv-show' ? 1 : undefined
      });
      setErrors({});
      onClose();
    }
  };

  const getTitle = () => {
    const prefix = editMode ? 'Edit' : 'Add';
    switch (category) {
      case 'trending': return `${prefix} Trending Movie`;
      case 'tv-show': return `${prefix} TV Show`;
      default: return `${prefix} Movie`;
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { 
            backgroundColor: '#1a1a2e',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon />
            {getTitle()}
          </Box>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        
        {loading && <LinearProgress />}
        
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  disabled={loading}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: '#ff4d4d' },
                      '&.Mui-focused fieldset': { borderColor: '#f9cb28' },
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  error={!!errors.year}
                  helperText={errors.year}
                  disabled={loading}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: '#ff4d4d' },
                      '&.Mui-focused fieldset': { borderColor: '#f9cb28' },
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  disabled={loading}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: '#ff4d4d' },
                      '&.Mui-focused fieldset': { borderColor: '#f9cb28' },
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Director"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  error={!!errors.director}
                  helperText={errors.director}
                  disabled={loading}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: '#ff4d4d' },
                      '&.Mui-focused fieldset': { borderColor: '#f9cb28' },
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Rating (0-10)"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  error={!!errors.rating}
                  helperText={errors.rating}
                  disabled={loading}
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: '#ff4d4d' },
                      '&.Mui-focused fieldset': { borderColor: '#f9cb28' },
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={3}>
                {category === 'tv-show' ? (
                  <TextField
                    fullWidth
                    type="number"
                    label="Seasons"
                    name="seasons"
                    value={formData.seasons || ''}
                    onChange={handleChange}
                    error={!!errors.seasons}
                    helperText={errors.seasons}
                    disabled={loading}
                    inputProps={{ min: 1 }}
                    InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        '&:hover fieldset': { borderColor: '#ff4d4d' },
                        '&.Mui-focused fieldset': { borderColor: '#f9cb28' },
                      }
                    }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label="Duration (e.g., 2h 30m)"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    error={!!errors.duration}
                    helperText={errors.duration}
                    disabled={loading}
                    InputLabelProps={{ style: { color: '#fff' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        '&:hover fieldset': { borderColor: '#ff4d4d' },
                        '&.Mui-focused fieldset': { borderColor: '#f9cb28' },
                      }
                    }}
                  />
                )}
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  error={!!errors.image}
                  helperText={errors.image}
                  disabled={loading}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: '#ff4d4d' },
                      '&.Mui-focused fieldset': { borderColor: '#f9cb28' },
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.genre}>
                  <InputLabel sx={{ color: '#fff' }}>Genres</InputLabel>
                  <Select
                    multiple
                    value={formData.genre}
                    onChange={handleGenreChange}
                    disabled={loading}
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.23)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff4d4d'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f9cb28'
                      }
                    }}
                  >
                    {GENRE_OPTIONS.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        {genre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.genre && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.genre}
                    </Typography>
                  )}
                </FormControl>
                
                {formData.genre.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.genre.map((genre) => (
                      <Chip
                        key={genre}
                        label={genre}
                        onDelete={() => removeGenre(genre)}
                        disabled={loading}
                        sx={{
                          backgroundColor: 'rgba(255, 77, 77, 0.2)',
                          color: '#ff4d4d',
                          '& .MuiChip-deleteIcon': {
                            color: '#ff4d4d'
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{ color: '#f9cb28' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff3333, #e6b523)',
              }
            }}
          >
            {loading ? (editMode ? 'Updating...' : 'Adding...') : (editMode ? `Update ${category === 'tv-show' ? 'TV Show' : 'Movie'}` : `Add ${category === 'tv-show' ? 'TV Show' : 'Movie'}`)}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddMovieForm;