// Standard image dimensions for movie posters across the application
export const POSTER_DIMENSIONS = {
  width: 300,
  height: 450, // 2:3 aspect ratio (standard movie poster)
};

// Standard image dimensions for TV show posters in horizontal layout
export const TV_POSTER_DIMENSIONS = {
  width: 200,
  height: 300, // 2:3 aspect ratio
};

// Common image container styles
export const getStandardImageContainerStyles = (dimensions = POSTER_DIMENSIONS) => ({
  position: 'relative',
  width: `${dimensions.width}px`,
  height: `${dimensions.height}px`,
  overflow: 'hidden',
  borderRadius: '12px',
  flexShrink: 0,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    display: 'block'
  },
  '&:hover img': {
    transform: 'scale(1.05)'
  }
});

// Responsive image container styles that maintain exact dimensions
export const getResponsiveImageContainerStyles = (dimensions = POSTER_DIMENSIONS) => ({
  position: 'relative',
  width: { xs: `${Math.round(dimensions.width * 0.8)}px`, sm: `${dimensions.width}px` },
  height: { xs: `${Math.round(dimensions.height * 0.8)}px`, sm: `${dimensions.height}px` },
  overflow: 'hidden',
  borderRadius: '12px',
  flexShrink: 0,
  mx: 'auto', // Center the image container
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    display: 'block'
  },
  '&:hover img': {
    transform: 'scale(1.05)'
  }
});

// Card styles that accommodate the fixed image sizes
export const getStandardCardStyles = (dimensions = POSTER_DIMENSIONS) => ({
  width: { xs: `${Math.round(dimensions.width * 0.8)}px`, sm: `${dimensions.width}px` },
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  mx: 'auto', // Center the card
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
  }
});

// TV Show horizontal card styles
export const getTVShowCardStyles = () => ({
  width: '100%',
  maxWidth: '600px',
  height: `${TV_POSTER_DIMENSIONS.height}px`,
  display: 'flex',
  flexDirection: 'row',
  background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  mx: 'auto',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(255, 77, 77, 0.3)',
    border: '1px solid rgba(255, 77, 77, 0.4)'
  }
});