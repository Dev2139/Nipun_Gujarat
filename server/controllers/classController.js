const Class = require('../models/Class');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// @desc    Get all classes for logged-in teacher
// @route   GET /api/classes
exports.getTeacherClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ teacherId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new class
// @route   POST /api/classes
exports.createClass = async (req, res, next) => {
  try {
    const { name, grade, section } = req.body;

    if (!name || !grade) {
      return res.status(400).json({ success: false, message: 'Class name and grade are required' });
    }

    const newClass = await Class.create({
      name: name.trim(),
      grade,
      section: (section || 'A').trim().toUpperCase(),
      academicYear: '2026-27',
      teacherId: req.user._id,
      schoolName: req.user.schoolName,
      studentCount: 0,
    });

    await Teacher.findByIdAndUpdate(req.user._id, {
      $push: { assignedClasses: newClass._id }
    });

    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single class with students
// @route   GET /api/classes/:id
exports.getClassById = async (req, res, next) => {
  try {
    const classDoc = await Class.findById(req.params.id);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (classDoc.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this class' });
    }

    const students = await Student.find({ classId: classDoc._id, active: true }).sort({ uid: 1 });

    res.status(200).json({
      success: true,
      data: {
        classInfo: classDoc,
        students,
        totalStudents: students.length,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
exports.deleteClass = async (req, res, next) => {
  try {
    const classDoc = await Class.findById(req.params.id);
    if (!classDoc) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (classDoc.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this class' });
    }

    await Student.updateMany({ classId: classDoc._id }, { active: false });
    await Class.findByIdAndDelete(classDoc._id);
    await Teacher.findByIdAndUpdate(req.user._id, {
      $pull: { assignedClasses: classDoc._id }
    });

    res.status(200).json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    next(error);
  }
};
