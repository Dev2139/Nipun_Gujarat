const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  teacherId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  schoolName: {
    type: String,
    required: true,
    trim: true,
  },
  schoolCode: {
    type: String,
    required: true,
    trim: true,
  },
  taluka: {
    type: String,
    default: 'ગાંધીનગર',
  },
  district: {
    type: String,
    default: 'ગાંધીનગર',
  },
  role: {
    type: String,
    enum: ['Teacher', 'Admin'],
    default: 'Teacher',
  },
  assignedClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
