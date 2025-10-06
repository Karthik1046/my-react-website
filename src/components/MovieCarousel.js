import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, Typography, Snackbar, Alert } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyList } from '../contexts/MyListContext';

const movieSlides = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    image: 'https://visitboise.com/wp-content/uploads/2024/01/The-Shawshank-Redemption-1994.jpg',
    genre: ['Drama'],
    year: 1994,
    rating: 4.9
  },
  {
    id: 2,
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz2rr4EBGvAnbC0FfFJnHDaLmITxO2_Pd3fg&s',
    genre: ['Crime', 'Drama'],
    year: 1972,
    rating: 4.8
  },
  {
    id: 3,
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    image: 'https://assets.murphysmultiverse.com/uploads/2022/02/knight.jpg',
    genre: ['Action', 'Crime', 'Drama'],
    year: 2008,
    rating: 4.9
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    image: 'https://prod5.agileticketing.net/images/user/loft_4255/Pulp_Fiction_TMDB-jlVOS4D6ledQGxGdL0EIte3TXfL.jpg',
    genre: ['Crime', 'Drama'],
    year: 1994,
    rating: 4.8
  },
  {
    id: 5,
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    image: 'https://wallpapers.com/images/hd/inception-movie-poster-dream-is-real-9ei1rpyath620n92.jpg',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    year: 2010,
    rating: 4.8
  }
];

const MovieCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const { toggleMyList, isInMyList } = useMyList();

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === movieSlides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movieSlides.length - 1 : prevIndex - 1
    );
  };

  const handleMyList = () => {
    const currentMovie = {
      ...movieSlides[currentIndex],
      // Ensure all required fields are included
      poster_path: movieSlides[currentIndex].image,
      release_date: movieSlides[currentIndex].year.toString(),
      overview: movieSlides[currentIndex].description,
      vote_average: movieSlides[currentIndex].rating,
      genre: movieSlides[currentIndex].genre
    };
    
    const isInList = isInMyList(currentMovie.id, 'movie');
    
    // Toggle the movie in the list
    toggleMyList(currentMovie, 'movie').then(() => {
      // Update the snackbar after the state has been updated
      setSnackbar({
        open: true,
        message: isInList ? 'Removed from My List' : 'Added to My List',
        severity: 'success'
      });
    }).catch(error => {
      console.error('Error updating My List:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update My List',
        severity: 'error'
      });
    });
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '80vh',
      overflow: 'hidden',
      borderRadius: 2,
      boxShadow: 3,
      mb: 4
    }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 1000 : -1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -1000 : 1000 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${movieSlides[currentIndex].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: theme.spacing(4),
            color: 'white',
          }}
        >
          <Box sx={{ 
            maxWidth: '60%', 
            [theme.breakpoints.down('md')]: { maxWidth: '100%' },
            minHeight: '120px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  lineHeight: 1.2
                }}
              >
                {movieSlides[currentIndex].title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mr: 2,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1
                }}>
                  <span style={{ color: 'gold', marginRight: '4px' }}>★</span>
                  <span>{movieSlides[currentIndex].rating}</span>
                </Box>
                <span>{movieSlides[currentIndex].year}</span>
                <span style={{ margin: '0 8px' }}>•</span>
                <span>{Array.isArray(movieSlides[currentIndex].genre) ? movieSlides[currentIndex].genre.join(', ') : movieSlides[currentIndex].genre}</span>
              </Box>
            </motion.div>
            
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: '1.2rem',
                marginBottom: theme.spacing(2),
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                lineHeight: 1.6,
                maxWidth: '80%',
                [theme.breakpoints.down('md')]: { 
                  maxWidth: '100%',
                  fontSize: '1rem'
                }
              }}
            >
              {movieSlides[currentIndex].description}
            </motion.p>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ marginTop: theme.spacing(3), display: 'flex', gap: '16px' }}
            >
              <button style={{
                backgroundColor: theme.palette.secondary.main,
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                }
              }}>
                Watch Now
              </button>
              <button 
                onClick={handleMyList}
                style={{
                  backgroundColor: isInMyList(movieSlides[currentIndex].id, 'movie') 
                    ? 'rgba(255, 77, 77, 0.8)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '12px 30px',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isInMyList(movieSlides[currentIndex].id, 'movie')
                    ? 'rgba(255, 77, 77, 1)'
                    : 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isInMyList(movieSlides[currentIndex].id, 'movie')
                    ? 'rgba(255, 77, 77, 0.8)'
                    : 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {isInMyList(movieSlides[currentIndex].id, 'movie') ? '✓ In My List' : '+ My List'}
              </button>
            </motion.div>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <IconButton 
        onClick={prevSlide} 
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.7)'
          },
          zIndex: 2,
          [theme.breakpoints.down('sm')]: {
            left: 10,
            padding: '8px'
          }
        }}
        aria-label="Previous slide"
      >
        <KeyboardArrowLeft fontSize="large" />
      </IconButton>
      
      <IconButton 
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.7)'
          },
          zIndex: 2,
          [theme.breakpoints.down('sm')]: {
            right: 10,
            padding: '8px'
          }
        }}
        aria-label="Next slide"
      >
        <KeyboardArrowRight fontSize="large" />
      </IconButton>
      
      {/* Indicators */}
      <Box sx={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 2
      }}>
        {movieSlides.map((_, index) => (
          <Box 
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            sx={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? theme.palette.secondary.main : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.2)'
              }
            }}
          />
        ))}
      </Box>
      
      {/* Snackbar for My List notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovieCarousel;
