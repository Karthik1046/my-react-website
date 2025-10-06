import React from 'react';
import { Box, Typography, Avatar, Paper, Grid, Button, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Use user data from auth context or default values
  const { 
    name = 'Guest User',
    email = 'user@example.com',
    joinDate = new Date().toLocaleDateString(),
    bio = 'Tell us about yourself...',
    avatar,
    stats = {
      watched: 0,
      watching: 0,
      planToWatch: 0
    }
  } = currentUser || {};
  
  // Use the avatar from the user data or fallback to generated avatar
  const avatarUrl = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1976d2&color=fff`;
  
  // Format join date properly
  const formatJoinDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Recently';
    }
  };
  

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '40px auto', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, position: 'relative' }}>
        {/* Edit Button */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleEditClick}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
        </Box>
        
        {/* Welcome Message */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            pt: 1 // Add some padding to account for the absolute positioned button
          }}>
            Welcome to Your Profile, {name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account and track your anime journey
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Profile Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                src={avatarUrl} 
                alt={name}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mb: 2, 
                  fontSize: '3rem',
                  border: '3px solid #f5f5f5',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
                imgProps={{
                  style: {
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }
                }}
              />
              <Typography variant="h5" component="h1" gutterBottom align="center">
                {name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {email}
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2, borderRadius: '20px' }}
                onClick={() => navigate('/profile/edit')}
              >
                Edit Profile
              </Button>
            </Box>
          </Grid>

          {/* Right Column - Details */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>About</Typography>
              <Typography variant="body1" paragraph sx={{ 
                p: 2, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                minHeight: 80
              }}>
                {bio}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Account Details</Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                '& > div': { mb: 2, '&:last-child': { mb: 0 } }
              }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                  <Typography variant="body1">{email}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Member Since</Typography>
                  <Typography variant="body1">{formatJoinDate(joinDate)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Account Status</Typography>
                  <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    Active
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" gutterBottom>Anime Stats</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {stats.watched}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Watched</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {stats.watching}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Watching</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {stats.planToWatch}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Plan to Watch</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" gutterBottom>My Collections</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
                      {currentUser?.watchlist?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Watchlist Items</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
                      {currentUser?.favorites?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Favorite Items</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfile;
