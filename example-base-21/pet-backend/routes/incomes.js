const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

// @route   GET /api/incomes
// @desc    Get all incomes
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (req.user) {
      query.userId = req.user._id;
    }

    if (category) {
      query.category = category;
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

    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const incomes = await Income.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Income.countDocuments(query);

    res.json({
      success: true,
      count: incomes.length,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
      data: incomes,
    });
  } catch (error) {
    console.error('Get incomes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/incomes/stats/summary (must be before /:id)
// @desc    Income statistics
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

    const totalIncomes = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    const categoryTotals = await Income.aggregate([
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

    const monthlyBreakdown = await Income.aggregate([
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
        total: totalIncomes[0]?.total || 0,
        count: totalIncomes[0]?.count || 0,
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
    console.error('Get income stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/incomes/:id
router.get('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (req.user && income.userId && income.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this income' });
    }

    res.json({
      success: true,
      data: income,
    });
  } catch (error) {
    console.error('Get income error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid income ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/incomes
// @desc    Create income
router.post('/', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description || amount === undefined || amount === null || !category || !date) {
      return res.status(400).json({
        message: 'Please provide description, amount, category, and date',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const income = await Income.create({
      description,
      amount,
      category,
      date: new Date(date),
      userId: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: 'Income created successfully',
      data: income,
    });
  } catch (error) {
    console.error('Create income error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/incomes/:id
router.put('/:id', async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (req.user && income.userId && income.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this income' });
    }

    const { description, amount, category, date } = req.body;

    if (description !== undefined) income.description = description;
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }
      income.amount = amount;
    }
    if (category !== undefined) income.category = category;
    if (date !== undefined) income.date = new Date(date);

    await income.save();

    res.json({
      success: true,
      message: 'Income updated successfully',
      data: income,
    });
  } catch (error) {
    console.error('Update income error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid income ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/incomes/:id
router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (req.user && income.userId && income.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this income' });
    }

    await income.deleteOne();

    res.json({
      success: true,
      message: 'Income deleted successfully',
    });
  } catch (error) {
    console.error('Delete income error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid income ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
