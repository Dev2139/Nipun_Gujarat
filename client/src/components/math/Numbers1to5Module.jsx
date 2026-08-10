import React, { useState, useEffect } from 'react';
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
  VectorApple,
  VectorBlock,
  VectorBall,
  VectorPencil,
  VectorObjectItem,
  NumberCard,
  InteractiveNumberLine,
  OperationBasket,
} from './Numbers1to5SvgLibrary';
import {
  NumberRecognitionActivity,
  CountingActivity,
  NumberQuantityActivity,
  NumberSequenceActivity,
  NumberOrderActivity,
  AdditionObjectsActivity,
  AdditionNumberLineActivity,
  SubtractionObjectsActivity,
  SubtractionNumberLineActivity,
  MixedOperationActivity,
} from './Numbers1to5Components';
import {
  getSavedModule3Progress,
  saveModule3Progress,
  resetModule3Progress,
} from '../../services/module3ProgressState';
import {
  Play,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Gamepad2,
  FileCheck2,
  Trophy,
  HelpCircle,
  RefreshCw,
  Check,
  Search,
  Plus,
  Minus,
  Sparkles,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';

export default function Numbers1to5Module({ competency, progress, onTestReady }) {
  const navigate = useNavigate();

  // Load persistent progress state
  const [moduleState, setModuleState] = useState(() => getSavedModule3Progress());

  // Active Stage: 'video' | 'explore' | 'activities' | 'addition' | 'subtraction' | 'mixed' | 'practice' | 'minicheck' | 'test' | 'completed' | 'relearn'
  const [activeStage, setActiveStage] = useState(() => {
    const saved = getSavedModule3Progress();
    if (saved.passed) return 'completed';
    if (saved.practiceCompleted) return 'test';
    if (saved.guidedCompleted) return 'practice';
    return 'video';
  });

  const updateState = (patch) => {
    const next = saveModule3Progress(patch);
    setModuleState({ ...next });
    if (next.practiceCompleted && onTestReady) {
      onTestReady();
    }
  };

  useEffect(() => {
    const saved = getSavedModule3Progress();
    setModuleState(saved);
  }, []);

  /* ==========================================================================
     STAGES DEFINITION
     ========================================================================== */
  const stages = [
    { id: 'video', titleGujarati: 'વિડિયો', icon: Play, isUnlocked: true, isCompleted: moduleState.videoCompleted },
    { id: 'explore', titleGujarati: 'અંક ઓળખ', icon: BookOpen, isUnlocked: true, isCompleted: moduleState.guidedActivitiesDone?.length > 0 },
    { id: 'activities', titleGujarati: 'પ્રવૃત્તિઓ', icon: Sparkles, isUnlocked: true, isCompleted: moduleState.guidedActivitiesDone?.length >= 5 },
    { id: 'addition', titleGujarati: 'સરવાળો', icon: Plus, isUnlocked: true, isCompleted: moduleState.guidedActivitiesDone?.length >= 8 },
    { id: 'subtraction', titleGujarati: 'બાદબાકી', icon: Minus, isUnlocked: true, isCompleted: moduleState.guidedCompleted },
    { id: 'practice', titleGujarati: 'મહાવરો', icon: Gamepad2, isUnlocked: moduleState.guidedCompleted, isCompleted: moduleState.practiceCompleted },
    { id: 'minicheck', titleGujarati: 'ચેક', icon: Search, isUnlocked: moduleState.practiceCompleted, isCompleted: moduleState.miniCheckCompleted },
    { id: 'test', titleGujarati: 'કસોટી', icon: FileCheck2, isUnlocked: moduleState.practiceCompleted, isCompleted: moduleState.passed },
    { id: 'completed', titleGujarati: 'સિદ્ધિ', icon: Trophy, isUnlocked: moduleState.passed, isCompleted: moduleState.passed },
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
      {/* Top Stepper Journey Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-6 border-2 border-indigo-200 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-indigo-600 text-white font-black text-xs font-mono shadow-sm">
              M-03
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-gujarati">
                સંખ્યાજ્ઞાન અને ક્રિયાઓ (Numbers 1 to 5)
              </span>
              <h2 className="text-base md:text-lg font-black text-slate-900 font-gujarati">
                ૧ થી ૫ સુધીની સંખ્યાઓ અને સરળ સરવાળા-બાદબાકી
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <GujaratiVoiceButton
              text="૧ થી ૫ સુધીની સંખ્યાઓ અને સરળ સરવાળા-બાદબાકી શીખીએ."
              label="સાંભળો"
              size="sm"
            />
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 pt-2">
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
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-b from-indigo-600 to-purple-700 text-white shadow-md ring-2 ring-indigo-300 scale-105 z-10'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 cursor-pointer'
                    : isLocked
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-70'
                    : 'bg-white text-slate-700 border border-indigo-200 hover:border-indigo-400 cursor-pointer shadow-xs'
                }`}
              >
                <div className="flex items-center justify-center mb-0.5">
                  {isDone && !isActive ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : isLocked ? (
                    <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-bounce' : ''}`} />
                  )}
                </div>

                <span className={`text-[9px] sm:text-[10px] font-black font-gujarati tracking-tight text-center ${
                  isActive ? 'text-white' : ''
                }`}>
                  {idx + 1}. {stage.titleGujarati}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: VIDEO LESSON */}
      {activeStage === 'video' && (
        <VideoLessonStage
          moduleState={moduleState}
          onVideoComplete={() => {
            playSuccessSound();
            updateState({ videoCompleted: true, videoWatchedPercentage: 100 });
            setActiveStage('explore');
          }}
        />
      )}

      {/* STAGE 2: NUMBER EXPLORATION (1 TO 5) */}
      {activeStage === 'explore' && (
        <NumberExplorationStage
          onProceed={() => {
            playSuccessSound();
            setActiveStage('activities');
          }}
        />
      )}

      {/* STAGE 3: NUMBER SENSE ACTIVITIES (1 TO 5) */}
      {activeStage === 'activities' && (
        <NumberActivitiesStage
          moduleState={moduleState}
          onActivityDone={(actNum) => {
            const current = moduleState.guidedActivitiesDone || [];
            const updated = Array.from(new Set([...current, actNum]));
            updateState({ guidedActivitiesDone: updated });
          }}
          onGoToAddition={() => {
            playClickSound();
            setActiveStage('addition');
          }}
        />
      )}

      {/* STAGE 4: ADDITION INTERACTIVES */}
      {activeStage === 'addition' && (
        <AdditionInteractivesStage
          moduleState={moduleState}
          onActivityDone={(actNum) => {
            const current = moduleState.guidedActivitiesDone || [];
            const updated = Array.from(new Set([...current, actNum]));
            updateState({ guidedActivitiesDone: updated });
          }}
          onGoToSubtraction={() => {
            playClickSound();
            setActiveStage('subtraction');
          }}
        />
      )}

      {/* STAGE 5: SUBTRACTION INTERACTIVES */}
      {activeStage === 'subtraction' && (
        <SubtractionInteractivesStage
          moduleState={moduleState}
          onActivityDone={(actNum) => {
            const current = moduleState.guidedActivitiesDone || [];
            const updated = Array.from(new Set([...current, actNum]));
            const isAll = updated.length >= 10;
            updateState({ guidedActivitiesDone: updated, guidedCompleted: isAll });
          }}
          onGoToPractice={() => {
            playClickSound();
            setActiveStage('practice');
          }}
        />
      )}

      {/* STAGE 6: PRACTICE ROUND (12 QUESTIONS) */}
      {activeStage === 'practice' && (
        <PracticeRoundStage
          moduleState={moduleState}
          onComplete={({ score, total, accuracy, concepts }) => {
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

      {/* STAGE 7: MINI-CHECK DIAGNOSTIC (6 QUESTIONS) */}
      {activeStage === 'minicheck' && (
        <MiniCheckDiagnosticStage
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
        />
      )}

      {/* STAGE 8: FINAL ASSESSMENT TEST (10 QUESTIONS) */}
      {activeStage === 'test' && (
        <AssessmentTestStage
          moduleState={moduleState}
          onTestFinished={({ score, total, percentage, passed, concepts }) => {
            if (passed) {
              playFanfareSound();
              confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
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

      {/* STAGE 9: MASTERY SCREEN */}
      {activeStage === 'completed' && (
        <MasteryCompletedStage
          moduleState={moduleState}
          onProceedNextModule={() => {
            playClickSound();
            navigate('/student/path/mathematics');
          }}
        />
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 1: VIDEO LESSON (YouTube Privacy-Enhanced Player)
   ========================================================================== */
function VideoLessonStage({ moduleState, onVideoComplete }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6 text-center">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold font-gujarati">
          <Play className="w-3.5 h-3.5 fill-indigo-600" />
          <span>પગલું ૧: વિડિયો શિક્ષણ</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          STD-1 Maths | ગુજરાતી સરવાળા (૧ થી ૫)
        </h3>
        <p className="text-xs md:text-sm text-slate-600 font-gujarati max-w-md mx-auto">
          વિડિયો ધ્યાનથી જુઓ. પછી નીચેનું બટન દબાવી પ્રવૃત્તિઓ શરૂ કરો.
        </p>
      </div>

      {/* Responsive YouTube Embed Player */}
      <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-black">
        <iframe
          src="https://www.youtube-nocookie.com/embed/amphByfzQ1k?rel=0&modestbranding=1"
          title="STD-1 Maths Gujarati Addition"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onVideoComplete}
          className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-2 font-gujarati active:scale-95 transition-all"
        >
          <span>વિડિયો જોયો! આગળ વધો (Start Learning →)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   STAGE 2: NUMBER EXPLORATION (1 TO 5)
   ========================================================================== */
function NumberExplorationStage({ onProceed }) {
  const [selectedNum, setSelectedNum] = useState(1);

  const numbersData = [
    { num: '૧', val: 1, word: 'એક', label: 'એક સફરજન', phrase: 'આ ૧ છે. એક સફરજન.' },
    { num: '૨', val: 2, word: 'બે', label: 'બે બ્લૉક', phrase: 'આ ૨ છે. બે બ્લૉક.' },
    { num: '૩', val: 3, word: 'ત્રણ', label: 'ત્રણ દડા', phrase: 'આ ૩ છે. ત્રણ દડા.' },
    { num: '૪', val: 4, word: 'ચાર', label: 'ચાર પેન્સિલ', phrase: 'આ ૪ છે. ચાર પેન્સિલ.' },
    { num: '૫', val: 5, word: 'પાંચ', label: 'પાંચ સફરજન', phrase: 'આ ૫ છે. પાંચ સફરજન.' },
  ];

  const current = numbersData.find((d) => d.val === selectedNum) || numbersData[0];

  const handleSelect = (item) => {
    playClickSound();
    setSelectedNum(item.val);
    speakGujarati(item.phrase);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6 text-center">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold font-gujarati">
          <BookOpen className="w-3.5 h-3.5" />
          <span>સંખ્યા અન્વેષણ (૧ થી ૫)</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
          અંકો અને તેમની માત્રા ઓળખો
        </h3>
      </div>

      {/* Number Select Row */}
      <div className="flex items-center justify-center gap-3 py-2 flex-wrap">
        {numbersData.map((item) => (
          <NumberCard
            key={item.val}
            numeral={item.num}
            gujaratiWord={item.word}
            size="md"
            selected={selectedNum === item.val}
            onClick={() => handleSelect(item)}
          />
        ))}
      </div>

      {/* Quantity Viewport */}
      <div className="max-w-md mx-auto bg-gradient-to-b from-indigo-50/70 to-white rounded-3xl p-6 border-2 border-indigo-200 shadow-inner flex flex-col items-center space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-5xl font-black font-gujarati text-indigo-900 leading-none">
            {current.num}
          </span>
          <span className="text-2xl font-black font-gujarati text-indigo-700">
            ({current.word})
          </span>
        </div>

        {/* Visual Quantity Display */}
        <div className="flex items-center justify-center gap-3 flex-wrap min-h-[80px]">
          {Array.from({ length: current.val }).map((_, i) => (
            <VectorApple key={i} size={56} countBadge={i + 1} highlight />
          ))}
        </div>

        <GujaratiVoiceButton text={current.phrase} label="સાંભળો" size="sm" />
      </div>

      <button
        onClick={onProceed}
        className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
      >
        <span>પ્રવૃત્તિઓ શરૂ કરો (Start Activities →)</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ==========================================================================
   STAGE 3: NUMBER SENSE ACTIVITIES (1 TO 5)
   ========================================================================== */
function NumberActivitiesStage({ moduleState, onActivityDone, onGoToAddition }) {
  const [actIdx, setActIdx] = useState(0);

  const handleNext = () => {
    playClickSound();
    onActivityDone(actIdx + 1);
    if (actIdx < 4) {
      setActIdx(actIdx + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-gujarati">
            અંક અને ગણતરી પ્રવૃત્તિ {actIdx + 1} of 5
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            સંખ્યાજ્ઞાન રમતો
          </h3>
        </div>
      </div>

      {actIdx === 0 && (
        <NumberRecognitionActivity
          targetNumber="૫"
          targetWord="પાંચ"
          options={['૨', '૫', '૩']}
          onSuccess={handleNext}
        />
      )}

      {actIdx === 1 && (
        <CountingActivity
          count={4}
          objectType="apple"
          options={[3, 4, 5]}
          onSuccess={handleNext}
        />
      )}

      {actIdx === 2 && (
        <NumberQuantityActivity
          targetNumber={3}
          numeral="૩"
          onSuccess={handleNext}
        />
      )}

      {actIdx === 3 && (
        <NumberSequenceActivity
          sequence={['૧', '૨', '__', '૪', '૫']}
          missingIndex={2}
          correctAnswer="૩"
          options={['૨', '૩', '૫']}
          onSuccess={handleNext}
        />
      )}

      {actIdx === 4 && (
        <NumberOrderActivity onSuccess={handleNext} />
      )}

      {actIdx >= 4 && (
        <div className="text-center pt-4">
          <button
            onClick={onGoToAddition}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
          >
            <span>હવે સરવાળો શીખીએ (Go to Addition →)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 4: ADDITION INTERACTIVES (SUM <= 5)
   ========================================================================== */
function AdditionInteractivesStage({ moduleState, onActivityDone, onGoToSubtraction }) {
  const [addIdx, setAddIdx] = useState(0);

  const handleNext = () => {
    playClickSound();
    onActivityDone(5 + addIdx + 1);
    if (addIdx < 3) {
      setAddIdx(addIdx + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-gujarati">
            સરવાળો પ્રવૃત્તિ {addIdx + 1} of 4 (પરિણામ ≤ ૫)
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            સરવાળો: સમૂહ ભેગા કરવા
          </h3>
        </div>
      </div>

      {addIdx === 0 && (
        <AdditionObjectsActivity
          num1={2}
          num2={1}
          numeral1="૨"
          numeral2="૧"
          sum={3}
          sumNumeral="૩"
          objectType="block"
          options={[2, 3, 4]}
          onSuccess={handleNext}
        />
      )}

      {addIdx === 1 && (
        <AdditionObjectsActivity
          num1={3}
          num2={2}
          numeral1="૩"
          numeral2="૨"
          sum={5}
          sumNumeral="૫"
          objectType="apple"
          options={[3, 4, 5]}
          onSuccess={handleNext}
        />
      )}

      {addIdx === 2 && (
        <AdditionNumberLineActivity
          start={2}
          jump={2}
          result={4}
          onSuccess={handleNext}
        />
      )}

      {addIdx === 3 && (
        <AdditionObjectsActivity
          num1={4}
          num2={1}
          numeral1="૪"
          numeral2="૧"
          sum={5}
          sumNumeral="૫"
          objectType="pencil"
          options={[4, 5, 3]}
          onSuccess={handleNext}
        />
      )}

      {addIdx >= 3 && (
        <div className="text-center pt-4">
          <button
            onClick={onGoToSubtraction}
            className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-rose-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
          >
            <span>હવે બાદબાકી શીખીએ (Go to Subtraction →)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 5: SUBTRACTION INTERACTIVES (RESULT >= 0)
   ========================================================================== */
function SubtractionInteractivesStage({ moduleState, onActivityDone, onGoToPractice }) {
  const [subIdx, setSubIdx] = useState(0);

  const handleNext = () => {
    playClickSound();
    onActivityDone(8 + subIdx + 1);
    if (subIdx < 2) {
      setSubIdx(subIdx + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 font-gujarati">
            બાદબાકી પ્રવૃત્તિ {subIdx + 1} of 3 (વસ્તુઓ દૂર કરવી)
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            બાદબાકી: વસ્તુઓ દૂર કરવી
          </h3>
        </div>
      </div>

      {subIdx === 0 && (
        <SubtractionObjectsActivity
          total={5}
          remove={2}
          remaining={3}
          objectType="apple"
          options={[2, 3, 4]}
          onSuccess={handleNext}
        />
      )}

      {subIdx === 1 && (
        <SubtractionObjectsActivity
          total={4}
          remove={1}
          remaining={3}
          objectType="block"
          options={[2, 3, 4]}
          onSuccess={handleNext}
        />
      )}

      {subIdx === 2 && (
        <SubtractionNumberLineActivity
          start={5}
          backward={2}
          result={3}
          onSuccess={handleNext}
        />
      )}

      {subIdx >= 2 && (
        <div className="text-center pt-4">
          <button
            onClick={onGoToPractice}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
          >
            <span>સ્વતંત્ર મહાવરો શરૂ કરો (Start Practice →)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 6: PRACTICE ROUND (12 QUESTIONS WITH ADAPTIVE HINTS)
   ========================================================================== */
function PracticeRoundStage({ moduleState, onComplete, onGoToMiniCheck }) {
  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(moduleState.practiceCompleted || false);

  const practiceItems = [
    { id: 1, prompt: '૪ શોધો:', options: ['૨', '૪', '૧'], correct: '૪', hint: 'ચાર માટે ૪ પસંદ કરો.' },
    { id: 2, prompt: '૩ વસ્તુઓ ગણો:', options: ['૨', '૩', '૫'], correct: '૩', hint: 'વસ્તુઓ એક પછી એક ગણો.' },
    { id: 3, prompt: '૧ → ૨ → __ → ૪ → ૫', options: ['૨', '૩', '૫'], correct: '૩', hint: 'બે પછી ત્રણ (૩) આવે.' },
    { id: 4, prompt: '૧ + ૧ = ?', options: ['૨', '૩', '૧'], correct: '૨', hint: 'એક અને એક મળીને બે (૨) થાય.' },
    { id: 5, prompt: '૨ + ૧ = ?', options: ['૨', '૩', '૪'], correct: '૩', hint: 'બે માં એક ઉમેરો.' },
    { id: 6, prompt: '૨ + ૨ = ?', options: ['૩', '૪', '૫'], correct: '૪', hint: 'બે અને બે ચાર (૪) થાય.' },
    { id: 7, prompt: '૩ + ૨ = ?', options: ['૪', '૫', '૩'], correct: '૫', hint: 'ત્રણ માં બે ઉમેરતાં પાંચ (૫) થાય.' },
    { id: 8, prompt: '૩ − ૧ = ?', options: ['૧', '૨', '૩'], correct: '૨', hint: 'ત્રણ માંથી એક દૂર કરો.' },
    { id: 9, prompt: '૪ − ૨ = ?', options: ['૨', '૩', '૧'], correct: '૨', hint: 'ચાર માંથી બે દૂર કરતાં બે (૨) વધે.' },
    { id: 10, prompt: '૫ − ૨ = ?', options: ['૨', '૩', '૪'], correct: '૩', hint: 'પાંચ માંથી બે દૂર કરો.' },
    { id: 11, prompt: '૫ − ૧ = ?', options: ['૪', '૩', '૨'], correct: '૪', hint: 'પાંચ માંથી એક જાય તો ચાર (૪).' },
    { id: 12, prompt: '૪ + ૧ = ?', options: ['૩', '૪', '૫'], correct: '૫', hint: 'ચાર માં એક ઉમેરો.' },
  ];

  const current = practiceItems[qIndex];

  const handlePick = (opt) => {
    if (opt === current.correct) {
      playSuccessSound();
      const next = correctCount + 1;
      setCorrectCount(next);
      setFeedback({ correct: true, text: 'સાચો જવાબ! સરસ.' });

      setTimeout(() => {
        setFeedback(null);
        setHintLevel(0);
        if (qIndex < practiceItems.length - 1) {
          setQIndex(qIndex + 1);
        } else {
          setDone(true);
          const acc = Math.round((next / practiceItems.length) * 100);
          onComplete({
            score: next,
            total: practiceItems.length,
            accuracy: acc,
            concepts: {
              numberRecognition: { score: 95, attempts: 2 },
              counting: { score: 90, attempts: 2 },
              sequence: { score: 90, attempts: 2 },
              addition: { score: 85, attempts: 3 },
              subtraction: { score: 85, attempts: 3 },
            },
          });
        }
      }, 700);
    } else {
      playErrorSound();
      setHintLevel((prev) => Math.min(prev + 1, 3));
      setFeedback({ correct: false, text: `ફરી પ્રયાસ કરો. ${current.hint}` });
      speakGujarati(current.hint);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-gujarati">
            સ્વતંત્ર મહાવરો (Question {qIndex + 1} of {practiceItems.length})
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            {!done ? current.prompt : 'મહાવરો પૂર્ણ'}
          </h3>
        </div>
      </div>

      {!done ? (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 text-center space-y-6">
          <div className="flex items-center justify-center gap-4 py-4 flex-wrap">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handlePick(opt)}
                className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 font-black text-3xl font-gujarati shadow-sm active:scale-95 transition-all text-slate-900"
              >
                {opt}
              </button>
            ))}
          </div>

          {hintLevel > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-bold text-amber-900 font-gujarati">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>મદદ: {current.hint}</span>
            </div>
          )}

          {feedback && (
            <div
              className={`p-3.5 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 max-w-sm mx-auto ${
                feedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-8 border-2 border-indigo-300 text-center space-y-6">
          <h3 className="text-2xl font-black text-slate-900 font-gujarati">
            મહાવરો પૂર્ણ થયો!
          </h3>
          <p className="text-xs text-slate-600 font-gujarati">
            હવે ઝડપી ૬-પ્રશ્ન મિની-ચેક કરી લઈએ.
          </p>
          <button
            onClick={onGoToMiniCheck}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md font-gujarati flex items-center gap-2 mx-auto"
          >
            <span>મિની-ચેક શરૂ કરો (Start Mini-Check →)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 7: MINI-CHECK DIAGNOSTIC (6 QUESTIONS)
   ========================================================================== */
function MiniCheckDiagnosticStage({ moduleState, onComplete, onGoToTest }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const miniQuestions = [
    { id: 1, concept: 'numberRecognition', prompt: '૧. ૫ શોધો:', options: [{ text: '૫', correct: true }, { text: '૨' }, { text: '૩' }] },
    { id: 2, concept: 'counting', prompt: '૨. ૪ વસ્તુઓ ગણો:', options: [{ text: '૪', correct: true }, { text: '૩' }, { text: '૫' }] },
    { id: 3, concept: 'sequence', prompt: '૩. ૧ → ૨ → __ → ૪', options: [{ text: '૩', correct: true }, { text: '૫' }, { text: '૧' }] },
    { id: 4, concept: 'addition', prompt: '૪. ૨ + ૧ = ?', options: [{ text: '૩', correct: true }, { text: '૨' }, { text: '૪' }] },
    { id: 5, concept: 'subtraction', prompt: '૫. ૫ − ૨ = ?', options: [{ text: '૩', correct: true }, { text: '૨' }, { text: '૪' }] },
    { id: 6, concept: 'mixed', prompt: '૬. વસ્તુઓ ભેગી થાય તેને શું કહેવાય?', options: [{ text: 'સરવાળો (+)', correct: true }, { text: 'બાદબાકી (−)' }] },
  ];

  const currentQ = miniQuestions[qIdx];

  const handlePick = (opt) => {
    playClickSound();
    const nextAnswers = { ...answers, [currentQ.id]: opt };
    setAnswers(nextAnswers);

    if (qIdx < miniQuestions.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      let score = 0;
      const weak = [];
      miniQuestions.forEach((q) => {
        if (nextAnswers[q.id]?.correct) score += 1;
        else weak.push(q.concept);
      });
      setFinished(true);
      onComplete({ score, total: 6, weakConcepts: Array.from(new Set(weak)) });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-indigo-300 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 font-gujarati">
            મિની-ચેક (Question {qIdx + 1}/6)
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            {!finished ? currentQ.prompt : 'મિની-ચેક પરિણામ'}
          </h3>
        </div>
      </div>

      {!finished ? (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 text-center space-y-6">
          <div className="flex items-center justify-center gap-4 py-4 flex-wrap">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handlePick(opt)}
                className="px-8 py-4 bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-400 rounded-2xl font-black text-xl text-slate-800 font-gujarati shadow-sm active:scale-95 transition-all"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-8 border-2 border-indigo-300 text-center space-y-6">
          <h3 className="text-xl font-black text-slate-900 font-gujarati">
            મિની-ચેક પૂર્ણ! સ્કોર: {Object.values(answers).filter((a) => a.correct).length} / 6
          </h3>
          <button
            onClick={onGoToTest}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs rounded-xl shadow-md font-gujarati flex items-center gap-2 mx-auto"
          >
            <span>આખરી કસોટી શરૂ કરો (Start Final Assessment →)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 8: FINAL ASSESSMENT TEST (10 QUESTIONS - 80% PASS THRESHOLD)
   ========================================================================== */
function AssessmentTestStage({ moduleState, onTestFinished, onRetryPractice, onGoToComplete }) {
  const [qIndex, setQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  const testQuestions = [
    { id: 1, concept: 'counting', prompt: 'પ્રશ્ન ૧: ૪ સફરજન ગણો. કેટલી વસ્તુઓ છે?', options: [{ id: 'a', text: '૩' }, { id: 'b', text: '૪', isCorrect: true }, { id: 'c', text: '૫' }] },
    { id: 2, concept: 'sequence', prompt: 'પ્રશ્ન ૨: ૧ → ૨ → __ → ૪ → ૫', options: [{ id: 'a', text: '૩', isCorrect: true }, { id: 'b', text: '૫' }, { id: 'c', text: '૨' }] },
    { id: 3, concept: 'addition', prompt: 'પ્રશ્ન ૩: ૨ + ૧ = ?', options: [{ id: 'a', text: '૨' }, { id: 'b', text: '૩', isCorrect: true }, { id: 'c', text: '૪' }] },
    { id: 4, concept: 'addition', prompt: 'પ્રશ્ન ૪: ૨ + ૩ = ?', options: [{ id: 'a', text: '૪' }, { id: 'b', text: '૫', isCorrect: true }, { id: 'c', text: '૩' }] },
    { id: 5, concept: 'addition', prompt: 'પ્રશ્ન ૫: ૪ + ૧ = ?', options: [{ id: 'a', text: '૫', isCorrect: true }, { id: 'b', text: '૪' }, { id: 'c', text: '૩' }] },
    { id: 6, concept: 'subtraction', prompt: 'પ્રશ્ન ૬: ૫ માંથી ૨ દૂર કરો. કેટલી બાકી રહે? (૫ − ૨ = ?)', options: [{ id: 'a', text: '૨' }, { id: 'b', text: '૩', isCorrect: true }, { id: 'c', text: '૪' }] },
    { id: 7, concept: 'subtraction', prompt: 'પ્રશ્ન ૭: ૪ − ૧ = ?', options: [{ id: 'a', text: '૩', isCorrect: true }, { id: 'b', text: '૨' }, { id: 'c', text: '૪' }] },
    { id: 8, concept: 'subtraction', prompt: 'પ્રશ્ન ૮: ૩ − ૨ = ?', options: [{ id: 'a', text: '૧', isCorrect: true }, { id: 'b', text: '૨' }, { id: 'c', text: '૩' }] },
    { id: 9, concept: 'addition', prompt: 'પ્રશ્ન ૯: સંખ્યા રેખા પર ૨ થી ૨ ડગલાં આગળ કૂદો (૨ + ૨ = ?)', options: [{ id: 'a', text: '૩' }, { id: 'b', text: '૪', isCorrect: true }, { id: 'c', text: '૫' }] },
    { id: 10, concept: 'subtraction', prompt: 'પ્રશ્ન ૧૦: સંખ્યા રેખા પર ૫ થી ૩ ડગલાં પાછળ કૂદો (૫ − ૩ = ?)', options: [{ id: 'a', text: '૨', isCorrect: true }, { id: 'b', text: '૩' }, { id: 'c', text: '૧' }] },
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
    const concepts = {
      numberRecognition: { correct: 0, total: 0 },
      counting: { correct: 0, total: 0 },
      sequence: { correct: 0, total: 0 },
      addition: { correct: 0, total: 0 },
      subtraction: { correct: 0, total: 0 },
    };

    testQuestions.forEach((q) => {
      const chosen = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      const isRight = chosen === correctOpt?.id;

      if (isRight) score += 1;

      if (concepts[q.concept]) {
        concepts[q.concept].total += 1;
        if (isRight) concepts[q.concept].correct += 1;
      }
    });

    const total = testQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 80;

    const res = { score, total, percentage, passed, concepts };
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
      </div>

      {!testResult ? (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 space-y-6 text-center">
          {/* Navigation Grid */}
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
                className={`px-8 py-5 rounded-2xl border-2 font-black text-2xl font-gujarati transition-all ${
                  selected === opt.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md ring-4 ring-indigo-200 scale-105'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {/* Nav Controls */}
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
              અભિનંદન! તમે ૧ થી ૫ સુધીની સંખ્યાઓ અને સરળ સરવાળા-બાદબાકી શીખી લીધા. 🎉
            </h3>
            <p className="text-sm font-bold text-emerald-800 font-gujarati">
              સિદ્ધિ સ્તર: <span className="text-emerald-900 underline">નિપુણ (Mastered)</span>
            </p>
          </div>

          <div className="bg-emerald-100/70 rounded-2xl p-4 border border-emerald-300 text-emerald-900 font-gujarati text-xs font-bold max-w-md mx-auto">
            🔓 આગળનું મોડ્યુલ (Module 4: ૧ થી ૯ સંખ્યાજ્ઞાન) હવે ખુલ્લું છે!
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
              સરવાળા અને બાદબાકીનો થોડો વધુ મહાવરો કરવાથી તમે ૮૦% કરતાં વધુ સ્કોર કરી શકશો.
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
   STAGE 9: MASTERY COMPLETED STAGE
   ========================================================================== */
function MasteryCompletedStage({ moduleState, onProceedNextModule }) {
  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-emerald-50 rounded-3xl p-8 border-4 border-emerald-400 text-center space-y-6 shadow-2xl">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto text-5xl shadow-xl shadow-emerald-200 animate-bounce">
        🏆
      </div>

      <div className="space-y-2">
        <span className="px-4 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full font-gujarati uppercase">
          મોડ્યુલ ૩ સફળતાપૂર્વક પૂર્ણ ✅
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-gujarati">
          ૧ થી ૫ સંખ્યાજ્ઞાન અને સરવાળા-બાદબાકી
        </h2>
        <p className="text-sm font-semibold text-emerald-700 font-gujarati max-w-md mx-auto">
          તમે ૧ થી ૫ અંકો, ગણતરી, ક્રમ, સરળ સરવાળા (≤૫) અને બાદબાકી (≥૦) સંપૂર્ણપણે શીખી લીધા છે!
        </p>
      </div>

      {/* Sub-Skill Analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-2xl mx-auto py-2">
        <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">અંક ઓળખ</span>
          <span className="text-base font-black text-emerald-700 font-mono">૧૦૦%</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">ગણતરી</span>
          <span className="text-base font-black text-emerald-700 font-mono">૧૦૦%</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">ક્રમ ગોઠવણી</span>
          <span className="text-base font-black text-indigo-700 font-mono">૧૦૦%</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">સરવાળો (≤૫)</span>
          <span className="text-base font-black text-emerald-600 font-mono">૧૦૦%</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">બાદબાકી (≥૦)</span>
          <span className="text-base font-black text-emerald-600 font-mono">૧૦૦%</span>
        </div>
      </div>

      <div className="pt-4 border-t border-emerald-100">
        <button
          onClick={onProceedNextModule}
          className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
        >
          <span>આગળના મોડ્યુલ પર જાઓ (Next Module M-04 ➔)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
