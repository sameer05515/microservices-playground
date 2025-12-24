const express = require('express');
const router = express.Router();

// Health check endpoint (public)
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'RBAC Backend API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

