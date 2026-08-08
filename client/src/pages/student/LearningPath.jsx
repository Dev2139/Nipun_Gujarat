import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { progressService, curriculumService } from '../../services';
import GujaratiVoiceButton from '../../components/GujaratiVoiceButton';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Award
} from 'lucide-react';

export default function LearningPath() {
  const { subject } = useParams(); // 'gujarati' | 'mathematics'
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isGujarati = subject === 'gujarati';

  const fetchPath = async () => {
    try {
      setLoading(true);
      const res = await progressService.getMyProgress();
      if (res.success) {
        const subjectData = isGujarati ? res.data.subjects.gujarati : res.data.subjects.mathematics;
        setCompetencies(subjectData.competencies || []);
      }
    } catch (err) {
      console.error('Error loading learning path:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPath();
  }, [subject]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs font-gujarati"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>મુખ્ય પેજ પર પાછા જાઓ</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-slate-800 font-gujarati">
            {isGujarati ? '📖 ગુજરાતી માર્ગ' : '🔢 ગણિત માર્ગ'}
          </span>
        </div>
      </div>

      <div className="text-center space-y-1.5">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          {isGujarati ? 'ગુજરાતી અધ્યયન ક્રમ' : 'ગણિત અધ્યયન ક્રમ'} 🎯
        </h1>
        <p className="text-xs text-slate-500 font-gujarati">
          એક પછી એક ક્ષમતા શીખો, મહાવરો કરો અને આગળનું પગલું અનલૉક કરો!
        </p>
      </div>

      {/* Sequential Roadmap Nodes */}
      <div className="space-y-4 max-w-2xl mx-auto pt-2">
        {competencies.map((p, idx) => {
          const comp = p.competencyId;
          const isMastered = p.status === 'MASTERED';
          const isRelearn = p.status === 'RELEARN';
          const isLocked = p.status === 'LOCKED';
          const isAvailable = p.status === 'AVAILABLE' || p.status === 'LEARNING' || p.status === 'PRACTICE' || p.status === 'TEST_AVAILABLE';

          let cardBorder = 'border-slate-200 bg-white';
          let statusBadge = null;

          if (isMastered) {
            cardBorder = 'border-emerald-300 bg-emerald-50/50 shadow-xs';
            statusBadge = (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full font-gujarati flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>નિપુણ (૧૦૦%)</span>
              </span>
            );
          } else if (isRelearn) {
            cardBorder = 'border-rose-300 bg-rose-50/70 shadow-md ring-2 ring-rose-200';
            statusBadge = (
              <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold text-xs rounded-full font-gujarati flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>ફરી શીખો ({p.latestScore}%)</span>
              </span>
            );
          } else if (isAvailable) {
            cardBorder = 'border-amber-300 bg-amber-50/60 shadow-lg ring-4 ring-amber-200 current-skill-pulse';
            statusBadge = (
              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full font-gujarati flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>અહીંથી શરૂ કરો</span>
              </span>
            );
          } else {
            cardBorder = 'border-slate-200 bg-slate-100/70 opacity-60';
            statusBadge = (
              <span className="px-3 py-1 bg-slate-200 text-slate-600 font-bold text-xs rounded-full font-gujarati flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>લૉક થયેલ</span>
              </span>
            );
          }

          return (
            <div
              key={p._id}
              className={`p-5 rounded-3xl border-2 transition-all space-y-3 relative ${cardBorder}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm font-mono shadow-xs ${
                      isMastered
                        ? 'bg-emerald-600 text-white'
                        : isRelearn
                        ? 'bg-rose-500 text-white'
                        : isAvailable
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{p.competencyCode}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-gujarati">{comp?.stage}</span>
                    </div>
                    <h3 className="text-base md:text-lg font-black text-slate-900 font-gujarati">
                      {comp?.titleGujarati || p.competencyCode}
                    </h3>
                  </div>
                </div>

                <div>{statusBadge}</div>
              </div>

              <p className="text-xs text-slate-600 font-gujarati pl-13">
                {comp?.descriptionGujarati}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 pl-13">
                <GujaratiVoiceButton
                  text={comp?.titleGujarati}
                  label="સાંભળો"
                  size="sm"
                />

                {!isLocked ? (
                  <Link
                    to={`/student/learn/${p.competencyCode}`}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs font-gujarati flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${
                      isRelearn
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{isMastered ? 'પુનરાવર્તન કરો' : (isRelearn ? 'પાઠ ફરી શીખો ▶' : 'શીખવાનું શરૂ કરો ▶')}</span>
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400 font-gujarati font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>પહેલાં આગળની ક્ષમતા પૂર્ણ કરો</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
