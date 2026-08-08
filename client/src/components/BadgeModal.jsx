import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Award, Sparkles } from 'lucide-react';

export default function BadgeModal({ isOpen, onClose, achievement }) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-amber-300 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-lg mb-4 ring-8 ring-amber-100 animate-bounce">
          {achievement.iconEmoji || '🏆'}
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full mb-2 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          નવો બેજ પ્રાપ્ત થયો!
        </div>

        <h3 className="text-xl font-black text-slate-900 font-gujarati mb-2">
          {achievement.titleGujarati}
        </h3>

        <p className="text-xs text-slate-600 font-gujarati mb-6">
          {achievement.descriptionGujarati}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all text-sm font-gujarati"
        >
          આભાર! આગળ વધો 🚀
        </button>
      </div>
    </div>
  );
}
