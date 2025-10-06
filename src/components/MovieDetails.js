import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMyList } from '../contexts/MyListContext';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Grid, 
  Paper, 
  IconButton,
  Rating,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Mock data - in a real app, this would come from an API
const mockMovieDetails = {
  1: {
    id: 1,
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    poster_path: 'https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmQ2LTljNDYtMmZjNTc5MDUxMzViXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    backdrop_path: 'https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmQ2LTljNDYtMmZjNTc5MDUxMzViXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    release_date: '2024-03-01',
    runtime: 166,
    vote_average: 8.5,
    vote_count: 4500,
    genres: [
      { id: 1, name: 'Science Fiction' },
      { id: 2, name: 'Adventure' },
      { id: 3, name: 'Drama' }
    ],
    director: 'Denis Villeneuve',
    cast: [
      { id: 1, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: 'https://image.tmdb.org/t/p/w200/7Bxpe8pBfTO9Vo1f7qFU4EiZ6o08.jpg' },
      { id: 2, name: 'Zendaya', character: 'Chani', profile_path: 'https://image.tmdb.org/t/p/w200/6TE2AlOUqcrs7CyJiWYgodmee1r.jpg' },
      { id: 3, name: 'Rebecca Ferguson', character: 'Lady Jessica', profile_path: 'https://image.tmdb.org/t/p/w200/9APD0Xw6NzJ3dHQM66qFVELhl5t.jpg' },
      { id: 4, name: 'Javier Bardem', character: 'Stilgar', profile_path: 'https://image.tmdb.org/t/p/w200/2CcyMVM0zBdT0fYT2zHfxRVrVQu.jpg' },
    ],
    similar_movies: [
      { id: 101, title: 'Dune', poster_path: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', year: 2021 },
      { id: 102, title: 'Blade Runner 2049', poster_path: 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg', year: 2017 },
      { id: 103, title: 'Interstellar', poster_path: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', year: 2014 },
    ]
  },
  // Add more movie details as needed
};

// Mock TV show data
const mockTVShowDetails = {
  1: {
    id: 1,
    title: 'Stranger Things',
    tagline: 'Friendship never ends.',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    poster_path: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZDE1MzhlYzZiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    backdrop_path: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZDE1MzhlYzZiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    first_air_date: '2016-07-15',
    seasons: 4,
    vote_average: 4.8,
    vote_count: 12500,
    genres: [
      { id: 1, name: 'Drama' },
      { id: 2, name: 'Fantasy' },
      { id: 3, name: 'Horror' }
    ],
    creator: 'The Duffer Brothers',
    cast: [
      { id: 1, name: 'Millie Bobby Brown', character: 'Eleven', profile_path: 'https://image.tmdb.org/t/p/w200/yNHiRWTYu6mowHHf9E3OL0LIaMV.jpg' },
      { id: 2, name: 'Finn Wolfhard', character: 'Mike Wheeler', profile_path: 'https://image.tmdb.org/t/p/w200/hhu4eLq0PIpD2xSEbR9pOa9s9mO.jpg' },
      { id: 3, name: 'David Harbour', character: 'Jim Hopper', profile_path: 'https://image.tmdb.org/t/p/w200/6TE2AlOUqcrs7CyJiWYgodmee1r.jpg' },
      { id: 4, name: 'Winona Ryder', character: 'Joyce Byers', profile_path: 'https://image.tmdb.org/t/p/w200/2CcyMVM0zBdT0fYT2zHfxRVrVQu.jpg' },
    ],
    similar_shows: [
      { id: 2, title: 'The Mandalorian', poster_path: 'https://m.media-amazon.com/images/M/MV5BZDhlMzY0ZGItZTcyNS00ZTAxLWIyMmYtZGQ2ODg5OWZiYmJkXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_.jpg', year: '2019' },
      { id: 3, title: 'The Witcher', poster_path: 'https://m.media-amazon.com/images/M/MV5BN2EyZjNmZTUtODNiYy00YjY0LThkN2UtYzM5N2Y0Y2VmYjYyXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg', year: '2019' },
      { id: 4, title: 'The Crown', poster_path: 'https://m.media-amazon.com/images/M/MV5BZTE1NjZlYzgtNjMyNS00YTEwLTgyYmUtNjYxN2Q1N2U5YzU4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg', year: '2016' },
    ]
  },
  2: {
    id: 2,
    title: 'The Mandalorian',
    tagline: 'This is the Way.',
    overview: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    poster_path: 'https://m.media-amazon.com/images/M/MV5BZDhlMzY0ZGItZTcyNS00ZTAxLWIyMmYtZGQ2ODg5OWZiYmJkXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_.jpg',
    backdrop_path: 'https://m.media-amazon.com/images/M/MV5BZDhlMzY0ZGItZTcyNS00ZTAxLWIyMmYtZGQ2ODg5OWZiYmJkXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_.jpg',
    first_air_date: '2019-11-12',
    seasons: 3,
    vote_average: 4.7,
    vote_count: 8900,
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
      { id: 3, name: 'Sci-Fi' }
    ],
    creator: 'Jon Favreau',
    cast: [
      { id: 1, name: 'Pedro Pascal', character: 'Din Djarin', profile_path: 'https://image.tmdb.org/t/p/w200/9APD0Xw6NzJ3dHQM66qFVELhl5t.jpg' },
      { id: 2, name: 'Gina Carano', character: 'Cara Dune', profile_path: 'https://image.tmdb.org/t/p/w200/6TE2AlOUqcrs7CyJiWYgodmee1r.jpg' },
      { id: 3, name: 'Carl Weathers', character: 'Greef Karga', profile_path: 'https://image.tmdb.org/t/p/w200/2CcyMVM0zBdT0fYT2zHfxRVrVQu.jpg' },
    ],
    similar_shows: [
      { id: 1, title: 'Stranger Things', poster_path: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZDE1MzhlYzZiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', year: '2016' },
      { id: 3, title: 'The Witcher', poster_path: 'https://m.media-amazon.com/images/M/MV5BN2EyZjNmZTUtODNiYy00YjY0LThkN2UtYzM5N2Y0Y2VmYjYyXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg', year: '2019' },
      { id: 4, title: 'The Crown', poster_path: 'https://m.media-amazon.com/images/M/MV5BZTE1NjZlYzgtNjMyNS00YTEwLTgyYmUtNjYxN2Q1N2U5YzU4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg', year: '2016' },
    ]
  }
};

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#ff4d4d',
    height: '3px',
  },
});

