const express = require('express');
const router = express.Router();
const { getTeacherClasses, createClass, getClassById, deleteClass } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Teacher', 'Admin'));

router.route('/')
  .get(getTeacherClasses)
  .post(createClass);

router.route('/:id')
  .get(getClassById)
  .delete(deleteClass);

module.exports = router;
