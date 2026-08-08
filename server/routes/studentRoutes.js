const express = require('express');
const router = express.Router();
const { addStudent, bulkImportStudents, getStudentById } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('Teacher', 'Admin'), addStudent);
router.post('/import', authorize('Teacher', 'Admin'), bulkImportStudents);
router.get('/:id', getStudentById);

module.exports = router;
