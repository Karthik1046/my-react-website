import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'white',
  color: '#333',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  padding: '10px 0',
});

const NavButton = styled(Button)({
  margin: '0 10px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#1976d2',
  },
});

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold', color: '#1976d2', marginRight: 3 }}
            >
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                MovieFlix
              </Link>
            </Typography>
            {currentUser && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                  Welcome, {currentUser.name}!
                </Typography>
                <Avatar 
                  alt={currentUser.name} 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1976d2&color=fff`}
                  sx={{ width: 24, height: 24 }}
                />
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NavButton color="inherit" component={Link} to="/">Home</NavButton>
            <NavButton color="inherit" component={Link} to="/trending">Trending</NavButton>
            <NavButton color="inherit" component={Link} to="/movies">Movies</NavButton>
            <NavButton color="inherit" component={Link} to="/tv-shows">TV Shows</NavButton>
            <NavButton color="inherit" component={Link} to="/my-list">My List</NavButton>
            {currentUser ? (
              <>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link}
                  to="/profile"
                  sx={{ marginLeft: '10px', borderRadius: '20px' }}
                >
                  Profile
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleLogout}
                  sx={{ marginLeft: '10px', borderRadius: '20px' }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  component={Link}
                  to="/login"
                  sx={{ marginLeft: '10px', borderRadius: '20px' }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link}
                  to="/signup"
                  sx={{ marginLeft: '10px', borderRadius: '20px' }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;
