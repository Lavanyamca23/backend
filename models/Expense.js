const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Expense',
  new mongoose.Schema(
    {
      date:        { type: Date, required: true },
      category:    { type: String, required: true },
      subCategory: { type: String },
      description: { type: String },
      amount:      { type: Number, required: true },
      status:      { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    },
    { timestamps: true }
  )
);
