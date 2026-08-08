const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  competencyCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  competencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competency',
    required: true,
  },
  titleGujarati: {
    type: String,
    required: true,
  },
  titleEnglish: {
    type: String,
    required: true,
  },
  passingPercentage: {
    type: Number,
    default: 80, // Nipun Gujarat mastery threshold
  },
  timeLimitMinutes: {
    type: Number,
    default: 15,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  totalQuestions: {
    type: Number,
    default: 5,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
