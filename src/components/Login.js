import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, Paper, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call the login function from AuthContext
      const result = await login(email, password);
      
      if (result.success) {
        // Show success message
        toast.success(`Welcome back, ${result.user.name}! 🎉`);
        // Redirect to home page
        navigate('/');
      } else {
        setError(result.error || 'Failed to log in. Please try again.');
        toast.error(result.error || 'Failed to log in. Please try again.');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
      toast.error('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        // Show success message
        toast.success(`Welcome, ${result.user.displayName || result.user.email}! 🎉`);
        // Redirect to home page
        navigate('/');
      } else {
        setError(result.error || 'Failed to sign in with Google. Please try again.');
        toast.error(result.error || 'Failed to sign in with Google. Please try again.');
      }
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className="login-container">
        <Paper className="login-paper" elevation={3}>
          <Typography component="h1" variant="h5" className="login-title">
            Sign In
          </Typography>
          <Box component="form" className="login-form" onSubmit={handleSubmit}>
            <TextField
              className="login-input"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              className="login-input"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography className="error-message">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="login-button"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Divider sx={{ my: 2 }}>OR</Divider>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              disabled={loading}
              startIcon={<GoogleIcon />}
              sx={{
                color: '#757575',
                borderColor: '#e0e0e0',
                '&:hover': {
                  borderColor: '#bdbdbd',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                },
                mb: 2
              }}
            >
              {loading ? 'Signing In...' : 'Continue with Google'}
            </Button>
            <Typography className="login-footer">
              Don't have an account?{' '}
              <a href="/signup" style={{ color: '#4ecdc4', textDecoration: 'none' }}>
                Sign Up
              </a>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
