const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Boy', 'Girl', 'Other', 'કુમાર', 'કન્યા'],
    default: 'Boy',
  },
  grade: {
    type: String,
    required: true,
    enum: ['Balvatika', 'Grade 1', 'Grade 2', 'બાલવાટિકા', 'ધોરણ 1', 'ધોરણ 2'],
  },
  section: {
    type: String,
    required: true,
    default: 'A',
  },
  schoolName: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  profileImage: {
    type: String,
    default: 'avatar-1',
  },
  active: {
    type: Boolean,
    default: true,
  },
  startingPoint: {
    type: String,
    enum: ['FOUNDATIONAL', 'GRADE_LEVEL'],
    default: 'FOUNDATIONAL',
  },
  streakDays: {
    type: Number,
    default: 1,
  },
  totalStars: {
    type: Number,
    default: 0,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
