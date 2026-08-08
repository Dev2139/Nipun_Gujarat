import React, { useState, useEffect } from 'react';
import { studentService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { Award, Star, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Achievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const res = await studentService.getStudentById(user.id);
          if (res.success) {
            setAchievements(res.data.achievements || []);
          }
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const allBadgeTemplates = [
    { key: 'first_skill_mastered', title: 'પ્રથમ સિદ્ધિ ⭐', desc: 'પ્રથમ ક્ષમતામાં ૮૦%+ ગુણ મેળવ્યા', emoji: '⭐' },
    { key: 'gujarati_explorer', title: 'ગુજરાતી ભાષા વિજેતા 📖', desc: 'ગુજરાતીમાં ૩ ક્ષમતાઓ પૂર્ણ કરી', emoji: '📖' },
    { key: 'math_explorer', title: 'ગણિત ગણીતજ્ઞ 🔢', desc: 'ગણિતમાં ૩ ક્ષમતાઓ પૂર્ણ કરી', emoji: '🔢' },
    { key: 'learning_streak_3', title: 'અવિરત શીખનાર 🔥', desc: 'સતત ૩ દિવસ અધ્યયન કર્યું', emoji: '🔥' },
    { key: 'fln_champion', title: 'નિપુણ ગુજરાત ચેમ્પિયન 🏆', desc: 'તમામ પાયાના લક્ષ્યો હાંસલ કર્યા', emoji: '🏆' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          મારી સિદ્ધિઓ અને બેજ (My Badges) 🏆
        </h1>
        <p className="text-xs text-slate-500 font-gujarati">
          તમારી મહેનત અને સિદ્ધિઓના ચમકતા બેજ
        </p>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-amber-200 shadow-sm text-center space-y-1">
          <div className="text-3xl font-black text-amber-500 font-mono">
            ⭐ {user?.totalStars || 0}
          </div>
          <div className="text-xs font-bold text-slate-600 font-gujarati">
            કુલ પ્રાપ્ત તારા (Total Stars)
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-orange-200 shadow-sm text-center space-y-1">
          <div className="text-3xl font-black text-orange-500 font-mono">
            🔥 {user?.streakDays || 1} દિવસ
          </div>
          <div className="text-xs font-bold text-slate-600 font-gujarati">
            અધ્યયન ક્રમ (Daily Streak)
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3 pt-2">
        <h2 className="font-extrabold text-base text-slate-900 font-gujarati flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>બેજ સંગ્રહ (Badges Collection)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allBadgeTemplates.map((template) => {
            const isUnlocked = achievements.some(a => a.badgeKey === template.key);
            return (
              <div
                key={template.key}
                className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50 to-white border-amber-300 shadow-md ring-2 ring-amber-100'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${
                    isUnlocked ? 'bg-amber-400 text-white animate-bounce-soft' : 'bg-slate-200 grayscale'
                  }`}
                >
                  {template.emoji}
                </div>

                <div className="space-y-0.5 font-gujarati">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-sm text-slate-900">{template.title}</h3>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{template.desc}</p>
                  <div className="text-[10px] font-bold">
                    {isUnlocked ? (
                      <span className="text-emerald-700">અનલૉક થયેલ ✓</span>
                    ) : (
                      <span className="text-slate-400">લૉક થયેલ 🔒</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
