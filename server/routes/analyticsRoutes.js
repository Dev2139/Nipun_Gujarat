const express = require('express');
const router = express.Router();
const { recordInstall, getInstallStats, getOverview } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public App Installation Tracking Endpoints
router.post('/install', recordInstall);
router.get('/installs', getInstallStats);

// Teacher Analytics Endpoint
router.get('/overview', protect, authorize('Teacher', 'Admin'), getOverview);

module.exports = router;
