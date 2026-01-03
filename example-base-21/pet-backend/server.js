require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/incomes');
const healthRoutes = require('./routes/health');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Verify environment variables are loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined');
  console.error('💡 Please ensure .env file exists with MONGODB_URI set');
  console.error('💡 Example: MONGODB_URI=mongodb://localhost:27017/personal-expense-tracker');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (optional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Personal Expense Tracker API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
      },
      expenses: {
        getAll: 'GET /api/expenses',
        getOne: 'GET /api/expenses/:id',
        create: 'POST /api/expenses',
        update: 'PUT /api/expenses/:id',
        delete: 'DELETE /api/expenses/:id',
        stats: 'GET /api/expenses/stats/summary',
      },
      incomes: {
        getAll: 'GET /api/incomes',
        getOne: 'GET /api/incomes/:id',
        create: 'POST /api/incomes',
        update: 'PUT /api/incomes/:id',
        delete: 'DELETE /api/incomes/:id',
        stats: 'GET /api/incomes/stats/summary',
      },
    },
    documentation: 'See README.md for detailed API documentation',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

