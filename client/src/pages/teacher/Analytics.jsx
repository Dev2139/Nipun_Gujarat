import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Award, BookOpen, Calculator } from 'lucide-react';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await teacherService.getDashboardOverview();
        if (res.success) {
          setOverview(res.data);
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const subjectData = overview ? [
    { subject: 'ગુજરાતી (Gujarati)', masteryRate: overview.gujaratiMasteryRate, target: 80 },
    { subject: 'ગણિત (Mathematics)', masteryRate: overview.mathMasteryRate, target: 80 },
    { subject: 'સમગ્ર (Overall FLN)', masteryRate: overview.overallMasteryRate, target: 80 },
  ] : [];

  const bandData = overview ? [
    { name: '૦ થી ૩૦% (ઉદયમાન - Emerging)', count: overview.performanceBands?.emerging || 0, color: '#ef4444' },
    { name: '૩૧ થી ૭૯% (પ્રગતિશીલ - Developing)', count: overview.performanceBands?.developing || 0, color: '#f59e0b' },
    { name: '૮૦ થી ૧૦૦% (નિપુણ - Mastered)', count: overview.performanceBands?.mastered || 0, color: '#10b981' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-gujarati">
              FLN પ્રગતિ વિશ્લેષણ (Progress Analytics)
            </h1>
            <p className="text-xs text-slate-500 font-gujarati mt-0.5">
              નિપુણ ગુજરાત માપદંડો મુજબ વર્ગ અને વિષયવાર સિદ્ધિ વિશ્લેષણ
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Comparison Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 font-gujarati flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>વિષયવાર નિપુણતા દર (%) વિરુદ્ધ લક્ષ્યાંક</span>
          </h3>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="subject" tick={{ fontSize: 11, fontFamily: 'Noto Sans Gujarati' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Noto Sans Gujarati' }} />
                <Bar dataKey="masteryRate" name="હાલનો નિપુણતા દર (%)" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" name="FLN લક્ષ્યાંક (80%)" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nipun Performance Bands Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 font-gujarati flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>પ્રદર્શન શ્રેણી મુજબ વિદ્યાર્થીઓનું વિતરણ</span>
          </h3>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bandData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: 'Noto Sans Gujarati' }} width={160} />
                <Tooltip />
                <Bar dataKey="count" name="વિદ્યાર્થીઓની સંખ્યા" radius={[0, 8, 8, 0]}>
                  {bandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
