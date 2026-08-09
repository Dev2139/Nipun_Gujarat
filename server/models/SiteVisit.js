const mongoose = require('mongoose');

const siteVisitSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    index: true,
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  deviceType: {
    type: String,
    enum: ['Mobile', 'Tablet', 'Desktop', 'Unknown'],
    default: 'Mobile',
  },
  os: {
    type: String,
    default: 'Unknown',
  },
  browser: {
    type: String,
    default: 'Unknown',
  },
  userRole: {
    type: String,
    enum: ['Student', 'Teacher', 'Guest'],
    default: 'Guest',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  lastPath: {
    type: String,
    default: '/',
  },
  visitCount: {
    type: Number,
    default: 1,
  },
  firstVisitAt: {
    type: Date,
    default: Date.now,
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
    index: true,
  }
}, { timestamps: true });

// Compound index for finding daily active users quickly
siteVisitSchema.index({ lastActiveAt: -1 });

module.exports = mongoose.model('SiteVisit', siteVisitSchema);
