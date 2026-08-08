import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { GraduationCap, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TeacherLogin() {
  const [identifier, setIdentifier] = useState('teacher@nipun.gujarat.gov.in');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginTeacher } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('કૃપા કરીને ઈમેલ/શિક્ષક આઈડી અને પાસવર્ડ દાખલ કરો.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await loginTeacher(identifier, password);
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'લૉગિન કરવામાં નિષ્ફળતા. કૃપા કરીને વિગતો ચકાસો.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoTeacher = () => {
    setIdentifier('teacher@nipun.gujarat.gov.in');
    setPassword('Password@123');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-gujarati">
            શિક્ષક પોર્ટલ પ્રવેશ
          </h2>
          <p className="text-xs text-slate-500 font-gujarati">
            Nipun Gujarat / FLN શિક્ષક લૉગિન
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-gujarati">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-gujarati">
              ઈમેલ અથવા શિક્ષક ID (Email / Teacher ID)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="teacher@nipun.gujarat.gov.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-gujarati">
              પાસવર્ડ (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all text-sm font-gujarati flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'પ્રવેશ કરી રહ્યા છીએ...' : 'લૉગિન કરો (Sign In)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5 text-center text-xs">
          <button
            type="button"
            onClick={fillDemoTeacher}
            className="text-emerald-700 font-bold hover:underline font-gujarati"
          >
            ✨ ડેમો શિક્ષક વિગતો ભરો (Fill Demo Teacher)
          </button>

          <Link
            to="/login/student"
            className="text-slate-500 hover:text-slate-800 font-gujarati"
          >
            વિદ્યાર્થી છો? અહીંથી UID દ્વારા લૉગિન કરો &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
