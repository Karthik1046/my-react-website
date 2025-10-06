import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Avatar, 
  Grid,
  Divider,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const EditProfile = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set initial form data when currentUser is available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        bio: currentUser.bio || ''
      });
      if (currentUser.avatar) {
        setPreviewUrl(currentUser.avatar.startsWith('http') ? currentUser.avatar : `http://localhost:5000${currentUser.avatar}`);
      }
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, JPG)');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const uploadProfilePhoto = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('profilePhoto', selectedFile);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('movieflix_token');
      const response = await fetch('http://localhost:5000/api/auth/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      return data.user.avatar;
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload profile photo');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.name.trim()) {
      return setError('Name is required');
    }
    
    // Password validation if password fields are filled
    if (password || confirmPassword) {
      if (password.length < 6) {
        return setError('Password must be at least 6 characters long');
      }
      if (password !== confirmPassword) {
        return setError('Passwords do not match');
      }
    }

    setLoading(true);
    
    try {
      // Upload profile photo if a new one was selected
      let avatarUrl = currentUser?.avatar;
      if (selectedFile) {
        const uploadedAvatar = await uploadProfilePhoto();
        if (uploadedAvatar) {
          avatarUrl = uploadedAvatar;
        }
      }

      const updateData = {
        name: formData.name,
        bio: formData.bio || ''
      };
      
      // Only include password if it was changed
      if (password) {
        updateData.password = password;
      }
      
      if (avatarUrl) {
        updateData.avatar = avatarUrl;
      }
      
      const result = await updateUser(updateData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        // Clear password fields
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to profile after 1.5 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1976d2&color=fff`;

  return (
    <Box sx={{ maxWidth: 800, margin: '40px auto', padding: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Edit Profile
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left Column - Avatar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar 
                  src={previewUrl || avatarUrl}
                  alt={formData.name}
                  sx={{ width: 150, height: 150, mb: 3, fontSize: '3rem' }}
                />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  disabled={isUploading}
                  sx={{ mb: 2 }}
                >
                  {isUploading ? 'Uploading...' : 'Change Photo'}
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="caption" color="text.secondary">
                    {selectedFile.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Right Column - Form Fields */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Change Password (leave blank to keep current)
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditProfile;
