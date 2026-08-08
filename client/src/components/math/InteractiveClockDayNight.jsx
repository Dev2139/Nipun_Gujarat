import React, { useState } from 'react';
import { speakGujarati } from '../../utils/gujaratiAudio';
import { Sun, Moon, Sunrise, Sunset, Clock, Sparkles } from 'lucide-react';

const TIME_ACTIVITIES = [
  {
    key: 'morning',
    titleGujarati: 'સવાર (Morning)',
    icon: Sunrise,
    bgClass: 'from-amber-100 to-orange-100 border-amber-300',
    skyEmoji: '🌅',
    activities: ['જાગવું અને દાંત સાફ કરવા 🪥', 'પ્રાર્થના અને કસરત 🧘', 'શાળાએ જવું 🏫'],
    soundPrompt: 'સવારે સૂરજ ઊગે છે. આપણે જાગીએ છીએ અને શાળાએ જઈએ છીએ.'
  },
  {
    key: 'afternoon',
    titleGujarati: 'બપોર (Afternoon)',
    icon: Sun,
    bgClass: 'from-yellow-100 to-amber-200 border-yellow-400',
    skyEmoji: '☀️',
    activities: ['બપોરનું ભોજન લેવું 🍱', 'શાળામાં અભ્યાસ કરવો 📚'],
    soundPrompt: 'બપોરે સૂર્ય માથા પર આવે છે. આપણે બપોરનું ભોજન લઈએ છીએ.'
  },
  {
    key: 'evening',
    titleGujarati: 'સાંજ (Evening)',
    icon: Sunset,
    bgClass: 'from-orange-100 to-rose-200 border-orange-300',
    skyEmoji: '🌇',
    activities: ['મિત્રો સાથે રમતો રમવી ⚽', 'ઘરકામ કરવું 📝'],
    soundPrompt: 'સાંજે સૂર્ય આથમે છે. આપણે મિત્રો સાથે રમતો રમીએ છીએ.'
  },
  {
    key: 'night',
    titleGujarati: 'રાત (Night)',
    icon: Moon,
    bgClass: 'from-slate-800 to-indigo-950 text-white border-slate-700',
    skyEmoji: '🌙',
    activities: ['ચંદ્ર અને તારાઓ જોવા ⭐', 'રાત્રિ ભોજન અને ઊંઘવું 😴'],
    soundPrompt: 'રાત્રે આકાશમાં ચંદ્ર અને તારા ચમકે છે. આપણે સૂઈ જઈએ છીએ.'
  }
];

export default function InteractiveClockDayNight() {
  const [selectedTime, setSelectedTime] = useState(TIME_ACTIVITIES[0]);

  const handleSelectTime = (t) => {
    setSelectedTime(t);
    speakGujarati(t.soundPrompt);
  };

  const Icon = selectedTime.icon;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-indigo-50/50 p-6 rounded-3xl border-2 border-amber-300 shadow-md space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-amber-500 text-white font-bold text-lg shadow-sm">
            ⏰
          </span>
          <div>
            <h3 className="font-extrabold text-base md:text-lg text-slate-900 font-gujarati">
              સમય ચક્ર અને પ્રવૃત્તિઓ (Daily Time Cycle)
            </h3>
            <p className="text-xs text-slate-600 font-gujarati">
              દિવસના જુદા જુદા સમય પર ક્લિક કરો અને પ્રવૃત્તિઓ સમજો
            </p>
          </div>
        </div>
      </div>

      {/* Time Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-gujarati">
        {TIME_ACTIVITIES.map((t) => {
          const isSelected = selectedTime.key === t.key;
          const TIcon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => handleSelectTime(t)}
              className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 shadow-xs active:scale-95 ${
                isSelected
                  ? 'border-emerald-600 bg-white ring-4 ring-emerald-200 scale-105 font-bold'
                  : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
              }`}
            >
              <span className="text-2xl">{t.skyEmoji}</span>
              <span className="text-xs truncate">{t.titleGujarati.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Time Feature Card */}
      <div className={`p-6 rounded-3xl border-2 bg-gradient-to-br ${selectedTime.bgClass} shadow-md space-y-4 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedTime.skyEmoji}</span>
            <div>
              <h4 className="text-xl font-black font-gujarati">
                {selectedTime.titleGujarati}
              </h4>
              <p className="text-xs opacity-80 font-gujarati">
                આ સમયે થતી મુખ્ય પ્રવૃત્તિઓ:
              </p>
            </div>
          </div>
          <Icon className="w-8 h-8 opacity-60" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {selectedTime.activities.map((act, idx) => (
            <div
              key={idx}
              className="p-3 bg-white/90 backdrop-blur-xs text-slate-900 rounded-2xl border border-white/40 shadow-xs font-gujarati font-bold text-xs flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{act}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
