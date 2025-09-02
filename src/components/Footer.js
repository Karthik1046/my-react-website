import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const FooterContainer = styled(Box)({
  backgroundColor: '#0a0a1a',
  color: 'white',
  padding: '60px 0 20px',
  marginTop: '60px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
});

const FooterTitle = styled((props) => (
  <Typography variant="h6" component="h3" {...props} />
))({
  fontWeight: 'bold',
  marginBottom: '20px',
  position: 'relative',
  display: 'inline-block',
  color: '#fff',
  fontSize: '1.1rem',
  '&:after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: '-8px',
    width: '40px',
    height: '2px',
    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
  },
});

const FooterLink = styled(Link)({
  display: 'block',
  color: '#b3b3b3',
  marginBottom: '12px',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  fontSize: '0.95rem',
  '&:hover': {
    color: '#fff',
    textDecoration: 'none',
    paddingLeft: '5px',
  },
});

const SocialIcon = styled(IconButton)({
  color: 'white',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginRight: '10px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#ff4d4d',
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
});

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FooterTitle>
              MovieFlix
            </FooterTitle>
            <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 2, maxWidth: '300px', lineHeight: 1.6 }}>
              Your ultimate destination for discovering and watching the best movies and TV shows. Personalized recommendations just for you.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <SocialIcon aria-label="Facebook">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon aria-label="Twitter">
                <TwitterIcon />
              </SocialIcon>
              <SocialIcon aria-label="Instagram">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon aria-label="LinkedIn">
                <LinkedInIcon />
              </SocialIcon>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <FooterTitle>
              Navigation
            </FooterTitle>
            <FooterLink href="/" underline="none">Home</FooterLink>
            <FooterLink href="/movies" underline="none">Movies</FooterLink>
            <FooterLink href="/tv-shows" underline="none">TV Shows</FooterLink>
            <FooterLink href="/trending" underline="none">Trending</FooterLink>
            <FooterLink href="/my-list" underline="none">My List</FooterLink>
          </Grid>
          
          <Grid item xs={12} sm={4} md={4}>
            <FooterTitle>
              Categories
            </FooterTitle>
            <FooterLink href="/genre/action" underline="none">Action</FooterLink>
            <FooterLink href="/genre/drama" underline="none">Drama</FooterLink>
            <FooterLink href="/genre/comedy" underline="none">Comedy</FooterLink>
            <FooterLink href="/genre/thriller" underline="none">Thriller</FooterLink>
            <FooterLink href="/genre/scifi" underline="none">Sci-Fi</FooterLink>
            <FooterTitle sx={{ mt: { xs: 0, md: 4 } }}>
              Support
            </FooterTitle>
            <FooterLink href="/help" underline="none">Help Center</FooterLink>
            <FooterLink href="/contact" underline="none">Contact Us</FooterLink>
            <FooterLink href="/faq" underline="none">FAQ</FooterLink>
            <FooterLink href="/feedback" underline="none">Feedback</FooterLink>
            <FooterLink href="/about" underline="none">About Us</FooterLink>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888', fontSize: '0.9rem', textAlign: { xs: 'center', md: 'left' } }}>
                © {new Date().getFullYear()} MovieFlix. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: '20px' }}>
                <FooterLink href="/terms" underline="none">Terms of Service</FooterLink>
                <FooterLink href="/privacy" underline="none">Privacy Policy</FooterLink>
                <FooterLink href="/cookies" underline="none">Cookie Policy</FooterLink>
                <FooterLink href="/sitemap" underline="none">Sitemap</FooterLink>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
