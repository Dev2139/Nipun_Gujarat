const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'nipun_gujarat_secure_fln_jwt_secret_2026_key';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Teacher Login with Email/TeacherID and Password
// @route   POST /api/auth/teacher/login
exports.teacherLogin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or teacherId

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/teacher ID and password' });
    }

    const teacher = await Teacher.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { teacherId: identifier.trim() },
      ]
    }).populate('assignedClasses');

    if (!teacher) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Teacher not found.' });
    }

    const isMatch = await bcrypt.compare(password, teacher.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(teacher._id, 'Teacher');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        teacherId: teacher.teacherId,
        schoolName: teacher.schoolName,
        schoolCode: teacher.schoolCode,
        taluka: teacher.taluka,
        district: teacher.district,
        role: 'Teacher',
        assignedClasses: teacher.assignedClasses,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Student Login with UID
// @route   POST /api/auth/student/login
exports.studentLogin = async (req, res, next) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, message: 'Please enter student UID' });
    }

    const formattedUid = uid.trim().toUpperCase();
    const student = await Student.findOne({ uid: formattedUid, active: true })
      .populate('classId', 'name grade section')
      .populate('teacherId', 'name schoolName');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student UID '${formattedUid}' not found. Please contact your teacher.`
      });
    }

    student.lastLoginAt = new Date();
    await student.save();

    const token = generateToken(student._id, 'Student');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: student._id,
        uid: student.uid,
        name: student.name,
        gender: student.gender,
        grade: student.grade,
        section: student.section,
        schoolName: student.schoolName,
        classInfo: student.classId,
        teacherInfo: student.teacherId ? { name: student.teacherId.name } : null,
        profileImage: student.profileImage,
        streakDays: student.streakDays,
        totalStars: student.totalStars,
        role: 'Student',
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    if (req.user.role === 'Teacher') {
      const teacher = await Teacher.findById(req.user._id)
        .select('-passwordHash')
        .populate('assignedClasses');
      return res.status(200).json({ success: true, user: teacher });
    } else {
      const student = await Student.findById(req.user._id)
        .populate('classId', 'name grade section')
        .populate('teacherId', 'name schoolName');
      return res.status(200).json({ success: true, user: student });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get public active students list for quick selection
// @route   GET /api/auth/students
exports.getPublicStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ active: true })
      .select('uid name gender grade section profileImage totalStars streakDays')
      .sort({ uid: 1 });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};


