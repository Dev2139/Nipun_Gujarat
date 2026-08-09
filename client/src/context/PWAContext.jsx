import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyticsService } from '../services';

const PWAContext = createContext(null);

export const PWAProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Real Analytics Stats
  const [realStats, setRealStats] = useState({
    totalUniqueVisitors: 1,
    todayVisitors: 1,
    liveActiveUsers: 1,
    totalAppInstalls: 0,
    totalRegisteredStudents: 9,
    totalRegisteredTeachers: 1,
    osBreakdown: {},
    deviceBreakdown: {},
  });

  const [installCount, setInstallCount] = useState(0);
  const [installBreakdown, setInstallBreakdown] = useState({ android: 0, ios: 0, desktop: 0 });
  const [installedUsersData, setInstalledUsersData] = useState({ totalInstalls: 0, users: [], summary: {} });

  // Get or create persistent device ID
  const getDeviceId = () => {
    let devId = localStorage.getItem('nipun_device_id');
    if (!devId) {
      devId = `dev_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem('nipun_device_id', devId);
    }
    return devId;
  };

  // Get or create persistent visitor ID for real traffic counting
  const getVisitorId = () => {
    let visId = localStorage.getItem('nipun_visitor_id');
    if (!visId) {
      visId = `vis_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem('nipun_visitor_id', visId);
    }
    return visId;
  };

  // Helper to detect device specs
  const getDeviceSpecs = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    let os = 'Other';
    if (/android/.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/.test(ua)) os = 'iOS';
    else if (/windows/.test(ua)) os = 'Windows';
    else if (/macintosh|mac os x/.test(ua)) os = 'macOS';
    else if (/linux/.test(ua)) os = 'Linux';

    let browser = 'Chrome';
    if (/samsungbrowser/.test(ua)) browser = 'Samsung Internet';
    else if (/edg\//.test(ua)) browser = 'Edge';
    else if (/chrome|crios/.test(ua) && !/edg\//.test(ua)) browser = 'Chrome';
    else if (/safari/.test(ua) && !/chrome|crios/.test(ua)) browser = 'Safari';
    else if (/firefox|fxios/.test(ua)) browser = 'Firefox';

    let deviceType = 'Mobile';
    if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) deviceType = 'Tablet';
    else if (!/mobile|iphone|ipod|android/.test(ua)) deviceType = 'Desktop';

    return { os, browser, deviceType };
  };

  // Track site visit in backend
  const recordVisitToBackend = async () => {
    try {
      const visitorId = getVisitorId();
      await analyticsService.trackVisit({
        visitorId,
        path: window.location.pathname || '/',
      });
    } catch (err) {
      // silent background failure
    }
  };

  // Send install event to backend analytics
  const recordInstallToBackend = async (source = 'pwa_prompt', extraUserInfo = {}) => {
    try {
      const specs = getDeviceSpecs();
      const deviceId = getDeviceId();

      const res = await analyticsService.trackInstall({
        deviceId,
        ...specs,
        ...extraUserInfo,
        source,
      });

      if (res?.data?.totalInstalls !== undefined) {
        setInstallCount(res.data.totalInstalls);
      }
      localStorage.setItem('nipun_pwa_installed_recorded', 'true');
      fetchRealSiteStats();
    } catch (err) {
      console.warn('[PWA] Failed to record install analytics:', err?.message);
    }
  };

  // Sync Logged-in User with their Installed Device record
  const syncUserWithDevice = async (user, role) => {
    if (!user) return;
    try {
      const specs = getDeviceSpecs();
      const deviceId = getDeviceId();

      await analyticsService.trackInstall({
        deviceId,
        ...specs,
        userId: user._id,
        userRole: role,
        userName: user.name,
        userIdentifier: user.uid || user.email || user.schoolCode || '',
        userGrade: user.grade || (user.class?.grade) || '',
        userSection: user.section || (user.class?.section) || '',
        schoolName: user.schoolName || 'જાડીયાણા પ્રાથમિક શાળા',
        source: 'user_login_sync',
      });
      fetchRealSiteStats();
    } catch (err) {
      console.warn('[PWA] Sync user with device error:', err?.message);
    }
  };

  // Fetch 100% Real Live Site Stats from backend
  const fetchRealSiteStats = async () => {
    try {
      const res = await analyticsService.getRealSiteStats();
      if (res?.success && res.data) {
        setRealStats(res.data);
        setInstallCount(res.data.totalAppInstalls || 0);
      }
    } catch (err) {
      console.warn('[PWA] Failed to fetch real site stats:', err?.message);
    }
  };

  // Fetch Detailed Installed Users List (Teacher/Admin)
  const fetchInstalledUsersList = async () => {
    try {
      const res = await analyticsService.getInstalledUsers();
      if (res?.success && res.data) {
        setInstalledUsersData(res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('[PWA] Failed to fetch installed users list:', err?.message);
    }
    return null;
  };

  useEffect(() => {
    // 1. Record site visit & fetch real stats
    recordVisitToBackend();
    fetchRealSiteStats();

    // Refresh real stats every 60 seconds
    const interval = setInterval(() => {
      recordVisitToBackend();
      fetchRealSiteStats();
    }, 60000);

    // 2. Detect if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    // If running standalone and not yet recorded, track it
    if (isStandalone && !localStorage.getItem('nipun_pwa_installed_recorded')) {
      recordInstallToBackend('standalone_detected');
    }

    // 3. Detect iOS devices
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // 4. Listen for beforeinstallprompt event (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log('[PWA] beforeinstallprompt event captured');
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // 5. Listen for app installed event
    const handleAppInstalled = () => {
      console.log('[PWA] App successfully installed event fired');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      recordInstallToBackend('appinstalled_event');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback for browsers where beforeinstallprompt didn't fire
      alert('તમારા બ્રાઉઝરના મેનુ (⋮) માં જઈને "Install Nipun Gujarat" અથવા "Add to Home Screen" પસંદ કરો.');
      return;
    }

    // Show native install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User choice: ${outcome}`);

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
      recordInstallToBackend('pwa_prompt_accepted');
    }
    setDeferredPrompt(null);
  };

  const handleIOSDone = () => {
    setShowIOSModal(false);
    recordInstallToBackend('ios_instructions_done');
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isIOS,
        showIOSModal,
        setShowIOSModal,
        installCount,
        installBreakdown,
        realStats,
        installedUsersData,
        installPWA,
        handleIOSDone,
        syncUserWithDevice,
        fetchInstalledUsersList,
        refreshStats: fetchRealSiteStats,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
