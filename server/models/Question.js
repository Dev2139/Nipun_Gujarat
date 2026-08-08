const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    unique: true,
  },
  competencyCode: {
    type: String,
    required: true,
    index: true,
  },
  questionType: {
    type: String,
    default: 'mcq',
  },
  promptGujarati: {
    type: String,
    required: true,
  },
  promptEnglish: {
    type: String,
  },
  audioText: {
    type: String,
  },
  emojiVisual: {
    type: String,
  },
  options: [{
    id: String,
    textGujarati: String,
    emoji: String,
    isCorrect: Boolean,
  }],
  correctAnswerId: {
    type: String,
    required: true,
  },
  explanationGujarati: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
