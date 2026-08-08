const express = require('express');
const router = express.Router();
const { exportClassCsv } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Teacher', 'Admin'));

router.get('/class/:classId/csv', exportClassCsv);

module.exports = router;
