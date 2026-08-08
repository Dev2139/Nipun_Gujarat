import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import BadgeModal from '../../components/BadgeModal';
import GujaratiVoiceButton from '../../components/GujaratiVoiceButton';
import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Award,
  Home
} from 'lucide-react';

export default function ResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);

  const result = state?.result;
  const competencyCode = state?.competencyCode;
  const titleGujarati = state?.titleGujarati;

  useEffect(() => {
    if (result?.isMastered) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      if (result.newlyUnlockedAchievements && result.newlyUnlockedAchievements.length > 0) {
        setCurrentBadge(result.newlyUnlockedAchievements[0]);
        setTimeout(() => setBadgeModalOpen(true), 1200);
      }
    }
  }, [result]);

  if (!result) {
    return (
      <div className="text-center py-20 font-gujarati space-y-4">
        <p className="text-slate-500 font-bold">પરિણામ ઉપલબ્ધ નથી.</p>
        <Link
          to="/student/dashboard"
          className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md inline-block"
        >
          મુખ્ય પેજ પર જાઓ
        </Link>
      </div>
    );
  }

  const isMastered = result.isMastered;
  const percentage = result.percentage;

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-10">
      {/* Result Card */}
      <div
        className={`rounded-3xl p-8 border-4 text-center shadow-2xl space-y-6 ${
          isMastered
            ? 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50 border-emerald-400'
            : percentage >= 31
            ? 'bg-gradient-to-b from-amber-50 via-white to-amber-50 border-amber-400'
            : 'bg-gradient-to-b from-rose-50 via-white to-rose-50 border-rose-400'
        }`}
      >
        <div
          className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-xl animate-bounce ${
            isMastered
              ? 'bg-emerald-500 text-white ring-8 ring-emerald-100'
              : percentage >= 31
              ? 'bg-amber-400 text-white ring-8 ring-amber-100'
              : 'bg-rose-400 text-white ring-8 ring-rose-100'
          }`}
        >
          {isMastered ? '🎉' : (percentage >= 31 ? '👍' : '💪')}
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono bg-white shadow-xs">
            સ્કોર: {result.score} / {result.totalQuestions} ({percentage}%)
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-gujarati">
            {isMastered
              ? '🎉 અભિનંદન! તમે સૌથી નાનું અને સૌથી મોટું સારી રીતે શીખી લીધું.'
              : (percentage >= 31
                ? 'તમે થોડું વધુ શીખવાની જરૂર છે 👍'
                : 'ચાલો ફરીથી શીખીએ! ✨')}
          </h1>

          <p className="text-sm font-semibold text-slate-600 font-gujarati max-w-md mx-auto leading-relaxed">
            {result.feedbackGujarati}
          </p>

          {/* Diagnosed Weak Areas */}
          {!isMastered && result.weakAreas && result.weakAreas.length > 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-left text-xs font-gujarati space-y-1.5 mt-3">
              <div className="font-black text-amber-950 flex items-center gap-1.5">
                <span>🎯 નબળા મુદ્દાઓ (Weak Areas to Practice):</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.weakAreas.map((wa, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 font-bold text-[11px]"
                  >
                    {wa}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <GujaratiVoiceButton
              text={result.feedbackGujarati}
              label="પરિણામ સાંભળો"
              size="sm"
            />
          </div>
        </div>

        {/* Unlocked Next Competency Box */}
        {isMastered && result.nextUnlockedCompetency && (
          <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-2xl text-left text-xs font-gujarati space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>આગળનું પગલું અનલૉક થયું છે:</span>
            </div>
            <div className="font-extrabold text-sm text-emerald-950 font-gujarati">
              {result.nextUnlockedCompetency.code}: {result.nextUnlockedCompetency.titleGujarati}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 font-gujarati">
          {isMastered ? (
            <Link
              to="/student/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>આગળ વધો (Continue) 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to={`/student/learn/${competencyCode}`}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>પાઠ ફરીથી શીખો (Relearn)</span>
              </Link>
              <Link
                to="/student/dashboard"
                className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 border border-slate-300 font-bold text-xs rounded-2xl hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>મુખ્ય પેજ</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Badge Modal on Milestone */}
      <BadgeModal
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
        achievement={currentBadge}
      />
    </div>
  );
}
