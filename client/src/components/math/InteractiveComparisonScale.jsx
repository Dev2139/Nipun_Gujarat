import React, { useState } from 'react';
import { speakGujarati } from '../../utils/gujaratiAudio';
import { Sparkles, Scale, RotateCcw } from 'lucide-react';

export default function InteractiveComparisonScale({
  items = [
    { name: 'હાથી (Elephant)', emoji: '🐘', weight: 100, label: 'સૌથી મોટો / ભારે' },
    { name: 'બિલાડી (Cat)', emoji: '🐈', weight: 20, label: 'મધ્યમ' },
    { name: 'ઉંદર (Mouse)', emoji: '🐁', weight: 2, label: 'સૌથી નાનો / હલકો' },
  ],
  mode = 'size' // 'size' | 'weight' | 'numbers'
}) {
  const [leftItem, setLeftItem] = useState(items[0]);
  const [rightItem, setRightItem] = useState(items[2]);

  const handleSelectLeft = (it) => {
    setLeftItem(it);
    compareAnnouncement(it, rightItem);
  };

  const handleSelectRight = (it) => {
    setRightItem(it);
    compareAnnouncement(leftItem, it);
  };

  const compareAnnouncement = (left, right) => {
    if (!left || !right) return;
    if (left.weight > right.weight) {
      speakGujarati(`${left.name} એ ${right.name} કરતાં ${mode === 'weight' ? 'ભારે' : 'મોટું'} છે.`);
    } else if (left.weight < right.weight) {
      speakGujarati(`${right.name} એ ${left.name} કરતાં ${mode === 'weight' ? 'ભારે' : 'મોટું'} છે.`);
    } else {
      speakGujarati(`બંને સરખા છે.`);
    }
  };

  // Tilt angle calculation
  const diff = (leftItem?.weight || 0) - (rightItem?.weight || 0);
  const tiltDeg = Math.max(-15, Math.min(15, diff * 0.4));

  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50/60 p-6 rounded-3xl border-2 border-teal-300 shadow-md space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-teal-600 text-white font-bold text-lg shadow-sm">
            ⚖️
          </span>
          <div>
            <h3 className="font-extrabold text-base md:text-lg text-teal-950 font-gujarati">
              ઇન્ટરેક્ટિવ સરખામણી ત્રાજવું (Interactive Scale)
            </h3>
            <p className="text-xs text-teal-800 font-gujarati">
              વસ્તુઓ બદલીને સરખામણી જુઓ અને સાંભળો
            </p>
          </div>
        </div>
      </div>

      {/* Visual Balance Scale Representation */}
      <div className="bg-white/80 p-6 rounded-3xl border border-teal-200 shadow-xs relative overflow-hidden flex flex-col items-center">
        {/* Scale Beam */}
        <div
          className="w-64 sm:w-80 h-3 bg-amber-700 rounded-full transition-transform duration-500 ease-out flex items-center justify-between px-4 relative shadow-sm"
          style={{ transform: `rotate(${-tiltDeg}deg)` }}
        >
          {/* Fulcrum indicator */}
          <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-4 h-4 bg-amber-900 rounded-full"></div>

          {/* Left Pan */}
          <div className="flex flex-col items-center -translate-y-2">
            <div className="w-0.5 h-12 bg-amber-600"></div>
            <div className="w-24 h-14 bg-teal-100 border-2 border-teal-500 rounded-b-3xl flex items-center justify-center text-3xl shadow-sm">
              {leftItem?.emoji}
            </div>
            <span className="text-[11px] font-bold font-gujarati text-slate-800 mt-1">
              {leftItem?.name?.split(' ')[0]}
            </span>
          </div>

          {/* Right Pan */}
          <div className="flex flex-col items-center -translate-y-2">
            <div className="w-0.5 h-12 bg-amber-600"></div>
            <div className="w-24 h-14 bg-teal-100 border-2 border-teal-500 rounded-b-3xl flex items-center justify-center text-3xl shadow-sm">
              {rightItem?.emoji}
            </div>
            <span className="text-[11px] font-bold font-gujarati text-slate-800 mt-1">
              {rightItem?.name?.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Scale Base Triangle */}
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[36px] border-b-amber-800 mt-8"></div>
        <div className="w-32 h-3 bg-amber-950 rounded-full shadow-xs"></div>
      </div>

      {/* Item Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-gujarati text-xs">
        <div className="p-3 bg-white rounded-2xl border border-teal-200 space-y-2">
          <span className="font-bold text-teal-900">ડાબી બાજુ પસંદ કરો:</span>
          <div className="flex gap-2">
            {items.map((it, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLeft(it)}
                className={`p-2 rounded-xl border flex-1 text-center font-bold transition-all ${
                  leftItem?.name === it.name
                    ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 hover:bg-teal-50 text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-xl">{it.emoji}</div>
                <div className="truncate text-[10px]">{it.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-teal-200 space-y-2">
          <span className="font-bold text-teal-900">જમણી બાજુ પસંદ કરો:</span>
          <div className="flex gap-2">
            {items.map((it, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectRight(it)}
                className={`p-2 rounded-xl border flex-1 text-center font-bold transition-all ${
                  rightItem?.name === it.name
                    ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 hover:bg-teal-50 text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-xl">{it.emoji}</div>
                <div className="truncate text-[10px]">{it.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Text Output */}
      <div className="p-3.5 bg-white rounded-2xl border border-teal-200 text-center font-gujarati text-sm font-bold text-teal-950">
        {leftItem && rightItem && (
          <span>
            {leftItem.weight > rightItem.weight
              ? `👉 ${leftItem.name} ${mode === 'weight' ? 'ભારે' : 'મોટું'} છે, ${rightItem.name} ${mode === 'weight' ? 'હલકું' : 'નાનું'} છે!`
              : leftItem.weight < rightItem.weight
              ? `👉 ${rightItem.name} ${mode === 'weight' ? 'ભારે' : 'મોટું'} છે, ${leftItem.name} ${mode === 'weight' ? 'હલકું' : 'નાનું'} છે!`
              : `👉 બંને વસ્તુઓનું વજન/કદ એકસમાન છે!`}
          </span>
        )}
      </div>
    </div>
  );
}
