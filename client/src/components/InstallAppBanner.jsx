import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { Download, X, Smartphone, Monitor, Share2, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export default function InstallAppBanner() {
  const { isInstalled, isIOS, showIOSModal, setShowIOSModal, installPWA, installCount, handleIOSDone } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom / Top Install Banner for Mobile & Desktop */}
      <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 rounded-3xl shadow-2xl border-2 border-emerald-400 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0 ring-2 ring-white/30">
              📲
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300 font-gujarati">
                <Sparkles className="w-3 h-3" />
                <span>{installCount > 0 ? `${installCount} ઉપકરણો પર ડાઉનલોડ થયેલ` : 'મોબાઇલ અને કમ્પ્યુટર એપ'}</span>
              </div>
              <h4 className="font-black text-sm font-gujarati leading-tight">
                નિપુણ ગુજરાત એપ ડાઉનલોડ કરો
              </h4>
              <p className="text-[11px] text-emerald-100 font-gujarati">
                {installCount > 0 ? `અત્યાર સુધી ${installCount} લોકોએ પોતાના ફોનમાં એપ ડાઉનલોડ કરી છે` : 'ઝડપી ઑફલાઇન પ્રવેશ અને સરળ શિક્ષણ'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 font-gujarati">
            <button
              onClick={installPWA}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ઇન્સ્ટોલ</span>
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
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
