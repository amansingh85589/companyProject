require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/dbConnect');

const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/orgRoutes');
const flagRoutes = require('./routes/flagRoutes');

const app = express();

// ---------------------------------------------
// GLOBAL MIDDLEWARE
// ---------------------------------------------
app.use(cors()); // tighten this to specific origins once the 3 frontend apps have fixed ports/URLs
app.use(express.json());

// ---------------------------------------------
// ROUTES
// ---------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/flags', flagRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Feature Flag API is running' });
});

// ---------------------------------------------
// 404 fallback
// ---------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



dbConnect()

module.exports = app;

