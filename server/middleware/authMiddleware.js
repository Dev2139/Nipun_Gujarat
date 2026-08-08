const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'nipun_gujarat_secure_fln_jwt_secret_2026_key';

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'Teacher' || decoded.role === 'Admin') {
      const teacher = await Teacher.findById(decoded.id).select('-passwordHash');
      if (!teacher) {
        return res.status(401).json({ success: false, message: 'Teacher account no longer exists' });
      }
      req.user = teacher;
      req.user.role = 'Teacher';
    } else if (decoded.role === 'Student') {
      const student = await Student.findById(decoded.id);
      if (!student || !student.active) {
        return res.status(401).json({ success: false, message: 'Student account inactive or not found' });
      }
      req.user = student;
      req.user.role = 'Student';
    } else {
      return res.status(401).json({ success: false, message: 'Invalid token role payload' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'None'}' is not authorized to access this route`
      });
    }
    next();
  };
};
