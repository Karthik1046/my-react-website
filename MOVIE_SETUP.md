# MovieFlix - Movie Management Setup Guide

## 🎬 Overview
This application now has **persistent movie management** - all movie edits are saved to MongoDB and will persist after refresh/relogin.

## 🚀 Quick Start

### Option 1: Automatic Startup (Windows)
```bash
# Double-click start.bat or run:
start.bat
```

### Option 2: Manual Startup

1. **Start Backend Server:**
```bash
cd server
npm run dev
```

2. **Start Frontend (in new terminal):**
```bash
npm start
```

## 👤 Admin Access
- **Email:** `admin@movieflix.com`
- **Password:** `SecureAdmin2024!`

## 📂 Key Features Fixed

### ✅ Persistent Movie Storage
- All movie data now saves to MongoDB database
- Movie edits persist after page refresh
- No more localStorage - everything is server-side

### ✅ Complete CRUD Operations
- **Create:** Add new movies/TV shows
- **Read:** View all movies with categories
- **Update:** Edit existing movies (admin only)
- **Delete:** Remove movies (admin only)

### ✅ API Endpoints
- `GET /api/movies` - Get all movies
- `GET /api/movies/category/:category` - Get by category
- `POST /api/movies` - Create movie (admin)
- `PUT /api/movies/:id` - Update movie (admin)
- `DELETE /api/movies/:id` - Delete movie (admin)

## 🗄️ Database Setup

### Initial Data Seeding
If you need to populate with sample movies:
```bash
cd server
node scripts/seedMovies.js
```

### Reset Database
To clear all movies and reseed:
```bash
cd server
# Clear movies (optional - you can do this via MongoDB)
node scripts/seedMovies.js
```

## 🛠️ Troubleshooting

### Issue: "Failed to update movie"
**Solution:**
1. Ensure backend is running on port 5000
2. Check admin is logged in
3. Verify JWT token is valid

```bash
# Check if backend is running
netstat -ano | findstr :5000

# If not running, start it:
cd server && npm run dev
```

### Issue: "Cannot reach this page"
**Solution:**
```bash
# Kill any processes using port 5000
netstat -ano | findstr :5000
# Note the PID and kill it:
taskkill /PID [PID] /F

# Then restart
cd server && npm run dev
```

### Issue: Movies not loading
**Solution:**
1. Check browser console for errors
2. Verify API is responding:
   - Visit: http://localhost:5000/api/test
   - Should return: `{"message": "MovieFlix API is running!"}`

## 📁 File Structure
```
my-react-website/
├── server/
│   ├── models/Movie.js          # Movie database schema
│   ├── routes/movies.js         # Movie API endpoints
│   ├── scripts/seedMovies.js    # Database seeding
│   └── server.js                # Main server file
├── src/
│   ├── components/
│   │   ├── AddMovieForm.js      # Movie creation/editing form
│   │   └── Home.js              # Movies display
│   └── utils/
│       └── movieApi.js          # API utility functions
├── start.bat                    # Automatic startup script
└── MOVIE_SETUP.md              # This guide
```

## 🔧 Development Commands

### Backend
```bash
cd server
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production mode
node scripts/seedMovies.js  # Seed sample data
```

### Frontend
```bash
npm start           # Start React development server
npm run build       # Build for production
```

### Full Stack
```bash
npm run dev         # Start both frontend and backend
```

## ⚡ Testing the Fix

1. **Login as admin** using the credentials above
2. **Edit a movie** - change title, image, or any field
3. **Save the changes** - should see "Movie updated successfully"
4. **Refresh the page** - changes should still be there
5. **Logout and login again** - changes persist

## 🎯 Key Components

### Movie Model (server/models/Movie.js)
- Validates all movie fields
- Supports both movies and TV shows
- Tracks creation/update metadata

### Movie API (server/routes/movies.js)
- Full CRUD operations
- Admin authentication required for CUD operations
- Proper error handling and validation

### Frontend Integration
- Real API calls instead of mock data
- Proper error handling
- Loading states and user feedback

---

🎉 **The movie persistence issue is now completely resolved!** All movie edits will be saved permanently to the database.