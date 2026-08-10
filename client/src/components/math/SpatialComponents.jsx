import React, { useState } from 'react';
import {
  ChildCharacter,
  ClassroomTable,
  ClassroomChair,
  Bookshelf,
  GeometricObject,
  SchoolItem,
  DirectionArrow,
  DropZoneMarker,
} from './SpatialSvgLibrary';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/soundEffects';
import { speakGujarati } from '../../utils/gujaratiAudio';
import { CheckCircle2, HelpCircle, ArrowUp, ArrowDown, Move, Compass } from 'lucide-react';

/* ==========================================================================
   1. DRAG AND PLACE MANIPULATIVE (ઉપર / નીચે)
   Touch & Mouse Drag or Click-to-Place above/below reference object
   ========================================================================== */
export function DragPositionManipulative({
  instruction = 'વસ્તુને ટેબલની ઉપર મૂકો.',
  targetPosition = 'above', // 'above' | 'below'
  referenceType = 'table', // 'table' | 'chair' | 'shelf'
  movableItem = { type: 'cube', label: 'લાલ બ્લૉક' },
  onSuccess,
}) {
  const [placedPosition, setPlacedPosition] = useState(null); // 'above' | 'below' | null
  const [feedback, setFeedback] = useState(null);

  const handlePlace = (pos) => {
    playClickSound();
    setPlacedPosition(pos);

    if (pos === targetPosition) {
      playSuccessSound();
      setFeedback({ correct: true, text: `સરસ! વસ્તુ ${pos === 'above' ? 'ઉપર' : 'નીચે'} ગોઠવાઈ ગઈ છે.` });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({
        correct: false,
        text: `ફરી પ્રયાસ કરો. વસ્તુને ${targetPosition === 'above' ? 'ઉપર' : 'નીચે'} મૂકો!`,
      });
      speakGujarati(`ફરી પ્રયાસ કરો. વસ્તુને ${targetPosition === 'above' ? 'ઉપર' : 'નીચે'} મૂકો!`);
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 text-center space-y-6">
      <div className="space-y-1">
        <h4 className="text-lg md:text-xl font-black text-slate-900 font-gujarati">
          {instruction}
        </h4>
        <p className="text-xs text-slate-500 font-gujarati">
          નીચેના યોગ્ય ખાના (Drop Zone) પર ક્લિક અથવા ટેપ કરો:
        </p>
      </div>

      {/* Interactive Manipulation Canvas */}
      <div className="relative max-w-md mx-auto bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-inner flex flex-col items-center justify-between min-h-[300px] gap-4">
        {/* Top Drop Zone (Above) */}
        <DropZoneMarker
          position="above"
          active={placedPosition === 'above'}
          onClick={() => handlePlace('above')}
          label="ઉપર મૂકો (Top / Above)"
        >
          {placedPosition === 'above' ? (
            <div className="animate-scale-in flex flex-col items-center">
              <GeometricObject type={movableItem.type} label={movableItem.label} size={50} />
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-gujarati mt-1">
                ઉપર ✅
              </span>
            </div>
          ) : null}
        </DropZoneMarker>

        {/* Center Reference Object */}
        <div className="my-2 select-none">
          {referenceType === 'table' && <ClassroomTable width={180} height={95} label="ટેબલ" />}
          {referenceType === 'chair' && <ClassroomChair width={110} height={130} label="ખુરશી" />}
          {referenceType === 'shelf' && <Bookshelf width={140} height={150} label="કબાટ" />}
        </div>

        {/* Bottom Drop Zone (Below) */}
        <DropZoneMarker
          position="below"
          active={placedPosition === 'below'}
          onClick={() => handlePlace('below')}
          label="નીચે મૂકો (Bottom / Below)"
        >
          {placedPosition === 'below' ? (
            <div className="animate-scale-in flex flex-col items-center">
              <GeometricObject type={movableItem.type} label={movableItem.label} size={50} />
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-gujarati mt-1">
                નીચે ✅
              </span>
            </div>
          ) : null}
        </DropZoneMarker>
      </div>

      {/* Feedback Banner */}
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
   2. RELATIVE POSITION 3-TIER STACK (ની ઉપર / ની નીચે)
   Vertical stack: Top Object -> Character Middle -> Bottom Box
   ========================================================================== */
export function RelativeStackManipulative({
  topObject = { name: 'book', label: 'પુસ્તક', isCorrect: false },
  middleCharacter = { label: 'બાળક' },
  bottomObject = { name: 'box', label: 'પેટી', isCorrect: false },
  questionPrompt = 'બાળકની ઉપર શું છે?',
  correctTarget = 'top', // 'top' | 'bottom'
  onSuccess,
}) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handlePick = (tier) => {
    playClickSound();
    setSelected(tier);

    if (tier === correctTarget) {
      playSuccessSound();
      setFeedback({ correct: true, text: 'સાચું! તમે સાચો સંબંધ ઓળખ્યો.' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({ correct: false, text: 'ફરીથી જુઓ. બાળકની સ્થિતિ સાથે સરખામણી કરો!' });
      speakGujarati('ફરીથી જુઓ. બાળકની સ્થિતિ સાથે સરખામણી કરો!');
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-gujarati">
          સાપેક્ષ સ્થાન (Relative Position)
        </span>
        <h4 className="text-lg md:text-xl font-black text-slate-900 font-gujarati">
          {questionPrompt}
        </h4>
      </div>

      {/* 3-Tier Vertical Stack */}
      <div className="max-w-xs mx-auto bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col items-center gap-4">
        {/* Tier 1: Top Object */}
        <div
          onClick={() => handlePick('top')}
          className={`cursor-pointer p-3 rounded-2xl border-2 transition-all w-full flex items-center justify-center gap-3 ${
            selected === 'top'
              ? correctTarget === 'top'
                ? 'border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-200'
                : 'border-rose-400 bg-rose-50'
              : 'border-slate-200 bg-slate-50/60 hover:border-indigo-300'
          }`}
        >
          <SchoolItem name={topObject.name} size={45} />
          <span className="text-xs font-black text-slate-800 font-gujarati">{topObject.label} (ઉપર)</span>
        </div>

        {/* Direction Arrow Downward */}
        <DirectionArrow direction="down" size={24} color="#6366F1" animate={false} />

        {/* Tier 2: Middle Character */}
        <div className="p-2 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center w-full">
          <ChildCharacter gender="boy" size={80} />
          <span className="text-xs font-black text-indigo-900 font-gujarati mt-1">{middleCharacter.label} (વચ્ચે)</span>
        </div>

        {/* Direction Arrow Downward */}
        <DirectionArrow direction="down" size={24} color="#6366F1" animate={false} />

        {/* Tier 3: Bottom Object */}
        <div
          onClick={() => handlePick('bottom')}
          className={`cursor-pointer p-3 rounded-2xl border-2 transition-all w-full flex items-center justify-center gap-3 ${
            selected === 'bottom'
              ? correctTarget === 'bottom'
                ? 'border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-200'
                : 'border-rose-400 bg-rose-50'
              : 'border-slate-200 bg-slate-50/60 hover:border-indigo-300'
          }`}
        >
          <SchoolItem name={bottomObject.name} size={45} />
          <span className="text-xs font-black text-slate-800 font-gujarati">{bottomObject.label} (નીચે)</span>
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
   3. VERTICAL ELEVATION MANIPULATIVE (ઊંચે / નીચે)
   Character elevation along dotted trajectory
   ========================================================================== */
export function VerticalElevationManipulative({
  instruction = 'બાળકને ઊંચે લઈ જાઓ.',
  targetElevation = 'high', // 'high' | 'low'
  onSuccess,
}) {
  const [currentElevation, setCurrentElevation] = useState('low');
  const [feedback, setFeedback] = useState(null);

  const handleMove = (elevation) => {
    playClickSound();
    setCurrentElevation(elevation);

    if (elevation === targetElevation) {
      playSuccessSound();
      setFeedback({
        correct: true,
        text: `સરસ! બાળક ${elevation === 'high' ? 'ઊંચે ગયું' : 'નીચે આવ્યું'}.`,
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({
        correct: false,
        text: `ફરી પ્રયાસ કરો. બાળકને ${targetElevation === 'high' ? 'ઊંચે' : 'નીચે'} લઈ જાઓ!`,
      });
      speakGujarati(`ફરી પ્રયાસ કરો. બાળકને ${targetElevation === 'high' ? 'ઊંચે' : 'નીચે'} લઈ જાઓ!`);
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 text-center space-y-6">
      <div className="space-y-1">
        <h4 className="text-lg md:text-xl font-black text-slate-900 font-gujarati">
          {instruction}
        </h4>
        <p className="text-xs text-slate-500 font-gujarati">
          બટન અથવા લક્ષ્ય સ્થાન પર ક્લિક કરો:
        </p>
      </div>

      {/* Elevation Track */}
      <div className="relative max-w-sm mx-auto bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 rounded-3xl p-6 border-2 border-sky-200 shadow-inner min-h-[320px] flex flex-col justify-between items-center">
        {/* Top Target Zone */}
        <div
          onClick={() => handleMove('high')}
          className={`w-full p-3 rounded-2xl border-2 border-dashed transition-all flex items-center justify-between cursor-pointer ${
            currentElevation === 'high'
              ? 'border-emerald-500 bg-emerald-100/80 shadow-md ring-2 ring-emerald-300'
              : 'border-sky-300 bg-white/70 hover:bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <SchoolItem name="kite" size={36} />
            <span className="text-xs font-black text-sky-900 font-gujarati">ઊંચે આકાશમાં (High Above)</span>
          </div>
          <DirectionArrow direction="up" size={20} animate={currentElevation !== 'high'} />
        </div>

        {/* Dotted Trajectory Line */}
        <div className="flex-1 flex flex-col items-center justify-center my-2">
          <div className="w-1 bg-gradient-to-b from-sky-400 to-emerald-400 border-dashed border-l-2 border-slate-400 h-24 my-1" />
          <div className="animate-bounce">
            <ChildCharacter
              gender="girl"
              pose={currentElevation === 'high' ? 'reaching_up' : 'standing'}
              size={currentElevation === 'high' ? 95 : 85}
            />
          </div>
        </div>

        {/* Bottom Ground Zone */}
        <div
          onClick={() => handleMove('low')}
          className={`w-full p-3 rounded-2xl border-2 border-dashed transition-all flex items-center justify-between cursor-pointer ${
            currentElevation === 'low'
              ? 'border-emerald-500 bg-emerald-100/80 shadow-md ring-2 ring-emerald-300'
              : 'border-emerald-300 bg-white/70 hover:bg-white'
          }`}
        >
          <span className="text-xs font-black text-emerald-900 font-gujarati">નીચે જમીન પર (Down on Ground)</span>
          <DirectionArrow direction="down" size={20} animate={currentElevation !== 'low'} />
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
   4. NEAR / FAR DISTANCE MANIPULATIVE (નજીક / દૂર)
   ========================================================================== */
export function NearFarDistanceManipulative({
  instruction = 'વસ્તુને બાળકની નજીક મૂકો.',
  targetZone = 'near', // 'near' | 'far'
  onSuccess,
}) {
  const [placedZone, setPlacedZone] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handlePlace = (zone) => {
    playClickSound();
    setPlacedZone(zone);

    if (zone === targetZone) {
      playSuccessSound();
      setFeedback({
        correct: true,
        text: `સરસ! વસ્તુ બાળકની ${zone === 'near' ? 'નજીક' : 'દૂર'} ગોઠવાઈ ગઈ છે.`,
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } else {
      playErrorSound();
      setFeedback({
        correct: false,
        text: `ફરી જુઓ. વસ્તુને બાળકની ${targetZone === 'near' ? 'નજીક' : 'દૂર'} મૂકો!`,
      });
      speakGujarati(`ફરી જુઓ. વસ્તુને બાળકની ${targetZone === 'near' ? 'નજીક' : 'દૂર'} મૂકો!`);
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 text-center space-y-6">
      <div className="space-y-1">
        <h4 className="text-lg md:text-xl font-black text-slate-900 font-gujarati">
          {instruction}
        </h4>
        <p className="text-xs text-slate-500 font-gujarati">
          નજીક કે દૂર વાળા ખાના પર ટેપ કરો:
        </p>
      </div>

      {/* Horizontal Distance Runway */}
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Child Anchor */}
        <div className="flex flex-col items-center p-2">
          <ChildCharacter gender="boy" size={85} />
          <span className="text-xs font-black text-slate-800 font-gujarati mt-1">બાળક</span>
        </div>

        {/* Near Drop Zone (Short Distance) */}
        <div
          onClick={() => handlePlace('near')}
          className={`flex-1 p-3 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer min-h-[110px] ${
            placedZone === 'near'
              ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-300'
              : 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-100/60'
          }`}
        >
          {placedZone === 'near' ? (
            <div className="animate-scale-in flex flex-col items-center">
              <GeometricObject type="sphere" size={44} />
              <span className="text-[10px] font-black text-emerald-800 font-gujarati mt-1">નજીક ✅</span>
            </div>
          ) : (
            <>
              <DirectionArrow direction="near" animate={false} />
              <span className="text-[11px] font-black text-emerald-800 font-gujarati mt-1">
                નજીક ખાનું (Near)
              </span>
            </>
          )}
        </div>

        {/* Distance Gap Separator */}
        <div className="text-slate-300 font-mono text-sm hidden md:block">• • • • •</div>

        {/* Far Drop Zone (Large Distance) */}
        <div
          onClick={() => handlePlace('far')}
          className={`flex-1 p-3 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer min-h-[110px] ${
            placedZone === 'far'
              ? 'border-purple-500 bg-purple-50 shadow-md ring-2 ring-purple-300'
              : 'border-purple-300 bg-purple-50/40 hover:bg-purple-100/60'
          }`}
        >
          {placedZone === 'far' ? (
            <div className="animate-scale-in flex flex-col items-center">
              <GeometricObject type="sphere" size={44} />
              <span className="text-[10px] font-black text-purple-800 font-gujarati mt-1">દૂર ✅</span>
            </div>
          ) : (
            <>
              <DirectionArrow direction="far" animate={false} />
              <span className="text-[11px] font-black text-purple-800 font-gujarati mt-1">
                દૂર ખાનું (Far)
              </span>
            </>
          )}
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
