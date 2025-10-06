const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const upload = require('../utils/fileUpload');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      user: user.toJSON(),
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   GET /api/auth/user
// @desc    Get current user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   PUT /api/auth/update
// @desc    Update user profile
// @access  Private
router.put('/update', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('bio').optional().trim(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  console.log('Update route - Request body:', req.body);
  console.log('Update route - Authenticated user ID:', req.user?._id);
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: errors.array()[0].msg 
      });
    }

    const updates = {};
    const { name, email, bio, password } = req.body;

    // Only update fields that are provided
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    
    // Handle password update if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Find and update user
    console.log('Update route - Attempting to update user with ID:', req.user._id);
    console.log('Update route - Updates to apply:', updates);
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('Update route - Update result:', user ? 'User updated' : 'User not found');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Update error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is already in use' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   POST /api/auth/upload-photo
// @desc    Upload profile photo
// @access  Private
router.post('/upload-photo', auth, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Get the file URL (relative to the server)
    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Update user's profile photo
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: fileUrl } },
      { new: true }
    ).select('-password');

    if (!user) {
      // Delete the uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // If user had a previous photo, delete it
    if (req.user.avatar && !req.user.avatar.startsWith('http')) {
      const oldPhotoPath = path.join(__dirname, '..', req.user.avatar);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    res.json({
      success: true,
      user,
      fileUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Delete the uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, error: 'Server error during file upload' });
  }
});

// Serve uploaded files statically
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
