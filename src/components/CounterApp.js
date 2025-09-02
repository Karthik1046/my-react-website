import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  Container,
  Grid,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const CounterApp = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const increment = () => {
    setCount(prevCount => prevCount + step);
  };

  const decrement = () => {
    setCount(prevCount => prevCount - step);
  };

  const reset = () => {
    setCount(0);
  };

  const handleStepChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setStep(Math.max(1, value)); // Ensure step is at least 1
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Button 
          startIcon={<HomeIcon />} 
          onClick={() => navigate('/')}
          sx={{ mb: 4 }}
        >
          Back to Home
        </Button>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Counter Application
          </Typography>
          
          <Typography variant="h2" component="div" sx={{ my: 4, fontWeight: 'bold' }}>
            {count}
          </Typography>
          
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item>
              <IconButton 
                color="error" 
                onClick={decrement}
                size="large"
                sx={{ border: '1px solid', borderColor: 'error.main' }}
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton 
                color="primary" 
                onClick={increment}
                size="large"
                sx={{ border: '1px solid', borderColor: 'primary.main' }}
              >
                <AddIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton 
                color="secondary" 
                onClick={reset}
                size="large"
                sx={{ border: '1px solid', borderColor: 'secondary.main' }}
              >
                <RefreshIcon />
              </IconButton>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, maxWidth: 300, mx: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              Step Size: {step}
            </Typography>
            <TextField
              type="number"
              value={step}
              onChange={handleStepChange}
              inputProps={{ min: 1 }}
              fullWidth
              variant="outlined"
              label="Set Step"
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={() => setCount(0)}
            >
              Reset Counter
            </Button>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setCount(prev => prev + 10)}
          >
            +10
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => setCount(prev => prev - 10)}
          >
            -10
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CounterApp;
