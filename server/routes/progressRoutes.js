const express = require('express');
const router = express.Router();
const { getMyProgress, markLearningStep, trackLearningActivity } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/my', getMyProgress);
router.post('/step', markLearningStep);
router.post('/activity-update', trackLearningActivity);

module.exports = router;
