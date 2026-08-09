const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  grade: {
    type: String,
    required: true,
    default: 'Grade 1',
  },
  section: {
    type: String,
    required: true,
    default: 'A',
    trim: true,
  },
  academicYear: {
    type: String,
    default: '2026-27',
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  studentCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
