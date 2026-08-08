import React, { useState } from 'react';
import { speakGujarati } from '../../utils/gujaratiAudio';
import { Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveNumberLine({ startNumber = 5, maxRange = 12 }) {
  const [currentPosition, setCurrentPosition] = useState(startNumber);
  const [history, setHistory] = useState([startNumber]);

  const handleHopForward = () => {
    if (currentPosition < maxRange) {
      const nextPos = currentPosition + 1;
      setCurrentPosition(nextPos);
      setHistory(prev => [...prev, nextPos]);
      speakGujarati(`${currentPosition} વત્તા એક બરાબર ${nextPos}`);
    }
  };

  const handleHopBackward = () => {
    if (currentPosition > 0) {
      const nextPos = currentPosition - 1;
      setCurrentPosition(nextPos);
      setHistory(prev => [...prev, nextPos]);
      speakGujarati(`${currentPosition} ઓછા એક બરાબર ${nextPos}`);
    }
  };

  const handleReset = () => {
    setCurrentPosition(startNumber);
    setHistory([startNumber]);
    speakGujarati(`સંખ્યા પટ્ટી પર પાછા ${startNumber} પર આવ્યા.`);
  };

  const numbers = Array.from({ length: maxRange + 1 }, (_, i) => i);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 rounded-3xl border-2 border-blue-300 shadow-md space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-sm">
            🐸
          </span>
          <div>
            <h3 className="font-extrabold text-base md:text-lg text-blue-950 font-gujarati">
              ઇન્ટરેક્ટિવ સંખ્યા પટ્ટી (Interactive Number Line)
            </h3>
            <p className="text-xs text-blue-800 font-gujarati">
              દેડકાને આગળ-પાછળ કુદાવો અને સરવાળા-બાદબાકી સમજો!
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 bg-white hover:bg-blue-100 text-blue-800 rounded-xl border border-blue-200 text-xs font-bold font-gujarati flex items-center gap-1 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ફરીથી</span>
        </button>
      </div>

      {/* Visual Number Line Strip */}
      <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-xs overflow-x-auto">
        <div className="min-w-[500px] flex flex-col items-center py-2">
          {/* Frog Position Above Line */}
          <div className="w-full flex justify-between px-2 mb-2">
            {numbers.map((num) => (
              <div key={num} className="w-10 flex flex-col items-center">
                {currentPosition === num ? (
                  <div className="text-3xl animate-bounce">🐸</div>
                ) : (
                  <div className="h-9"></div>
                )}
              </div>
            ))}
          </div>

          {/* Number Track Bar */}
          <div className="w-full h-3 bg-blue-600 rounded-full flex items-center justify-between px-2 relative">
            {numbers.map((num) => (
              <div
                key={num}
                className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                  currentPosition === num ? 'bg-amber-400 scale-125 ring-4 ring-amber-200' : 'bg-blue-800'
                }`}
              ></div>
            ))}
          </div>

          {/* Number Labels Below Line */}
          <div className="w-full flex justify-between px-2 mt-2">
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => {
                  setCurrentPosition(num);
                  speakGujarati(`સંખ્યા ${num}`);
                }}
                className={`w-10 h-10 rounded-xl font-mono font-bold text-sm flex items-center justify-center transition-all ${
                  currentPosition === num
                    ? 'bg-blue-600 text-white shadow-md scale-110'
                    : 'text-slate-700 hover:bg-blue-50'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hop Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-gujarati">
        <div className="flex items-center gap-2">
          <button
            onClick={handleHopBackward}
            disabled={currentPosition === 0}
            className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 disabled:opacity-40"
          >
            <Minus className="w-4 h-4" />
            <span>૧ કુદકો પાછળ (બાદબાકી)</span>
          </button>

          <button
            onClick={handleHopForward}
            disabled={currentPosition === maxRange}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>૧ કુદકો આગળ (સરવાળો)</span>
          </button>
        </div>

        {/* Current State Output */}
        <div className="p-2.5 bg-white rounded-xl border border-blue-200 font-mono font-black text-sm text-blue-950 flex items-center gap-2">
          <span>હાલનું સ્થાન:</span>
          <span className="text-xl text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-300">
            {currentPosition}
          </span>
        </div>
      </div>
    </div>
  );
}
