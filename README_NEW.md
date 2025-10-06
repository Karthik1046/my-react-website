# 🎬 MovieFlix - Movie Recommendation Web Application

![MovieFlix](https://img.shields.io/badge/MovieFlix-v1.0.0-red?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen?style=flat&logo=mongodb)

## 🎯 Overview

MovieFlix is a modern, full-stack movie recommendation web application featuring user authentication, personalized movie discovery, and a comprehensive admin panel for platform management.

### ✨ Key Features
- 🎬 **Movie Discovery** - Browse trending movies and TV shows
- 👤 **User Authentication** - Secure JWT-based login system  
- 📊 **Admin Panel** - Comprehensive user management dashboard
- 📱 **Responsive Design** - Mobile-optimized interface
- 🔒 **Security** - Role-based access control and audit logging

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd my-react-website

# Install dependencies
npm install
cd server && npm install && cd ..

# Setup environment variables
cp server/config.env.example server/config.env
# Edit server/config.env with your MongoDB URI

# Create admin user
cd server && node scripts/createAdminUser.js && cd ..

# Start the application
npm run dev
```

## 🖥️ Available Scripts

### `npm run dev`
Starts both frontend and backend servers concurrently
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### `npm start`
Runs the React app in development mode at http://localhost:3000

### `npm run server`
Starts the Node.js backend server at http://localhost:5000

### `npm run build`
Builds the app for production deployment

### `npm test`
Launches the test runner

## 👑 Admin Panel Access

**URL:** http://localhost:3000/admin

**Demo Credentials:**
- Email: `admin@movieflix.com`
- Password: `Admin123!`

### Admin Features
- 📊 User analytics dashboard
- 👥 Complete user management
- 🔍 Advanced search and filtering
- 🛡️ Security monitoring and audit logs
- ⚙️ Role management (admin/user)

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - UI Framework
- **Material-UI 7.3.1** - Component Library
- **React Router 7.8.2** - Navigation
- **Framer Motion** - Animations

### Backend
- **Node.js & Express** - Server Framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Encryption

## 📁 Project Structure

```
MovieFlix/
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   └── App.js              # Main app component
├── server/
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── middleware/         # Custom middleware
│   └── scripts/            # Utility scripts
└── public/                 # Static assets
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `PUT /api/auth/update` - Update profile

### Admin Panel
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get analytics

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Role-based Access Control
- ✅ Rate Limiting (30 req/min for admins)
- ✅ Audit Logging
- ✅ Input Validation
- ✅ CORS Configuration

## 📊 Admin Dashboard

The admin panel provides:
- **User Analytics** - Total users, active users, growth metrics
- **User Management** - Search, filter, role changes, deletion
- **Activity Monitoring** - Recent registrations and user activity
- **Security Audit** - Login tracking and admin action logs

## 📖 Documentation

- 📋 [Complete Project Documentation](./PROJECT_DOCUMENTATION.md)
- 📊 [Project Summary](./PROJECT_SUMMARY.md)
- 🔐 [Admin Panel Guide](./ADMIN_PANEL.md)

## 🐛 Troubleshooting

### Common Issues

**Admin panel not accessible:**
- Ensure user has 'admin' role in database
- Check JWT token validity
- Verify server is running on port 5000

**Database connection failed:**
- Check MongoDB is running
- Verify MONGODB_URI in config.env
- Ensure database permissions

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure MongoDB Atlas or production database
3. Set secure JWT_SECRET
4. Build frontend: `npm run build`
5. Deploy to hosting platform

## 📈 Future Enhancements

- 🤖 Machine Learning recommendations
- 📱 Mobile application
- 🎥 Video streaming integration
- 🌍 Multi-language support
- 👥 Social features and reviews

## 📞 Support

For issues or questions:
1. Check server logs for errors
2. Review audit logs for security issues
3. Monitor performance metrics
4. Regular database backups recommended

---

**🎬 MovieFlix - Your Ultimate Movie Discovery Platform**