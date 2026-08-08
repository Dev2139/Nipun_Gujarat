const Student = require('../models/Student');
const StudentProgress = require('../models/StudentProgress');
const Competency = require('../models/Competency');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const TeacherNote = require('../models/TeacherNote');

/**
 * Get comprehensive analytics and overview for a teacher.
 */
exports.getTeacherDashboardOverview = async (teacherId, classId = null) => {
  const query = { teacherId, active: true };
  if (classId) {
    query.classId = classId;
  }

  const students = await Student.find(query).populate('classId', 'name grade section');
  const studentIds = students.map(s => s._id);

  const totalStudents = students.length;

  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      masteredCount: 0,
      onTrackCount: 0,
      needsSupportCount: 0,
      studentsNeedingAttention: [],
      gujaratiMasteryRate: 0,
      mathMasteryRate: 0,
      overallMasteryRate: 0,
      performanceBands: { emerging: 0, developing: 0, mastered: 0 },
    };
  }

  const progressList = await StudentProgress.find({ studentId: { $in: studentIds } })
    .populate('competencyId', 'titleGujarati titleEnglish code subject sequence trackerColumnNumber');

  const totalCompetencies = await Competency.countDocuments({ active: true });

  // Map progress per student
  const studentProgressMap = new Map();
  studentIds.forEach(id => {
    studentProgressMap.set(id.toString(), {
      mastered: 0,
      relearn: 0,
      available: 0,
      locked: 0,
      gujaratiMastered: 0,
      mathMastered: 0,
      interventionCount: 0,
      items: [],
    });
  });

  const studentsNeedingAttentionMap = new Map();

  progressList.forEach(p => {
    const sId = p.studentId.toString();
    const stats = studentProgressMap.get(sId);
    if (stats) {
      stats.items.push(p);
      if (p.status === 'MASTERED') {
        stats.mastered += 1;
        if (p.subject === 'gujarati') stats.gujaratiMastered += 1;
        if (p.subject === 'mathematics') stats.mathMastered += 1;
      } else if (p.status === 'RELEARN') {
        stats.relearn += 1;
      } else if (p.status === 'AVAILABLE' || p.status === 'LEARNING' || p.status === 'PRACTICE' || p.status === 'TEST_AVAILABLE') {
        stats.available += 1;
      } else {
        stats.locked += 1;
      }

      if (p.needsIntervention) {
        stats.interventionCount += 1;
        const studentInfo = students.find(s => s._id.toString() === sId);
        if (studentInfo) {
          studentsNeedingAttentionMap.set(`${sId}_${p.competencyCode}`, {
            studentId: studentInfo._id,
            studentUid: studentInfo.uid,
            studentName: studentInfo.name,
            grade: studentInfo.grade,
            section: studentInfo.section,
            className: studentInfo.classId ? studentInfo.classId.name : '',
            subject: p.subject,
            competencyCode: p.competencyCode,
            competencyTitleGujarati: p.competencyId ? p.competencyId.titleGujarati : p.competencyCode,
            consecutiveFailures: p.consecutiveFailures,
            latestScore: p.latestScore,
            attempts: p.attempts,
            interventionReviewed: p.interventionReviewed,
          });
        }
      }
    }
  });

  let masteredCount = 0;
  let onTrackCount = 0;
  let needsSupportCount = 0;

  studentProgressMap.forEach((stats) => {
    if (stats.interventionCount > 0 || stats.relearn >= 2) {
      needsSupportCount += 1;
    } else if (stats.mastered >= 4) {
      masteredCount += 1;
    } else {
      onTrackCount += 1;
    }
  });

  // Calculate Nipun Gujarat performance bands
  const totalMasteredComp = Array.from(studentProgressMap.values()).reduce((acc, curr) => acc + curr.mastered, 0);
  const gujaratiTotalMastered = Array.from(studentProgressMap.values()).reduce((acc, curr) => acc + curr.gujaratiMastered, 0);
  const mathTotalMastered = Array.from(studentProgressMap.values()).reduce((acc, curr) => acc + curr.mathMastered, 0);

  const totalPossible = totalStudents * totalCompetencies;
  const overallMasteryRate = totalPossible > 0 ? Math.round((totalMasteredComp / totalPossible) * 100) : 0;
  const gujaratiTotalPossible = totalStudents * 8; // 8 Gujarati competencies
  const mathTotalPossible = totalStudents * 7; // 7 Math competencies

  const gujaratiMasteryRate = gujaratiTotalPossible > 0 ? Math.round((gujaratiTotalMastered / gujaratiTotalPossible) * 100) : 0;
  const mathMasteryRate = mathTotalPossible > 0 ? Math.round((mathTotalMastered / mathTotalPossible) * 100) : 0;

  return {
    totalStudents,
    masteredCount,
    onTrackCount,
    needsSupportCount,
    studentsNeedingAttention: Array.from(studentsNeedingAttentionMap.values()),
    gujaratiMasteryRate,
    mathMasteryRate,
    overallMasteryRate,
    performanceBands: {
      mastered: masteredCount,
      developing: onTrackCount,
      emerging: needsSupportCount,
    }
  };
};

/**
 * Build digital class heatmap matrix (Physical Tracker replacement).
 */
exports.getClassHeatmap = async (classId, subject = null) => {
  const students = await Student.find({ classId, active: true }).sort({ uid: 1 });
  const compQuery = { active: true };
  if (subject) {
    compQuery.subject = subject;
  }
  const competencies = await Competency.find(compQuery).sort({ subject: 1, sequence: 1 });

  const studentIds = students.map(s => s._id);
  const progressList = await StudentProgress.find({ studentId: { $in: studentIds } });

  const matrix = students.map(student => {
    const studentProgMap = new Map();
    progressList
      .filter(p => p.studentId.toString() === student._id.toString())
      .forEach(p => studentProgMap.set(p.competencyCode, p));

    const cells = competencies.map(comp => {
      const p = studentProgMap.get(comp.code);
      return {
        competencyCode: comp.code,
        sequence: comp.sequence,
        subject: comp.subject,
        trackerColumnNumber: comp.trackerColumnNumber,
        status: p ? p.status : 'LOCKED',
        score: p ? p.latestScore : 0,
        attempts: p ? p.attempts : 0,
        needsIntervention: p ? p.needsIntervention : false,
      };
    });

    const masteredTotal = cells.filter(c => c.status === 'MASTERED').length;
    const progressPercent = competencies.length > 0 ? Math.round((masteredTotal / competencies.length) * 100) : 0;

    return {
      studentId: student._id,
      uid: student.uid,
      name: student.name,
      gender: student.gender,
      grade: student.grade,
      section: student.section,
      masteredCount: masteredTotal,
      progressPercent,
      cells,
    };
  });

  return {
    competencies: competencies.map(c => ({
      code: c.code,
      subject: c.subject,
      sequence: c.sequence,
      trackerColumnNumber: c.trackerColumnNumber,
      titleGujarati: c.titleGujarati,
      titleEnglish: c.titleEnglish,
      grade: c.grade,
    })),
    matrix,
  };
};
