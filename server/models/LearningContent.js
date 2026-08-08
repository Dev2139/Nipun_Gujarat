const mongoose = require('mongoose');

const learningContentSchema = new mongoose.Schema({
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
  headlineGujarati: {
    type: String,
    required: true,
  },
  instructionGujarati: {
    type: String,
    required: true,
  },
  soundPhonicsText: {
    type: String, // Text spoken by audio engine, e.g. "ગ - ગ થી ગણપતિ"
  },
  letterOrSymbol: {
    type: String, // e.g. 'ગ', 'મ', '૫', 'સરવાળો +'
  },
  mediaEmojiOrIcon: {
    type: String,
    default: '📖',
  },
  examples: [{
    wordGujarati: String,
    wordEnglish: String,
    imageEmoji: String,
    audioText: String,
    breakdown: String,
  }],
  conceptCard: {
    title: String,
    explanationGujarati: String,
    visualHint: String,
    steps: [String],
  },
  interactivePractice: [{
    type: {
      type: String,
      enum: ['tap_match', 'sound_listen', 'count_objects', 'order_items', 'fill_blank'],
      default: 'tap_match',
    },
    promptGujarati: String,
    audioPrompt: String,
    options: [String],
    correctAnswer: String,
    hintGujarati: String,
  }],
  relearningGuide: {
    focusPointsGujarati: [String],
    encouragementMessageGujarati: String,
    relearnSteps: [String],
  }
}, { timestamps: true });

module.exports = mongoose.model('LearningContent', learningContentSchema);
