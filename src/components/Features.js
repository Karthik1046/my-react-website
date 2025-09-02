import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import DevicesIcon from '@mui/icons-material/Devices';
import SpeedIcon from '@mui/icons-material/Speed';

const Section = styled(Box)({
  padding: '80px 0',
  backgroundColor: 'white',
});

const SectionTitle = styled(Typography)({
  textAlign: 'center',
  fontWeight: 'bold',
  marginBottom: '60px',
  color: '#1a237e',
  position: 'relative',
  '&:after': {
    content: '""',
    display: 'block',
    width: '60px',
    height: '4px',
    background: '#1976d2',
    margin: '20px auto 0',
    borderRadius: '2px',
  },
});

const FeatureCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
});

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px',
  color: 'white',
  backgroundColor: theme.palette.primary.main,
  fontSize: '2rem',
}));

const FeatureTitle = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '15px',
  textAlign: 'center',
});

const FeatureDescription = styled(Typography)({
  color: '#616161',
  textAlign: 'center',
});

const features = [
  {
    icon: <CodeIcon fontSize="large" />,
    title: 'Clean Code',
    description: 'Built with modern React practices and clean, maintainable code that follows industry standards.',
  },
  {
    icon: <DesignServicesIcon fontSize="large" />,
    title: 'Beautiful Design',
    description: 'Thoughtfully designed components with attention to detail and modern aesthetics.',
  },
  {
    icon: <DevicesIcon fontSize="large" />,
    title: 'Fully Responsive',
    description: 'Looks and works perfectly on all devices, from mobile to desktop.',
  },
  {
    icon: <SpeedIcon fontSize="large" />,
    title: 'Fast Performance',
    description: 'Optimized for speed and performance with minimal bundle size.',
  },
];

const Features = () => {
  return (
    <Section id="features">
      <Container maxWidth="lg">
        <SectionTitle variant="h3" component="h2">
          Amazing Features
        </SectionTitle>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard elevation={2}>
                <CardContent sx={{ padding: '30px 20px' }}>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <FeatureTitle variant="h5" component="h3">
                    {feature.title}
                  </FeatureTitle>
                  <FeatureDescription variant="body1">
                    {feature.description}
                  </FeatureDescription>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Features;
