// backend/routes/orderRoutes.js
const express = require('express');
const Order   = require('../models/Order');
const router  = express.Router();

/* CREATE -----------------------------------------------------*/
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create order', message: err.message });
  }
});

/* LIST with search & pagination -----------------------------*/
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const query = {
      $or: [
        { 'customer.name':    new RegExp(search, 'i') },
        { 'customer.location':new RegExp(search, 'i') },
        { 'customer.contact': new RegExp(search, 'i') },
        { 'items.name':       new RegExp(search, 'i') },
      ],
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', message: err.message });
  }
});

module.exports = router;
