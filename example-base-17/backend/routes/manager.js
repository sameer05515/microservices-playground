const express = require('express');
const router = express.Router();
const { authenticate, allowRoles } = require('../middleware/auth');
const User = require('../models/User');

// All manager routes require authentication and MANAGER or ADMIN role
router.use(authenticate);
router.use(allowRoles('ADMIN', 'MANAGER'));

// Get limited users list (Manager can read, but not all details)
router.get('/users', async (req, res) => {
  try {
    // Managers can only see USER role users (not other managers or admins)
    const users = await User.find({ role: 'USER' })
      .select('username email role createdAt')
      .limit(50); // Limit results
    
    res.json({
      message: 'Limited users retrieved successfully',
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user (limited - Manager can only update USER role accounts)
router.patch('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Managers cannot update ADMIN or MANAGER accounts
    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      return res.status(403).json({ 
        message: 'Forbidden: Cannot update admin or manager accounts' 
      });
    }

    // Allow updating username and email (not password or role)
    const { username, email } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Manager dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    message: 'Welcome to Manager Dashboard',
    user: req.user,
    access: 'Limited resource access - can read/update USER accounts only'
  });
});

module.exports = router;

