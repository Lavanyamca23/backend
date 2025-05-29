// backend/models/Order.js
const mongoose = require('mongoose');
module.exports = mongoose.model('Order', new mongoose.Schema({
  customer:   Object,          // name, contact, etc.
  items:      Array,           // [{ productCode, name, price, ...}]
  subtotal:   Number,
  gst:        Number,
  total:      Number,
  createdAt:  { type: Date, default: Date.now }
}));
