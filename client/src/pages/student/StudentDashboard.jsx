import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { progressService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import GujaratiVoiceButton from '../../components/GujaratiVoiceButton';
import {
  BookOpen,
  Calculator,
  Award,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  PlayCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { DashboardSkeleton } from '../../components/common/SkeletonLoader';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await progressService.getMyProgress();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  const { student, subjects } = data;
  const gujarati = subjects.gujarati;
  const math = subjects.mathematics;

  // Find next actionable skill
  const currentSkill = gujarati.currentCompetency?.status !== 'MASTERED'
    ? { subject: 'gujarati', comp: gujarati.currentCompetency, name: 'ગુજરાતી' }
    : { subject: 'mathematics', comp: math.currentCompetency, name: 'ગણિત' };

  return (
    <div className="space-y-6">
      {/* Friendly Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold font-gujarati">
              <span>તમારો UID: {student.uid}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-gujarati tracking-tight flex items-center gap-2">
              <span>નમસ્તે, {student.name.split(' ')[0]}</span>
              <span>👋</span>
            </h1>
            <p className="text-emerald-100 text-sm font-gujarati font-medium">
              મારી શીખવાની સફર • આજે કંઈક નવું શીખીએ!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-center text-xs font-bold font-mono">
              <div className="text-xl">⭐ {student.totalStars || 0}</div>
              <div className="text-[10px] text-emerald-100 font-gujarati font-normal">તારા (Stars)</div>
            </div>
            <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-center text-xs font-bold font-mono">
              <div className="text-xl">🔥 {student.streakDays || 1}d</div>
              <div className="text-[10px] text-emerald-100 font-gujarati font-normal">અધ્યયન ક્રમ</div>
            </div>
          </div>
        </div>
      </div>

      {/* "Today's Learning" Hero Card (આજનું શિક્ષણ) */}
      {currentSkill.comp && (
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-lg space-y-4 current-skill-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-amber-500 text-white font-bold text-lg shadow-sm">
                🎯
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 font-gujarati">
                  આજે આ શીખો (Today's Skill)
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
                  {currentSkill.comp.competencyId?.titleGujarati || currentSkill.comp.competencyCode}
                </h2>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs font-gujarati">
              {currentSkill.name}
            </span>
          </div>

          <p className="text-xs md:text-sm text-slate-600 font-gujarati">
            {currentSkill.comp.competencyId?.descriptionGujarati}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <GujaratiVoiceButton
              text={`આજે આપણે ${currentSkill.comp.competencyId?.titleGujarati} શીખીશું.`}
              label="સાંભળો"
              size="sm"
            />

            <Link
              to={`/student/learn/${currentSkill.comp.competencyCode}`}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all text-sm font-gujarati flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              <span>શીખવાનું શરૂ કરો (Start Learning) ▶</span>
            </Link>
          </div>
        </div>
      )}

      {/* Subject Cards with Progress Bars */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 font-gujarati flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>મારી શીખવાની પ્રગતિ (My Learning Journey)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gujarati Card */}
          <Link
            to="/student/path/gujarati"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📖
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 font-gujarati">
                    ગુજરાતી (Gujarati)
                  </h3>
                  <div className="text-xs text-slate-500 font-gujarati">
                    {gujarati.masteredCount} માંથી {gujarati.totalCount} ક્ષમતાઓ પૂર્ણ
                  </div>
                </div>
              </div>
              <span className="font-mono font-bold text-lg text-emerald-700">
                {gujarati.progressPercentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${gujarati.progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-1 font-gujarati">
              <span>અધ્યયન માર્ગ જુઓ &rarr;</span>
              {gujarati.currentCompetency && (
                <span className="text-[11px] text-slate-400 font-mono">
                  હાલનું: {gujarati.currentCompetency.competencyCode}
                </span>
              )}
            </div>
          </Link>

          {/* Mathematics Card */}
          <Link
            to="/student/path/mathematics"
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🔢
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 font-gujarati">
                    ગણિત (Mathematics)
                  </h3>
                  <div className="text-xs text-slate-500 font-gujarati">
                    {math.masteredCount} માંથી {math.totalCount} ક્ષમતાઓ પૂર્ણ
                  </div>
                </div>
              </div>
              <span className="font-mono font-bold text-lg text-blue-700">
                {math.progressPercentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${math.progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-blue-700 pt-1 font-gujarati">
              <span>અધ્યયન માર્ગ જુઓ &rarr;</span>
              {math.currentCompetency && (
                <span className="text-[11px] text-slate-400 font-mono">
                  હાલનું: {math.currentCompetency.competencyCode}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
