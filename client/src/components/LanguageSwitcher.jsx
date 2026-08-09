import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-xs active:scale-95 touch-target shrink-0"
      title="Toggle Language / ભાષા બદલો"
    >
      <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span className="hidden sm:inline">{lang === 'gu' ? 'English' : 'ગુજરાતી'}</span>
      <span className="sm:hidden font-mono font-bold uppercase">{lang === 'gu' ? 'EN' : 'ગુ'}</span>
    </button>
  );
}