const StyledTab = styled(Tab)({
  color: '#fff',
  fontWeight: '500',
  textTransform: 'none',
  fontSize: '1rem',
  '&.Mui-selected': {
    color: '#ff4d4d',
  },
});

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isInMyList, toggleMyList, loading: listLoading } = useMyList();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [rating, setRating] = useState(0);
  
  // Determine if this is a TV show or movie based on URL
  const isTV = location.pathname.startsWith('/tv-shows');
  const contentType = isTV ? 'tv' : 'movie';

  useEffect(() => {
    // Simulate API call
    const fetchContentDetails = async () => {
      setLoading(true);
      
      if (isTV) {
        // Check if we have TV show mock data for this ID
        if (mockTVShowDetails[id]) {
          setContent(mockTVShowDetails[id]);
          setLoading(false);
          return;
        }
        
        // For TV shows not in mock data, create a generic TV show details
        setTimeout(() => {
          const genericTVShow = {
            id: parseInt(id),
            title: `TV Show ${id}`,
            tagline: 'An amazing television experience.',
            overview: 'This is a fantastic TV show that will captivate your imagination and take you on an incredible journey through storytelling and character development across multiple seasons.',
            poster_path: 'https://via.placeholder.com/300x450?text=TV+Show+Poster',
            backdrop_path: 'https://via.placeholder.com/1920x1080?text=TV+Show+Backdrop',
            first_air_date: '2024-01-01',
            seasons: 3,
            vote_average: 7.5,
            vote_count: 1000,
            genres: [
              { id: 1, name: 'Drama' },
              { id: 2, name: 'Action' }
            ],
            creator: 'Unknown Creator',
            cast: [
              { id: 1, name: 'Lead Actor', character: 'Main Character', profile_path: 'https://via.placeholder.com/200x300?text=Actor' },
              { id: 2, name: 'Supporting Actor', character: 'Supporting Role', profile_path: 'https://via.placeholder.com/200x300?text=Actor' },
            ],
            similar_shows: [
              { id: 101, title: 'Similar Show 1', poster_path: 'https://via.placeholder.com/300x450?text=Similar+1', year: '2023' },
              { id: 102, title: 'Similar Show 2', poster_path: 'https://via.placeholder.com/300x450?text=Similar+2', year: '2022' },
            ]
          };
          
          setContent(genericTVShow);
          setLoading(false);
        }, 500);
      } else {
        // Check if we have movie mock data for this ID
        if (mockMovieDetails[id]) {
          setContent(mockMovieDetails[id]);
          setLoading(false);
          return;
        }
        
        // For movies not in mock data, create a generic movie details
        setTimeout(() => {
          const genericMovie = {
            id: parseInt(id),
            title: `Movie ${id}`,
            tagline: 'An amazing cinematic experience.',
            overview: 'This is a fantastic movie that will captivate your imagination and take you on an incredible journey through storytelling and visual excellence.',
            poster_path: 'https://via.placeholder.com/300x450?text=Movie+Poster',
            backdrop_path: 'https://via.placeholder.com/1920x1080?text=Movie+Backdrop',
            release_date: '2024-01-01',
            runtime: 120,
            vote_average: 7.5,
            vote_count: 1000,
            genres: [
              { id: 1, name: 'Action' },
              { id: 2, name: 'Drama' }
            ],
            director: 'Unknown Director',
            cast: [
              { id: 1, name: 'Lead Actor', character: 'Main Character', profile_path: 'https://via.placeholder.com/200x300?text=Actor' },
              { id: 2, name: 'Supporting Actor', character: 'Supporting Role', profile_path: 'https://via.placeholder.com/200x300?text=Actor' },
            ],
            similar_movies: [
              { id: 101, title: 'Similar Movie 1', poster_path: 'https://via.placeholder.com/300x450?text=Similar+1', year: 2023 },
              { id: 102, title: 'Similar Movie 2', poster_path: 'https://via.placeholder.com/300x450?text=Similar+2', year: 2022 },
            ]
          };
          
          setContent(genericMovie);
          setLoading(false);
        }, 500);
      }
    };

    fetchContentDetails();
  }, [id, isTV]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    // In a real app, you would save the rating to your backend
  };

  const toggleWatchlist = async () => {
    if (!content) return;
    
    try {
      // Convert content data to the format expected by MyListContext
      const contentData = {
        id: content.id,
        title: content.title,
        poster_path: content.poster_path,
        release_date: isTV ? content.first_air_date : content.release_date,
        first_air_date: content.first_air_date, // for TV shows
        overview: content.overview,
        vote_average: content.vote_average,
        genre_ids: content.genres?.map(g => g.id) || [],
        genre: content.genres?.map(g => g.name) || [],
        type: contentType
      };
      
      await toggleMyList(contentData, contentType);
      
      // Show success message
      if (isInMyList(content.id, contentType)) {
        console.log(`"${content.title}" removed from your watchlist!`);
      } else {
        console.log(`"${content.title}" added to your watchlist!`);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      alert(`Error updating watchlist: ${error.message || 'Please try again'}`);
    }
  };

  if (loading || !content) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading {isTV ? 'TV show' : 'movie'} details...</Typography>
      </Box>
    );
  }

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Box sx={{ 
      background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${content.backdrop_path})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      color: 'white',
    }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white', mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Back to {isTV ? 'TV Shows' : 'Movies'}</Typography>
        </Box>

        {/* Hero Card Section */}
        <Box sx={{ mb: 6 }}>
          <Paper 
            elevation={6} 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 26, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Grid container spacing={0}>
              {/* Poster Image */}
              <Grid item xs={12} sm={4} md={3}>
                <Box sx={{ 
                  position: 'relative',
                  height: { xs: '300px', sm: '400px', md: '500px' },
                  overflow: 'hidden'
                }}>
                  <img 
                    src={content.poster_path} 
                    alt={content.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                  {/* Rating Badge */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    borderRadius: '20px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <StarIcon sx={{ color: '#f9cb28', fontSize: '1.2rem', mr: 0.5 }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {content.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              {/* Content Area */}
              <Grid item xs={12} sm={8} md={9}>
                <Box sx={{ p: { xs: 3, sm: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Title and Basic Info */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" component="h1" sx={{ 
                      mb: 1, 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                      color: 'white'
                    }}>
                      {content.title}
                    </Typography>
                    
                    {content.tagline && (
                      <Typography variant="h6" sx={{ 
                        fontStyle: 'italic', 
                        mb: 2, 
                        color: '#ccc',
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                      }}>
                        "{content.tagline}"
                      </Typography>
                    )}
                    
                    {/* Genres and Info Chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {content.genres.map((genre) => (
                        <Chip 
                          key={genre.id}
                          label={genre.name}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            fontWeight: 500,
                            '&:hover': {
                              bgcolor: 'rgba(255,77,77,0.2)',
                            }
                          }}
                        />
                      ))}
                      <Chip 
                        label={(isTV ? content.first_air_date : content.release_date)?.split('-')[0]}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(249, 203, 40, 0.2)',
                          color: '#f9cb28',
                          fontWeight: 600
                        }}
                      />
                      {isTV ? (
                        <Chip 
                          label={`${content.seasons} ${content.seasons === 1 ? 'Season' : 'Seasons'}`}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(255, 77, 77, 0.2)',
                            color: '#ff4d4d',
                            fontWeight: 600
                          }}
                        />
                      ) : (
                        <Chip 
                          label={formatRuntime(content.runtime)}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(255, 77, 77, 0.2)',
                            color: '#ff4d4d',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  {/* Action Buttons */}
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Button 
                          variant="contained" 
                          startIcon={<PlayArrowIcon />}
                          fullWidth
                          sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                            color: '#000',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(255, 77, 77, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          WATCH NOW
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Button 
                          variant="outlined" 
                          startIcon={isInMyList(content.id, contentType) ? <StarIcon /> : <AddIcon />}
                          fullWidth
                          onClick={toggleWatchlist}
                          disabled={listLoading}
                          sx={{
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            '&:hover': {
                              borderColor: '#ff4d4d',
                              color: '#ff4d4d',
                              backgroundColor: 'rgba(255, 77, 77, 0.1)'
                            },
                            '&:disabled': {
                              opacity: 0.7,
                              color: 'rgba(255,255,255,0.5)',
                              borderColor: 'rgba(255,255,255,0.2)'
                            }
                          }}
                        >
                          {listLoading ? 'Processing...' : (isInMyList(content.id, contentType) ? 'IN WATCHLIST' : 'ADD TO WATCHLIST')}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {/* Rating and Share */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="legend" sx={{ color: 'white', fontWeight: 500 }}>Rate:</Typography>
                      <Rating
                        name="content-rating"
                        value={rating}
                        onChange={handleRatingChange}
                        precision={0.5}
                        icon={<StarIcon fontSize="inherit" />}
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        sx={{ color: '#f9cb28' }}
                      />
                    </Box>
                    <Button 
                      variant="text" 
                      startIcon={<ShareIcon />}
                      sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          color: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      SHARE
                    </Button>
                  </Box>
                  
                  {/* Description */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.7, 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      color: 'rgba(255,255,255,0.9)',
                      mb: 2
                    }}>
                      {content.overview}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        
        {/* Additional Content Tabs */}
        <Box sx={{ mb: 4 }}>
          <StyledTabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ mb: 3, justifyContent: 'center', '& .MuiTabs-flexContainer': { justifyContent: 'center' } }}
          >
            <StyledTab label="Cast & Crew" />
            <StyledTab label={`Similar ${isTV ? 'Shows' : 'Movies'}`} />
          </StyledTabs>
          
          <Box sx={{ mb: 4 }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Cast</Typography>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                  gap: 2,
                  mb: 3
                }}>
                  {content.cast.map((person) => (
                    <Paper 
                      key={person.id} 
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255, 77, 77, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                        {person.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {person.character}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>{isTV ? 'Creator' : 'Director'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography>{isTV ? content.creator : content.director}</Typography>
                </Box>
              </Box>
            )}
            
            {tabValue === 1 && (
              <Grid container spacing={2}>
                {(isTV ? content.similar_shows : content.similar_movies)?.map((similar) => (
                  <Grid item xs={6} sm={4} md={3} key={similar.id}>
                    <Box 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover .similar-movie-overlay': {
                          opacity: 1,
                        }
                      }}
                      onClick={() => navigate(isTV ? `/tv-shows/${similar.id}` : `/movies/${similar.id}`)}
                    >
                      <Box sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                        <img 
                          src={similar.poster_path} 
                          alt={similar.title}
                          style={{ 
                            width: '100%', 
                            display: 'block',
                            aspectRatio: '2/3',
                            objectFit: 'cover',
                          }} 
                        />
                        <Box 
                          className="similar-movie-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: 2,
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                            {similar.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#ccc' }}>
                            {similar.year}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MovieDetails;
