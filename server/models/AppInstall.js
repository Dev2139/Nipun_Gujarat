const mongoose = require('mongoose');

const appInstallSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  deviceType: {
    type: String,
    enum: ['Mobile', 'Tablet', 'Desktop', 'Unknown'],
    default: 'Mobile',
  },
  os: {
    type: String,
    enum: ['Android', 'iOS', 'Windows', 'macOS', 'Linux', 'Other'],
    default: 'Android',
  },
  browser: {
    type: String,
    enum: ['Chrome', 'Safari', 'Edge', 'Firefox', 'Samsung Internet', 'Opera', 'Other'],
    default: 'Chrome',
  },
  userRole: {
    type: String,
    enum: ['Student', 'Teacher', 'Guest'],
    default: 'Guest',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',
  },
  userModel: {
    type: String,
    enum: ['Student', 'Teacher'],
  },
  source: {
    type: String,
    enum: ['pwa_prompt', 'ios_instructions', 'standalone_detected', 'banner_click', 'manual'],
    default: 'pwa_prompt',
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  installedAt: {
    type: Date,
    default: Date.now,
    index: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('AppInstall', appInstallSchema);
