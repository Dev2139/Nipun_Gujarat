import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import TeacherNoteModal from '../../components/TeacherNoteModal';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calculator,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Note modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentForNote, setSelectedStudentForNote] = useState(null);

  const fetchDashboardData = async (classId = '') => {
    try {
      setLoading(true);
      const [classesRes, overviewRes] = await Promise.all([
        teacherService.getClasses(),
        teacherService.getDashboardOverview(classId),
      ]);

      if (classesRes.success) {
        setClasses(classesRes.data);
      }
      if (overviewRes.success) {
        setOverview(overviewRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedClassId);
  }, [selectedClassId]);

  const handleOpenNote = (item) => {
    setSelectedStudentForNote(item);
    setModalOpen(true);
  };

  const pieData = overview ? [
    { name: 'નિપુણ (Mastered 80-100%)', value: overview.performanceBands?.mastered || 0, color: '#10b981' },
    { name: 'પ્રગતિશીલ (Developing 31-79%)', value: overview.performanceBands?.developing || 0, color: '#f59e0b' },
    { name: 'વિશેષ મદદ (Emerging 0-30%)', value: overview.performanceBands?.emerging || 0, color: '#ef4444' },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header with Welcome and Class Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
              {t('welcomeTeacher')}, {user?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-gujarati mt-1">
            {user?.schoolName} • શૈક્ષણિક વર્ષ: ૨૦૨૬-૨૭
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-gujarati text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">બધા વર્ગો (All Classes)</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} ({cls.grade} - {cls.section})
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchDashboardData(selectedClassId)}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3-Second Instant UX Metrics Answer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Students */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-gujarati">
              ૧. કુલ વિદ્યાર્થીઓ
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {overview?.totalStudents || 0}
          </div>
          <div className="text-xs text-slate-500 font-gujarati">
            કુલ નોંધાયેલા વિદ્યાર્થીઓ
          </div>
        </div>

        {/* Metric 2: Mastered */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-gujarati">
              ૨. નિપુણ (Mastered)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            {overview?.masteredCount || 0}
          </div>
          <div className="text-xs text-emerald-600 font-gujarati font-semibold">
            FLN ક્ષમતાઓ પૂર્ણ કરેલ
          </div>
        </div>

        {/* Metric 3: On Track */}
        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 font-gujarati">
              પ્રગતિશીલ (On Track)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-700 font-mono">
            {overview?.onTrackCount || 0}
          </div>
          <div className="text-xs text-amber-600 font-gujarati font-semibold">
            યોગ્ય ગતિએ શીખી રહ્યા છે
          </div>
        </div>

        {/* Metric 4: Needs Teacher Attention */}
        <div className="bg-gradient-to-br from-rose-50 to-red-50 p-5 rounded-3xl border-2 border-rose-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 font-gujarati">
              ૩. વિશેષ મદદની જરૂર ⚠
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs animate-bounce">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-800 font-mono">
            {overview?.needsSupportCount || 0}
          </div>
          <div className="text-xs text-rose-700 font-gujarati font-bold">
            ધ્યાન આપવા યોગ્ય વિદ્યાર્થીઓ
          </div>
        </div>
      </div>

      {/* Critical UX List: Students Needing Attention (Intervention Queue) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              ⚠
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-gujarati">
                ધ્યાન આપવા યોગ્ય વિદ્યાર્થીઓ (Students Needing Teacher Attention)
              </h2>
              <p className="text-xs text-slate-500 font-gujarati">
                જે વિદ્યાર્થીઓ ૨ કે તેથી વધુ વખત કસોટીમાં નિષ્ફળ ગયા હોય તેમના માટે ઉપચારાત્મક સહાય
              </p>
            </div>
          </div>

          <Link
            to="/teacher/interventions"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 font-gujarati"
          >
            <span>બધા જુઓ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {overview?.studentsNeedingAttention?.length === 0 ? (
          <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-center text-xs font-bold text-emerald-800 font-gujarati flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ખૂબ સરસ! હાલમાં કોઈ વિદ્યાર્થીને તાત્કાલિક હસ્તક્ષેપની જરૂર નથી.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs font-gujarati">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100 pb-2">
                  <th className="py-2">વિદ્યાર્થી (Student)</th>
                  <th className="py-2">વિષય (Subject)</th>
                  <th className="py-2">ક્ષમતા (Competency)</th>
                  <th className="py-2">પ્રયત્નો (Attempts)</th>
                  <th className="py-2">છેલ્લો સ્કોર</th>
                  <th className="py-2 text-right">ક્રિયા (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overview?.studentsNeedingAttention?.map((st, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-slate-900">
                      <Link to={`/teacher/students/${st.studentId}`} className="hover:text-emerald-700">
                        {st.studentName} <span className="font-mono text-slate-400 font-normal">({st.studentUid})</span>
                      </Link>
                    </td>
                    <td className="py-3 font-semibold capitalize">
                      {st.subject === 'gujarati' ? '📖 ગુજરાતી' : '🔢 ગણિત'}
                    </td>
                    <td className="py-3 font-medium text-slate-700">
                      <span className="font-mono font-bold text-emerald-700 mr-1">{st.competencyCode}:</span>
                      {st.competencyTitleGujarati}
                    </td>
                    <td className="py-3 font-mono font-bold text-rose-600">
                      {st.attempts} વખત
                    </td>
                    <td className="py-3 font-mono font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        {st.latestScore}%
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenNote(st)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs active:scale-95 inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>નોંધ ઉમેરો</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Progress Charts & Subject Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Rates */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 font-gujarati flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>વિષયવાર નિપુણતા દર (Subject Mastery Rate)</span>
          </h3>

          <div className="space-y-4 pt-2 font-gujarati">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">📖 ગુજરાતી (Gujarati)</span>
                <span className="font-mono font-bold text-emerald-700">{overview?.gujaratiMasteryRate || 0}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${overview?.gujaratiMasteryRate || 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">🔢 ગણિત (Mathematics)</span>
                <span className="font-mono font-bold text-blue-700">{overview?.mathMasteryRate || 0}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${overview?.mathMasteryRate || 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">🎯 સમગ્ર વર્ગ પ્રગતિ (Overall Progress)</span>
                <span className="font-mono font-bold text-teal-700">{overview?.overallMasteryRate || 0}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${overview?.overallMasteryRate || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Nipun Performance Bands Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 font-gujarati flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>FLN પ્રદર્શન શ્રેણીઓ (Nipun Performance Bands)</span>
          </h3>

          <div className="h-44 flex items-center justify-center">
            {pieData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 font-gujarati">ડેટા ઉપલબ્ધ નથી</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-gujarati font-bold pt-1">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <div>{overview?.performanceBands?.mastered || 0}</div>
              <div className="text-[10px] font-normal">નિપુણ (≥80%)</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <div>{overview?.performanceBands?.developing || 0}</div>
              <div className="text-[10px] font-normal">પ્રગતિશીલ (31-79%)</div>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800">
              <div>{overview?.performanceBands?.emerging || 0}</div>
              <div className="text-[10px] font-normal">ઉદયમાન (0-30%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Note Modal */}
      <TeacherNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudentForNote}
        competencyCode={selectedStudentForNote?.competencyCode}
        onSaved={() => fetchDashboardData(selectedClassId)}
      />
    </div>
  );
}
