import React from 'react';
import { MapPin, Sparkles, School, Award, CheckCircle2 } from 'lucide-react';

export default function SchoolHeaderBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white border-b-2 border-amber-400/80 py-2 px-3 sm:px-6 shadow-md select-none font-gujarati">
      {/* Subtle Background Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 relative z-10">
        {/* Left: School Emblem & Official School Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 text-slate-950 flex items-center justify-center text-sm sm:text-base font-black shadow-md shrink-0 ring-2 ring-amber-300/60 animate-pulse-subtle">
            🏫
          </div>

          <div className="min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-amber-300 font-black text-xs sm:text-sm md:text-base tracking-wide drop-shadow-xs truncate">
                શ્રી જડિયાણા પ્રાથમિક શાળા
              </span>
              <span className="text-emerald-400 text-xs hidden sm:inline">•</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-emerald-100 font-bold shrink-0">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0 inline" />
              <span>છોટાઉદેપુર</span>
              <span className="text-[10px] text-emerald-300 font-normal hidden md:inline font-mono">
                (Chhota Udepur)
              </span>
            </div>
          </div>
        </div>

        {/* Right: State FLN Initiative Badge & Social Proof */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-xs font-semibold text-emerald-100">
            <span>ગુજરાત સરકાર શિક્ષણ વિભાગ</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-full font-black text-[10px] sm:text-xs shadow-xs">
            <Sparkles className="w-3 h-3 text-slate-950" />
            <span>નિપુણ ભારત મિશન</span>
          </div>
        </div>
      </div>
    </div>
  );
}
