import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const animeSlides = [
  {
    id: 1,
    title: 'Attack on Titan: Final Season',
    description: 'The war for Paradis zeroes in on the mysteries of the Titans and the dark history of the world.',
    image: '/images/aot.jpg',
    genre: 'Action, Drama, Fantasy'
  },
  {
    id: 2,
    title: 'Demon Slayer: Mugen Train',
    description: 'Tanjiro and his comrades board the Mugen Train to investigate a series of disappearances.',
    image: '/images/demonslayer.avif',
    genre: 'Action, Supernatural, Historical'
  },
  {
    id: 3,
    title: 'Jujutsu Kaisen',
    description: 'Yuji Itadori joins a secret organization of Jujutsu Sorcerers to defeat a powerful curse.',
    image: '/images/gojosatoru3.jpg',
    genre: 'Action, Supernatural, School'
  },
  {
    id: 4,
    title: 'My Hero Academia',
    description: 'Izuku Midoriya dreams of becoming a hero in a world where superpowers are the norm.',
    image: '/images/mha.jpg',
    genre: 'Action, Comedy, School'
  },
  {
    id: 5,
    title: 'One Piece',
    description: 'These quotes will make you feel happy, brave, and ready to follow your dreams. 🌟 So get ready to smile, feel strong, and remember why One Piece is so special. I don’t want to conquer anything. I just think the guy with the most freedom in this whole ocean… is the Pirate King You came without fear.',
    image: '/images/OnePiece1.webp',
    genre: 'Action, Comedy, Adventure, Fantasy'
  }
];

const AnimeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const theme = useTheme();
  

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === animeSlides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? animeSlides.length - 1 : prevIndex - 1
    );
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
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${animeSlides[currentIndex].image})`,
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
            <motion.h1 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                margin: 0,
                padding: 0,
                lineHeight: '1.2',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxHeight: '2.4em', 
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: theme.spacing(2),
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {animeSlides[currentIndex].title}
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: '1.2rem',
                marginBottom: theme.spacing(2),
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {animeSlides[currentIndex].description}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span style={{
                display: 'inline-block',
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                marginRight: '10px',
                marginBottom: '10px'
              }}>
                {animeSlides[currentIndex].genre}
              </span>
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{ marginTop: theme.spacing(3) }}
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
          zIndex: 10,
        }}
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
          zIndex: 10,
        }}
      >
        <KeyboardArrowRight fontSize="large" />
      </IconButton>

      {/* Dots Indicator */}
      <Box sx={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 1,
        zIndex: 10,
      }}>
        {animeSlides.map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: currentIndex === index ? theme.palette.primary.main : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.2)'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AnimeCarousel;
