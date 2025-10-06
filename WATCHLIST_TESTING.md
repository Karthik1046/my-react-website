# Watchlist Functionality Testing Guide

## Overview
The "Add to Watchlist" button has been successfully integrated with both client-side and server-side functionality.

## Features Implemented

### 1. Server-Side API Routes
- **POST** `/api/watchlist/:movieId` - Add movie to watchlist
- **DELETE** `/api/watchlist/:movieId` - Remove movie from watchlist  
- **GET** `/api/watchlist` - Get user's watchlist
- **GET** `/api/watchlist/check/:movieId` - Check if movie is in watchlist
- **PUT** `/api/watchlist/:movieId/watched` - Mark movie as watched
- **PUT** `/api/watchlist/:movieId` - Update watchlist item

### 2. Client-Side Integration
- Updated `MyListContext` to work with server API
- Integrated authentication using existing `AuthContext`
- Maintains offline support with localStorage fallback
- Button state changes based on watchlist status

### 3. Authentication Integration
- Uses existing JWT token system (`movieflix_token`)
- Server validates user authentication for all watchlist operations
- Graceful fallback to localStorage when user is not logged in

## How It Works

### For Authenticated Users:
1. Click "Add to Watchlist" button on movie details page
2. Movie is added to server database via API call
3. Local state is updated for immediate UI feedback
4. Data persists across sessions and devices

### For Non-Authenticated Users:
1. Click "Add to Watchlist" button
2. Movie is added only to localStorage
3. Data persists locally but not across devices

## Testing Steps

### Prerequisites:
1. Start the server: `cd server && npm start`
2. Start the React app: `npm start`
3. Ensure MongoDB is running

### Test Cases:

#### 1. Test as Authenticated User
1. Register/Login to the application
2. Navigate to any movie details page (e.g., `/movies/1`)
3. Click "Add to Watchlist" button
4. Button should change to "In Watchlist" with a star icon
5. Click again to remove from watchlist
6. Check `/my-list` page to see the movie listed
7. Logout and login again - watchlist should persist

#### 2. Test as Guest User
1. Ensure you're logged out
2. Navigate to any movie details page
3. Click "Add to Watchlist" button
4. Movie should be added to localStorage
5. Check `/my-list` page to see the movie listed
6. Refresh the page - movie should still be there

#### 3. Test Error Handling
1. Try adding a movie while server is offline
2. Should see error message and fallback to localStorage
3. Try adding the same movie twice - should handle gracefully

## Button States

- **"Add to Watchlist"** (with + icon) - Movie not in watchlist
- **"In Watchlist"** (with star icon) - Movie already in watchlist
- **"Processing..."** - Operation in progress (button disabled)

## Technical Implementation

### Database Schema (Watchlist Model):
```javascript
{
  user: ObjectId (ref: User),
  movie: ObjectId (ref: Movie),
  addedAt: Date,
  notes: String,
  priority: String (low/medium/high),
  watched: Boolean,
  rating: Number
}
```

### API Response Format:
```javascript
{
  success: true,
  data: [...],
  message: "Operation successful"
}
```

## Files Modified:
- `server/routes/watchlist.js` (new)
- `server/server.js` (added route)
- `src/contexts/MyListContext.js` (enhanced)
- `src/components/MovieDetails.js` (integrated)

## Troubleshooting:

### Common Issues:
1. **Button doesn't work**: Check browser console for errors
2. **Not persisting**: Ensure user is logged in and server is running
3. **Token errors**: Check if `movieflix_token` exists in localStorage
4. **Server errors**: Check MongoDB connection and server logs

### Debug Steps:
1. Open browser dev tools → Network tab
2. Try adding/removing from watchlist
3. Check for API calls to `/api/watchlist/*`
4. Verify request/response data
5. Check console for error messages

## Success Criteria ✅
- [x] Button integrates with existing MyListContext
- [x] Works for both authenticated and guest users  
- [x] Persists data to server database when logged in
- [x] Graceful fallback to localStorage
- [x] Button state reflects watchlist status
- [x] Error handling and user feedback
- [x] Compatible with existing authentication system