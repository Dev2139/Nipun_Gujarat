const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: ['balvatika', 'grade_1', 'grade_2'],
  },
  nameGujarati: {
    type: String,
    required: true,
  },
  nameEnglish: {
    type: String,
    required: true,
  },
  levelOrder: {
    type: Number,
    required: true,
  },
  ageGroup: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
