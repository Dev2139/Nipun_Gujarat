import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import InstallAppBanner from '../components/InstallAppBanner';
import { LayoutDashboard, Users, Grid3X3, AlertTriangle, FileSpreadsheet } from 'lucide-react';

import { DashboardSkeleton } from '../components/common/SkeletonLoader';

export default function TeacherLayout() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!user || role !== 'Teacher') {
    return <Navigate to="/login/teacher" replace />;
  }

  const mobileNavItems = [
    { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'ડેશબોર્ડ' },
    { to: '/teacher/classes', icon: Users, label: 'વર્ગો' },
    { to: '/teacher/tracker', icon: Grid3X3, label: 'ટ્રેકર' },
    { to: '/teacher/interventions', icon: AlertTriangle, label: 'હસ્તક્ષેપ' },
    { to: '/teacher/reports', icon: FileSpreadsheet, label: 'અહેવાલ' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24 md:pb-0">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 px-3 py-3 sm:px-4 sm:py-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Floating In-App Install Prompt Banner */}
      <InstallAppBanner />

      {/* Teacher Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex justify-around md:hidden shadow-lg safe-bottom">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-[10px] sm:text-[11px] font-bold font-gujarati transition-all py-1.5 px-2 rounded-xl active:scale-95 touch-target justify-center ${
                  isActive
                    ? 'text-emerald-800 bg-emerald-100/90 scale-105 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[54px] text-center">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
