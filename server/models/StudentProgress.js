const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
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
  subject: {
    type: String,
    required: true,
    enum: ['gujarati', 'mathematics'],
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
  sequence: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['LOCKED', 'AVAILABLE', 'LEARNING', 'PRACTICE', 'TEST_AVAILABLE', 'PASSED', 'RELEARN', 'MASTERED'],
    default: 'LOCKED',
    index: true,
  },
  progressPercentage: {
    type: Number,
    default: 0,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  consecutiveFailures: {
    type: Number,
    default: 0,
  },
  highestScore: {
    type: Number,
    default: 0,
  },
  latestScore: {
    type: Number,
    default: 0,
  },
  learningCompleted: {
    type: Boolean,
    default: false,
  },
  practiceCompleted: {
    type: Boolean,
    default: false,
  },
  assessmentUnlocked: {
    type: Boolean,
    default: false,
  },
  firstAttemptAt: {
    type: Date,
  },
  lastAttemptAt: {
    type: Date,
  },
  masteredAt: {
    type: Date,
  },
  timeSpentSeconds: {
    type: Number,
    default: 0,
  },
  videoWatched: {
    type: Boolean,
    default: false,
  },
  videoWatchedPercentage: {
    type: Number,
    default: 0,
  },
  activitiesCompleted: {
    type: Number,
    default: 0,
  },
  practiceScore: {
    type: Number,
    default: 0,
  },
  practiceAttempts: {
    type: Number,
    default: 0,
  },
  hintsUsed: {
    type: Number,
    default: 0,
  },
  weakAreas: [{
    type: String,
  }],
  activityDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  needsIntervention: {
    type: Boolean,
    default: false,
    index: true,
  },
  interventionReviewed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

studentProgressSchema.index({ studentId: 1, subject: 1, sequence: 1 });
studentProgressSchema.index({ studentId: 1, competencyCode: 1 }, { unique: true });

module.exports = mongoose.model('StudentProgress', studentProgressSchema);
