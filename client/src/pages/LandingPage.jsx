import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  Calculator,
  Award,
  CheckCircle2,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  const { t, lang } = useLanguage();

  const steps = [
    { num: '૧', title: 'શીખો (Learn)', desc: 'સરળ ભાષા, ચિત્રો અને અવાજ સાથે દરેક ક્ષમતા સમજો.', emoji: '📖' },
    { num: '૨', title: 'મહાવરો (Practice)', desc: 'ક્લિક અને ટચ આધારિત મનોરંજક પ્રવૃત્તિઓથી પ્રેક્ટિસ કરો.', emoji: '✏️' },
    { num: '૩', title: 'કસોટી (Test)', desc: 'પોતાના જ્ઞાનનું મૂલ્યાંકન કરવા કસોટી આપો.', emoji: '🎯' },
    { num: '૪', title: 'નિપુણ (Mastery)', desc: '૮૦% કે તેથી વધુ ગુણ સાથે આગળનું પગલું અનલૉક કરો.', emoji: '⭐' },
    { num: '૫', title: 'ટ્રેકિંગ (Tracking)', desc: 'શિક્ષક ડિજિટલ ટ્રેકરમાં વિદ્યાર્થીની સાચી પ્રગતિ જુએ છે.', emoji: '📊' },
  ];

  return (
    <div className="space-y-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 font-bold text-xs shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>FLN 2026-27 • ગુજરાત સરકાર શિક્ષણ વિભાગ પ્રેરિત</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 font-gujarati tracking-tight leading-tight">
          નિપુણ ગુજરાત <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            પાયાની સાક્ષરતા અને સંખ્યાજ્ઞાન
          </span>
        </h1>

        <p className="text-base md:text-xl text-slate-600 max-w-3xl mx-auto font-gujarati font-medium">
          બાલવાટિકા, ધોરણ ૧ અને ૨ ના બાળકો માટે ક્રમિક અધ્યયન, મહાવરો, મૂલ્યાંકન અને જીવંત ડિજિટલ ટ્રેકિંગ પ્લેટફોર્મ.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/login/student"
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all flex items-center gap-2 font-gujarati"
          >
            <span>વિદ્યાર્થી પ્રવેશ (UID થી લૉગિન)</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login/teacher"
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 font-extrabold text-base md:text-lg rounded-2xl shadow-md active:scale-95 transition-all flex items-center gap-2 font-gujarati"
          >
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span>શિક્ષક પ્રવેશ (Teacher Portal)</span>
          </Link>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="mt-8 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl max-w-xl mx-auto text-left text-xs space-y-1.5 text-amber-950 font-gujarati shadow-xs">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <span>💡 તુરંત ચકાસણી માટે ડેમો વિગતો:</span>
          </div>
          <div><span className="font-bold">શિક્ષક લૉગિન:</span> <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">teacher@nipun.gujarat.gov.in</code> / પાસવર્ડ: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">Password@123</code></div>
          <div><span className="font-bold">વિદ્યાર્થી UID:</span> <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">NG-2026-001</code> (રવિ), <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">NG-2026-002</code> (કૃષા), <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">NG-2026-003</code> (આરવ)</div>
        </div>
      </section>

      {/* 5-Step Process */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
            નિપુણ ગુજરાત કેવી રીતે કાર્ય કરે છે?
          </h2>
          <p className="text-sm text-slate-600 font-gujarati">
            ક્રમિક અને નિપુણતા આધારિત સરળ શિક્ષણ પદ્ધતિ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center shadow-xs">
                {step.emoji}
              </div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700">
                <span>પગલું {step.num}</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 font-gujarati">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 font-gujarati leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Split for Teachers and Students */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-8 rounded-3xl border border-emerald-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md">
            👨‍🏫
          </div>
          <h3 className="text-2xl font-black text-emerald-950 font-gujarati">
            શિક્ષકો માટે (For Teachers)
          </h3>
          <ul className="space-y-2.5 text-sm text-emerald-900 font-gujarati">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>કાગળના ટ્રેકરનું સંપૂર્ણ ડિજિટાઈઝેશન - વર્ગ હીટમેપ ગ્રીડ.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>૩ સેકન્ડમાં ખ્યાલ આવે કે કયા વિદ્યાર્થીઓને વિશેષ મદદની જરૂર છે.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>સિંગલ ક્લિક CSV અને PDF રિપોર્ટ નિકાસ.</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              to="/login/teacher"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              શિક્ષક ડેશબોર્ડ ખોલો &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 rounded-3xl border border-blue-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md">
            🧒
          </div>
          <h3 className="text-2xl font-black text-blue-950 font-gujarati">
            વિદ્યાર્થીઓ માટે (For Students)
          </h3>
          <ul className="space-y-2.5 text-sm text-blue-900 font-gujarati">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>સરળ UID લૉગિન - કોઈ પાસવર્ડ યાદ રાખવાની જરૂર નથી.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>મોટા અક્ષરો, રંગબેરંગી ચિત્રો અને ગુજરાતી અવાજ સાથે શીખો.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span>તારા, સ્ટ્રીક અને ચેમ્પિયન બેજ મેળવવાની મજા.</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              to="/login/student"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 underline"
            >
              વિદ્યાર્થી લૉગિન કરો &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
