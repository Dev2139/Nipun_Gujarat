const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const Competency = require('../models/Competency');
const LearningContent = require('../models/LearningContent');

// @desc    Get all subjects
// @route   GET /api/curriculum/subjects
exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ active: true });
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all grades
// @route   GET /api/curriculum/grades
exports.getGrades = async (req, res, next) => {
  try {
    const grades = await Grade.find({ active: true }).sort({ levelOrder: 1 });
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    next(error);
  }
};

// @desc    Get competencies by subject and optional grade
// @route   GET /api/curriculum/competencies/:subject
exports.getCompetenciesBySubject = async (req, res, next) => {
  try {
    const { subject } = req.params;
    const { grade } = req.query;

    const query = { subject: subject.toLowerCase(), active: true };
    if (grade) {
      query.grade = grade.toLowerCase();
    }

    const competencies = await Competency.find(query).sort({ sequence: 1 });
    res.status(200).json({ success: true, count: competencies.length, data: competencies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single competency with learning content
// @route   GET /api/curriculum/competency/:code
exports.getCompetencyDetails = async (req, res, next) => {
  try {
    const { code } = req.params;
    const competency = await Competency.findOne({ code: code.toUpperCase() });
    if (!competency) {
      return res.status(404).json({ success: false, message: 'Competency not found' });
    }

    const learningContent = await LearningContent.findOne({ competencyCode: competency.code });

    res.status(200).json({
      success: true,
      data: {
        competency,
        learningContent,
      }
    });
  } catch (error) {
    next(error);
  }
};
