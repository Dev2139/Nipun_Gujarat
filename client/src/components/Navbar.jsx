import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Flame, Star, LogOut, Download } from 'lucide-react';
import { usePWA } from '../context/PWAContext';
import SchoolHeaderBanner from './SchoolHeaderBanner';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { t, lang } = useLanguage();
  const { isInstalled, installPWA, installCount } = usePWA();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top School Header Banner */}
      <SchoolHeaderBanner />

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-13 sm:h-16 flex items-center justify-between gap-1 sm:gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-base sm:text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
            🎯
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm sm:text-lg text-slate-900 font-gujarati tracking-tight truncate">
                {t('appTitle')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 hidden xs:inline-block">
                FLN
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block font-gujarati leading-none mt-0.5">
              {lang === 'gu' ? 'ગુજરાત સરકાર • પાયાની સાક્ષરતા અને સંખ્યાજ્ઞાન' : 'Govt of Gujarat • Foundational Learning'}
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* PWA Install Button */}
          {!isInstalled && (
            <button
              onClick={installPWA}
              className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-[11px] sm:text-xs rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1 font-gujarati shrink-0"
              title="Install App on Device / ઉપકરણ પર એપ ઇન્સ્ટોલ કરો"
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce-soft shrink-0" />
              <span className="hidden sm:inline">એપ ડાઉનલોડ</span>
              <span className="sm:hidden text-[10px]">ડાઉનલોડ</span>
            </button>
          )}

          <LanguageSwitcher />

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Student Stars & Streak Badge */}
              {role === 'Student' && (
                <div className="flex items-center gap-1 sm:gap-2 bg-amber-50 border border-amber-200 px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl sm:rounded-full text-amber-900 font-black text-[11px] sm:text-xs shrink-0">
                  <span className="flex items-center gap-0.5 sm:gap-1">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                    <span>{user.totalStars || 0}</span>
                  </span>
                  <span className="text-slate-300 hidden xs:inline">|</span>
                  <span className="hidden xs:flex items-center gap-0.5 sm:gap-1 text-orange-600">
                    <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-orange-500 shrink-0" />
                    <span>{user.streakDays || 1}d</span>
                  </span>
                </div>
              )}

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs shrink-0">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden md:block text-left text-xs max-w-[120px]">
                  <div className="font-bold text-slate-800 truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {role === 'Teacher' ? (user.schoolCode ? `શાળા: ${user.schoolCode}` : 'શિક્ષક') : `UID: ${user.uid}`}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-0.5 active:scale-95"
                  title="Logout / બહાર નીકળો"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
