const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Audit logging function
const logAdminAction = async (adminId, action, targetUserId = null, details = null) => {
  try {
    console.log(`[AUDIT LOG] Admin ${adminId} performed action: ${action}`, {
      timestamp: new Date().toISOString(),
      adminId,
      action,
      targetUserId,
      details,
      ip: 'IP_ADDRESS' // You can get this from req.ip in the actual routes
    });
    // In production, you might want to store this in a database
    // await AuditLog.create({ adminId, action, targetUserId, details, timestamp: new Date() });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

// Rate limiting middleware (basic implementation)
const adminRateLimit = {};
const rateLimitMiddleware = (req, res, next) => {
  const adminId = req.user._id.toString();
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30; // Max 30 requests per minute per admin
  
  if (!adminRateLimit[adminId]) {
    adminRateLimit[adminId] = [];
  }
  
  // Clean old requests
  adminRateLimit[adminId] = adminRateLimit[adminId].filter(time => now - time < windowMs);
  
  if (adminRateLimit[adminId].length >= maxRequests) {
    return res.status(429).json({ 
      success: false, 
      error: 'Too many requests. Please slow down.' 
    });
  }
  
  adminRateLimit[adminId].push(now);
  next();
};

// All routes here require authentication and admin role
router.use(auth, auth.requireAdmin, rateLimitMiddleware);

// GET /api/admin/users - list users
router.get('/users', async (req, res) => {
  try {
    await logAdminAction(req.user._id, 'VIEW_USERS', null, { ip: req.ip });
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Failed to load users' });
  }
});

// PATCH /api/admin/users/:id/role - change role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.id;
    
    // Validation
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }
    
    // Prevent changing your own role
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ success: false, error: 'Cannot change your own role' });
    }
    
    const existingUser = await User.findById(targetUserId);
    if (!existingUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const user = await User.findByIdAndUpdate(
      targetUserId,
      { $set: { role } },
      { new: true }
    ).select('-password');
    
    await logAdminAction(
      req.user._id, 
      'CHANGE_USER_ROLE', 
      targetUserId, 
      { 
        oldRole: existingUser.role, 
        newRole: role, 
        targetUserEmail: existingUser.email,
        ip: req.ip 
      }
    );
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ success: false, error: 'Failed to update role' });
  }
});

// DELETE /api/admin/users/:id - delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const targetUserId = req.params.id;
    
    // Prevent deleting yourself
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
    }
    
    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Additional security: Prevent deleting other admins (unless you're a super admin)
    if (user.role === 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Cannot delete admin users. Please demote to user first.' 
      });
    }
    
    await User.findByIdAndDelete(targetUserId);
    
    await logAdminAction(
      req.user._id, 
      'DELETE_USER', 
      targetUserId, 
      { 
        deletedUserEmail: user.email,
        deletedUserName: user.name,
        deletedUserRole: user.role,
        ip: req.ip 
      }
    );
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

// GET /api/admin/stats - summary stats
router.get('/stats', async (req, res) => {
  try {
    await logAdminAction(req.user._id, 'VIEW_STATS', null, { ip: req.ip });
    
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const latestUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    
    // Get user registration stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get active users (logged in within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: sevenDaysAgo }
    });
    
    res.json({ 
      success: true, 
      stats: { 
        totalUsers, 
        admins, 
        regularUsers,
        latestUsers, 
        recentRegistrations,
        activeUsers
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load stats' });
  }
});

module.exports = router;


