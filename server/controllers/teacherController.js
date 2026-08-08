const { getTeacherDashboardOverview, getClassHeatmap } = require('../services/analyticsService');
const TeacherNote = require('../models/TeacherNote');
const StudentProgress = require('../models/StudentProgress');
const Student = require('../models/Student');

// @desc    Get teacher dashboard high-level metrics
// @route   GET /api/teachers/dashboard
exports.getTeacherDashboard = async (req, res, next) => {
  try {
    const { classId } = req.query;
    const overview = await getTeacherDashboardOverview(req.user._id, classId);
    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    next(error);
  }
};

// @desc    Get class digital tracker heatmap
// @route   GET /api/teachers/classes/:classId/heatmap
exports.getClassHeatmapData = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { subject } = req.query;
    const heatmap = await getClassHeatmap(classId, subject);
    res.status(200).json({ success: true, data: heatmap });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of students needing teacher intervention
// @route   GET /api/teachers/interventions
exports.getInterventionsList = async (req, res, next) => {
  try {
    const { classId } = req.query;
    const overview = await getTeacherDashboardOverview(req.user._id, classId);
    res.status(200).json({
      success: true,
      count: overview.studentsNeedingAttention.length,
      data: overview.studentsNeedingAttention,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add teacher note and/or resolve intervention
// @route   POST /api/teachers/students/:studentId/notes
exports.addTeacherNote = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { competencyCode, noteText, actionTaken, markReviewed } = req.body;

    if (!noteText) {
      return res.status(400).json({ success: false, message: 'Note text is required' });
    }

    const note = await TeacherNote.create({
      teacherId: req.user._id,
      studentId,
      competencyCode: competencyCode ? competencyCode.toUpperCase() : null,
      noteText: noteText.trim(),
      actionTaken: actionTaken || 'REMEDIATION',
      resolved: !!markReviewed,
    });

    if (competencyCode && markReviewed) {
      await StudentProgress.findOneAndUpdate(
        { studentId, competencyCode: competencyCode.toUpperCase() },
        { interventionReviewed: true }
      );
    }

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher notes for a student
// @route   GET /api/teachers/students/:studentId/notes
exports.getStudentNotes = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const notes = await TeacherNote.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
};
