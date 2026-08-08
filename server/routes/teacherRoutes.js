const express = require('express');
const router = express.Router();
const {
  getTeacherDashboard,
  getClassHeatmapData,
  getInterventionsList,
  addTeacherNote,
  getStudentNotes
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Teacher', 'Admin'));

router.get('/dashboard', getTeacherDashboard);
router.get('/classes/:classId/heatmap', getClassHeatmapData);
router.get('/interventions', getInterventionsList);
router.route('/students/:studentId/notes')
  .get(getStudentNotes)
  .post(addTeacherNote);

module.exports = router;
