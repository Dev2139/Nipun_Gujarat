import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-sm active:scale-95"
      title="Toggle Language / ભાષા બદલો"
    >
      <Globe className="w-3.5 h-3.5 text-emerald-600" />
      <span>{lang === 'gu' ? 'English' : 'ગુજરાતી'}</span>
    </button>
  );
}
