import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ItemForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1
  });
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || '' : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.quantity <= 0 || isNaN(formData.quantity)) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Here you would typically make an API call to save the item
      console.log('Form submitted:', formData);
      setOpenSnackbar(true);
      // Reset form
      setFormData({
        name: '',
        description: '',
        quantity: 1
      });
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#1a1a2e', borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: '#fff', 
          mb: 4,
          textAlign: 'center',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff4d4d 30%, #f9cb28 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Add New Item
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                InputProps={{
                  style: { color: '#fff' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff4d4d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f9cb28',
                    },
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#f9cb28',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                variant="outlined"
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                InputProps={{
                  style: { color: '#fff' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff4d4d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f9cb28',
                    },
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#f9cb28',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                variant="outlined"
                inputProps={{ min: 1 }}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                InputProps={{
                  style: { color: '#fff' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff4d4d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f9cb28',
                    },
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#f9cb28',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => navigate('/')}
                  sx={{
                    color: '#f9cb28',
                    borderColor: '#f9cb28',
                    '&:hover': {
                      backgroundColor: 'rgba(249, 203, 40, 0.1)',
                      borderColor: '#f9cb28',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  sx={{
                    backgroundColor: '#ff4d4d',
                    '&:hover': {
                      backgroundColor: '#ff3333',
                    },
                  }}
                >
                  Add Item
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Item added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemForm;
