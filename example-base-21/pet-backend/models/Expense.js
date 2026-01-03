const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['food', 'transport', 'entertainment', 'bills', 'shopping', 'health', 'education', 'other'],
      default: 'other',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for now, can be required when auth is implemented
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for efficient queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ category: 1 });

// Virtual for formatted date
expenseSchema.virtual('formattedDate').get(function () {
  return this.date.toISOString().split('T')[0];
});

// Ensure virtuals are included in JSON
expenseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Expense', expenseSchema);

