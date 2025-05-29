const express  = require('express');
const Expense  = require('../models/Expense');
const router   = express.Router();

/* ----------  POST /api/expenses  (create) -------------------- */
router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create expense', message: err.message });
  }
});

/* ----------  GET /api/expenses  (list + totals) -------------- */
router.get('/', async (req, res) => {
  try {
    const { search = '', from, to, page = 1, limit = 10 } = req.query;

    const query = {
      $and: [
        search
          ? {
              $or: [
                { category:    new RegExp(search, 'i') },
                { subCategory: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
              ],
            }
          : {},
        from || to
          ? {
              date: {
                ...(from && { $gte: new Date(from) }),
                ...(to   && { $lte: new Date(to) }),
              },
            }
          : {},
      ],
    };

    const skip = (page - 1) * limit;

    /* main list */
    const [items, total] = await Promise.all([
      Expense.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Expense.countDocuments(query),
    ]);

    /* totals */
    const sums = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
        },
      },
    ]);
    const paidTotal   = sums.find((s) => s._id === 'Paid')?.total   || 0;
    const unpaidTotal = sums.find((s) => s._id === 'Unpaid')?.total || 0;

    res.json({ items, total, paidTotal, unpaidTotal, grandTotal: paidTotal + unpaidTotal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses', message: err.message });
  }
});

module.exports = router;
