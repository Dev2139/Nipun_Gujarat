import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import GujaratiVoiceButton from '../GujaratiVoiceButton';
import { speakGujarati } from '../../utils/gujaratiAudio';
import {
  playSuccessSound,
  playErrorSound,
  playClickSound,
  playFanfareSound,
  playStarSound,
} from '../../utils/soundEffects';
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
import {
  DragPositionManipulative,
  RelativeStackManipulative,
  VerticalElevationManipulative,
  NearFarDistanceManipulative,
} from './SpatialComponents';
import {
  getSavedModule2Progress,
  saveModule2Progress,
  resetModule2Progress,
} from '../../services/module2ProgressState';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  BookOpen,
  Gamepad2,
  FileCheck2,
  Trophy,
  HelpCircle,
  RefreshCw,
  Check,
  Compass,
  Lightbulb,
  Search,
} from 'lucide-react';

export default function SpatialConceptsModule({ competency, progress, onTestReady }) {
  const navigate = useNavigate();

  // Load persistent progress state
  const [moduleState, setModuleState] = useState(() => getSavedModule2Progress());

  // Active Stage: 'intro' | 'guided' | 'practice' | 'minicheck' | 'test' | 'completed' | 'relearn'
  const [activeStage, setActiveStage] = useState(() => {
    const saved = getSavedModule2Progress();
    if (saved.passed) return 'completed';
    if (saved.practiceCompleted) return 'test';
    if (saved.guidedCompleted) return 'practice';
    return 'intro';
  });

  const updateState = (patch) => {
    const next = saveModule2Progress(patch);
    setModuleState({ ...next });
    if (next.practiceCompleted && onTestReady) {
      onTestReady();
    }
  };

  useEffect(() => {
    const saved = getSavedModule2Progress();
    setModuleState(saved);
  }, []);

  /* ==========================================================================
     JOURNEY STAGES DEFINITION
     ========================================================================== */
  const stages = [
    {
      id: 'intro',
      titleGujarati: 'પરિચય',
      icon: Play,
      isUnlocked: true,
      isCompleted: moduleState.guidedActivitiesDone?.length > 0 || moduleState.guidedCompleted,
    },
    {
      id: 'guided',
      titleGujarati: 'શિક્ષણ',
      icon: BookOpen,
      isUnlocked: true,
      isCompleted: moduleState.guidedCompleted,
    },
    {
      id: 'practice',
      titleGujarati: 'મહાવરો',
      icon: Gamepad2,
      isUnlocked: moduleState.guidedCompleted,
      isCompleted: moduleState.practiceCompleted,
    },
    {
      id: 'minicheck',
      titleGujarati: 'ચેક',
      icon: Search,
      isUnlocked: moduleState.practiceCompleted,
      isCompleted: moduleState.miniCheckCompleted,
    },
    {
      id: 'test',
      titleGujarati: 'કસોટી',
      icon: FileCheck2,
      isUnlocked: moduleState.practiceCompleted,
      isCompleted: moduleState.passed,
    },
    {
      id: 'completed',
      titleGujarati: 'સિદ્ધિ',
      icon: Trophy,
      isUnlocked: moduleState.passed,
      isCompleted: moduleState.passed,
    },
  ];

  const handleStageClick = (stage) => {
    playClickSound();
    if (stage.isUnlocked || stage.isCompleted) {
      setActiveStage(stage.id);
    } else {
      playErrorSound();
      speakGujarati('પહેલાં આગળનું પગલું પૂર્ણ કરો');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stepper Journey */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-6 border-2 border-indigo-200 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-indigo-600 text-white font-black text-xs font-mono shadow-sm">
              M-02
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-gujarati">
                અવકાશીય સંકલ્પનાઓ (Spatial Concepts)
              </span>
              <h2 className="text-base md:text-lg font-black text-slate-900 font-gujarati">
                ઉપર-નીચે, ની ઉપર, ની નીચે, ઊંચે, નજીક-દૂરની સમજ
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <GujaratiVoiceButton
              text="ઉપર-નીચે, ની ઉપર, ની નીચે, ઊંચે, નજીક-દૂરની સંકલ્પના સમજે છે. સ્થાન ઓળખતા શીખીએ."
              label="સાંભળો"
              size="sm"
            />
          </div>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-6 gap-2 pt-2">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            const isDone = stage.isCompleted;
            const isLocked = !stage.isUnlocked && !stage.isCompleted;

            return (
              <button
                key={stage.id}
                onClick={() => handleStageClick(stage)}
                disabled={isLocked}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-b from-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-200 scale-105 z-10'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300 hover:bg-emerald-100 cursor-pointer'
                    : isLocked
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75'
                    : 'bg-white text-slate-700 border-2 border-indigo-200 hover:border-indigo-400 cursor-pointer shadow-xs'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isDone && !isActive ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isLocked ? (
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs">
                      <Lock className="w-3 h-3" />
                    </div>
                  ) : (
                    <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'animate-bounce' : ''}`} />
                  )}
                </div>

                <span className={`text-[10px] md:text-[11px] font-black font-gujarati tracking-tight text-center ${
                  isActive ? 'text-white' : ''
                }`}>
                  {idx + 1}. {stage.titleGujarati}
                </span>

                <span className={`text-[8px] md:text-[9px] font-bold mt-0.5 ${
                  isActive
                    ? 'text-indigo-100'
                    : isDone
                    ? 'text-emerald-600'
                    : isLocked
                    ? 'text-slate-400'
                    : 'text-indigo-600'
                }`}>
                  {isDone ? 'પૂર્ણ' : isActive ? 'ચાલુ' : isLocked ? 'લૉક' : 'ખુલ્લું'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: VISUAL INTRODUCTION */}
      {activeStage === 'intro' && (
        <IntroStage
          onComplete={() => {
            playSuccessSound();
            setActiveStage('guided');
          }}
        />
      )}

      {/* STAGE 2: GUIDED LEARNING (10 ACTIVITIES) */}
      {activeStage === 'guided' && (
        <GuidedLearningStage
          moduleState={moduleState}
          onActivityDone={(actNum) => {
            const current = moduleState.guidedActivitiesDone || [];
            const updated = Array.from(new Set([...current, actNum]));
            const isAll = updated.length >= 10;
            updateState({
              guidedActivitiesDone: updated,
              currentGuidedActivity: Math.min(actNum + 1, 10),
              guidedCompleted: isAll,
            });
          }}
          onGoToPractice={() => {
            playClickSound();
            setActiveStage('practice');
          }}
        />
      )}

      {/* STAGE 3: PRACTICE ROUND (10 ACTIVITIES) */}
      {activeStage === 'practice' && (
        <PracticeStage
          moduleState={moduleState}
          onComplete={({ accuracy, score, total, concepts }) => {
            playSuccessSound();
            updateState({
              practiceCompleted: true,
              practiceAccuracy: accuracy,
              practiceScore: score,
              concepts: { ...moduleState.concepts, ...concepts },
              testUnlocked: true,
            });
          }}
          onGoToMiniCheck={() => {
            playClickSound();
            setActiveStage('minicheck');
          }}
        />
      )}

      {/* STAGE 4: MINI-CHECK DIAGNOSTIC (5 QUESTIONS) */}
      {activeStage === 'minicheck' && (
        <MiniCheckStage
          moduleState={moduleState}
          onComplete={({ score, total, weakConcepts }) => {
            playSuccessSound();
            updateState({
              miniCheckCompleted: true,
              miniCheckScore: score,
              weakConcepts,
            });
          }}
          onGoToTest={() => {
            playClickSound();
            setActiveStage('test');
          }}
          onGoToRelearn={() => {
            playClickSound();
            setActiveStage('relearn');
          }}
        />
      )}

      {/* STAGE 5: FINAL ASSESSMENT TEST (10 QUESTIONS) */}
      {activeStage === 'test' && (
        <AssessmentStage
          moduleState={moduleState}
          onTestFinished={({ score, total, percentage, passed, concepts }) => {
            if (passed) {
              playFanfareSound();
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            } else {
              playErrorSound();
            }
            updateState({
              testCompleted: true,
              testScore: score,
              testTotal: total,
              latestTestScore: percentage,
              bestTestScore: Math.max(moduleState.bestTestScore || 0, percentage),
              testAttempts: (moduleState.testAttempts || 0) + 1,
              passed: passed,
              nextModuleUnlocked: passed,
              concepts: { ...moduleState.concepts, ...concepts },
              completedAt: passed ? new Date().toISOString() : null,
            });
          }}
          onRetryPractice={() => {
            playClickSound();
            setActiveStage('practice');
          }}
          onGoToComplete={() => {
            playClickSound();
            setActiveStage('completed');
          }}
        />
      )}

      {/* STAGE 6: COMPLETED MASTERY SCREEN */}
      {activeStage === 'completed' && (
        <CompletedStage
          moduleState={moduleState}
          onRevisitStage={(stg) => {
            playClickSound();
            setActiveStage(stg);
          }}
          onProceedNextModule={() => {
            playClickSound();
            navigate('/student/path/mathematics');
          }}
        />
      )}

      {/* ADAPTIVE RELEARNING */}
      {activeStage === 'relearn' && (
        <RelearnStage
          moduleState={moduleState}
          onPracticeAgain={() => {
            playClickSound();
            setActiveStage('practice');
          }}
        />
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 1: INTRODUCTION ("સ્થાન ઓળખતા શીખીએ")
   ========================================================================== */
function IntroStage({ onComplete }) {
  const [objectPos, setObjectPos] = useState('above'); // 'above' | 'below'

  const handleToggle = () => {
    playClickSound();
    const next = objectPos === 'above' ? 'below' : 'above';
    setObjectPos(next);
    speakGujarati(next === 'above' ? 'વસ્તુ ટેબલની ઉપર છે.' : 'વસ્તુ ટેબલની નીચે છે.');
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6 text-center">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold font-gujarati mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>પરિચય (Visual Demonstration)</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          સ્થાન ઓળખતા શીખીએ
        </h3>
        <p className="text-xs md:text-sm text-slate-600 font-gujarati max-w-md mx-auto">
          ટેબલની સાથે વસ્તુનું સ્થાન જુઓ. વસ્તુ ક્યારે ઉપર હોય અને ક્યારે નીચે હોય તે સમજો.
        </p>
      </div>

      {/* Interactive Demonstration Viewport */}
      <div className="relative max-w-md mx-auto bg-gradient-to-b from-sky-50 via-white to-amber-50/40 rounded-3xl p-8 border-2 border-indigo-100 shadow-inner flex flex-col items-center justify-between min-h-[340px]">
        {/* Animated Moving Geometric Cube */}
        <div className={`transition-all duration-700 transform ${
          objectPos === 'above'
            ? 'translate-y-0 scale-110'
            : 'translate-y-52 scale-100'
        }`}>
          <GeometricObject type="cube" size={54} label={objectPos === 'above' ? 'ઉપર (Above)' : 'નીચે (Below)'} highlight />
        </div>

        {/* Classroom Study Table */}
        <div className="my-auto">
          <ClassroomTable width={200} height={105} label="ટેબલ (Table)" />
        </div>

        {/* Child Standing Beside Table */}
        <div className="absolute right-8 bottom-6">
          <ChildCharacter gender="boy" size={75} />
        </div>
      </div>

      {/* Position Label & Controller */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleToggle}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md font-gujarati flex items-center gap-2 active:scale-95 transition-all"
        >
          <Move className="w-4 h-4" />
          <span>વસ્તુનું સ્થાન બદલો (Toggle Position)</span>
        </button>

        <button
          onClick={onComplete}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95 transition-all font-gujarati"
        >
          <span>સમજાયું! આગળ શીખીએ (Go to Guided Learning →)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   STAGE 2: GUIDED LEARNING (10 INTERACTIVE ACTIVITIES)
   ========================================================================== */
function GuidedLearningStage({ moduleState, onActivityDone, onGoToPractice }) {
  const [activityIdx, setActivityIdx] = useState(moduleState.currentGuidedActivity ? moduleState.currentGuidedActivity - 1 : 0);
  const [completedList, setCompletedList] = useState(moduleState.guidedActivitiesDone || []);

  const handleNextActivity = () => {
    playClickSound();
    const nextIdx = activityIdx + 1;
    const updated = Array.from(new Set([...completedList, activityIdx + 1]));
    setCompletedList(updated);
    onActivityDone(activityIdx + 1);

    if (nextIdx < 10) {
      setActivityIdx(nextIdx);
    }
  };

  const allDone = completedList.length >= 10;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6">
      {/* Activity Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-gujarati">
            માર્ગદર્શિત શિક્ષણ (Guided Activity {activityIdx + 1} of 10)
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            ઇન્ટરેક્ટિવ પ્રવૃત્તિઓ
          </h3>
        </div>

        {/* Activity Jump Bubbles */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const isDone = completedList.includes(num);
            const isCurrent = activityIdx + 1 === num;

            return (
              <button
                key={num}
                onClick={() => {
                  playClickSound();
                  setActivityIdx(num - 1);
                }}
                className={`w-7 h-7 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 scale-110 shadow-sm'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {isDone ? '✓' : num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Render Engine */}
      <div>
        {/* Activity 1: ઉપર / નીચે (Shelf) */}
        {activityIdx === 0 && (
          <DragPositionManipulative
            instruction="પ્રવૃત્તિ ૧: વસ્તુને કબાટની ઉપર મૂકો."
            targetPosition="above"
            referenceType="shelf"
            movableItem={{ type: 'sphere', label: 'દડો' }}
            onSuccess={handleNextActivity}
          />
        )}

        {/* Activity 2: Drag and Place (Table Below) */}
        {activityIdx === 1 && (
          <DragPositionManipulative
            instruction="પ્રવૃત્તિ ૨: વસ્તુને ટેબલની નીચે મૂકો."
            targetPosition="below"
            referenceType="table"
            movableItem={{ type: 'cube', label: 'લાલ બ્લૉક' }}
            onSuccess={handleNextActivity}
          />
        )}

        {/* Activity 3: ની ઉપર / ની નીચે (3-Tier Stack) */}
        {activityIdx === 2 && (
          <RelativeStackManipulative
            questionPrompt="પ્રવૃત્તિ ૩: બાળકની ઉપર શું છે? પસંદ કરો:"
            correctTarget="top"
            topObject={{ name: 'book', label: 'પુસ્તક' }}
            bottomObject={{ name: 'box', label: 'પેટી' }}
            onSuccess={handleNextActivity}
          />
        )}

        {/* Activity 4: Find the Object (Classroom Scene) */}
        {activityIdx === 3 && (
          <RelativeStackManipulative
            questionPrompt="પ્રવૃત્તિ ૪: બાળકની નીચે શું છે? પસંદ કરો:"
            correctTarget="bottom"
            topObject={{ name: 'kite', label: 'પતંગ' }}
            bottomObject={{ name: 'bag', label: 'બેગ' }}
            onSuccess={handleNextActivity}
          />
        )}

        {/* Activity 5: ઊંચે લઈ જાઓ */}
        {activityIdx === 4 && (
          <VerticalElevationManipulative
            instruction="પ્રવૃત્તિ ૫: બાળકને ઊંચે આકાશ તરફ લઈ જાઓ."
            targetElevation="high"
            onSuccess={handleNextActivity}
          />
        )}

        {/* Activity 6: નજીક / દૂર Distance */}
        {activityIdx === 5 && (
          <NearFarDistanceManipulative
            instruction="પ્રવૃત્તિ ૬: વસ્તુને બાળકની નજીક મૂકો."
            targetZone="near"
            onSuccess={handleNextActivity}
          />
        )}

        {/* Activity 7: Drag Far */}
        {activityIdx === 6 && (
          <NearFarDistanceManipulative
            instruction="પ્રવૃત્તિ ૭: વસ્તુને બાળકથી દૂર મૂકો."
            targetZone="far"
            onSuccess={handleNextActivity}
          />
        )}

        {/* Activity 8: Spatial Search */}
        {activityIdx === 7 && (
          <DragPositionManipulative
            instruction="પ્રવૃત્તિ ૮: ખુરશીની ઉપર વસ્તુ મૂકો."
            targetPosition="above"
            referenceType="chair"
            movableItem={{ type: 'cube', label: 'બ્લૉક' }}
            onSuccess={handleNextActivity}
          />
        )}

        {/* Activity 9: Move Character Down */}
        {activityIdx === 8 && (
          <VerticalElevationManipulative
            instruction="પ્રવૃત્તિ ૯: બાળકને નીચે જમીન પર લાવો."
            targetElevation="low"
            onSuccess={handleNextActivity}
          />
        )}

        {/* Activity 10: Final Guided Summary */}
        {activityIdx === 9 && (
          <DragPositionManipulative
            instruction="પ્રવૃત્તિ ૧૦: વસ્તુને ટેબલની ઉપર મૂકો."
            targetPosition="above"
            referenceType="table"
            movableItem={{ type: 'cylinder', label: 'નળાકાર' }}
            onSuccess={handleNextActivity}
          />
        )}
      </div>

      {/* Completion Banner */}
      {allDone && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-100 rounded-3xl p-6 border-2 border-indigo-400 text-center space-y-4 shadow-lg animate-fade-in">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md">
            🎉
          </div>
          <div>
            <h3 className="text-xl font-black text-indigo-950 font-gujarati">
              માર્ગદર્શિત શિક્ષણ પૂર્ણ થયું!
            </h3>
            <p className="text-xs font-semibold text-indigo-800 font-gujarati mt-1">
              તમે બધી ૧૦ પ્રવૃત્તિઓ સફળતાપૂર્વક સમજી લીધી છે. હવે સ્વતંત્ર મહાવરો કરીએ!
            </p>
          </div>

          <button
            onClick={onGoToPractice}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
          >
            <span>હવે મહાવરો કરીએ (Go to Practice →)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 3: PRACTICE STAGE (10 FORGIVING ACTIVITIES WITH ADAPTIVE HINTS)
   ========================================================================== */
function PracticeStage({ moduleState, onComplete, onGoToMiniCheck }) {
  const [actIndex, setActIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintLevel, setHintLevel] = useState(0); // 0: None, 1: Text, 2: Relationship, 3: Arrow
  const [feedback, setFeedback] = useState(null);
  const [practiceDone, setPracticeDone] = useState(moduleState.practiceCompleted || false);

  const practiceItems = [
    {
      id: 1,
      concept: 'aboveBelow',
      prompt: 'કઈ વસ્તુ ટેબલની ઉપર છે?',
      reference: 'table',
      options: [
        { id: 'opt1', label: 'દડો (ઉપર)', position: 'above', isCorrect: true },
        { id: 'opt2', label: 'પેટી (નીચે)', position: 'below', isCorrect: false },
      ],
      hint1: 'ચિત્રને ધ્યાનથી જુઓ.',
      hint2: 'ટેબલની સપાટી તરફ ધ્યાન આપો.',
      hint3: 'ઉપરની તરફ તીર (↑) જુઓ.',
    },
    {
      id: 2,
      concept: 'aboveBelow',
      prompt: 'કઈ વસ્તુ કબાટની નીચે છે?',
      reference: 'shelf',
      options: [
        { id: 'opt1', label: 'પુસ્તક (ઉપર)', position: 'above', isCorrect: false },
        { id: 'opt2', label: 'બેગ (નીચે)', position: 'below', isCorrect: true },
      ],
      hint1: 'ચિત્રને ધ્યાનથી જુઓ.',
      hint2: 'કબાટના તળિયા તરફ જુઓ.',
      hint3: 'નીચેની તરફ તીર (↓) જુઓ.',
    },
    {
      id: 3,
      concept: 'relativeAboveBelow',
      prompt: 'બાળકની ઉપર શું છે?',
      reference: 'child',
      options: [
        { id: 'opt1', label: 'પતંગ (ઉપર)', isCorrect: true },
        { id: 'opt2', label: 'દડો (નીચે)', isCorrect: false },
      ],
      hint1: 'બાળકના માથા તરફ જુઓ.',
      hint2: 'બાળકથી ઉપર રહેલી વસ્તુ શોધો.',
      hint3: 'આકાશમાં રહેલી પતંગ પસંદ કરો.',
    },
    {
      id: 4,
      concept: 'relativeAboveBelow',
      prompt: 'બાળકની નીચે શું છે?',
      reference: 'child',
      options: [
        { id: 'opt1', label: 'ચોપડી (ઉપર)', isCorrect: false },
        { id: 'opt2', label: 'પેટી (નીચે)', isCorrect: true },
      ],
      hint1: 'બાળકના પગ તરફ જુઓ.',
      hint2: 'જમીન પર રહેલી વસ્તુ શોધો.',
      hint3: 'નીચે રહેલી પેટી પસંદ કરો.',
    },
    {
      id: 5,
      concept: 'highLow',
      prompt: 'આમાંથી કઈ વસ્તુ ઊંચે છે?',
      options: [
        { id: 'opt1', label: 'પતંગ (ઊંચે)', isCorrect: true },
        { id: 'opt2', label: 'દડો (જમીન પર)', isCorrect: false },
      ],
      hint1: 'ઊંચાઈ સરખાવો.',
      hint2: 'આકાશ તરફ જુઓ.',
      hint3: 'પતંગ સૌથી ઊંચે છે.',
    },
    {
      id: 6,
      concept: 'highLow',
      prompt: 'આમાંથી કઈ વસ્તુ નીચે જમીન પર છે?',
      options: [
        { id: 'opt1', label: 'પતંગ (આકાશમાં)', isCorrect: false },
        { id: 'opt2', label: 'ગાડી (જમીન પર)', isCorrect: true },
      ],
      hint1: 'જમીન પર રહેલી વસ્તુ શોધો.',
      hint2: 'જે ઊંચે નથી તે પસંદ કરો.',
      hint3: 'ગાડી જમીન પર નીચે છે.',
    },
    {
      id: 7,
      concept: 'nearFar',
      prompt: 'બાળકની સૌથી નજીક શું છે?',
      options: [
        { id: 'opt1', label: 'દડો (નજીક)', isCorrect: true },
        { id: 'opt2', label: 'ઝાડ (દૂર)', isCorrect: false },
      ],
      hint1: 'અંતર ધ્યાનથી જુઓ.',
      hint2: 'જે વસ્તુ ઓછી દૂર છે તે નજીક કહેવાય.',
      hint3: 'દડો બાળકની તદ્દન નજીક છે.',
    },
    {
      id: 8,
      concept: 'nearFar',
      prompt: 'બાળકથી સૌથી દૂર શું છે?',
      options: [
        { id: 'opt1', label: 'ચોપડી (નજીક)', isCorrect: false },
        { id: 'opt2', label: 'મકાન (દૂર)', isCorrect: true },
      ],
      hint1: 'વધારે અંતર વાળી વસ્તુ શોધો.',
      hint2: 'જે બાળકથી લાંબા અંતરે છે તે પસંદ કરો.',
      hint3: 'મકાન ઘણું દૂર છે.',
    },
    {
      id: 9,
      concept: 'aboveBelow',
      prompt: 'ખુરશીની ઉપર શું મુકેલું છે?',
      reference: 'chair',
      options: [
        { id: 'opt1', label: 'સ્કૂલ બેગ (ઉપર)', isCorrect: true },
        { id: 'opt2', label: 'દડો (નીચે)', isCorrect: false },
      ],
      hint1: 'ખુરશીની બેઠક તરફ જુઓ.',
      hint2: 'ખુરશીની ઉપર રહેલી બેગ પસંદ કરો.',
      hint3: 'બેગ ઉપર મુકેલી છે.',
    },
    {
      id: 10,
      concept: 'nearFar',
      prompt: 'કઈ વસ્તુ બાળકની નજીક છે?',
      options: [
        { id: 'opt1', label: 'રમકડું (નજીક)', isCorrect: true },
        { id: 'opt2', label: 'ઝાડ (દૂર)', isCorrect: false },
      ],
      hint1: 'ટૂંકા અંતર વાળી વસ્તુ પસંદ કરો.',
      hint2: 'બાળકના હાથ પાસે રહેલું રમકડું જુઓ.',
      hint3: 'રમકડું નજીક છે.',
    },
  ];

  const current = practiceItems[actIndex];

  const handleSelect = (opt) => {
    if (opt.isCorrect) {
      playSuccessSound();
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      setFeedback({ correct: true, text: 'સરસ! સાચો જવાબ છે.' });

      setTimeout(() => {
        setFeedback(null);
        setHintLevel(0);
        if (actIndex < practiceItems.length - 1) {
          setActIndex(actIndex + 1);
        } else {
          setPracticeDone(true);
          const accuracy = Math.round((nextCorrect / practiceItems.length) * 100);
          onComplete({
            accuracy,
            score: nextCorrect,
            total: practiceItems.length,
            concepts: {
              aboveBelow: { score: 90, attempts: 3 },
              relativeAboveBelow: { score: 85, attempts: 2 },
              highLow: { score: 90, attempts: 2 },
              nearFar: { score: 80, attempts: 3 },
            },
          });
        }
      }, 800);
    } else {
      playErrorSound();
      const nextHint = Math.min(hintLevel + 1, 3);
      setHintLevel(nextHint);
      const hintMsg = nextHint === 1 ? current.hint1 : nextHint === 2 ? current.hint2 : current.hint3;
      setFeedback({ correct: false, text: `ફરી પ્રયત્ન કરો. ${hintMsg}` });
      speakGujarati(hintMsg);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-gujarati">
            સ્વતંત્ર મહાવરો (Practice {actIndex + 1} of {practiceItems.length})
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            {current.prompt}
          </h3>
        </div>

        <GujaratiVoiceButton text={current.prompt} label="પ્રશ્ન સાંભળો" size="sm" />
      </div>

      {!practiceDone ? (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 text-center space-y-6">
          {/* Options Grid */}
          <div className="flex items-center justify-center gap-8 py-6 flex-wrap">
            {current.options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className="cursor-pointer hover:scale-105 active:scale-95 transition-all p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-indigo-400 shadow-sm min-w-[160px] text-center space-y-2"
              >
                <div className="flex items-center justify-center mb-2">
                  {opt.label.includes('ઉપર') && <DirectionArrow direction="up" size={32} animate={false} />}
                  {opt.label.includes('નીચે') && <DirectionArrow direction="down" size={32} animate={false} />}
                  {opt.label.includes('નજીક') && <DirectionArrow direction="near" animate={false} />}
                  {opt.label.includes('દૂર') && <DirectionArrow direction="far" animate={false} />}
                </div>
                <span className="text-sm font-black text-slate-800 font-gujarati block">
                  {opt.label}
                </span>
              </div>
            ))}
          </div>

          {/* Adaptive Hint Indicator */}
          {hintLevel > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-bold text-amber-900 font-gujarati">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>મદદ (Hint Level {hintLevel}/3)</span>
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
      ) : (
        /* Practice Completed Screen */
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-100 rounded-3xl p-8 border-2 border-indigo-400 text-center space-y-6 shadow-xl animate-fade-in">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-md">
            🎉
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-indigo-950 font-gujarati">
              મહાવરો પૂર્ણ થયો!
            </h3>
            <p className="text-sm font-semibold text-indigo-800 font-gujarati mt-1">
              તમે બધી ૧૦ પ્રવૃત્તિઓ પૂર્ણ કરી છે. હવે ઝડપી મિની-ચેક કરીએ!
            </p>
          </div>

          <button
            onClick={onGoToMiniCheck}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
          >
            <span>૫-પ્રશ્ન મિની-ચેક શરૂ કરો (Mini-Check →)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 4: MINI-CHECK DIAGNOSTIC (5 QUESTIONS)
   ========================================================================== */
function MiniCheckStage({ moduleState, onComplete, onGoToTest, onGoToRelearn }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const miniQuestions = [
    { id: 1, concept: 'aboveBelow', prompt: '૧. ઉપર ઓળખો: કઈ વસ્તુ ઉપર છે?', options: [{ id: 'a', text: 'દડો (ઉપર)', correct: true }, { id: 'b', text: 'પેટી (નીચે)' }] },
    { id: 2, concept: 'aboveBelow', prompt: '૨. નીચે ઓળખો: કઈ વસ્તુ નીચે છે?', options: [{ id: 'a', text: 'પુસ્તક (ઉપર)' }, { id: 'b', text: 'બેગ (નીચે)', correct: true }] },
    { id: 3, concept: 'relativeAboveBelow', prompt: '૩. બાળકની ઉપર રહેલી વસ્તુ પસંદ કરો:', options: [{ id: 'a', text: 'પતંગ (ઉપર)', correct: true }, { id: 'b', text: 'દડો (નીચે)' }] },
    { id: 4, concept: 'nearFar', prompt: '૪. બાળકની નજીક રહેલી વસ્તુ શોધો:', options: [{ id: 'a', text: 'રમકડું (નજીક)', correct: true }, { id: 'b', text: 'મકાન (દૂર)' }] },
    { id: 5, concept: 'nearFar', prompt: '૫. બાળકથી દૂર રહેલી વસ્તુ શોધો:', options: [{ id: 'a', text: 'ચોપડી (નજીક)' }, { id: 'b', text: 'ઝાડ (દૂર)', correct: true }] },
  ];

  const currentQ = miniQuestions[qIndex];

  const handlePick = (opt) => {
    playClickSound();
    const nextAnswers = { ...answers, [currentQ.id]: opt };
    setAnswers(nextAnswers);

    if (qIndex < miniQuestions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      // Calculate mini check result
      let score = 0;
      const weak = [];
      miniQuestions.forEach((q) => {
        if (nextAnswers[q.id]?.correct) {
          score += 1;
        } else {
          weak.push(q.concept);
        }
      });
      setFinished(true);
      onComplete({ score, total: 5, weakConcepts: Array.from(new Set(weak)) });
    }
  };

  const isPassing = Object.values(answers).filter((a) => a.correct).length >= 4;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-gujarati">
            ઝડપી ડાયગ્નોસ્ટિક ચેક (Mini-Check {qIndex + 1}/5)
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            {!finished ? currentQ.prompt : 'ચેક પરિણામ'}
          </h3>
        </div>
      </div>

      {!finished ? (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 text-center space-y-6">
          <div className="flex items-center justify-center gap-6 py-6 flex-wrap">
            {currentQ.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePick(opt)}
                className="px-8 py-4 bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-400 rounded-2xl font-black text-sm text-slate-800 font-gujarati shadow-sm active:scale-95 transition-all"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-8 border-2 border-indigo-300 text-center space-y-6">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md">
            🔍
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-gujarati">
              મિની-ચેક પરિણામ: {Object.values(answers).filter((a) => a.correct).length} / 5
            </h3>
            <p className="text-xs text-slate-600 font-gujarati mt-1">
              {isPassing ? 'તમારી સમજ ઉત્તમ છે! હવે આખરી કસોટી માટે તૈયાર છો.' : 'થોડું વધુ પુનરાવર્તન મદદરૂપ થશે.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onGoToTest}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-black text-xs rounded-xl shadow-md font-gujarati flex items-center gap-2"
            >
              <span>આખરી કસોટી શરૂ કરો (Start Final Test →)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 5: FINAL ASSESSMENT TEST (10 QUESTIONS - 80% PASS THRESHOLD)
   ========================================================================== */
function AssessmentStage({ moduleState, onTestFinished, onRetryPractice, onGoToComplete }) {
  const [qIndex, setQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  const testQuestions = [
    {
      id: 1,
      concept: 'aboveBelow',
      prompt: 'પ્રશ્ન ૧: વસ્તુ ટેબલની ક્યાં છે?',
      options: [
        { id: 'opt1', text: 'ટેબલની ઉપર', isCorrect: true },
        { id: 'opt2', text: 'ટેબલની નીચે', isCorrect: false },
      ],
    },
    {
      id: 2,
      concept: 'aboveBelow',
      prompt: 'પ્રશ્ન ૨: વસ્તુ ટેબલની ક્યાં મુકેલી છે?',
      options: [
        { id: 'opt1', text: 'ટેબલની નીચે', isCorrect: true },
        { id: 'opt2', text: 'ટેબલની ઉપર', isCorrect: false },
      ],
    },
    {
      id: 3,
      concept: 'relativeAboveBelow',
      prompt: 'પ્રશ્ન ૩: બાળકની ઉપર શું છે?',
      options: [
        { id: 'opt1', text: 'પતંગ', isCorrect: true },
        { id: 'opt2', text: 'પેટી', isCorrect: false },
      ],
    },
    {
      id: 4,
      concept: 'relativeAboveBelow',
      prompt: 'પ્રશ્ન ૪: બાળકની નીચે શું છે?',
      options: [
        { id: 'opt1', text: 'પેટી', isCorrect: true },
        { id: 'opt2', text: 'પુસ્તક', isCorrect: false },
      ],
    },
    {
      id: 5,
      concept: 'highLow',
      prompt: 'પ્રશ્ન ૫: આકાશમાં સૌથી ઊંચે શું છે?',
      options: [
        { id: 'opt1', text: 'પતંગ', isCorrect: true },
        { id: 'opt2', text: 'ગાડી', isCorrect: false },
      ],
    },
    {
      id: 6,
      concept: 'highLow',
      prompt: 'પ્રશ્ન ૬: નીચે જમીન પર શું છે?',
      options: [
        { id: 'opt1', text: 'ગાડી', isCorrect: true },
        { id: 'opt2', text: 'પતંગ', isCorrect: false },
      ],
    },
    {
      id: 7,
      concept: 'nearFar',
      prompt: 'પ્રશ્ન ૭: વસ્તુ બાળકની નજીક ક્યાં છે?',
      options: [
        { id: 'opt1', text: 'નજીક (ઓછું અંતર)', isCorrect: true },
        { id: 'opt2', text: 'દૂર (વધારે અંતર)', isCorrect: false },
      ],
    },
    {
      id: 8,
      concept: 'nearFar',
      prompt: 'પ્રશ્ન ૮: વસ્તુ બાળકથી દૂર ક્યાં છે?',
      options: [
        { id: 'opt1', text: 'દૂર (લાંબુ અંતર)', isCorrect: true },
        { id: 'opt2', text: 'નજીક (ટૂંકું અંતર)', isCorrect: false },
      ],
    },
    {
      id: 9,
      concept: 'mixed',
      prompt: 'પ્રશ્ન ૯: બાળકની ઉપર રહેલી વસ્તુ પસંદ કરો:',
      options: [
        { id: 'opt1', text: 'પુસ્તક (ઉપર)', isCorrect: true },
        { id: 'opt2', text: 'દડો (નીચે)', isCorrect: false },
      ],
    },
    {
      id: 10,
      concept: 'mixed',
      prompt: 'પ્રશ્ન ૧૦: બાળકની નજીક રહેલી વસ્તુ કઈ છે?',
      options: [
        { id: 'opt1', text: 'રમકડું (નજીક)', isCorrect: true },
        { id: 'opt2', text: 'ઝાડ (દૂર)', isCorrect: false },
      ],
    },
  ];

  const currentQ = testQuestions[qIndex];
  const selected = userAnswers[currentQ?.id];

  const handleSelect = (optId) => {
    playClickSound();
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleNext = () => {
    if (qIndex < testQuestions.length - 1) {
      setQIndex(qIndex + 1);
      playClickSound();
    }
  };

  const handlePrev = () => {
    if (qIndex > 0) {
      setQIndex(qIndex - 1);
      playClickSound();
    }
  };

  const handleSubmit = () => {
    let score = 0;
    const conceptBreakdown = {
      aboveBelow: { correct: 0, total: 0 },
      relativeAboveBelow: { correct: 0, total: 0 },
      highLow: { correct: 0, total: 0 },
      nearFar: { correct: 0, total: 0 },
    };

    testQuestions.forEach((q) => {
      const chosen = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      const isRight = chosen === correctOpt?.id;

      if (isRight) score += 1;

      if (conceptBreakdown[q.concept]) {
        conceptBreakdown[q.concept].total += 1;
        if (isRight) conceptBreakdown[q.concept].correct += 1;
      }
    });

    const total = testQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 80;

    const res = { score, total, percentage, passed, concepts: conceptBreakdown };
    setTestResult(res);
    onTestFinished(res);
  };

  const allAnswered = Object.keys(userAnswers).length === testQuestions.length;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 font-gujarati">
            ક્ષમતા મૂલ્યાંકન કસોટી (Question {qIndex + 1} of {testQuestions.length})
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            {!testResult ? currentQ.prompt : 'કસોટી પરિણામ (Test Result)'}
          </h3>
        </div>

        {!testResult && <GujaratiVoiceButton text={currentQ.prompt} label="પ્રશ્ન સાંભળો" size="sm" />}
      </div>

      {!testResult ? (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 space-y-6 text-center">
          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2">
            {testQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setQIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                  idx === qIndex
                    ? 'bg-indigo-600 text-white scale-110'
                    : userAnswers[q.id]
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="flex items-center justify-center gap-6 py-6 flex-wrap">
            {currentQ.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`px-8 py-5 rounded-2xl border-2 font-black text-sm font-gujarati transition-all ${
                  selected === opt.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md ring-4 ring-indigo-200 scale-105'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={handlePrev}
              disabled={qIndex === 0}
              className="px-4 py-2 bg-white border border-slate-300 disabled:opacity-40 rounded-xl text-xs font-bold font-gujarati flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>પાછળ</span>
            </button>

            {qIndex < testQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md font-gujarati flex items-center gap-1"
              >
                <span>આગળ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md font-gujarati flex items-center gap-1"
              >
                <span>કસોટી જમા કરો (Submit Test)</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : testResult.passed ? (
        /* Test Passed Result Screen (>= 80%) */
        <div className="bg-gradient-to-b from-emerald-50 via-white to-emerald-50 rounded-3xl p-8 border-4 border-emerald-400 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-xl animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase font-mono bg-emerald-100 text-emerald-900">
              સ્કોર: {testResult.score} / {testResult.total} ({testResult.percentage}%)
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
              અભિનંદન! તમે સ્થાનની સંકલ્પનાઓ સારી રીતે સમજી લીધી. 🎉
            </h3>
            <p className="text-sm font-bold text-emerald-800 font-gujarati">
              સિદ્ધિ સ્તર: <span className="text-emerald-900 underline">નિપુણ (Mastered)</span>
            </p>
          </div>

          <div className="bg-emerald-100/70 rounded-2xl p-4 border border-emerald-300 text-emerald-900 font-gujarati text-xs font-bold max-w-md mx-auto">
            🔓 આગળનું મોડ્યુલ (Module 3: ૧ થી ૫ સંખ્યાજ્ઞાન) હવે ખુલ્લું છે!
          </div>

          <div className="pt-2 flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={onGoToComplete}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-200 flex items-center gap-2 font-gujarati"
            >
              <span>આગળના મોડ્યુલ પર જાઓ →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Test Failed Result Screen (< 80%) */
        <div className="bg-gradient-to-b from-rose-50 via-white to-rose-50 rounded-3xl p-8 border-4 border-rose-300 text-center space-y-6 shadow-xl animate-fade-in">
          <div className="w-20 h-20 bg-rose-400 text-white rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-md">
            💪
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase font-mono bg-rose-100 text-rose-900">
              સ્કોર: {testResult?.score || 0} / {testResult?.total || 10} ({testResult?.percentage || 0}%)
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
              ચાલો ફરીથી શીખીએ! ✨
            </h3>
            <p className="text-xs md:text-sm font-semibold text-slate-600 font-gujarati max-w-md mx-auto">
              થોડી વધુ પ્રેક્ટિસ કરવાથી તમે વધુ સારું કરી શકશો. પાસ થવા માટે ૮૦% ગુણ જરૂરી છે.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <button
              onClick={onRetryPractice}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-md font-gujarati flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ફરી પ્રેક્ટિસ કરો (Retry Practice)</span>
            </button>

            <button
              onClick={() => {
                setTestResult(null);
                setQIndex(0);
                setUserAnswers({});
              }}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md font-gujarati flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ફરી ટેસ્ટ આપો (Retake Test)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 6: COMPLETED MASTERY SCREEN
   ========================================================================== */
function CompletedStage({ moduleState, onRevisitStage, onProceedNextModule }) {
  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-emerald-50 rounded-3xl p-8 border-4 border-emerald-400 text-center space-y-6 shadow-2xl">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto text-5xl shadow-xl shadow-emerald-200 animate-bounce">
        🏆
      </div>

      <div className="space-y-2">
        <span className="px-4 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full font-gujarati uppercase">
          મોડ્યુલ ૨ સફળતાપૂર્વક પૂર્ણ ✅
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-gujarati">
          અવકાશીય સંકલ્પનાઓ (Spatial Concepts)
        </h2>
        <p className="text-sm font-semibold text-emerald-700 font-gujarati max-w-md mx-auto">
          તમે ઉપર-નીચે, ની ઉપર-ની નીચે, ઊંચે અને નજીક-દૂરની સંકલ્પનાઓ સંપૂર્ણપણે સમજી લીધી છે!
        </p>
      </div>

      {/* Sub-Concept Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto py-2">
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">ઉપર / નીચે</span>
          <span className="text-base font-black text-emerald-700 font-mono">૧૦૦%</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">ની ઉપર / નીચે</span>
          <span className="text-base font-black text-emerald-700 font-mono">૧૦૦%</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">ઊંચે / નીચે</span>
          <span className="text-base font-black text-indigo-700 font-mono">૧૦૦%</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">નજીક / દૂર</span>
          <span className="text-base font-black text-emerald-600 font-mono">૧૦૦%</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-emerald-100">
        <button
          onClick={onProceedNextModule}
          className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
        >
          <span>આગળના મોડ્યુલ પર જાઓ (Next Module M-03 ➔)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   ADAPTIVE RELEARNING STAGE
   ========================================================================== */
function RelearnStage({ moduleState, onPracticeAgain }) {
  const weak = moduleState.weakConcepts || ['nearFar'];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-purple-300 shadow-xl space-y-6 text-center">
      <div className="space-y-1">
        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider font-gujarati">
          વિશેષ માર્ગદર્શન (Targeted Revision)
        </span>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          ચાલો આ સંકલ્પના વધુ પાકી કરીએ
        </h3>
        <p className="text-xs md:text-sm text-slate-600 font-gujarati max-w-md mx-auto">
          નજીક-દૂર અને ઉપર-નીચેની સરખામણી વધુ એક વાર રમીને શીખીએ!
        </p>
      </div>

      <div className="max-w-md mx-auto bg-purple-50 p-6 rounded-3xl border border-purple-200 space-y-4">
        <NearFarDistanceManipulative
          instruction="પુનરાવર્તન: વસ્તુને બાળકની નજીક મૂકો."
          targetZone="near"
          onSuccess={onPracticeAgain}
        />
      </div>
    </div>
  );
}
