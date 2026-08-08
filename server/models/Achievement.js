const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  badgeKey: {
    type: String,
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
  descriptionGujarati: {
    type: String,
    required: true,
  },
  iconEmoji: {
    type: String,
    default: '⭐',
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
