const express = require('express');
const router = express.Router();
const {
  getAssessmentForCompetency,
  submitAssessment,
  getAttemptHistory
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/competency/:code', getAssessmentForCompetency);
router.post('/submit', submitAssessment);
router.get('/attempts/:competencyCode', getAttemptHistory);

module.exports = router;
