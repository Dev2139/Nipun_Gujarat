const express = require('express');
const router = express.Router();
const {
  recordVisit,
  recordInstall,
  getInstallStats,
  getRealSiteStats,
  getOverview,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Realtime Analytics Endpoints
router.post('/visit', recordVisit);
router.post('/install', recordInstall);
router.get('/installs', getInstallStats);
router.get('/real-stats', getRealSiteStats);

// Teacher Analytics Overview Endpoint
router.get('/overview', protect, authorize('Teacher', 'Admin'), getOverview);

module.exports = router;
