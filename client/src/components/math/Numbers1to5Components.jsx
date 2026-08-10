import React, { useState } from 'react';
import {
  VectorApple,
  VectorBlock,
  VectorBall,
  VectorPencil,
  VectorObjectItem,
  NumberCard,
  InteractiveNumberLine,
  OperationBasket,
} from './Numbers1to5SvgLibrary';
import { playClickSound, playSuccessSound, playErrorSound, playStarSound } from '../../utils/soundEffects';
import { speakGujarati } from '../../utils/gujaratiAudio';
import GujaratiVoiceButton from '../GujaratiVoiceButton';
import { CheckCircle2, HelpCircle, ArrowRight, Plus, Minus, Move, Check } from 'lucide-react';

/* ==========================================================================
   1. NUMBER RECOGNITION ACTIVITY (અંક ઓળખ)
   "૫ શોધો" from multiple number cards
   ========================================================================== */
export function NumberRecognitionActivity({
  targetNumber = '૫',
  targetWord = 'પાંચ',
  options = ['૨', '૫', '૩'],
  onSuccess,
}) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handlePick = (num) => {
    playClickSound();
    setSelected(num);

    if (num === targetNumber) {
      playSuccessSound();
      setFeedback({ correct: true, text: `સરસ! સાચો નંબર ${targetNumber} (${targetWord}) છે.` });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({ correct: false, text: 'ફરીથી ધ્યાનથી જુઓ અને સાચો નંબર પસંદ કરો.' });
      speakGujarati('ફરીથી ધ્યાનથી જુઓ.');
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          અંક ઓળખ (Number Recognition)
        </span>
        <h4 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          {targetNumber} શોધો ({targetWord})
        </h4>
      </div>

      <div className="flex items-center justify-center gap-6 py-4 flex-wrap">
        {options.map((num, i) => (
          <NumberCard
            key={i}
            numeral={num}
            size="lg"
            selected={selected === num}
            correct={selected === num ? num === targetNumber : null}
            onClick={() => handlePick(num)}
          />
        ))}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300 animate-shake'
          }`}
        >
          {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   2. COUNT OBJECTS ACTIVITY (વસ્તુઓ ગણો)
   Tap to count objects with animated counter badge and options
   ========================================================================== */
export function CountingActivity({
  count = 4,
  objectType = 'apple',
  options = [3, 4, 5],
  onSuccess,
}) {
  const [tappedIndices, setTappedIndices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const gujaratiNums = ['', '૧', '૨', '૩', '૪', '૫'];

  const handleTapObject = (idx) => {
    playStarSound();
    if (!tappedIndices.includes(idx)) {
      const next = [...tappedIndices, idx];
      setTappedIndices(next);
      speakGujarati(gujaratiNums[next.length] || String(next.length));
    }
  };

  const handleSelectOption = (ans) => {
    playClickSound();
    setSelectedAnswer(ans);

    if (ans === count) {
      playSuccessSound();
      setFeedback({ correct: true, text: `સાચો જવાબ! કુલ ${gujaratiNums[count]} વસ્તુઓ છે.` });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({ correct: false, text: 'ફરીથી વસ્તુઓ ગણો.' });
      speakGujarati('ફરીથી વસ્તુઓ ગણો.');
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          ગણતરી (Counting)
        </span>
        <h4 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
          વસ્તુઓ ગણીને સાચો જવાબ આપો
        </h4>
        <p className="text-xs text-slate-500 font-gujarati">
          વસ્તુઓ પર ક્લિક કરીને ગણી શકો છો:
        </p>
      </div>

      {/* Illustrated Objects Grid */}
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex items-center justify-center gap-4 flex-wrap min-h-[120px]">
        {Array.from({ length: count }).map((_, i) => {
          const isTapped = tappedIndices.includes(i);
          const order = tappedIndices.indexOf(i) + 1;

          return (
            <VectorObjectItem
              key={i}
              type={objectType}
              size={54}
              highlight={isTapped}
              countBadge={isTapped ? gujaratiNums[order] : null}
              onClick={() => handleTapObject(i)}
            />
          );
        })}
      </div>

      {/* Answer Options */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 font-gujarati">કેટલી વસ્તુઓ છે?</span>
        <div className="flex items-center justify-center gap-4">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelectOption(opt)}
              className={`w-14 h-14 rounded-2xl border-2 font-black text-2xl font-gujarati transition-all ${
                selectedAnswer === opt
                  ? opt === count
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-950 scale-105 shadow-md'
                    : 'border-rose-400 bg-rose-50 text-rose-950'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-900 shadow-xs'
              }`}
            >
              {gujaratiNums[opt]}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300 animate-shake'
          }`}
        >
          {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   3. NUMBER QUANTITY MATCH ACTIVITY (અંક અને જથ્થો જોડો)
   ========================================================================== */
export function NumberQuantityActivity({
  targetNumber = 3,
  numeral = '૩',
  groups = [
    { id: 'A', count: 2, label: 'સમૂહ A' },
    { id: 'B', count: 3, label: 'સમૂહ B' },
    { id: 'C', count: 5, label: 'સમૂહ C' },
  ],
  onSuccess,
}) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handlePick = (grp) => {
    playClickSound();
    setSelectedGroup(grp.id);

    if (grp.count === targetNumber) {
      playSuccessSound();
      setFeedback({ correct: true, text: `ખૂબ સરસ! ${numeral} સાથે ${grp.label} બરાબર જોડાયું.` });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({ correct: false, text: 'ફરીથી વસ્તુઓ ગણીને યોગ્ય સમૂહ પસંદ કરો.' });
      speakGujarati('ફરીથી ગણો.');
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          જથ્થો જોડો (Match Quantity)
        </span>
        <h4 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          {numeral} સાથે યોગ્ય સમૂહ જોડો
        </h4>
      </div>

      {/* Target Number Card */}
      <div className="flex justify-center">
        <NumberCard numeral={numeral} size="md" selected />
      </div>

      {/* 3 Visual Groups */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
        {groups.map((grp) => (
          <div
            key={grp.id}
            onClick={() => handlePick(grp)}
            className={`cursor-pointer p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-between min-h-[140px] ${
              selectedGroup === grp.id
                ? grp.count === targetNumber
                  ? 'border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-200'
                  : 'border-rose-400 bg-rose-50'
                : 'border-slate-200 bg-white hover:border-indigo-400 hover:shadow-sm'
            }`}
          >
            <span className="text-xs font-bold text-slate-500 font-gujarati">{grp.label}</span>
            <div className="flex items-center justify-center gap-1.5 flex-wrap my-auto p-2">
              {Array.from({ length: grp.count }).map((_, i) => (
                <VectorApple key={i} size={36} />
              ))}
            </div>
            <span className="text-xs font-black text-slate-800 font-gujarati">
              {grp.count} વસ્તુઓ
            </span>
          </div>
        ))}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300 animate-shake'
          }`}
        >
          {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. NUMBER SEQUENCE ACTIVITY (સંખ્યા ક્રમ)
   Find missing number: ૧ → ૨ → __ → ૪ → ૫
   ========================================================================== */
export function NumberSequenceActivity({
  sequence = ['૧', '૨', '__', '૪', '૫'],
  missingIndex = 2,
  correctAnswer = '૩',
  options = ['૨', '૩', '૫'],
  onSuccess,
}) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handlePick = (ans) => {
    playClickSound();
    setSelected(ans);

    if (ans === correctAnswer) {
      playSuccessSound();
      setFeedback({ correct: true, text: `સાચો ક્રમ! ખૂટતી સંખ્યા ${correctAnswer} છે.` });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({ correct: false, text: 'ફરીથી ક્રમ યાદ કરો.' });
      speakGujarati('ફરીથી ક્રમ યાદ કરો.');
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          સંખ્યા ક્રમ (Number Sequence)
        </span>
        <h4 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
          ખૂટતી સંખ્યા શોધો
        </h4>
      </div>

      {/* Sequence Track */}
      <div className="flex items-center justify-center gap-2 md:gap-3 py-4 flex-wrap max-w-md mx-auto">
        {sequence.map((item, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`w-12 h-14 md:w-14 md:h-16 rounded-2xl border-2 flex items-center justify-center font-black text-xl md:text-2xl font-gujarati shadow-xs ${
                idx === missingIndex
                  ? selected === correctAnswer
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-950 font-black animate-scale-in'
                    : 'border-dashed border-amber-400 bg-amber-50 text-amber-800'
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              {idx === missingIndex ? (selected === correctAnswer ? correctAnswer : '?') : item}
            </div>
            {idx < sequence.length - 1 && (
              <span className="text-slate-400 font-black text-lg">→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Options */}
      <div className="flex items-center justify-center gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            className={`w-14 h-14 rounded-2xl border-2 font-black text-2xl font-gujarati transition-all ${
              selected === opt
                ? opt === correctAnswer
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-950 scale-105'
                  : 'border-rose-400 bg-rose-50 text-rose-950'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-900'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300 animate-shake'
          }`}
        >
          {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   5. NUMBER ORDER ARRANGE ACTIVITY (૧ થી ૫ ક્રમમાં ગોઠવો)
   ========================================================================== */
export function NumberOrderActivity({ onSuccess }) {
  const target = ['૧', '૨', '૩', '૪', '૫'];
  const [currentOrder, setCurrentOrder] = useState(['૪', '૧', '૫', '૨', '૩']);
  const [selectedNum, setSelectedNum] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleCardClick = (num) => {
    playClickSound();
    if (!selectedNum) {
      setSelectedNum(num);
    } else {
      // Swap the two cards
      const idx1 = currentOrder.indexOf(selectedNum);
      const idx2 = currentOrder.indexOf(num);
      const next = [...currentOrder];
      next[idx1] = num;
      next[idx2] = selectedNum;
      setCurrentOrder(next);
      setSelectedNum(null);

      // Check if solved
      if (next.join('') === target.join('')) {
        playSuccessSound();
        setFeedback({ correct: true, text: 'ખૂબ સરસ! તમે ૧ થી ૫ સુધીનો ક્રમ સાચો ગોઠવ્યો.' });
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 900);
      }
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          ક્રમ ગોઠવણી (Order Numbers)
        </span>
        <h4 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
          ૧ થી ૫ સુધી યોગ્ય ક્રમમાં ગોઠવો
        </h4>
        <p className="text-xs text-slate-500 font-gujarati">
          બે અંકો પર ક્લિક કરીને તેમનો સ્થાન બદલો:
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 py-4 flex-wrap max-w-md mx-auto">
        {currentOrder.map((num, i) => (
          <NumberCard
            key={i}
            numeral={num}
            size="md"
            selected={selectedNum === num}
            onClick={() => handleCardClick(num)}
          />
        ))}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   6. ADDITION OBJECTS COMBINE ACTIVITY (સરવાળો: સમૂહ ભેગા કરવા)
   e.g. 2 objects + 1 object = 3 objects (Max sum <= 5)
   ========================================================================== */
export function AdditionObjectsActivity({
  num1 = 2,
  num2 = 1,
  numeral1 = '૨',
  numeral2 = '૧',
  sum = 3,
  sumNumeral = '૩',
  objectType = 'block',
  options = [2, 3, 4],
  onSuccess,
}) {
  const [combined, setCombined] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const gujaratiNums = ['', '૧', '૨', '૩', '૪', '૫'];

  const handleCombine = () => {
    playStarSound();
    setCombined(true);
    speakGujarati('બન્ને સમૂહ ભેગા થયા! હવે કુલ વસ્તુઓ ગણો.');
  };

  const handleSelectAnswer = (ans) => {
    playClickSound();
    setSelectedAnswer(ans);

    if (ans === sum) {
      playSuccessSound();
      setFeedback({ correct: true, text: `સાચું! ${numeral1} + ${numeral2} = ${sumNumeral}` });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({ correct: false, text: 'ભેગી થયેલી વસ્તુઓ ફરીથી ગણો.' });
      speakGujarati('ફરીથી ગણો.');
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          સરવાળો (Addition: Combining Groups)
        </span>
        <h4 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
          {numeral1} + {numeral2} = ?
        </h4>
        <p className="text-xs text-slate-500 font-gujarati">
          {!combined ? 'બન્ને સમૂહને ભેગા કરવા નીચે બટન દબાવો:' : 'હવે કુલ કેટલી વસ્તુઓ થઈ?'}
        </p>
      </div>

      {/* Visual Manipulation Area */}
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        {!combined ? (
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Group 1 */}
            <OperationBasket title={`સમૂહ ૧`} count={num1} objectType={objectType} />

            {/* Plus Indicator */}
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl shadow-xs">
              +
            </div>

            {/* Group 2 */}
            <OperationBasket title={`સમૂહ ૨`} count={num2} objectType={objectType} />
          </div>
        ) : (
          /* Combined Common Basket */
          <div className="animate-scale-in flex flex-col items-center space-y-2">
            <OperationBasket title="ભેગો થયેલો સમૂહ (Combined Group)" count={sum} objectType={objectType} highlight />
            <span className="text-sm font-black text-emerald-800 font-gujarati">
              {numeral1} + {numeral2} = {sumNumeral}
            </span>
          </div>
        )}
      </div>

      {/* Action Controls */}
      {!combined ? (
        <button
          onClick={handleCombine}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-md font-gujarati flex items-center gap-2 mx-auto active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>સમૂહ ભેગા કરો (Combine Groups)</span>
        </button>
      ) : (
        /* Answer Selection */
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 font-gujarati">કુલ કેટલી વસ્તુઓ થઈ?</span>
          <div className="flex items-center justify-center gap-4">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectAnswer(opt)}
                className={`w-14 h-14 rounded-2xl border-2 font-black text-2xl font-gujarati transition-all ${
                  selectedAnswer === opt
                    ? opt === sum
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-950 scale-105 shadow-md'
                      : 'border-rose-400 bg-rose-50 text-rose-950'
                    : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-900 shadow-xs'
                }`}
              >
                {gujaratiNums[opt]}
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300 animate-shake'
          }`}
        >
          {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   7. ADDITION NUMBER LINE ACTIVITY (સંખ્યા રેખા પર સરવાળો)
   e.g. 2 + 2 = 4 (Forward jump)
   ========================================================================== */
export function AdditionNumberLineActivity({
  start = 2,
  jump = 2,
  result = 4,
  onSuccess,
}) {
  const [currentPos, setCurrentPos] = useState(start);
  const [feedback, setFeedback] = useState(null);

  const gujaratiNums = ['', '૧', '૨', '૩', '૪', '૫'];

  const handleHop = () => {
    playStarSound();
    const next = Math.min(currentPos + 1, result);
    setCurrentPos(next);

    if (next === result) {
      playSuccessSound();
      setFeedback({
        correct: true,
        text: `સરસ! ${gujaratiNums[start]} + ${gujaratiNums[jump]} = ${gujaratiNums[result]}`,
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          સંખ્યા રેખા પર સરવાળો (Number Line Addition)
        </span>
        <h4 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          {gujaratiNums[start]} + {gujaratiNums[jump]} = {currentPos === result ? gujaratiNums[result] : '?'}
        </h4>
        <p className="text-xs text-slate-500 font-gujarati">
          {gujaratiNums[start]} થી શરૂ કરી આગળ {gujaratiNums[jump]} ડગલાં કૂદો:
        </p>
      </div>

      <InteractiveNumberLine
        activePosition={currentPos}
        startPosition={start}
        endPosition={result}
        highlightRange={[start, result]}
      />

      <div className="flex items-center justify-center gap-4">
        {currentPos < result ? (
          <button
            onClick={handleHop}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-md font-gujarati flex items-center gap-2 active:scale-95 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>આગળ કૂદો (+૧ Step)</span>
          </button>
        ) : null}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   8. SUBTRACTION OBJECTS ACTIVITY (બાદબાકી: વસ્તુઓ દૂર કરવી)
   e.g. 5 - 2 = 3
   ========================================================================== */
export function SubtractionObjectsActivity({
  total = 5,
  remove = 2,
  remaining = 3,
  objectType = 'apple',
  options = [2, 3, 4],
  onSuccess,
}) {
  const [removedCount, setRemovedCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const gujaratiNums = ['', '૧', '૨', '૩', '૪', '૫'];

  const handleRemoveOne = () => {
    playStarSound();
    const next = removedCount + 1;
    if (next <= remove) {
      setRemovedCount(next);
      speakGujarati(`એક વસ્તુ દૂર થઈ!`);
    }
  };

  const handleSelectAnswer = (ans) => {
    playClickSound();
    setSelectedAnswer(ans);

    if (ans === remaining) {
      playSuccessSound();
      setFeedback({
        correct: true,
        text: `સાચું! ${gujaratiNums[total]} − ${gujaratiNums[remove]} = ${gujaratiNums[remaining]}`,
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({ correct: false, text: 'બાકી રહેલી વસ્તુઓ ફરીથી ગણો.' });
      speakGujarati('બાકી રહેલી વસ્તુઓ ફરીથી ગણો.');
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          બાદબાકી (Subtraction: Taking Away)
        </span>
        <h4 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
          {gujaratiNums[total]} − {gujaratiNums[remove]} = ?
        </h4>
        <p className="text-xs text-slate-500 font-gujarati">
          {removedCount < remove
            ? `કુલ ${gujaratiNums[total]} માંથી ${gujaratiNums[remove]} વસ્તુઓ દૂર કરો:`
            : 'હવે કેટલી વસ્તુઓ બાકી રહી?'}
        </p>
      </div>

      {/* Visual Baskets */}
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        {/* Remaining Basket */}
        <OperationBasket
          title="મુખ્ય સમૂહ (Remaining)"
          count={total - removedCount}
          objectType={objectType}
          highlight={removedCount === remove}
        />

        {/* Minus Sign */}
        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xl shadow-xs">
          −
        </div>

        {/* Removed Basket */}
        <OperationBasket
          title={`દૂર કરેલી વસ્તુઓ (${removedCount}/${remove})`}
          count={removedCount}
          objectType={objectType}
        />
      </div>

      {/* Controls */}
      {removedCount < remove ? (
        <button
          onClick={handleRemoveOne}
          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-md font-gujarati flex items-center gap-2 mx-auto active:scale-95 transition-all"
        >
          <Minus className="w-4 h-4" />
          <span>૧ વસ્તુ દૂર કરો (Remove 1)</span>
        </button>
      ) : (
        /* Answer Selection */
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 font-gujarati">કેટલી વસ્તુઓ બાકી રહી?</span>
          <div className="flex items-center justify-center gap-4">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectAnswer(opt)}
                className={`w-14 h-14 rounded-2xl border-2 font-black text-2xl font-gujarati transition-all ${
                  selectedAnswer === opt
                    ? opt === remaining
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-950 scale-105 shadow-md'
                      : 'border-rose-400 bg-rose-50 text-rose-950'
                    : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-900 shadow-xs'
                }`}
              >
                {gujaratiNums[opt]}
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300 animate-shake'
          }`}
        >
          {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   9. SUBTRACTION NUMBER LINE ACTIVITY (સંખ્યા રેખા પર બાદબાકી)
   e.g. 5 - 2 = 3 (Backward jump)
   ========================================================================== */
export function SubtractionNumberLineActivity({
  start = 5,
  backward = 2,
  result = 3,
  onSuccess,
}) {
  const [currentPos, setCurrentPos] = useState(start);
  const [feedback, setFeedback] = useState(null);

  const gujaratiNums = ['', '૧', '૨', '૩', '૪', '૫'];

  const handleHopBackward = () => {
    playStarSound();
    const next = Math.max(currentPos - 1, result);
    setCurrentPos(next);

    if (next === result) {
      playSuccessSound();
      setFeedback({
        correct: true,
        text: `સરસ! ${gujaratiNums[start]} − ${gujaratiNums[backward]} = ${gujaratiNums[result]}`,
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          સંખ્યા રેખા પર બાદબાકી (Number Line Subtraction)
        </span>
        <h4 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          {gujaratiNums[start]} − {gujaratiNums[backward]} = {currentPos === result ? gujaratiNums[result] : '?'}
        </h4>
        <p className="text-xs text-slate-500 font-gujarati">
          {gujaratiNums[start]} થી શરૂ કરી પાછળ {gujaratiNums[backward]} ડગલાં કૂદો:
        </p>
      </div>

      <InteractiveNumberLine
        activePosition={currentPos}
        startPosition={start}
        endPosition={result}
        highlightRange={[result, start]}
      />

      <div className="flex items-center justify-center gap-4">
        {currentPos > result ? (
          <button
            onClick={handleHopBackward}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-md font-gujarati flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>પાછળ કૂદો (−૧ Step)</span>
          </button>
        ) : null}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   10. MIXED OPERATION MEANING ACTIVITY (ભેગું થયું કે દૂર થયું?)
   ========================================================================== */
export function MixedOperationActivity({
  scenario = 'addition', // 'addition' | 'subtraction'
  prompt = 'બે સફરજન હતા, તેમાં એક વધુ સફરજન આવ્યું. અહીં શું થયું?',
  onSuccess,
}) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handlePick = (choice) => {
    playClickSound();
    setSelected(choice);

    if (choice === scenario) {
      playSuccessSound();
      setFeedback({
        correct: true,
        text: `સાચું! આ ${choice === 'addition' ? 'સરવાળો (ભેગું થયું)' : 'બાદબાકી (દૂર થયું)'} છે.`,
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({ correct: false, text: 'ફરીથી વિચારો. વસ્તુઓ વધી કે ઘટી?' });
      speakGujarati('ફરીથી વિચારો.');
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-indigo-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          સંકલ્પના ઓળખો (Meaning of Operations)
        </span>
        <h4 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
          {prompt}
        </h4>
      </div>

      <div className="flex items-center justify-center gap-6 py-4 flex-wrap">
        <button
          onClick={() => handlePick('addition')}
          className={`px-8 py-5 rounded-3xl border-2 font-black text-base font-gujarati transition-all flex items-center gap-2 shadow-sm ${
            selected === 'addition'
              ? scenario === 'addition'
                ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-200 scale-105'
                : 'border-rose-400 bg-rose-50 text-rose-950'
              : 'border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-950'
          }`}
        >
          <Plus className="w-5 h-5 text-indigo-600" />
          <span>ભેગું થયું (સરવાળો +)</span>
        </button>

        <button
          onClick={() => handlePick('subtraction')}
          className={`px-8 py-5 rounded-3xl border-2 font-black text-base font-gujarati transition-all flex items-center gap-2 shadow-sm ${
            selected === 'subtraction'
              ? scenario === 'subtraction'
                ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-200 scale-105'
                : 'border-rose-400 bg-rose-50 text-rose-950'
              : 'border-rose-300 bg-white hover:bg-rose-50 text-rose-950'
          }`}
        >
          <Minus className="w-5 h-5 text-rose-600" />
          <span>દૂર થયું (બાદબાકી −)</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
            feedback.correct
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-rose-100 text-rose-900 border border-rose-300 animate-shake'
          }`}
        >
          {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}
