import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import InstallAppBanner from '../components/InstallAppBanner';
import { Home, BookOpen, Award, BarChart2 } from 'lucide-react';

export default function StudentLayout() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  if (!user || role !== 'Student') {
    return <Navigate to="/login/student" replace />;
  }

  const bottomNavItems = [
    { to: '/student/dashboard', icon: Home, label: 'હોમ' },
    { to: '/student/subjects', icon: BookOpen, label: 'વિષય' },
    { to: '/student/achievements', icon: Award, label: 'સિદ્ધિઓ' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/50 via-teal-50/30 to-slate-50 pb-24 md:pb-8">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 py-3 sm:px-4 sm:py-4 md:p-6">
        <Outlet />
      </main>

      {/* Floating In-App Install Prompt Banner */}
      <InstallAppBanner />

      {/* Child-Friendly Bottom Navigation for Tablets & Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex justify-around md:hidden shadow-lg safe-bottom">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-xs font-bold font-gujarati transition-all py-1.5 px-4 rounded-2xl active:scale-95 touch-target justify-center ${
                  isActive
                    ? 'text-emerald-800 bg-emerald-100/90 scale-105 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px]">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
