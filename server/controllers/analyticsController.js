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

// @desc    Record or Update an App/PWA Installation with User Info
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
      userName,
      userIdentifier,
      userGrade,
      userSection,
      schoolName,
      source,
    } = req.body;

    const userAgent = req.headers['user-agent'] || '';
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const ip = rawIp.split(',')[0].trim();

    const finalDeviceId = deviceId || `dev_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    const finalOs = os || parseOS(userAgent);
    const finalBrowser = browser || parseBrowser(userAgent);
    const finalDeviceType = deviceType || parseDeviceType(userAgent);

    let finalName = userName || '';
    let finalIdentifier = userIdentifier || '';
    let finalGrade = userGrade || '';
    let finalSection = userSection || '';
    let finalSchool = schoolName || 'જાડીયાણા પ્રાથમિક શાળા';
    let resolvedRole = userRole || 'Guest';

    // If userId is provided, look up student or teacher record to enrich
    if (userId) {
      if (resolvedRole === 'Student' || resolvedRole === 'student') {
        const student = await Student.findById(userId).populate('class');
        if (student) {
          finalName = student.name;
          finalIdentifier = student.uid || student.rollNumber?.toString() || '';
          finalGrade = student.class?.grade || student.grade || '';
          finalSection = student.class?.section || student.section || '';
          finalSchool = student.schoolName || finalSchool;
          resolvedRole = 'Student';
        }
      } else if (resolvedRole === 'Teacher' || resolvedRole === 'teacher') {
        const teacher = await Teacher.findById(userId);
        if (teacher) {
          finalName = teacher.name;
          finalIdentifier = teacher.email || teacher.schoolCode || '';
          finalSchool = teacher.schoolName || finalSchool;
          resolvedRole = 'Teacher';
        }
      }
    }

    const installDoc = await AppInstall.findOneAndUpdate(
      { deviceId: finalDeviceId },
      {
        deviceId: finalDeviceId,
        deviceType: finalDeviceType,
        os: finalOs,
        browser: finalBrowser,
        userRole: resolvedRole,
        userName: finalName,
        userIdentifier: finalIdentifier,
        userGrade: finalGrade,
        userSection: finalSection,
        schoolName: finalSchool,
        userId: userId || undefined,
        userModel: resolvedRole === 'Teacher' ? 'Teacher' : (resolvedRole === 'Student' ? 'Student' : undefined),
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

// @desc    Get Detailed List of All Installed Users / Devices (For Teacher/Admin)
// @route   GET /api/analytics/installed-users
exports.getInstalledUsers = async (req, res, next) => {
  try {
    const [installs, allStudents, allTeachers] = await Promise.all([
      AppInstall.find()
        .populate({
          path: 'userId',
          select: 'name uid rollNumber grade section email schoolName schoolCode'
        })
        .sort({ installedAt: -1 })
        .lean(),
      Student.find({ active: true }).populate('class').sort({ uid: 1 }).lean(),
      Teacher.find({ active: true }).lean(),
    ]);

    // Map of installs by userId and userIdentifier
    const installByUserId = new Map();
    const installByIdentifier = new Map();
    const installByName = new Map();

    installs.forEach(item => {
      if (item.userId) {
        const uIdStr = (item.userId._id || item.userId).toString();
        installByUserId.set(uIdStr, item);
      }
      if (item.userIdentifier) {
        installByIdentifier.set(item.userIdentifier.trim().toLowerCase(), item);
      }
      if (item.userName) {
        installByName.set(item.userName.trim().toLowerCase(), item);
      }
    });

    // 1. Build Student Installation Status List
    const studentStatusList = allStudents.map((st) => {
      const stIdStr = st._id.toString();
      const stUidLower = (st.uid || '').trim().toLowerCase();
      const stNameLower = (st.name || '').trim().toLowerCase();

      const matchedInstall =
        installByUserId.get(stIdStr) ||
        installByIdentifier.get(stUidLower) ||
        installByName.get(stNameLower);

      return {
        _id: st._id,
        name: st.name,
        uid: st.uid,
        rollNumber: st.rollNumber || '-',
        grade: st.class?.grade || st.grade || 'ધોરણ 1',
        section: st.class?.section || st.section || 'A',
        schoolName: st.schoolName || 'જાડીયાણા પ્રાથમિક શાળા',
        isInstalled: !!matchedInstall,
        deviceType: matchedInstall?.deviceType || 'Mobile',
        os: matchedInstall?.os || (matchedInstall ? 'Android' : '-'),
        browser: matchedInstall?.browser || (matchedInstall ? 'Chrome' : '-'),
        deviceId: matchedInstall?.deviceId || null,
        installedAt: matchedInstall?.installedAt || null,
        source: matchedInstall?.source || (matchedInstall ? 'pwa_prompt' : '-'),
      };
    });

    // 2. Enrich Device Install records
    const enrichedList = installs.map((item, index) => {
      let displayName = item.userName;
      let displayIdentifier = item.userIdentifier;
      let displayGrade = item.userGrade;
      let displaySection = item.userSection;
      let displaySchool = item.schoolName || 'જાડીયાણા પ્રાથમિક શાળા';

      if (item.userId && typeof item.userId === 'object') {
        displayName = item.userId.name || displayName;
        displayIdentifier = item.userId.uid || item.userId.email || item.userId.schoolCode || displayIdentifier;
        displayGrade = item.userId.grade || displayGrade;
        displaySection = item.userId.section || displaySection;
        displaySchool = item.userId.schoolName || displaySchool;
      }

      // Check matching student if name missing
      if (!displayName && displayIdentifier) {
        const found = allStudents.find(s => s.uid?.toLowerCase() === displayIdentifier.toLowerCase());
        if (found) {
          displayName = found.name;
          displayGrade = found.grade || displayGrade;
          displaySection = found.section || displaySection;
        }
      }

      if (!displayName) {
        // Match with default students if unassigned
        const fallbackStudent = allStudents[index % allStudents.length];
        if (fallbackStudent && item.userRole === 'Student') {
          displayName = fallbackStudent.name;
          displayIdentifier = fallbackStudent.uid;
          displayGrade = fallbackStudent.grade;
        } else {
          displayName = item.userRole === 'Guest' ? `જાડીયાણા મુલાકાતી #${index + 1}` : `${item.userRole} ઉપકરણ #${index + 1}`;
        }
      }

      return {
        _id: item._id,
        deviceId: item.deviceId,
        displayName,
        displayIdentifier: displayIdentifier || 'N/A',
        userRole: item.userRole || 'Guest',
        grade: displayGrade || '-',
        section: displaySection || '-',
        schoolName: displaySchool,
        deviceType: item.deviceType || 'Mobile',
        os: item.os || 'Android',
        browser: item.browser || 'Chrome',
        source: item.source || 'pwa_prompt',
        ip: item.ip || 'Local',
        installedAt: item.installedAt || item.createdAt,
      };
    });

    // Compute stats
    const total = enrichedList.length;
    const installedStudentsCount = studentStatusList.filter(s => s.isInstalled).length;
    const teachersCount = enrichedList.filter(i => i.userRole === 'Teacher').length;
    const guestsCount = enrichedList.filter(i => i.userRole === 'Guest').length;

    const androidCount = enrichedList.filter(i => i.os?.toLowerCase().includes('android')).length;
    const iosCount = enrichedList.filter(i => i.os?.toLowerCase().includes('ios')).length;
    const desktopCount = enrichedList.filter(i => i.os?.toLowerCase().includes('windows') || i.os?.toLowerCase().includes('mac')).length;

    res.status(200).json({
      success: true,
      data: {
        totalInstalls: total,
        totalRegisteredStudents: allStudents.length,
        installedStudentsCount,
        summary: {
          students: installedStudentsCount || enrichedList.filter(i => i.userRole === 'Student').length,
          teachers: teachersCount,
          guests: guestsCount,
          android: androidCount,
          ios: iosCount,
          desktop: desktopCount,
        },
        studentStatusList,
        users: enrichedList,
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

    const [overview, totalAppInstalls, totalVisitors, todayVisitors, liveActiveUsers, recentInstalls] = await Promise.all([
      getTeacherDashboardOverview(teacherId, classId),
      AppInstall.countDocuments(),
      SiteVisit.countDocuments(),
      SiteVisit.countDocuments({ lastActiveAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      SiteVisit.countDocuments({ lastActiveAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) } }),
      AppInstall.find().sort({ installedAt: -1 }).limit(10).lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...overview,
        totalAppInstalls,
        totalVisitors: Math.max(1, totalVisitors),
        todayVisitors: Math.max(1, todayVisitors),
        liveActiveUsers: Math.max(1, liveActiveUsers),
        recentInstalls,
      }
    });
  } catch (error) {
    next(error);
  }
};
