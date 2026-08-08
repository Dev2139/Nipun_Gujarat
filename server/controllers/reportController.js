const Student = require('../models/Student');
const StudentProgress = require('../models/StudentProgress');
const Class = require('../models/Class');
const Competency = require('../models/Competency');

// @desc    Export Class Progress as CSV
// @route   GET /api/reports/class/:classId/csv
exports.exportClassCsv = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const students = await Student.find({ classId: classDoc._id, active: true }).sort({ uid: 1 });
    const studentIds = students.map(s => s._id);

    const progressList = await StudentProgress.find({ studentId: { $in: studentIds } })
      .populate('competencyId');

    // Build CSV Rows: UID, StudentName, Grade, Section, Subject, CompetencyCode, CompetencyTitle, Status, LatestScore, Attempts
    const headers = ['UID', 'Student Name', 'Grade', 'Section', 'Subject', 'Competency Code', 'Competency Title (Gujarati)', 'Status', 'Latest Score (%)', 'Attempts', 'Intervention Needed'];
    const rows = [headers.join(',')];

    for (const st of students) {
      const stProg = progressList.filter(p => p.studentId.toString() === st._id.toString());
      for (const p of stProg) {
        const compTitle = p.competencyId ? `"${p.competencyId.titleGujarati.replace(/"/g, '""')}"` : '';
        const row = [
          st.uid,
          `"${st.name.replace(/"/g, '""')}"`,
          st.grade,
          st.section,
          p.subject,
          p.competencyCode,
          compTitle,
          p.status,
          p.latestScore,
          p.attempts,
          p.needsIntervention ? 'YES' : 'NO'
        ];
        rows.push(row.join(','));
      }
    }

    const csvContent = '\uFEFF' + rows.join('\n'); // UTF-8 BOM for Excel Gujarati rendering

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="nipun_gujarat_class_${classDoc._id}_tracker.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
