import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)({
  padding: '100px 0',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
});

const HeroTitle = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#1a237e',
});

const HeroSubtitle = styled(Typography)({
  fontSize: '1.2rem',
  color: '#455a64',
  marginBottom: '30px',
  maxWidth: '600px',
});

const HeroButton = styled(Button)({
  padding: '12px 30px',
  borderRadius: '25px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 'bold',
  marginRight: '15px',
  '&:last-child': {
    marginRight: 0,
    backgroundColor: 'transparent',
    border: '2px solid #1976d2',
    color: '#1976d2',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
  },
});

const HeroImage = styled(Box)({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '10px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
});

const Hero = () => {
  return (
    <HeroSection>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
              WELCOME TO MODERNSITE
            </Typography>
            <HeroTitle variant="h2" component="h1">
              Build Amazing Digital Experiences
            </HeroTitle>
            <HeroSubtitle>
              Create beautiful, responsive websites with our powerful React components and templates. Perfect for businesses and individuals looking to make an impact online.
            </HeroSubtitle>
            <Box>
              <HeroButton variant="contained" color="primary">
                Get Started
              </HeroButton>
              <HeroButton>Learn More</HeroButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <HeroImage 
              component="img"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Modern Website"
            />
          </Grid>
        </Grid>
      </Container>
    </HeroSection>
  );
};

export default Hero;
