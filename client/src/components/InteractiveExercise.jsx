import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import GujaratiVoiceButton from './GujaratiVoiceButton';
import { CheckCircle, XCircle, Sparkles, Volume2 } from 'lucide-react';

export default function InteractiveExercise({ practice, onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'

  if (!practice) return null;

  const handleSelect = (option) => {
    setSelectedOption(option);
    const isCorrect = option === practice.correctAnswer;
    if (isCorrect) {
      setFeedback('correct');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
      if (onComplete) onComplete(true);
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-6 rounded-3xl border-2 border-amber-200 shadow-md">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-amber-500 text-white font-bold text-lg shadow-sm">
            ✏️
          </span>
          <h3 className="font-extrabold text-lg text-amber-950 font-gujarati">
            ચાલો જાતે પ્રયત્ન કરીએ (Practice)
          </h3>
        </div>
        {practice.audioPrompt && (
          <GujaratiVoiceButton text={practice.audioPrompt} label="સાંભળો" size="sm" />
        )}
      </div>

      <p className="text-base font-bold text-slate-800 mb-5 font-gujarati">
        {practice.promptGujarati}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        {practice.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === practice.correctAnswer;
          let btnColor = 'bg-white hover:bg-amber-100 text-slate-800 border-2 border-amber-200';

          if (isSelected) {
            if (feedback === 'correct') {
              btnColor = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200';
            } else if (feedback === 'incorrect') {
              btnColor = 'bg-rose-500 text-white border-2 border-rose-600 ring-4 ring-rose-200';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              className={`p-4 rounded-2xl font-black text-xl font-gujarati shadow-sm active:scale-95 transition-all text-center ${btnColor}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {feedback === 'correct' && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-sm flex items-center gap-2 font-gujarati animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>ખૂબ સરસ! તમારો જવાબ સાચો છે ⭐ (Well done!)</span>
        </div>
      )}

      {feedback === 'incorrect' && (
        <div className="p-3.5 bg-rose-100 border border-rose-300 rounded-2xl text-rose-900 font-bold text-sm flex items-center justify-between gap-2 font-gujarati">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>ફરી પ્રયત્ન કરો! સંકેત: {practice.hintGujarati}</span>
          </div>
          <button
            onClick={() => { setSelectedOption(null); setFeedback(null); }}
            className="px-3 py-1 bg-white text-rose-700 text-xs font-bold rounded-lg border border-rose-300 shadow-xs"
          >
            ફરી કરો
          </button>
        </div>
      )}
    </div>
  );
}
