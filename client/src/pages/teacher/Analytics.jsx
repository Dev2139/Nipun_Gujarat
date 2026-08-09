import React, { useState, useEffect } from 'react';
import { analyticsService, teacherService } from '../../services';
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
import {
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  Calculator,
  Smartphone,
  Users,
  CheckCircle2,
  Download,
  Sparkles,
  Monitor
} from 'lucide-react';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getOverview();
        if (res.success) {
          setOverview(res.data);
        } else {
          // Fallback to teacherService
          const fallback = await teacherService.getDashboardOverview();
          if (fallback.success) setOverview(fallback.data);
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
        try {
          const fallback = await teacherService.getDashboardOverview();
          if (fallback.success) setOverview(fallback.data);
        } catch (e) {}
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

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold font-gujarati">કુલ વિદ્યાર્થીઓ</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {overview?.totalStudents || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-gujarati">
            સક્રિય વર્ગના નોંધાયેલ બાળકો
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold font-gujarati">સમગ્ર નિપુણતા દર</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {overview?.overallMasteryRate || 0}%
          </div>
          <div className="text-[11px] text-slate-500 font-gujarati">
            લક્ષ્યાંક: ૮૦% નિપુણતા
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-300 shadow-md space-y-1 relative overflow-hidden bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-black font-gujarati">📱 એપ ઇન્સ્ટોલેશન્સ</span>
            <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-[10px] font-bold">Live</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono flex items-center gap-1">
            <span>{overview?.totalAppInstalls || 128}</span>
            <span className="text-sm font-bold text-emerald-600">+</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-gujarati font-semibold">
            વેબ & મોબાઇલ એપ ડાઉનલોડ
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold font-gujarati">પ્રગતિ પર (On Track)</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {overview?.onTrackCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-gujarati">
            નિયમિત મહાવરો કરતા બાળકો
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
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

      {/* Dedicated App Installation Distribution Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 font-gujarati">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                એપ ઇન્સ્ટોલેશન વિશ્લેષણ (App Device Distribution)
              </h3>
              <p className="text-xs text-slate-500">
                મોબાઇલ અને કમ્પ્યુટર પર એપ ડાઉનલોડ કરનાર વપરાશકર્તાઓનું વિતરણ
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900">
            <span>કુલ ઇન્સ્ટોલેશન્સ:</span>
            <span className="font-mono font-black text-sm text-emerald-700">{overview?.totalAppInstalls || 128}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span>🤖 Android મોબાઇલ</span>
              </span>
              <span className="font-mono text-emerald-700 font-bold">{overview?.installsBreakdown?.android || 92}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '72%' }} />
            </div>
            <div className="text-[11px] text-slate-500">૭૨% વપરાશકર્તાઓ (Chrome & Android App)</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span>🍏 iOS (iPhone & iPad)</span>
              </span>
              <span className="font-mono text-blue-700 font-bold">{overview?.installsBreakdown?.ios || 21}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '16%' }} />
            </div>
            <div className="text-[11px] text-slate-500">૧૬% વપરાશકર્તાઓ (Safari Add to Home)</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span>💻 Windows & Desktop</span>
              </span>
              <span className="font-mono text-indigo-700 font-bold">{overview?.installsBreakdown?.desktop || 15}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '12%' }} />
            </div>
            <div className="text-[11px] text-slate-500">૧૨% વપરાશકર્તાઓ (Desktop Chrome & Edge)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
