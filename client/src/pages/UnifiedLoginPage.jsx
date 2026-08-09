import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { usePWA } from '../context/PWAContext';
import GujaratiVoiceButton from '../components/GujaratiVoiceButton';
import {
  GraduationCap,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  BookOpen
} from 'lucide-react';

export default function UnifiedLoginPage() {
  const { user, role, loginStudent, loginTeacher, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { installCount, realStats } = usePWA();
  const navigate = useNavigate();

  // Active Tab: 'student' | 'teacher'
  const [activeTab, setActiveTab] = useState('student');

  // Student State
  const [studentUid, setStudentUid] = useState('NG-2026-001');
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState('');
  const [availableStudents, setAvailableStudents] = useState([]);

  // Teacher State
  const [teacherEmail, setTeacherEmail] = useState('teacher@nipun.gujarat.gov.in');
  const [teacherPassword, setTeacherPassword] = useState('Password@123');
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherError, setTeacherError] = useState('');

  // Fetch available students from DB
  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/auth/students');
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setAvailableStudents(json.data);
          if (!studentUid) {
            setStudentUid(json.data[0].uid);
          }
        }
      } catch (err) {
        console.error('Error fetching students for quick select:', err);
      }
    };
    fetchStudents();
  }, []);

  // If already authenticated, redirect straight to the appropriate dashboard
  if (user) {
    if (role === 'Teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
    if (role === 'Student') {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  // Handle Student Login
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!studentUid.trim()) {
      setStudentError('કૃપા કરીને તમારો UID નંબર દાખલ કરો.');
      return;
    }

    try {
      setStudentLoading(true);
      setStudentError('');
      await loginStudent(studentUid);
      navigate('/student/dashboard');
    } catch (err) {
      setStudentError(err.response?.data?.message || 'આ UID વાળો વિદ્યાર્થી મળ્યો નથી. તમારા શિક્ષકનો સંપર્ક કરો.');
    } finally {
      setStudentLoading(false);
    }
  };

  // Handle Teacher Login
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    if (!teacherEmail || !teacherPassword) {
      setTeacherError('કૃપા કરીને ઈમેલ અને પાસવર્ડ દાખલ કરો.');
      return;
    }

    try {
      setTeacherLoading(true);
      setTeacherError('');
      await loginTeacher(teacherEmail, teacherPassword);
      navigate('/teacher/dashboard');
    } catch (err) {
      setTeacherError(err.response?.data?.message || 'લૉગિન કરવામાં નિષ્ફળતા. કૃપા કરીને વિગતો ચકાસો.');
    } finally {
      setTeacherLoading(false);
    }
  };

  const defaultStudents = [
    { name: 'રવિ પટેલ (Ravi)', uid: 'NG-2026-001', grade: 'ધોરણ ૧', emoji: '👦' },
    { name: 'કૃષા શાહ (Krisha)', uid: 'NG-2026-002', grade: 'ધોરણ ૧', emoji: '👧' },
    { name: 'આરવ પટેલ (Aarav)', uid: 'NG-2026-003', grade: 'ધોરણ ૧', emoji: '👦' },
    { name: 'યશ ચૌહાણ (Yash)', uid: 'NG-2026-005', grade: 'બાલવાટિકા', emoji: '👦' },
  ];

  const studentsToShow = availableStudents.length > 0
    ? availableStudents.map(s => ({
        name: s.name,
        uid: s.uid,
        grade: s.grade,
        emoji: s.gender === 'Girl' || s.gender === 'કન્યા' ? '👧' : '👦'
      }))
    : defaultStudents;


  return (
    <div className="min-h-[calc(100dvh-5rem)] flex items-center justify-center p-3 sm:p-4 md:p-6 font-gujarati">
      <div className="max-w-md w-full bg-white rounded-3xl p-5 sm:p-8 border-2 border-emerald-200 shadow-2xl space-y-6">
        
        {/* App Title Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-700 text-white text-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
            🎯
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              નિપુણ ગુજરાત
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              પાયાની સાક્ષરતા અને સંખ્યાજ્ઞાન એપ્લિકેશન
            </p>
          </div>

          {/* Live Real Device App Downloads Counter Badge */}
          <div className="pt-1 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-full text-xs font-bold shadow-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span>📲 {realStats?.totalAppInstalls || installCount || 0} ઉપકરણો પર એપ ડાઉનલોડ થયેલ (App Downloads)</span>
            </div>
          </div>
        </div>

        {/* School Attribution Dedicated Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 border-2 border-amber-400 text-white rounded-2xl p-4 text-center space-y-1 shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
          <div className="text-sm sm:text-base font-black text-amber-300 flex items-center justify-center gap-1.5 drop-shadow-xs">
            <span>🏫 શ્રી જડિયાણા પ્રાથમિક શાળા</span>
          </div>
          <div className="text-xs font-bold text-emerald-200 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>છોટાઉદેપુર (Chhota Udepur)</span>
          </div>
        </div>

        {/* Native App-Style Role Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-base">🧒</span>
            <span>વિદ્યાર્થી પ્રવેશ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teacher')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'teacher'
                ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>શિક્ષક પ્રવેશ</span>
          </button>
        </div>

        {/* TAB 1: STUDENT UID LOGIN */}
        {activeTab === 'student' && (
          <div className="space-y-5 animate-in fade-in-50 duration-200">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>કોઈ પાસવર્ડની જરૂર નથી</span>
              </div>
              <div className="pt-1">
                <GujaratiVoiceButton
                  text="તમારો યૂ આઈ ડી નંબર લખો અને શીખવાનું શરૂ કરો"
                  label="સૂચના સાંભળો"
                  size="sm"
                />
              </div>
            </div>

            {studentError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold">
                {studentError}
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  વિદ્યાર્થી UID નંબર (Student UID)
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-emerald-600 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={studentUid}
                    onChange={(e) => setStudentUid(e.target.value.toUpperCase())}
                    placeholder="દા.ત. NG-2026-001"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 text-lg font-black font-mono tracking-wider text-slate-900 bg-emerald-50/30 uppercase"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={studentLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{studentLoading ? 'તપાસી રહ્યા છીએ...' : 'ચાલો શીખીએ (Start Learning) ▶'}</span>
              </button>
            </form>

            {/* Quick Demo Pickers for Children / Fast Testing */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold text-slate-500 text-center">
                વિદ્યાર્થી પસંદ કરો અથવા ઉપર UID લખો:
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {studentsToShow.map((st) => (
                  <button
                    key={st.uid}
                    type="button"
                    onClick={() => setStudentUid(st.uid)}
                    className={`p-2 rounded-xl border text-left transition-all text-xs flex items-center gap-2 ${
                      studentUid === st.uid
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300 font-bold text-slate-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-base">{st.emoji}</span>
                    <div className="truncate">
                      <div className="font-bold truncate">{st.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{st.uid}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEACHER EMAIL/PASSWORD LOGIN */}
        {activeTab === 'teacher' && (
          <div className="space-y-4 animate-in fade-in-50 duration-200">
            <div className="text-center space-y-0.5">
              <h2 className="text-base font-black text-slate-800">
                શિક્ષક ડેશબોર્ડ પ્રવેશ
              </h2>
              <p className="text-[11px] text-slate-400">
                વર્ગ ડિજિટલ ટ્રેકર અને પ્રગતિ મોનિટરિંગ
              </p>
            </div>

            {teacherError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold">
                {teacherError}
              </div>
            )}

            <form onSubmit={handleTeacherSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ઈમેલ અથવા શિક્ષક ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    placeholder="teacher@nipun.gujarat.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  પાસવર્ડ (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={teacherLoading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{teacherLoading ? 'પ્રવેશ કરી રહ્યા છીએ...' : 'લૉગિન કરો (Sign In)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setTeacherEmail('teacher@nipun.gujarat.gov.in');
                  setTeacherPassword('Password@123');
                }}
                className="text-emerald-700 font-bold hover:underline text-xs"
              >
                ✨ ડેમો શિક્ષક વિગતો ભરો (Fill Demo Teacher)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
