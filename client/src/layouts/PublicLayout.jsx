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
            <span>🏫 જાડીયાણા પ્રાથમિક શાળા • તા./જી. છોટાઉદેપુર</span>
          </div>
          <p className="text-emerald-400 font-semibold">
            નિપુણ ગુજરાત • પાયાની સાક્ષરતા અને સંખ્યાજ્ઞાન (FLN 2026-27)
          </p>
          <p className="text-[11px] text-slate-500">
            શિક્ષણ વિભાગ • સમગ્ર શિક્ષા • GCERT ગાંધીનગર • તા./જી. છોટાઉદેપુર
          </p>
        </div>
      </footer>
    </div>
  );
}
