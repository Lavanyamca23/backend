// Instead of using .env file, you can define them like this:
process.env.MONGO_URI = 'mongodb+srv://kesav2807:Raji2807@cluster0.4k1tgsi.mongodb.net/Textile';
process.env.JWT_SECRET = 'kesav2807';
process.env.PORT = '1703';

// Then continue with the server setup
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 1703;

/* ---------------------- MongoDB Connection ---------------------- */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('\x1b[36m%s\x1b[0m', '✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

/* ---------------------- Middleware ---------------------- */
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------------------- Routes ---------------------- */
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/ads', require('./routes/adRoutes')); // Advertisement

/* ---------------------- Start Server ---------------------- */
app.listen(PORT, () => {
  console.log('\x1b[34m%s\x1b[0m', `🚀 Server running at: http://localhost:${PORT}`);
});
