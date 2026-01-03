const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect, optionalAuth } = require('../middleware/auth');

// Apply optional auth to all routes (allows both authenticated and unauthenticated access)
router.use(optionalAuth);

// @route   GET /api/expenses
// @desc    Get all expenses (optionally filtered by user)
// @access  Public (or Private if authenticated)
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, search, page = 1, limit = 50 } = req.query;

    // Build query
    const query = {};

    // Filter by user if authenticated
    if (req.user) {
      query.userId = req.user._id;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include entire end date
        query.date.$lte = end;
      }
    }

    // Search filter (description)
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const expenses = await Expense.find(query)
      .sort({ date: -1, createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Expense.countDocuments(query);

    res.json({
      success: true,
      count: expenses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: expenses,
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/expenses/stats/summary (must be registered before /:id)
// @desc    Get expense statistics
// @access  Public (or Private if authenticated)
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};

    if (req.user) {
      query.userId = req.user._id;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const totalExpenses = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    const categoryTotals = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const monthlyBreakdown = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        total: totalExpenses[0]?.total || 0,
        count: totalExpenses[0]?.count || 0,
        byCategory: categoryTotals,
        monthly: monthlyBreakdown.map((item) => ({
          year: item._id.year,
          month: item._id.month,
          total: item.total,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense by ID
// @access  Public (or Private if authenticated)
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // If authenticated, ensure user owns the expense
    if (req.user && expense.userId && expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this expense' });
    }

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error('Get expense error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Public (or Private if authenticated)
router.post('/', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    // Validation
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        message: 'Please provide description, amount, category, and date',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Create expense
    const expense = await Expense.create({
      description,
      amount,
      category,
      date: new Date(date),
      userId: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Create expense error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Public (or Private if authenticated)
router.put('/:id', async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // If authenticated, ensure user owns the expense
    if (req.user && expense.userId && expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    // Update fields
    const { description, amount, category, date } = req.body;

    if (description !== undefined) expense.description = description;
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }
      expense.amount = amount;
    }
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = new Date(date);

    await expense.save();

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    console.error('Update expense error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Public (or Private if authenticated)
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // If authenticated, ensure user owns the expense
    if (req.user && expense.userId && expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

