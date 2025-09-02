import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Snackbar, Alert } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import UserProfile from './components/UserProfile';
import Calculator from './components/Calculator';
import Login from './components/Login';
import Signup from './components/Signup';
import MovieDetails from './components/MovieDetails';
import MovieList from './components/MovieList';
import TVShows from './components/TVShows';
import MyList from './components/MyList';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff4d4d',
    },
    secondary: {
      main: '#f9cb28',
    },
    background: {
      default: '#0f0f1a',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Helper function to get time-based greeting
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const AppContent = () => {
  const [openWelcome, setOpenWelcome] = React.useState(false);
  const [welcomeMessage, setWelcomeMessage] = React.useState('');
  const { currentUser } = useAuth();
  const prevUserRef = React.useRef();

  React.useEffect(() => {
    // Check if user just logged in (previous user was null, current user exists)
    if (currentUser && !prevUserRef.current) {
      const userName = currentUser.displayName || currentUser.name || 'Guest';
      const greeting = getTimeBasedGreeting();
      const welcomeMsg = `🎉 ${greeting}, ${userName}! Enjoy your time exploring our website!`;
      
      // Show browser alert
      alert(welcomeMsg);
      
      // Also show in the UI
      setWelcomeMessage(welcomeMsg);
      setOpenWelcome(true);
    }
    // Update the previous user ref
    prevUserRef.current = currentUser;
  }, [currentUser]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWelcome(false);
  };
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/login" element={
            currentUser ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/signup" element={
            currentUser ? <Navigate to="/" /> : <Signup />
          } />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          } />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/trending" element={<MovieList category="trending" />} />
          <Route path="/my-list" element={
            <PrivateRoute>
              <MyList />
            </PrivateRoute>
          } />
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
      </Box>
      <Footer />
      <Snackbar 
        open={openWelcome} 
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {welcomeMessage}
        </Alert>
      </Snackbar>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
