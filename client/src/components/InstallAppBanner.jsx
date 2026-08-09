import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePWA } from '../context/PWAContext';
import { Download, X, Share2, PlusSquare, Sparkles } from 'lucide-react';

export default function InstallAppBanner() {
  const { isInstalled, isIOS, showIOSModal, setShowIOSModal, installPWA, installCount, handleIOSDone } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();

  // Hide on login, lesson learning, and test pages to avoid disturbing interactive UI
  const isExcludedPage = 
    location.pathname === '/' || 
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/student/lesson') ||
    location.pathname.startsWith('/student/test');

  if (isInstalled || dismissed || isExcludedPage) {
    if (!showIOSModal) return null;
  }

  return (
    <>
      {/* Ultra-Compact, Non-Intrusive Floating Banner for Mobile & Desktop */}
      <div className="fixed bottom-16 md:bottom-5 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-xs z-40 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-2xl shadow-xl border border-emerald-500/50 flex items-center justify-between gap-2.5 backdrop-blur-md font-gujarati">
          {/* Icon & Mini Label */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-xs shrink-0">
              📲
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-xs text-white leading-tight truncate">
                એપ ડાઉનલોડ કરો
              </div>
              <div className="text-[10px] text-amber-300 font-medium truncate">
                {installCount > 0 ? `${installCount} ઉપકરણો પર ડાઉનલોડ` : 'ઝડપી પ્રવેશ માટે'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={installPWA}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-black text-[11px] rounded-xl shadow-xs flex items-center gap-1 transition-all"
            >
              <Download className="w-3 h-3" />
              <span>ઇન્સ્ટોલ</span>
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari "Add to Home Screen" Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-gujarati">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-emerald-400 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl shadow-sm">
              🍎
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                iPhone / iPad પર ઇન્સ્ટોલ કરો
              </h3>
              <p className="text-xs text-slate-500">
                Safari બ્રાઉઝરમાં નીચે મુજબનાં ૨ સરળ પગલાં અનુસરો:
              </p>
            </div>

            <div className="bg-emerald-50/70 rounded-2xl p-3.5 text-left text-xs text-slate-700 space-y-2.5 border border-emerald-200">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ૧
                </div>
                <div>
                  સફારી બ્રાઉઝરના તળિયે રહેલું <span className="font-bold text-slate-900">શેર બટન</span> (<Share2 className="w-3.5 h-3.5 inline text-blue-600" />) દબાવો.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ૨
                </div>
                <div>
                  મેનુમાંથી <span className="font-bold text-slate-900">'Add to Home Screen'</span> (<PlusSquare className="w-3.5 h-3.5 inline text-emerald-700" />) પસંદ કરો.
                </div>
              </div>
            </div>

            <button
              onClick={handleIOSDone}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-all"
            >
              સમજાયું (Done) ✓
            </button>
          </div>
        </div>
      )}
    </>
  );
}
