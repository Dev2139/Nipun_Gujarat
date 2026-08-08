import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InstallAppBanner from '../components/InstallAppBanner';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating In-App Install Prompt Banner */}
      <InstallAppBanner />

      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2 font-gujarati">
          <div className="flex items-center justify-center gap-2 font-bold text-white text-sm">
            <span>🎯 નિપુણ ગુજરાત | Nipun Gujarat</span>
          </div>
          <p>ગુજરાત સરકાર • શિક્ષણ વિભાગ • સમગ્ર શિક્ષા • GCERT ગાંધીનગર</p>
          <p className="text-[11px] text-slate-500">
            FLN Action Plan 2026-27 • Foundational Literacy and Numeracy Mission
          </p>
        </div>
      </footer>
    </div>
  );
}
