const mongoose = require('mongoose');

const teacherNoteSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
    index: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  competencyCode: {
    type: String,
    default: null,
  },
  noteText: {
    type: String,
    required: true,
    trim: true,
  },
  actionTaken: {
    type: String,
    enum: ['REMEDIATION', 'EXTRA_PRACTICE', 'PARENT_CONTACT', 'WAIVED_PASSED', 'OBSERVATION'],
    default: 'REMEDIATION',
  },
  resolved: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('TeacherNote', teacherNoteSchema);
