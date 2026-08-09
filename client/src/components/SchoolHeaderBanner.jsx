import React from 'react';
import { MapPin, Sparkles } from 'lucide-react';

export default function SchoolHeaderBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white border-b border-emerald-700/60 py-1.5 px-2.5 sm:px-6 shadow-xs select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-center sm:text-left font-gujarati">
        {/* School Name & Location */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] sm:text-xs font-black shadow-xs shrink-0">
            🏫
          </div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs md:text-sm font-extrabold tracking-tight truncate">
            <span className="text-amber-300 font-black truncate">જાડીયાણા પ્રાથમિક શાળા</span>
            <span className="text-emerald-300 text-[10px] sm:text-xs">•</span>
            <span className="text-emerald-100 font-semibold flex items-center gap-0.5 shrink-0">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 inline shrink-0" />
              <span>તા./જી. છોટાઉદેપુર</span>
            </span>
          </div>
        </div>

        {/* FLN Mission Tag & English Subtitle */}
        <div className="flex items-center gap-1.5 shrink-0 text-[10px] sm:text-[11px] text-emerald-200">
          <span className="hidden lg:inline font-mono font-medium text-emerald-300">
            Jadiyana Prathmik Shala, Ta/Dist-Chhota Udepur
          </span>
          <span className="px-2 py-0.5 bg-emerald-700/70 border border-emerald-500/50 rounded-full font-bold text-amber-300 text-[9px] sm:text-[10px] hidden xs:inline-flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>FLN 2026-27</span>
          </span>
        </div>
      </div>
    </div>
  );
}
