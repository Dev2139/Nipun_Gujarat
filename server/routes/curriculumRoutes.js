const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getGrades,
  getCompetenciesBySubject,
  getCompetencyDetails
} = require('../controllers/curriculumController');

router.get('/subjects', getSubjects);
router.get('/grades', getGrades);
router.get('/competencies/:subject', getCompetenciesBySubject);
router.get('/competency/:code', getCompetencyDetails);

module.exports = router;
