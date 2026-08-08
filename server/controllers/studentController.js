const Student = require('../models/Student');
const Class = require('../models/Class');
const StudentProgress = require('../models/StudentProgress');
const Achievement = require('../models/Achievement');
const { initializeStudentProgress } = require('../services/masteryEngine');

// @desc    Add single student
// @route   POST /api/students
exports.addStudent = async (req, res, next) => {
  try {
    const { name, uid, grade, section, gender, classId, startingPoint } = req.body;

    if (!name || !classId) {
      return res.status(400).json({ success: false, message: 'Student name and Class ID are required' });
    }

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (classDoc.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add student to this class' });
    }

    // Auto-generate UID if not provided
    let finalUid = uid;
    if (!finalUid) {
      const count = await Student.countDocuments();
      finalUid = `NG-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    } else {
      finalUid = finalUid.trim().toUpperCase();
      const existing = await Student.findOne({ uid: finalUid });
      if (existing) {
        return res.status(400).json({ success: false, message: `Student UID '${finalUid}' already exists` });
      }
    }

    const student = await Student.create({
      uid: finalUid,
      name: name.trim(),
      gender: gender || 'Boy',
      grade: grade || classDoc.grade,
      section: section || classDoc.section,
      schoolName: req.user.schoolName,
      classId: classDoc._id,
      teacherId: req.user._id,
      profileImage: `avatar-${Math.floor(Math.random() * 6) + 1}`,
      startingPoint: startingPoint || 'FOUNDATIONAL',
    });

    classDoc.studentCount += 1;
    await classDoc.save();

    // Initialize all competency progress records
    await initializeStudentProgress(student._id, student.uid, student.startingPoint);

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk student import via CSV parsed data
// @route   POST /api/students/import
exports.bulkImportStudents = async (req, res, next) => {
  try {
    const { classId, students } = req.body;

    if (!classId || !students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: 'Class ID and a non-empty students array are required' });
    }

    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (classDoc.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this class' });
    }

    const createdStudents = [];
    const errors = [];

    for (let i = 0; i < students.length; i++) {
      const item = students[i];
      let { UID, Name, Grade, Section, Gender } = item;

      if (!Name) {
        errors.push(`Row ${i + 1}: Name is required`);
        continue;
      }

      let finalUid = UID;
      if (!finalUid) {
        const count = (await Student.countDocuments()) + i + 1;
        finalUid = `NG-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;
      } else {
        finalUid = finalUid.trim().toUpperCase();
        const existing = await Student.findOne({ uid: finalUid });
        if (existing) {
          errors.push(`Row ${i + 1}: UID '${finalUid}' already exists`);
          continue;
        }
      }

      const newStudent = await Student.create({
        uid: finalUid,
        name: Name.trim(),
        gender: Gender || 'Boy',
        grade: Grade || classDoc.grade,
        section: Section || classDoc.section,
        schoolName: req.user.schoolName,
        classId: classDoc._id,
        teacherId: req.user._id,
        profileImage: `avatar-${((i) % 6) + 1}`,
        startingPoint: 'FOUNDATIONAL',
      });

      await initializeStudentProgress(newStudent._id, newStudent.uid, 'FOUNDATIONAL');
      createdStudents.push(newStudent);
    }

    classDoc.studentCount += createdStudents.length;
    await classDoc.save();

    res.status(201).json({
      success: true,
      message: `Successfully imported ${createdStudents.length} students.`,
      importedCount: createdStudents.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student profile and high-level progress
// @route   GET /api/students/:id
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('classId', 'name grade section')
      .populate('teacherId', 'name schoolName email');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Role check: Teachers can only view their own students; Students can only view themselves
    if (req.user.role === 'Teacher' && student.teacherId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this student' });
    }
    if (req.user.role === 'Student' && student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const progress = await StudentProgress.find({ studentId: student._id })
      .populate('competencyId')
      .sort({ subject: 1, sequence: 1 });

    const achievements = await Achievement.find({ studentId: student._id }).sort({ unlockedAt: -1 });

    // Aggregate statistics
    const totalComps = progress.length;
    const masteredComps = progress.filter(p => p.status === 'MASTERED').length;
    const overallProgress = totalComps > 0 ? Math.round((masteredComps / totalComps) * 100) : 0;

    const gujaratiComps = progress.filter(p => p.subject === 'gujarati');
    const gujaratiMastered = gujaratiComps.filter(p => p.status === 'MASTERED').length;
    const gujaratiProgress = gujaratiComps.length > 0 ? Math.round((gujaratiMastered / gujaratiComps.length) * 100) : 0;

    const mathComps = progress.filter(p => p.subject === 'mathematics');
    const mathMastered = mathComps.filter(p => p.status === 'MASTERED').length;
    const mathProgress = mathComps.length > 0 ? Math.round((mathMastered / mathComps.length) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        student,
        overallProgress,
        gujaratiProgress,
        mathProgress,
        progress,
        achievements,
      }
    });
  } catch (error) {
    next(error);
  }
};
