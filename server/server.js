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
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://nipungujarat.netlify.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV === 'development'
    ) {
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

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nipun_gujarat';

// Database connection logic with robust serverless connection caching
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is missing!');
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((m) => {
      console.log('✅ MongoDB connected successfully');
      return m;
    }).catch((err) => {
      cached.promise = null;
      console.error('❌ MongoDB connection error:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    return null;
  }
};

// Database connection middleware for all incoming requests (MUST be before routes)
app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/') {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    try {
      const db = await connectDB();
      if (!db || mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          success: false,
          message: 'ડેટાબેઝ કનેક્શન ઉપલબ્ધ નથી (Database connection unavailable). Please verify MONGODB_URI in Vercel settings.',
          hint: 'Make sure MONGODB_URI is set in Vercel Environment Variables and 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.',
        });
      }
    } catch (connErr) {
      return res.status(503).json({
        success: false,
        message: 'ડેટાબેઝ કનેક્શન ઉપલબ્ધ નથી (Database connection unavailable).',
        error: connErr.message,
        hint: 'Please check your Vercel Environment Variables (MONGODB_URI) and MongoDB Atlas IP Whitelist (0.0.0.0/0).',
      });
    }
  }
  next();
});

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
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Nipun Gujarat API Server is Live',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: '/api/health, /api/auth, /api/curriculum, /api/progress, /api/assessments',
  });
});

// Online Database Seeder Endpoint (Useful for seeding cloud MongoDB Atlas on Vercel)
app.get('/api/admin/seed', async (req, res) => {
  const { key } = req.query;
  if (key !== 'nipun2026' && process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Unauthorized. Pass ?key=nipun2026' });
  }

  try {
    const seedRunner = require('./seed/seedRunner');
    res.status(200).json({
      success: true,
      message: 'Seeding triggered. Please check server logs or query students after 5 seconds.',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Nipun Gujarat Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  });
}

module.exports = app;
