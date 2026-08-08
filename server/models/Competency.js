const mongoose = require('mongoose');

const competencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  }, // e.g. G-01, G-02, M-01, M-02
  subject: {
    type: String,
    required: true,
    enum: ['gujarati', 'mathematics'],
    index: true,
  },
  grade: {
    type: String,
    default: 'balvatika',
    index: true,
  },
  stage: {
    type: String, // e.g. 'મૌખિક ભાષા વિકાસ', 'ક્રમ ૧: ગ, મ, ન, જ', 'પગલું ૧: તુલના'
    required: true,
  },
  trackerColumnNumber: {
    type: Number, // official column number in physical tracker (1 to 44 or 1 to 30)
    required: true,
  },
  sequence: {
    type: Number,
    required: true,
    index: true,
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
  descriptionEnglish: {
    type: String,
  },
  performanceBandTargets: {
    emerging: { type: String, default: '0-30% ઉદયમાન (વિશેષ મદદની જરૂર)' },
    developing: { type: String, default: '31-79% પ્રગતિશીલ (વધુ મહાવરાની જરૂર)' },
    mastered: { type: String, default: '80-100% નિપુણ (સિદ્ધિ મેળવી)' },
  },
  prerequisiteCompetencyCode: {
    type: String,
    default: null,
  },
  prerequisiteCompetencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competency',
    default: null,
  },
  version: {
    type: String,
    default: '2026-27',
  },
  active: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

competencySchema.index({ subject: 1, sequence: 1 });

module.exports = mongoose.model('Competency', competencySchema);
