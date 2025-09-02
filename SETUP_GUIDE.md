# MovieFlix Setup Guide

## Quick Start Instructions

### 1. Start MongoDB
Make sure MongoDB is running on your system. If you don't have MongoDB installed, you can:
- Install MongoDB locally, or
- Use MongoDB Atlas (cloud version)

### 2. Start the Backend Server
```bash
cd server
npm run dev
```
This will start the backend server on `http://localhost:5000`

### 3. Start the Frontend Application
In a new terminal window:
```bash
npm start
```
This will start the frontend on `http://localhost:3000`

### 4. Test the Signup Functionality

1. Go to `http://localhost:3000`
2. Click the "Sign Up" button in the header
3. Fill in the form:
   - **Name**: Your full name (at least 2 characters)
   - **Email**: A valid email address
   - **Password**: At least 6 characters
   - **Confirm Password**: Same as password
4. Click "Sign Up"
5. You should be redirected to the home page with a welcome message: "Welcome back, [Your Name]! 👋"

### 5. Test the Login Functionality

1. Click "Logout" in the header
2. Click "Login" in the header
3. Enter your email and password
4. Click "Sign In"
5. You should be redirected to the home page with the welcome message

### 6. Test User Persistence

1. Refresh the page
2. You should still be logged in and see the welcome message
3. The user data is stored in MongoDB and persists between sessions

## Features Working

✅ **Signup Page**: 
- Form validation (name, email, password)
- Password confirmation
- MongoDB integration
- JWT token generation
- Redirect to home page with welcome message

✅ **Login Page**:
- Email and password validation
- MongoDB authentication
- JWT token verification
- Redirect to home page with welcome message

✅ **Home Page**:
- Welcome message for logged-in users
- "Welcome back, [Name]! 👋" display
- Responsive design

✅ **Header**:
- Shows "Welcome, [Name]!" for logged-in users
- Login/Signup buttons for guests
- Logout functionality

✅ **Backend**:
- MongoDB connection
- User model with password hashing
- JWT authentication
- Input validation
- Error handling

## Troubleshooting

### If MongoDB connection fails:
1. Make sure MongoDB is running
2. Check the connection string in `server/config.env`
3. For MongoDB Atlas, replace the connection string with your cloud database URL

### If the backend server won't start:
1. Make sure you're in the server directory
2. Run `npm install` in the server directory
3. Check if port 5000 is available

### If the frontend can't connect to backend:
1. Make sure the backend is running on port 5000
2. Check the API URL in `src/contexts/AuthContext.js`
3. Ensure CORS is properly configured

## API Endpoints

- `POST http://localhost:5000/api/auth/signup` - User registration
- `POST http://localhost:5000/api/auth/login` - User login
- `GET http://localhost:5000/api/auth/user` - Get current user (protected)

## Database Schema

The User model includes:
- name (required, min 2 chars)
- email (required, unique, validated)
- password (required, min 6 chars, hashed)
- avatar (auto-generated)
- joinDate (auto-generated)
- bio (default text)
- stats (watched, watching, planToWatch)
- watchlist and favorites arrays

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable configuration
