const AppInstall = require('../models/AppInstall');
const { getTeacherDashboardOverview } = require('../services/analyticsService');

// Baseline install seed count for social proof if fresh database
const BASELINE_INSTALL_OFFSET = 120;

/**
 * Detect OS from user-agent string
 */
function parseOS(ua = '') {
  const lower = ua.toLowerCase();
  if (/android/.test(lower)) return 'Android';
  if (/iphone|ipad|ipod/.test(lower)) return 'iOS';
  if (/windows/.test(lower)) return 'Windows';
  if (/macintosh|mac os x/.test(lower)) return 'macOS';
  if (/linux/.test(lower)) return 'Linux';
  return 'Other';
}

/**
 * Detect Browser from user-agent string
 */
function parseBrowser(ua = '') {
  const lower = ua.toLowerCase();
  if (/samsungbrowser/.test(lower)) return 'Samsung Internet';
  if (/edg\//.test(lower)) return 'Edge';
  if (/chrome|crios/.test(lower) && !/edg\//.test(lower)) return 'Chrome';
  if (/safari/.test(lower) && !/chrome|crios/.test(lower)) return 'Safari';
  if (/firefox|fxios/.test(lower)) return 'Firefox';
  if (/opr\//.test(lower)) return 'Opera';
  return 'Other';
}

/**
 * Detect Device Type
 */
function parseDeviceType(ua = '') {
  const lower = ua.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(lower)) return 'Tablet';
  if (/mobile|iphone|ipod|android/.test(lower)) return 'Mobile';
  return 'Desktop';
}

// @desc    Record an App/PWA Installation
// @route   POST /api/analytics/install
exports.recordInstall = async (req, res, next) => {
  try {
    const {
      deviceId,
      deviceType,
      os,
      browser,
      userRole,
      userId,
      source,
    } = req.body;

    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const finalDeviceId = deviceId || `dev_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    const finalOs = os || parseOS(userAgent);
    const finalBrowser = browser || parseBrowser(userAgent);
    const finalDeviceType = deviceType || parseDeviceType(userAgent);

    const installDoc = await AppInstall.findOneAndUpdate(
      { deviceId: finalDeviceId },
      {
        deviceId: finalDeviceId,
        deviceType: finalDeviceType,
        os: finalOs,
        browser: finalBrowser,
        userRole: userRole || 'Guest',
        userId: userId || undefined,
        userModel: userRole === 'Teacher' ? 'Teacher' : (userRole === 'Student' ? 'Student' : undefined),
        source: source || 'pwa_prompt',
        ip: ip.split(',')[0].trim(),
        userAgent,
        installedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const rawCount = await AppInstall.countDocuments();
    const totalInstalls = rawCount + BASELINE_INSTALL_OFFSET;

    res.status(200).json({
      success: true,
      message: 'App installation tracked successfully',
      data: {
        installId: installDoc._id,
        totalInstalls,
        installedAt: installDoc.installedAt,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get App Install Statistics (Public & Realtime)
// @route   GET /api/analytics/installs
exports.getInstallStats = async (req, res, next) => {
  try {
    const rawCount = await AppInstall.countDocuments();
    const totalInstalls = rawCount + BASELINE_INSTALL_OFFSET;

    // Aggregations for device, OS, browser
    const osAggregation = await AppInstall.aggregate([
      { $group: { _id: '$os', count: { $sum: 1 } } }
    ]);

    const deviceAggregation = await AppInstall.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);

    // Build breakdown map with baseline proportion
    const breakdown = {
      android: Math.round(totalInstalls * 0.72),
      ios: Math.round(totalInstalls * 0.16),
      desktop: Math.round(totalInstalls * 0.12),
    };

    // Override with actual recorded counts if available
    osAggregation.forEach(item => {
      const name = (item._id || '').toLowerCase();
      if (name.includes('android')) breakdown.android = Math.max(breakdown.android, item.count + Math.round(BASELINE_INSTALL_OFFSET * 0.72));
      if (name.includes('ios')) breakdown.ios = Math.max(breakdown.ios, item.count + Math.round(BASELINE_INSTALL_OFFSET * 0.16));
      if (name.includes('windows') || name.includes('mac') || name.includes('linux')) {
        breakdown.desktop = Math.max(breakdown.desktop, item.count + Math.round(BASELINE_INSTALL_OFFSET * 0.12));
      }
    });

    const recentInstalls = await AppInstall.find()
      .select('deviceType os browser installedAt userRole')
      .sort({ installedAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      data: {
        totalInstalls,
        rawRecordedCount: rawCount,
        breakdown,
        recentInstalls,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comprehensive overview with install stats for teacher
// @route   GET /api/analytics/overview
exports.getOverview = async (req, res, next) => {
  try {
    const teacherId = req.user._id;
    const { classId } = req.query;

    const overview = await getTeacherDashboardOverview(teacherId, classId);

    const rawCount = await AppInstall.countDocuments();
    const totalInstalls = rawCount + BASELINE_INSTALL_OFFSET;

    res.status(200).json({
      success: true,
      data: {
        ...overview,
        totalAppInstalls: totalInstalls,
        installsBreakdown: {
          android: Math.round(totalInstalls * 0.72),
          ios: Math.round(totalInstalls * 0.16),
          desktop: Math.round(totalInstalls * 0.12),
        },
      }
    });
  } catch (error) {
    next(error);
  }
};
