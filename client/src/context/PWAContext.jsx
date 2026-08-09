import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyticsService } from '../services';

const PWAContext = createContext(null);

export const PWAProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installCount, setInstallCount] = useState(128); // Default fallback
  const [installBreakdown, setInstallBreakdown] = useState({ android: 92, ios: 21, desktop: 15 });

  // Get or create persistent device ID
  const getDeviceId = () => {
    let devId = localStorage.getItem('nipun_device_id');
    if (!devId) {
      devId = `dev_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem('nipun_device_id', devId);
    }
    return devId;
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
    else if (/chrome|crios/.test(ua)) browser = 'Chrome';
    else if (/safari/.test(ua)) browser = 'Safari';
    else if (/firefox|fxios/.test(ua)) browser = 'Firefox';

    let deviceType = 'Mobile';
    if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) deviceType = 'Tablet';
    else if (!/mobile|iphone|ipod|android/.test(ua)) deviceType = 'Desktop';

    return { os, browser, deviceType };
  };

  // Send install event to backend analytics
  const recordInstallToBackend = async (source = 'pwa_prompt') => {
    try {
      const alreadyRecorded = localStorage.getItem('nipun_pwa_installed_recorded');
      const specs = getDeviceSpecs();
      const deviceId = getDeviceId();

      const res = await analyticsService.trackInstall({
        deviceId,
        ...specs,
        source,
      });

      if (res?.data?.totalInstalls) {
        setInstallCount(res.data.totalInstalls);
      }
      localStorage.setItem('nipun_pwa_installed_recorded', 'true');
    } catch (err) {
      console.warn('[PWA] Failed to record install analytics:', err?.message);
    }
  };

  // Fetch live install stats from backend
  const fetchLiveInstallStats = async () => {
    try {
      const res = await analyticsService.getInstallStats();
      if (res?.success && res.data) {
        setInstallCount(res.data.totalInstalls);
        if (res.data.breakdown) {
          setInstallBreakdown(res.data.breakdown);
        }
      }
    } catch (err) {
      console.warn('[PWA] Failed to fetch install stats:', err?.message);
    }
  };

  useEffect(() => {
    // 1. Fetch live install stats
    fetchLiveInstallStats();

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
        installPWA,
        handleIOSDone,
        refreshInstallCount: fetchLiveInstallStats,
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
