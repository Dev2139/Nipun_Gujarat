import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import GujaratiVoiceButton from '../components/GujaratiVoiceButton';
import { Sparkles, ArrowRight, UserCheck, KeyRound } from 'lucide-react';

export default function StudentLogin() {
  const [uid, setUid] = useState('NG-2026-001');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginStudent } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!uid.trim()) {
      setError('કૃપા કરીને તમારો UID નંબર દાખલ કરો.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await loginStudent(uid);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'આ UID વાળો વિદ્યાર્થી મળ્યો નથી. તમારા શિક્ષકનો સંપર્ક કરો.');
    } finally {
      setLoading(false);
    }
  };

  const sampleStudents = [
    { name: 'રવિ પટેલ (Ravi)', uid: 'NG-2026-001', grade: 'ધોરણ ૧', emoji: '👦' },
    { name: 'કૃષા શાહ (Krisha)', uid: 'NG-2026-002', grade: 'ધોરણ ૧', emoji: '👧' },
    { name: 'આરવ પટેલ (Aarav)', uid: 'NG-2026-003', grade: 'ધોરણ ૧', emoji: '👦' },
    { name: 'દિયા પ્રજાપતિ (Diya)', uid: 'NG-2026-004', grade: 'ધોરણ ૧', emoji: '👧' },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-emerald-200 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white text-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
            🧒
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
            વિદ્યાર્થી પ્રવેશ 🚀
          </h2>
          <p className="text-xs text-slate-500 font-gujarati">
            તમારો UID નંબર લખો અને શીખવાનું શરૂ કરો!
          </p>
          <div className="pt-1">
            <GujaratiVoiceButton
              text="તમારો યૂ આઈ ડી નંબર લખો અને આગળ વધો"
              label="સૂચના સાંભળો"
              size="sm"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-gujarati">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 font-gujarati">
              વિદ્યાર્થી UID નંબર (Student UID)
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-emerald-600 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value.toUpperCase())}
                placeholder="દા.ત. NG-2026-001"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 text-lg font-black font-mono tracking-wider text-slate-900 bg-emerald-50/30 uppercase"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all font-gujarati flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'તપાસી રહ્યા છીએ...' : 'ચાલો શીખીએ (Start Learning) ▶'}</span>
          </button>
        </form>

        {/* Quick Demo Pickers for Children / Testing */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <p className="text-xs font-bold text-slate-600 font-gujarati text-center">
            અથવા ડેમો વિદ્યાર્થી પસંદ કરો:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {sampleStudents.map((st) => (
              <button
                key={st.uid}
                type="button"
                onClick={() => setUid(st.uid)}
                className={`p-2.5 rounded-xl border text-left transition-all font-gujarati text-xs flex items-center gap-2 ${
                  uid === st.uid
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300 font-bold'
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

        <div className="text-center pt-2">
          <Link
            to="/login/teacher"
            className="text-xs text-slate-500 hover:text-emerald-700 font-gujarati"
          >
            શિક્ષક છો? અહીંથી પાસવર્ડ વડે લૉગિન કરો &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
