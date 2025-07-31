const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware - but disable some features for CORS
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// CORS configuration - IMPORTANT: Add your frontend URL
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://mental-health-checkin-app.vercel.app',
    'https://mental-health-checkin-app-gxdy.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight
app.options('*', cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mental Health API is running!',
    endpoints: {
      auth: '/api/auth',
      checkins: '/api/checkins'
    }
  });
});

// Add this test route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API endpoint is working!',
    availableRoutes: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      checkins: {
        create: 'POST /api/checkins',
        getAll: 'GET /api/checkins'
      }
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/checkins', checkinRoutes);

// Error handling
app.use(errorHandler);

// 404 handler - log what route was attempted
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Route not found',
    attempted: `${req.method} ${req.path}`,
    availableEndpoints: {
      root: 'GET /',
      api: 'GET /api',
      auth: 'POST /api/auth/login, POST /api/auth/register',
      checkins: 'GET /api/checkins, POST /api/checkins'
    }
  });
});

// Database connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Export for Vercel
module.exports = app;
