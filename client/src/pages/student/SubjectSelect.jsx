import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calculator, Sparkles, ArrowRight } from 'lucide-react';

export default function SubjectSelect() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          વિષય પસંદ કરો (Select Subject) 📚
        </h1>
        <p className="text-xs text-slate-500 font-gujarati">
          તમે કયો વિષય શીખવા માંગો છો?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Gujarati Card */}
        <Link
          to="/student/path/gujarati"
          className="bg-gradient-to-br from-emerald-50 to-teal-100/60 p-8 rounded-3xl border-2 border-emerald-300 shadow-md hover:shadow-xl transition-all space-y-4 group active:scale-95"
        >
          <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
            📖
          </div>
          <div>
            <h2 className="text-2xl font-black text-emerald-950 font-gujarati">
              ગુજરાતી ભાષા (Gujarati)
            </h2>
            <p className="text-xs text-emerald-800 font-gujarati mt-1 leading-relaxed">
              મૌખિક ભાષા વિકાસ, મૂળાક્ષરો (ગ, મ, ન, જ, વ, ર, સ, દ), કાના-માત્રા અને જોડાક્ષરોનું વાચન-લેખન.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2 font-bold text-emerald-700 text-sm font-gujarati">
            <span>અધ્યયન માર્ગ ખોલો ▶</span>
          </div>
        </Link>

        {/* Mathematics Card */}
        <Link
          to="/student/path/mathematics"
          className="bg-gradient-to-br from-blue-50 to-indigo-100/60 p-8 rounded-3xl border-2 border-blue-300 shadow-md hover:shadow-xl transition-all space-y-4 group active:scale-95"
        >
          <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
            🔢
          </div>
          <div>
            <h2 className="text-2xl font-black text-blue-950 font-gujarati">
              ગણિત (Mathematics)
            </h2>
            <p className="text-xs text-blue-800 font-gujarati mt-1 leading-relaxed">
              તુલના, ૧ થી ૧૦૦ સુધીનું સંખ્યાજ્ઞાન, સરવાળા, બાદબાકી, ઘડિયા અને વ્યવહારુ કોયડા.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2 font-bold text-blue-700 text-sm font-gujarati">
            <span>અધ્યયન માર્ગ ખોલો ▶</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
