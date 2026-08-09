import React from 'react';
import { MapPin, School, Sparkles, Award } from 'lucide-react';

export default function SchoolHeaderBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white border-b border-emerald-700/50 py-2 px-3 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-center sm:text-left font-gujarati">
        {/* School Name & Location */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-xs shrink-0">
            🏫
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-extrabold tracking-wide">
            <span className="text-amber-300">જાડીયાણા પ્રાથમિક શાળા</span>
            <span className="text-emerald-300 text-[10px] sm:text-xs font-normal">•</span>
            <span className="text-emerald-100 font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0 inline" />
              <span>તા./જી. છોટાઉદેપુર</span>
            </span>
          </div>
        </div>

        {/* FLN Mission Tag & English Subtitle */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-emerald-200">
          <span className="hidden md:inline font-mono font-medium text-emerald-300">
            Jadiyana Prathmik Shala, Ta/Dist-Chhota Udepur
          </span>
          <span className="px-2 py-0.5 bg-emerald-700/60 border border-emerald-500/50 rounded-full font-bold text-amber-300 text-[10px]">
            ✨ નિપુણ ભારત • FLN મિશન
          </span>
        </div>
      </div>
    </div>
  );
}
