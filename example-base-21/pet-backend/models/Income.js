const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
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
      enum: [
        'salary',
        'freelance',
        'business',
        'investment',
        'gift',
        'refund',
        'interest',
        'rental',
        'other',
      ],
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
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

incomeSchema.index({ userId: 1, date: -1 });
incomeSchema.index({ category: 1 });

incomeSchema.virtual('formattedDate').get(function () {
  return this.date.toISOString().split('T')[0];
});

incomeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Income', incomeSchema);
