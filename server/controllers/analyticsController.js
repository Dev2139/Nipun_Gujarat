const AppInstall = require('../models/AppInstall');
const SiteVisit = require('../models/SiteVisit');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { getTeacherDashboardOverview } = require('../services/analyticsService');

/**
 * Helper to detect OS
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
 * Helper to detect Browser
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
 * Helper to detect Device Type
 */
function parseDeviceType(ua = '') {
  const lower = ua.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(lower)) return 'Tablet';
  if (/mobile|iphone|ipod|android/.test(lower)) return 'Mobile';
  return 'Desktop';
}

// @desc    Record or update a real Site Visit
// @route   POST /api/analytics/visit
exports.recordVisit = async (req, res, next) => {
  try {
    const { visitorId, path, userRole, userId } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const ip = rawIp.split(',')[0].trim();

    const finalVisitorId = visitorId || `vis_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    const os = parseOS(userAgent);
    const browser = parseBrowser(userAgent);
    const deviceType = parseDeviceType(userAgent);

    const visit = await SiteVisit.findOneAndUpdate(
      { visitorId: finalVisitorId },
      {
        $set: {
          ip,
          userAgent,
          deviceType,
          os,
          browser,
          userRole: userRole || 'Guest',
          userId: userId || undefined,
          lastPath: path || '/',
          lastActiveAt: new Date(),
        },
        $inc: { visitCount: 1 },
        $setOnInsert: {
          firstVisitAt: new Date(),
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        visitorId: visit.visitorId,
        visitCount: visit.visitCount,
      }
    });
  } catch (error) {
    next(error);
  }
};

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
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const ip = rawIp.split(',')[0].trim();

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
        ip,
        userAgent,
        installedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const totalInstalls = await AppInstall.countDocuments();

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

// @desc    Get 100% Real Live Site & User Usage Statistics
// @route   GET /api/analytics/real-stats
exports.getRealSiteStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

    // 1. Real Database Counts
    const [
      totalUniqueVisitors,
      todayVisitors,
      liveActiveUsers,
      totalAppInstalls,
      totalStudents,
      totalTeachers,
      osAggregation,
      deviceAggregation,
    ] = await Promise.all([
      SiteVisit.countDocuments(),
      SiteVisit.countDocuments({ lastActiveAt: { $gte: startOfToday } }),
      SiteVisit.countDocuments({ lastActiveAt: { $gte: fifteenMinsAgo } }),
      AppInstall.countDocuments(),
      Student.countDocuments({ active: true }),
      Teacher.countDocuments({ active: true }),
      SiteVisit.aggregate([{ $group: { _id: '$os', count: { $sum: 1 } } }]),
      SiteVisit.aggregate([{ $group: { _id: '$deviceType', count: { $sum: 1 } } }]),
    ]);

    // Format OS & Device Breakdown
    const osBreakdown = {};
    osAggregation.forEach(item => {
      if (item._id) osBreakdown[item._id] = item.count;
    });

    const deviceBreakdown = {};
    deviceAggregation.forEach(item => {
      if (item._id) deviceBreakdown[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalUniqueVisitors: Math.max(1, totalUniqueVisitors),
        todayVisitors: Math.max(1, todayVisitors),
        liveActiveUsers: Math.max(1, liveActiveUsers),
        totalAppInstalls: Math.max(0, totalAppInstalls),
        totalRegisteredStudents: totalStudents,
        totalRegisteredTeachers: totalTeachers,
        osBreakdown,
        deviceBreakdown,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get App Install Statistics (Public)
// @route   GET /api/analytics/installs
exports.getInstallStats = async (req, res, next) => {
  try {
    const totalInstalls = await AppInstall.countDocuments();
    const totalVisitors = await SiteVisit.countDocuments();

    const osAggregation = await AppInstall.aggregate([
      { $group: { _id: '$os', count: { $sum: 1 } } }
    ]);

    const breakdown = {
      android: 0,
      ios: 0,
      desktop: 0,
    };

    osAggregation.forEach(item => {
      const name = (item._id || '').toLowerCase();
      if (name.includes('android')) breakdown.android += item.count;
      else if (name.includes('ios')) breakdown.ios += item.count;
      else breakdown.desktop += item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalInstalls,
        totalVisitors,
        breakdown,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comprehensive overview with real user and install stats for teacher
// @route   GET /api/analytics/overview
exports.getOverview = async (req, res, next) => {
  try {
    const teacherId = req.user._id;
    const { classId } = req.query;

    const [overview, totalAppInstalls, totalVisitors, todayVisitors, liveActiveUsers] = await Promise.all([
      getTeacherDashboardOverview(teacherId, classId),
      AppInstall.countDocuments(),
      SiteVisit.countDocuments(),
      SiteVisit.countDocuments({ lastActiveAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      SiteVisit.countDocuments({ lastActiveAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...overview,
        totalAppInstalls,
        totalVisitors: Math.max(1, totalVisitors),
        todayVisitors: Math.max(1, todayVisitors),
        liveActiveUsers: Math.max(1, liveActiveUsers),
      }
    });
  } catch (error) {
    next(error);
  }
};
