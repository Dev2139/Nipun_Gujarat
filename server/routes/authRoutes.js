const express = require('express');
const router = express.Router();
const { teacherLogin, studentLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/teacher/login', teacherLogin);
router.post('/student/login', studentLogin);
router.get('/me', protect, getMe);

module.exports = router;
