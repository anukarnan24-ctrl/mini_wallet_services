const express = require('express');

const walletRoutes = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

// PUBLIC routes
app.use('/auth', authRoutes);

// USER protected routes
app.use('/user', authMiddleware, userRoutes);
app.use('/wallets', authMiddleware, walletRoutes);
app.use('/transactions', authMiddleware, transactionRoutes);

// ADMIN protected routes
app.use('/admin', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
