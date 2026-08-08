require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Route files
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
const curriculumRoutes = require('./routes/curriculumRoutes');
const progressRoutes = require('./routes/progressRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const reportRoutes = require('./routes/reportRoutes');

const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' }
});
app.use('/api/auth', authLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'Nipun Gujarat FLN Platform',
    academicYear: '2026-27',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/reports', reportRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nipun_gujarat';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`✅ MongoDB connected successfully to ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`🚀 Nipun Gujarat Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
