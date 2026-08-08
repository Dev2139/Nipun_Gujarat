import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Users,
  Grid3X3,
  AlertTriangle,
  BarChart3,
  FileSpreadsheet,
  Settings,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export default function Sidebar() {
  const { t } = useLanguage();

  const navItems = [
    { to: '/teacher/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/teacher/classes', icon: Users, label: t('myClasses') },
    { to: '/teacher/tracker', icon: Grid3X3, label: t('digitalTracker') },
    { to: '/teacher/interventions', icon: AlertTriangle, label: t('interventions') },
    { to: '/teacher/analytics', icon: BarChart3, label: t('analytics') },
    { to: '/teacher/reports', icon: FileSpreadsheet, label: t('reports') },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3 py-2 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>શિક્ષક પોર્ટલ (Teacher Hub)</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-0.5">
            FLN ટ્રેકિંગ અને લર્નિંગ મોનિટરિંગ
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-gujarati">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400 font-medium">
          Nipun Gujarat • v1.0.0 (2026-27)
        </span>
      </div>
    </aside>
  );
}
