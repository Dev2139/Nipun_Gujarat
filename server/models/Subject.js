const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: ['gujarati', 'mathematics'],
  },
  nameGujarati: {
    type: String,
    required: true,
  },
  nameEnglish: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'BookOpen',
  },
  color: {
    type: String,
    default: '#10b981',
  },
  descriptionGujarati: {
    type: String,
  },
  descriptionEnglish: {
    type: String,
  },
  totalCompetencies: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
