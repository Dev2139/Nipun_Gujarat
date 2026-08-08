const mongoose = require('mongoose');

const assessmentAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  studentUid: {
    type: String,
    required: true,
    index: true,
  },
  competencyCode: {
    type: String,
    required: true,
    index: true,
  },
  competencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competency',
    required: true,
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
  },
  attemptNumber: {
    type: Number,
    required: true,
    default: 1,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswersCount: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  performanceBand: {
    type: String,
    enum: ['EMERGING', 'DEVELOPING', 'MASTERED'],
    required: true,
  },
  answers: [{
    questionId: String,
    selectedOptionId: String,
    isCorrect: Boolean,
  }],
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
