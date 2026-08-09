import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Flame, Star, LogOut, User, Sparkles, BookOpen, Download, Smartphone } from 'lucide-react';
import { usePWA } from '../context/PWAContext';
import SchoolHeaderBanner from './SchoolHeaderBanner';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { t, lang } = useLanguage();
  const { isInstalled, installPWA } = usePWA();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top School Header Banner */}
      <SchoolHeaderBanner />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 font-gujarati tracking-tight">
                {t('appTitle')}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 hidden xs:inline-block">
                FLN 2026-27
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {lang === 'gu' ? 'ગુજરાત સરકાર • પાયાની સાક્ષરતા અને સંખ્યાજ્ઞાન' : 'Govt of Gujarat • Foundational Learning'}
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button */}
          {!isInstalled && (
            <button
              onClick={installPWA}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 font-gujarati"
              title="Install App on Device"
            >
              <Download className="w-3.5 h-3.5 animate-bounce-soft" />
              <span className="hidden sm:inline">એપ ડાઉનલોડ</span>
              <span className="sm:hidden">એપ</span>
            </button>
          )}

          <LanguageSwitcher />

          {user ? (
            <div className="flex items-center gap-3">
              {role === 'Student' && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-900 font-bold text-xs">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>{user.totalStars || 0}</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1 text-orange-600">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span>{user.streakDays || 1}d</span>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <div className="font-bold text-slate-800 line-clamp-1">{user.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {role === 'Teacher' ? (user.schoolCode ? `શાળા કોડ: ${user.schoolCode}` : 'શિક્ષક') : `UID: ${user.uid}`}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                  title="Logout / બહાર નીકળો"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
