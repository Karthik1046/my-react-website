const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Received token:', token ? 'token exists' : 'no token');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ success: false, error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId);
    console.log('Auth middleware - Found user:', user ? `ID: ${user._id}` : 'User not found');
    
    if (!user) {
      console.log('Auth middleware - User not found with ID:', decoded.userId);
      return res.status(401).json({ success: false, error: 'Token is not valid' });
    }

    req.user = user;
    console.log('Auth middleware - Authentication successful for user:', user._id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin-only guard; use AFTER auth
auth.requireAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
};

module.exports = auth;
