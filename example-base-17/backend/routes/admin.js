const express = require('express');
const router = express.Router();
const { authenticate, allowRoles } = require('../middleware/auth');
const User = require('../models/User');

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(allowRoles('ADMIN'));

// Get all users (Admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      message: 'Users retrieved successfully',
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID (Admin only)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user role (Admin only)
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['ADMIN', 'MANAGER', 'USER'].includes(role.toUpperCase())) {
      return res.status(400).json({ message: 'Valid role (ADMIN, MANAGER, USER) is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role.toUpperCase();
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin dashboard (Admin only)
router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Welcome to Admin Dashboard',
    user: req.user,
    access: 'Full system access'
  });
});

module.exports = router;

