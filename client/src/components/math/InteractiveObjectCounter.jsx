import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, Sparkles } from 'lucide-react';
import { speakGujarati } from '../../utils/gujaratiAudio';

const GUJARATI_NUM_WORDS = [
  'શૂન્ય', 'એક', 'બે', 'ત્રણ', 'ચાર', 'પાંચ', 'છ', 'સાત', 'આઠ', 'નવ', 'દસ'
];

export default function InteractiveObjectCounter({ maxCount = 5, itemEmoji = '🍎', title = 'વસ્તુઓ પર ક્લિક કરી ગણો' }) {
  const [countedIndices, setCountedIndices] = useState(new Set());

  const handleTapItem = (idx) => {
    const nextSet = new Set(countedIndices);
    if (!nextSet.has(idx)) {
      nextSet.add(idx);
      setCountedIndices(nextSet);
      const currentCount = nextSet.size;
      const word = GUJARATI_NUM_WORDS[currentCount] || String(currentCount);
      speakGujarati(word);

      if (currentCount === maxCount) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {}
        setTimeout(() => {
          speakGujarati(`ખૂબ સરસ! કુલ ${word} વસ્તુઓ છે.`);
        }, 600);
      }
    }
  };

  const handleReset = () => {
    setCountedIndices(new Set());
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-6 rounded-3xl border-2 border-amber-300 shadow-md space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-amber-500 text-white font-bold text-lg shadow-sm">
            🧮
          </span>
          <div>
            <h3 className="font-extrabold text-base md:text-lg text-amber-950 font-gujarati">
              રમતાં રમતાં ગણતરી (Touch & Count)
            </h3>
            <p className="text-xs text-amber-800 font-gujarati">
              દરેક {itemEmoji} પર ટચ કરો અને ગણો!
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 bg-white hover:bg-amber-100 text-amber-800 rounded-xl border border-amber-200 text-xs font-bold font-gujarati flex items-center gap-1 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ફરીથી</span>
        </button>
      </div>

      {/* Tap Items Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-9 gap-3 py-2 justify-items-center">
        {Array.from({ length: maxCount }).map((_, idx) => {
          const isCounted = countedIndices.has(idx);
          return (
            <button
              key={idx}
              onClick={() => handleTapItem(idx)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-3xl sm:text-4xl flex items-center justify-center transition-all shadow-sm active:scale-90 relative ${
                isCounted
                  ? 'bg-emerald-100 border-2 border-emerald-500 ring-4 ring-emerald-200 scale-105 animate-bounce-soft'
                  : 'bg-white border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-100'
              }`}
            >
              <span>{itemEmoji}</span>
              {isCounted && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center font-mono shadow-md">
                  {Array.from(countedIndices).indexOf(idx) + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Count Display */}
      <div className="p-4 bg-white/90 rounded-2xl border border-amber-200 flex items-center justify-between font-gujarati">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">ગણેલી સંખ્યા:</span>
          <span className="text-2xl font-black font-mono text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-xl border border-emerald-200">
            {countedIndices.size}
          </span>
          <span className="text-sm font-bold text-slate-800">
            ({GUJARATI_NUM_WORDS[countedIndices.size] || countedIndices.size})
          </span>
        </div>

        {countedIndices.size === maxCount && (
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>શાબાશ! બધી વસ્તુઓ ગણાઈ ગઈ ⭐</span>
          </span>
        )}
      </div>
    </div>
  );
}
