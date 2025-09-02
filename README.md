# MovieFlix - Movie Streaming Platform

A modern movie streaming platform built with React, Material-UI, and MongoDB.

## Features

- 🎬 **Movie & TV Show Browsing**: Browse through a vast collection of movies and TV shows
- 👤 **User Authentication**: Secure signup and login with MongoDB backend
- 📝 **Personal Watchlist**: Add movies and shows to your personal list
- ⭐ **Favorites**: Mark your favorite content
- 📱 **Responsive Design**: Works perfectly on all devices
- 🎨 **Modern UI**: Beautiful Material-UI design with dark theme
- 🔒 **Secure Backend**: JWT authentication with MongoDB

## Tech Stack

### Frontend
- React 19.1.1
- Material-UI 7.3.1
- React Router DOM 7.8.2
- Framer Motion 12.23.12

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd my-react-website
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Setup MongoDB
Make sure MongoDB is running on your system. If you're using MongoDB Atlas, update the connection string in `server/config.env`.

### 5. Configure Environment Variables
Edit `server/config.env`:
```env
MONGODB_URI=mongodb://localhost:27017/movieflix
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### 6. Start the Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`

### 7. Start the Frontend Application
In a new terminal:
```bash
npm start
```
The application will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user (protected)

### Request/Response Examples

#### Signup
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "...",
    "joinDate": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "..."
  },
  "token": "jwt_token_here"
}
```

## Project Structure

```
my-react-website/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── Home.js
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── App.js
│   └── index.js
├── server/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── config.env
└── package.json
```

## Features in Detail

### User Authentication
- Secure signup with email validation
- Password hashing with bcryptjs
- JWT token-based authentication
- Automatic token verification on app load

### User Profile
- Display user information
- Show watchlist and favorites
- User statistics (watched, watching, plan to watch)

### Movie & TV Show Features
- Browse movies and TV shows
- View detailed information
- Add to watchlist/favorites
- Search functionality
- Responsive movie carousel

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
