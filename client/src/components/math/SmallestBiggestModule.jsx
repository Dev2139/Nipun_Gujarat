import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import SvgObject, { OBJECT_CATALOG } from './SvgObjectLibrary';
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
  getSavedModule1Progress,
  saveModule1Progress,
  resetModule1Progress,
} from '../../services/module1ProgressState';
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
  Award,
  Video,
  BookOpen,
  Gamepad2,
  FileCheck2,
  Trophy,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  Star,
  Check,
  Flame,
  Lightbulb
} from 'lucide-react';

export default function SmallestBiggestModule({ competency, progress, onTestReady }) {
  const navigate = useNavigate();

  // Load persistent progress state
  const [moduleState, setModuleState] = useState(() => getSavedModule1Progress());

  // Active Stage: 'video' | 'learning' | 'practice' | 'test' | 'completed'
  const [activeStage, setActiveStage] = useState(() => {
    const saved = getSavedModule1Progress();
    if (saved.passed) return 'completed';
    if (saved.practiceCompleted) return 'test';
    if (saved.learningCompleted) return 'practice';
    if (saved.videoCompleted) return 'learning';
    return 'video';
  });

  // Keep state synced
  const updateState = (patch) => {
    const next = saveModule1Progress(patch);
    setModuleState({ ...next });
    if (next.practiceCompleted && onTestReady) {
      onTestReady();
    }
  };

  // Re-read on mount
  useEffect(() => {
    const saved = getSavedModule1Progress();
    setModuleState(saved);
  }, []);

  /* ==========================================================================
     TOP PROGRESS JOURNEY STEPPER
     1. 🎬 Video  2. 📚 Learning  3. 🎮 Practice  4. 📝 Test  5. 🏆 Completed
     ========================================================================== */
  const journeyStages = [
    {
      id: 'video',
      titleGujarati: 'વિડિયો',
      titleEnglish: 'Video',
      icon: Video,
      isUnlocked: true,
      isCompleted: moduleState.videoCompleted,
    },
    {
      id: 'learning',
      titleGujarati: 'શીખવું',
      titleEnglish: 'Learning',
      icon: BookOpen,
      isUnlocked: moduleState.videoCompleted,
      isCompleted: moduleState.learningCompleted,
    },
    {
      id: 'practice',
      titleGujarati: 'મહાવરો',
      titleEnglish: 'Practice',
      icon: Gamepad2,
      isUnlocked: moduleState.learningCompleted,
      isCompleted: moduleState.practiceCompleted,
    },
    {
      id: 'test',
      titleGujarati: 'કસોટી',
      titleEnglish: 'Test',
      icon: FileCheck2,
      isUnlocked: moduleState.practiceCompleted,
      isCompleted: moduleState.passed,
    },
    {
      id: 'completed',
      titleGujarati: 'સફળતા',
      titleEnglish: 'Complete',
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
      {/* =========================================================================
          JOURNEY PROGRESS BAR AT TOP
          ========================================================================= */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 md:p-6 border-2 border-emerald-200 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-500 text-white font-black text-xs font-mono shadow-sm">
              M-01
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-gujarati">
                ગણિત અધ્યયન યાત્રા (Learning Journey)
              </span>
              <h2 className="text-base md:text-lg font-black text-slate-900 font-gujarati">
                સૌથી નાની અને સૌથી મોટી વસ્તુઓની સરખામણી કરે છે
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <GujaratiVoiceButton
              text="સૌથી નાની અને સૌથી મોટી વસ્તુઓની સરખામણી કરે છે. વિડિયો, શીખવું, મહાવરો અને કસોટી પૂર્ણ કરો."
              label="સાંભળો"
              size="sm"
            />
          </div>
        </div>

        {/* Stepper Nodes */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {journeyStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            const isDone = stage.isCompleted;
            const isLocked = !stage.isUnlocked && !stage.isCompleted;

            return (
              <button
                key={stage.id}
                onClick={() => handleStageClick(stage)}
                disabled={isLocked}
                className={`relative flex flex-col items-center justify-center p-2.5 md:p-3.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 ring-4 ring-emerald-200 scale-105 z-10'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300 hover:bg-emerald-100 cursor-pointer'
                    : isLocked
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75'
                    : 'bg-white text-slate-700 border-2 border-amber-300 hover:border-amber-400 cursor-pointer shadow-xs'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {isDone && !isActive ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isLocked ? (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'animate-bounce' : ''}`} />
                  )}
                </div>

                <span className={`text-[11px] md:text-xs font-black font-gujarati tracking-tight text-center ${
                  isActive ? 'text-white' : ''
                }`}>
                  {idx + 1}. {stage.titleGujarati}
                </span>

                {/* Sub status */}
                <span className={`text-[9px] font-bold mt-0.5 ${
                  isActive
                    ? 'text-emerald-100'
                    : isDone
                    ? 'text-emerald-600'
                    : isLocked
                    ? 'text-slate-400'
                    : 'text-amber-600'
                }`}>
                  {isDone ? '✅ પૂર્ણ' : isActive ? '🚀 ચાલુ' : isLocked ? '🔒 લૉક' : '🔓 તૈયાર'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          STAGE 1: VIDEO STAGE
          ========================================================================= */}
      {activeStage === 'video' && (
        <VideoStage
          moduleState={moduleState}
          onVideoComplete={() => {
            playSuccessSound();
            updateState({
              videoCompleted: true,
              videoWatchedPercentage: 100,
              learningUnlocked: true,
            });
          }}
          onGoToLearning={() => {
            playClickSound();
            setActiveStage('learning');
          }}
        />
      )}

      {/* =========================================================================
          STAGE 2: LEARNING STAGE (7 STEPS)
          ========================================================================= */}
      {activeStage === 'learning' && (
        <LearningStage
          moduleState={moduleState}
          onStepComplete={(stepNumber) => {
            const currentSteps = moduleState.learningStepsCompleted || [];
            const updatedSteps = Array.from(new Set([...currentSteps, stepNumber]));
            const isAllDone = updatedSteps.length >= 7;
            updateState({
              learningStepsCompleted: updatedSteps,
              currentLearningStep: Math.min(stepNumber + 1, 7),
              learningCompleted: isAllDone,
            });
          }}
          onGoToPractice={() => {
            playClickSound();
            setActiveStage('practice');
          }}
        />
      )}

      {/* =========================================================================
          STAGE 3: PRACTICE STAGE (10 ACTIVITIES)
          ========================================================================= */}
      {activeStage === 'practice' && (
        <PracticeStage
          moduleState={moduleState}
          onPracticeComplete={({ accuracy, score, total }) => {
            playSuccessSound();
            updateState({
              practiceCompleted: true,
              practiceAccuracy: accuracy,
              practiceScore: score,
              testUnlocked: true,
              activitiesCompleted: total,
            });
          }}
          onGoToTest={() => {
            playClickSound();
            setActiveStage('test');
          }}
        />
      )}

      {/* =========================================================================
          STAGE 4: TEST STAGE (10 QUESTIONS)
          ========================================================================= */}
      {activeStage === 'test' && (
        <TestStage
          moduleState={moduleState}
          onTestFinished={({ score, total, percentage, passed }) => {
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

      {/* =========================================================================
          STAGE 5: MODULE COMPLETED / MASTERY SCREEN
          ========================================================================= */}
      {activeStage === 'completed' && (
        <CompletedStage
          moduleState={moduleState}
          onRevisitVideo={() => {
            playClickSound();
            setActiveStage('video');
          }}
          onRevisitLearning={() => {
            playClickSound();
            setActiveStage('learning');
          }}
          onRevisitPractice={() => {
            playClickSound();
            setActiveStage('practice');
          }}
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
   STAGE 1: VIDEO STAGE COMPONENT
   Interactive Presentation Player with Gujarati Audio, Real SVG Objects, Scenes
   ========================================================================== */
function VideoStage({ moduleState, onVideoComplete, onGoToLearning }) {
  const [videoMode, setVideoMode] = useState('youtube'); // 'youtube' | 'interactive'
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(moduleState.videoCompleted || false);
  const timerRef = useRef(null);

  const youtubeVideoId = 'osssUip3vHk';
  const youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&playsinline=1`;

  const handleMarkVideoDone = () => {
    playSuccessSound();
    setVideoFinished(true);
    onVideoComplete();
  };

  const scenes = [
    {
      id: 1,
      title: 'કદ ઓળખીએ (What is Size?)',
      narration: 'ચાલો શીખીએ કે કઈ વસ્તુ નાની છે અને કઈ વસ્તુ મોટી છે. આપણી આસપાસની દરેક વસ્તુનું કદ અલગ અલગ હોય છે!',
      renderIllustration: () => (
        <div className="flex items-center justify-center gap-6 py-6 animate-fade-in">
          <div className="text-center space-y-2">
            <SvgObject name="ball" size="small" highlight />
            <span className="block text-xs font-black text-blue-800 bg-blue-100 px-3 py-1 rounded-full font-gujarati">
              નાનું (Small)
            </span>
          </div>
          <span className="text-3xl text-slate-400 font-bold">vs</span>
          <div className="text-center space-y-2">
            <SvgObject name="ball" size="large" highlight />
            <span className="block text-xs font-black text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full font-gujarati">
              મોટું (Large)
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'નાનું અને મોટું (Small vs Big)',
      narration: 'જુઓ! આ પીળી પેન્સિલ નાની છે, અને આ લીલું ઝાડ મોટું છે. નાની વસ્તુ ઓછી જગ્યા રોકે, મોટી વસ્તુ વધારે જગ્યા રોકે!',
      renderIllustration: () => (
        <div className="flex items-end justify-center gap-8 py-6">
          <div className="text-center space-y-2">
            <SvgObject name="pencil" size="small" />
            <span className="block text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-gujarati">
              નાની પેન્સિલ ✏️
            </span>
          </div>
          <div className="text-center space-y-2">
            <SvgObject name="tree" size="large" />
            <span className="block text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-gujarati">
              મોટું ઝાડ 🌳
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'નાનું, મધ્યમ, મોટું (Three Sizes)',
      narration: 'જ્યારે ત્રણ વસ્તુઓ હોય, ત્યારે નાનું, મધ્યમ અને મોટું કદ ઓળખી શકાય. જેમ કે સફરજન: નાનું સફરજન, મધ્યમ સફરજન, અને મોટું સફરજન!',
      renderIllustration: () => (
        <div className="flex items-end justify-center gap-6 py-6">
          <div className="text-center space-y-2 animate-bounce" style={{ animationDelay: '0ms' }}>
            <SvgObject name="apple" size="small" />
            <span className="block text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full font-gujarati">
              ૧. નાનું
            </span>
          </div>
          <div className="text-center space-y-2 animate-bounce" style={{ animationDelay: '200ms' }}>
            <SvgObject name="apple" size="medium" />
            <span className="block text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full font-gujarati">
              ૨. મધ્યમ
            </span>
          </div>
          <div className="text-center space-y-2 animate-bounce" style={{ animationDelay: '400ms' }}>
            <SvgObject name="apple" size="large" />
            <span className="block text-[11px] font-bold text-rose-900 bg-rose-200 px-2.5 py-0.5 rounded-full font-gujarati">
              ૩. મોટું
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'સૌથી નાનું ઓળખીએ (Finding the Smallest)',
      narration: 'બધી વસ્તુઓમાંથી જેનું કદ સૌથી ઓછું હોય, તેને સૌથી નાની વસ્તુ કહેવાય. અહીં ઉંદર સૌથી નાનો છે!',
      renderIllustration: () => (
        <div className="flex items-end justify-center gap-6 py-6">
          <div className="text-center space-y-2 ring-4 ring-emerald-400 bg-emerald-50 rounded-2xl p-2 scale-110 shadow-md">
            <SvgObject name="mouse" size="small" />
            <span className="block text-xs font-black text-emerald-800 bg-emerald-200 px-3 py-1 rounded-full font-gujarati">
              ⭐ સૌથી નાનો ઉંદર
            </span>
          </div>
          <div className="text-center space-y-2 opacity-60">
            <SvgObject name="cup" size="medium" />
            <span className="block text-xs font-semibold text-slate-600 font-gujarati">
              કપ
            </span>
          </div>
          <div className="text-center space-y-2 opacity-60">
            <SvgObject name="bottle" size="large" />
            <span className="block text-xs font-semibold text-slate-600 font-gujarati">
              બોટલ
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'સૌથી મોટું ઓળખીએ (Finding the Largest)',
      narration: 'બધી વસ્તુઓમાંથી જેનું કદ સૌથી વધારે વિશાળ હોય, તેને સૌથી મોટી વસ્તુ કહેવાય. અહીં હાથી સૌથી મોટો છે!',
      renderIllustration: () => (
        <div className="flex items-end justify-center gap-6 py-6">
          <div className="text-center space-y-2 opacity-60">
            <SvgObject name="ball" size="small" />
            <span className="block text-xs font-semibold text-slate-600 font-gujarati">
              દડો
            </span>
          </div>
          <div className="text-center space-y-2 opacity-60">
            <SvgObject name="car" size="medium" />
            <span className="block text-xs font-semibold text-slate-600 font-gujarati">
              ગાડી
            </span>
          </div>
          <div className="text-center space-y-2 ring-4 ring-emerald-400 bg-emerald-50 rounded-2xl p-2 scale-110 shadow-md">
            <SvgObject name="elephant" size="large" />
            <span className="block text-xs font-black text-emerald-800 bg-emerald-200 px-3 py-1 rounded-full font-gujarati">
              ⭐ સૌથી મોટો હાથી
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'સારાંશ અને નિષ્કર્ષ (Summary)',
      narration: 'અદ્ભુત! હવે તમે નાનું, મોટું, સૌથી નાનું અને સૌથી મોટું ઓળખવાનું શીખી ગયા છો. ચાલો હવે જાતે શીખીએ!',
      renderIllustration: () => (
        <div className="grid grid-cols-4 gap-4 py-4 max-w-md mx-auto">
          <div className="text-center">
            <SvgObject name="apple" size="small" />
            <span className="text-[10px] font-bold text-slate-700 font-gujarati">નાનું</span>
          </div>
          <div className="text-center">
            <SvgObject name="bottle" size="medium" />
            <span className="text-[10px] font-bold text-slate-700 font-gujarati">મધ્યમ</span>
          </div>
          <div className="text-center">
            <SvgObject name="tree" size="large" />
            <span className="text-[10px] font-bold text-slate-700 font-gujarati">મોટું</span>
          </div>
          <div className="text-center">
            <SvgObject name="elephant" size="large" />
            <span className="text-[10px] font-bold text-slate-700 font-gujarati">સૌથી મોટું</span>
          </div>
        </div>
      ),
    },
  ];

  const currentScene = scenes[currentSceneIndex];

  // Speak narration when scene changes
  const speakCurrentScene = (idx = currentSceneIndex) => {
    const text = scenes[idx]?.narration;
    if (text) {
      speakGujarati(text);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    speakCurrentScene(currentSceneIndex);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIdx);
      playClickSound();
      speakCurrentScene(nextIdx);
    } else {
      // Video Finished
      setIsPlaying(false);
      handleMarkVideoDone();
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      const prevIdx = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIdx);
      playClickSound();
      speakCurrentScene(prevIdx);
    }
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    playClickSound();
    handlePlay();
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-300 shadow-xl space-y-6">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold font-gujarati mb-1">
            <Video className="w-3.5 h-3.5" />
            <span>તબક્કો ૧: શૈક્ષણિક વિડિયો (Stage 1 - Educational Video)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
            કદ ઓળખીએ: શું નાનું, શું મોટું ?
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-gujarati">
            ચાલો શીખીએ કે કઈ વસ્તુ નાની છે અને કઈ વસ્તુ મોટી છે.
          </p>
        </div>

        {/* Video Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              playClickSound();
              setVideoMode('youtube');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-gujarati transition-all ${
              videoMode === 'youtube'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎬 યૂટ્યુબ વિડિયો (YouTube)
          </button>
          <button
            onClick={() => {
              playClickSound();
              setVideoMode('interactive');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-gujarati transition-all ${
              videoMode === 'interactive'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✨ એનિમેશન પાર્ટ
          </button>
        </div>
      </div>

      {/* YOUTUBE EMBEDDED PLAYER */}
      {videoMode === 'youtube' && (
        <div className="space-y-4">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-black aspect-video max-h-[480px]">
            <iframe
              src={youtubeEmbedUrl}
              title="શું નાનું, શું મોટું ? || small and big || smallest and biggest"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-left space-y-0.5">
              <span className="text-xs font-bold text-slate-800 font-gujarati">
                📺 શીર્ષક: શું નાનું, શું મોટું ? (Small & Big Concepts)
              </span>
              <p className="text-[11px] text-slate-500 font-gujarati">
                વિડિયો પૂરો જોયા પછી નીચેના બટન પર ક્લિક કરીને આગળનું શિક્ષણ શરૂ કરો.
              </p>
            </div>

            {!videoFinished ? (
              <button
                onClick={handleMarkVideoDone}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95 transition-all font-gujarati whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>મેં વિડિયો જોયો (Mark as Completed)</span>
              </button>
            ) : (
              <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl font-gujarati flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>વિડિયો પૂર્ણ થયો ✅</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE ANIMATED CONCEPT WALKTHROUGH */}
      {videoMode === 'interactive' && (
        <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl border-4 border-slate-700 overflow-hidden min-h-[360px] flex flex-col justify-between">
          {/* Top Video Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/80 text-white font-bold text-xs font-mono">
                ભાગ {currentSceneIndex + 1} / {scenes.length}
              </span>
              <span className="text-sm font-bold text-emerald-300 font-gujarati">
                {currentScene.title}
              </span>
            </div>

            <button
              onClick={() => speakCurrentScene(currentSceneIndex)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1 text-xs font-gujarati"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>અવાજ</span>
            </button>
          </div>

          {/* Video Canvas / Animation Area */}
          <div className="my-auto py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
            {currentScene.renderIllustration()}
          </div>

          {/* Subtitles Box */}
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center space-y-1">
            <p className="text-sm md:text-base font-bold text-emerald-200 font-gujarati leading-relaxed">
              "{currentScene.narration}"
            </p>
          </div>

          {/* Timeline Progress Bar */}
          <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentSceneIndex + 1) / scenes.length) * 100}%` }}
            />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
            <button
              onClick={handlePrevScene}
              disabled={currentSceneIndex === 0}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold text-xs font-gujarati flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>પાછળ</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRestart}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                title="ફરીથી શરૂ કરો"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm font-gujarati flex items-center gap-2 shadow-lg shadow-emerald-900/50"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'રોકો' : 'શરૂ કરો'}</span>
              </button>
            </div>

            <button
              onClick={handleNextScene}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs font-gujarati flex items-center gap-1 shadow-md"
            >
              <span>{currentSceneIndex === scenes.length - 1 ? 'વિડિયો પૂર્ણ કરો' : 'આગળ'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Video Completed Screen / Unlock Prompt */}
      {videoFinished && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 rounded-3xl p-6 border-2 border-emerald-400 text-center space-y-4 shadow-lg animate-fade-in">
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md">
            🎉
          </div>
          <div>
            <h3 className="text-xl font-black text-emerald-900 font-gujarati">
              વિડિયો પૂર્ણ થયો!
            </h3>
            <p className="text-xs font-semibold text-emerald-700 font-gujarati mt-1">
              તમે કદની સરખામણીનો વિડિયો સફળતાપૂર્વક જોઈ લીધો છે. હવે આગળનું ઇન્ટરેક્ટિવ શિક્ષણ શરૂ કરીએ!
            </p>
          </div>

          <button
            onClick={onGoToLearning}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
          >
            <span>આગળ શીખીએ (Go to Learning →)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}



/* ==========================================================================
   STAGE 2: LEARNING STAGE (7 INTERACTIVE STEPS)
   ========================================================================== */
function LearningStage({ moduleState, onStepComplete, onGoToPractice }) {
  const [currentStep, setCurrentStep] = useState(moduleState.currentLearningStep || 1);
  const [completedSteps, setCompletedSteps] = useState(moduleState.learningStepsCompleted || []);
  const [stepFeedback, setStepFeedback] = useState(null);
  const [stepInteractionDone, setStepInteractionDone] = useState(false);

  const isStepUnlocked = (stepNum) => {
    if (stepNum === 1) return true;
    return completedSteps.includes(stepNum - 1) || completedSteps.includes(stepNum);
  };

  const handleStepSelect = (stepNum) => {
    if (isStepUnlocked(stepNum)) {
      playClickSound();
      setCurrentStep(stepNum);
      setStepFeedback(null);
      setStepInteractionDone(completedSteps.includes(stepNum));
    } else {
      playErrorSound();
      speakGujarati('પહેલાં આના આગળનું પગથિયું પૂર્ણ કરો');
    }
  };

  const handleCorrectStep = (customFeedback = '🎉 સરસ! તમે સાચો જવાબ આપ્યો.') => {
    playSuccessSound();
    setStepFeedback({ correct: true, text: customFeedback });
    setStepInteractionDone(true);
    const updated = Array.from(new Set([...completedSteps, currentStep]));
    setCompletedSteps(updated);
    onStepComplete(currentStep);
  };

  const handleWrongStep = (hintText = 'ફરીથી પ્રયત્ન કરો. કદ ધ્યાનથી જુઓ!') => {
    playErrorSound();
    setStepFeedback({ correct: false, text: hintText });
    speakGujarati(hintText);
  };

  const handleNextStep = () => {
    playClickSound();
    setStepFeedback(null);
    setStepInteractionDone(false);
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const allCompleted = completedSteps.length >= 7;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-300 shadow-xl space-y-6">
      {/* Learning Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold font-gujarati mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>તબક્કો ૨: ઇન્ટરેક્ટિવ શિક્ષણ (Stage 2 - Interactive Learning)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
            શીખવાનું પગથિયું: {currentStep} / 7
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-gujarati">
            એક પછી એક પગથિયું શીખો અને આગળ વધો.
          </p>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => {
            const isDone = completedSteps.includes(num);
            const isCurrent = currentStep === num;
            const isUnlocked = isStepUnlocked(num);

            return (
              <button
                key={num}
                onClick={() => handleStepSelect(num)}
                disabled={!isUnlocked}
                className={`w-8 h-8 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-amber-500 text-white ring-4 ring-amber-200 scale-110 shadow-md'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer'
                    : isUnlocked
                    ? 'bg-white text-slate-700 border border-slate-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                }`}
                title={`પગથિયું ${num}`}
              >
                {isDone ? '✓' : num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 space-y-6">
        {/* Step 1: નાનું એટલે શું? */}
        {currentStep === 1 && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-gujarati">
                પગથિયું ૧ (Step 1)
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
                નાનું એટલે શું? (What is Small?)
              </h3>
              <p className="text-sm text-slate-600 font-gujarati">
                અહીં બે દડા છે. જે દડો નાનો છે તેને સ્પર્શ (ટેપ) કરો:
              </p>
            </div>

            <div className="flex items-center justify-center gap-10 py-6">
              <div className="text-center space-y-2">
                <SvgObject
                  name="ball"
                  size="small"
                  onClick={() => handleCorrectStep('🎉 શાબાશ! આ બોલ નાનો છે.')}
                  className="hover:bg-emerald-50 rounded-3xl"
                />
                <span className="block text-xs font-bold text-slate-600 font-gujarati">દડો ૧</span>
              </div>

              <div className="text-center space-y-2">
                <SvgObject
                  name="ball"
                  size="large"
                  onClick={() => handleWrongStep('ના, આ બોલ તો મોટો છે. નાનો બોલ પસંદ કરો!')}
                  className="hover:bg-rose-50 rounded-3xl"
                />
                <span className="block text-xs font-bold text-slate-600 font-gujarati">દડો ૨</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: મોટું એટલે શું? */}
        {currentStep === 2 && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-gujarati">
                પગથિયું ૨ (Step 2)
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
                મોટું એટલે શું? (What is Big?)
              </h3>
              <p className="text-sm text-slate-600 font-gujarati">
                અહીં બે સફરજન છે. મોટો સફરજન પસંદ કરો:
              </p>
            </div>

            <div className="flex items-center justify-center gap-10 py-6">
              <div className="text-center space-y-2">
                <SvgObject
                  name="apple"
                  size="small"
                  onClick={() => handleWrongStep('આ તો નાનું સફરજન છે. મોટો સફરજન પસંદ કરો!')}
                  className="hover:bg-rose-50 rounded-3xl"
                />
                <span className="block text-xs font-bold text-slate-600 font-gujarati">સફરજન ૧</span>
              </div>

              <div className="text-center space-y-2">
                <SvgObject
                  name="apple"
                  size="large"
                  onClick={() => handleCorrectStep('🎉 ઉત્તમ! તમે મોટો સફરજન ઓળખી લીધો.')}
                  className="hover:bg-emerald-50 rounded-3xl"
                />
                <span className="block text-xs font-bold text-slate-600 font-gujarati">સફરજન ૨</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: નાનું, મધ્યમ, મોટું */}
        {currentStep === 3 && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-gujarati">
                પગથિયું ૩ (Step 3)
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
                નાનું, મધ્યમ અને મોટું (3 Sizes: Small, Medium, Large)
              </h3>
              <p className="text-sm text-slate-600 font-gujarati">
                ત્રણેય કપને ક્રમમાં જુઓ અને દરેકમાં રહેલ કદનો તફાવત સમજો:
              </p>
            </div>

            <div className="flex items-end justify-center gap-6 py-6">
              <div className="text-center space-y-2">
                <SvgObject name="cup" size="small" showLabel labelOverride="નાનું" />
              </div>
              <div className="text-center space-y-2">
                <SvgObject name="cup" size="medium" showLabel labelOverride="મધ્યમ" />
              </div>
              <div className="text-center space-y-2">
                <SvgObject name="cup" size="large" showLabel labelOverride="મોટું" />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleCorrectStep('🎉 બરાબર! નાનું → મધ્યમ → મોટું સમજાઈ ગયું.')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md font-gujarati"
              >
                મેં કદ સમજી લીધું 👍
              </button>
            </div>
          </div>
        )}

        {/* Step 4: સૌથી નાનું શોધો */}
        {currentStep === 4 && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-gujarati">
                પગથિયું ૪ (Step 4)
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
                સૌથી નાનું શોધો (Find the Smallest)
              </h3>
              <p className="text-sm text-slate-600 font-gujarati">
                આ ત્રણ પેન્સિલમાંથી <span className="font-black text-emerald-700">સૌથી નાની</span> પેન્સિલ કઈ છે?
              </p>
            </div>

            <div className="flex items-end justify-center gap-8 py-6">
              <div className="text-center space-y-2">
                <SvgObject
                  name="pencil"
                  size="large"
                  onClick={() => handleWrongStep('આ સૌથી મોટી પેન્સિલ છે. સૌથી નાની શોધો!')}
                />
                <span className="text-xs font-bold text-slate-600 font-gujarati">પેન્સિલ A</span>
              </div>
              <div className="text-center space-y-2">
                <SvgObject
                  name="pencil"
                  size="small"
                  onClick={() => handleCorrectStep('🎉 સાચો જવાબ! આ પેન્સિલ સૌથી નાની છે.')}
                />
                <span className="text-xs font-bold text-slate-600 font-gujarati">પેન્સિલ B</span>
              </div>
              <div className="text-center space-y-2">
                <SvgObject
                  name="pencil"
                  size="medium"
                  onClick={() => handleWrongStep('આ મધ્યમ પેન્સિલ છે. સૌથી નાની શોધો!')}
                />
                <span className="text-xs font-bold text-slate-600 font-gujarati">પેન્સિલ C</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: સૌથી મોટું શોધો */}
        {currentStep === 5 && (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-gujarati">
                પગથિયું ૫ (Step 5)
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
                સૌથી મોટું શોધો (Find the Largest)
              </h3>
              <p className="text-sm text-slate-600 font-gujarati">
                આ ત્રણ બોટલમાંથી <span className="font-black text-emerald-700">સૌથી મોટી</span> બોટલ પસંદ કરો:
              </p>
            </div>

            <div className="flex items-end justify-center gap-8 py-6">
              <div className="text-center space-y-2">
                <SvgObject
                  name="bottle"
                  size="small"
                  onClick={() => handleWrongStep('આ તો સૌથી નાની બોટલ છે. સૌથી મોટી બોટલ શોધો!')}
                />
                <span className="text-xs font-bold text-slate-600 font-gujarati">બોટલ A</span>
              </div>
              <div className="text-center space-y-2">
                <SvgObject
                  name="bottle"
                  size="large"
                  onClick={() => handleCorrectStep('🎉 બરાબર! આ બોટલ સૌથી મોટી છે.')}
                />
                <span className="text-xs font-bold text-slate-600 font-gujarati">બોટલ B</span>
              </div>
              <div className="text-center space-y-2">
                <SvgObject
                  name="bottle"
                  size="medium"
                  onClick={() => handleWrongStep('આ મધ્યમ બોટલ છે. સૌથી મોટી બોટલ શોધો!')}
                />
                <span className="text-xs font-bold text-slate-600 font-gujarati">બોટલ C</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: કદ પ્રમાણે ગોઠવો */}
        {currentStep === 6 && (
          <Step6OrderingActivity
            onComplete={() => handleCorrectStep('🎉 અદ્ભુત! તમે કદ પ્રમાણે સાચો ક્રમ ગોઠવ્યો.')}
          />
        )}

        {/* Step 7: વ્યવહારુ ઉદાહરણો (Real World) */}
        {currentStep === 7 && (
          <Step7RealWorldActivity
            onComplete={() => handleCorrectStep('🎉 અભિનંદન! તમે બધાં વ્યવહારુ ઉદાહરણો શીખી લીધા.')}
          />
        )}

        {/* Feedback Banner */}
        {stepFeedback && (
          <div
            className={`p-4 rounded-2xl font-gujarati text-sm font-bold text-center flex items-center justify-center gap-2 ${
              stepFeedback.correct
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 border border-rose-300 animate-shake'
            }`}
          >
            {stepFeedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <HelpCircle className="w-5 h-5 text-rose-600" />}
            <span>{stepFeedback.text}</span>
          </div>
        )}

        {/* Continue to Next Step Button */}
        {stepInteractionDone && currentStep < 7 && (
          <div className="text-center pt-2">
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md font-gujarati inline-flex items-center gap-2"
            >
              <span>આગળનું પગથિયું (Step {currentStep + 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Completion Banner when all 7 steps done */}
      {allCompleted && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 rounded-3xl p-6 border-2 border-emerald-400 text-center space-y-4 shadow-lg animate-fade-in">
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md">
            🎉
          </div>
          <div>
            <h3 className="text-xl font-black text-emerald-900 font-gujarati">
              શીખવાનું પૂર્ણ થયું! (Learning Completed)
            </h3>
            <p className="text-xs font-semibold text-emerald-700 font-gujarati mt-1">
              તમે તમામ ૭ પગથિયાં સફળતાપૂર્વક પૂર્ણ કર્યા છે. હવે સ્વતંત્ર મહાવરો કરીએ!
            </p>
          </div>

          <button
            onClick={onGoToPractice}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
          >
            <span>હવે પ્રેક્ટિસ કરીએ (Go to Practice →)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------
   Step 6 Subcomponent: Order Small -> Medium -> Large
------------------------------------------------------------- */
function Step6OrderingActivity({ onComplete }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([
    { id: 'large', size: 'large', label: 'મોટો બ્લૉક' },
    { id: 'small', size: 'small', label: 'નાનો બ્લૉક' },
    { id: 'medium', size: 'medium', label: 'મધ્યમ બ્લૉક' },
  ]);

  const handlePick = (item) => {
    playClickSound();
    const nextSelected = [...selectedItems, item];
    setSelectedItems(nextSelected);
    setAvailableItems(availableItems.filter((i) => i.id !== item.id));

    if (nextSelected.length === 3) {
      // Check if order is small -> medium -> large
      if (nextSelected[0].size === 'small' && nextSelected[1].size === 'medium' && nextSelected[2].size === 'large') {
        onComplete();
      } else {
        playErrorSound();
        speakGujarati('ક્રમ સાચો નથી. પહેલાં નાનું, પછી મધ્યમ, પછી મોટું મૂકો!');
        setTimeout(() => {
          setSelectedItems([]);
          setAvailableItems([
            { id: 'large', size: 'large', label: 'મોટો બ્લૉક' },
            { id: 'small', size: 'small', label: 'નાનો બ્લૉક' },
            { id: 'medium', size: 'medium', label: 'મધ્યમ બ્લૉક' },
          ]);
        }, 1500);
      }
    }
  };

  const handleReset = () => {
    setSelectedItems([]);
    setAvailableItems([
      { id: 'large', size: 'large', label: 'મોટો બ્લૉક' },
      { id: 'small', size: 'small', label: 'નાનો બ્લૉક' },
      { id: 'medium', size: 'medium', label: 'મધ્યમ બ્લૉક' },
    ]);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-1">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-gujarati">
          પગથિયું ૬ (Step 6)
        </span>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
          કદ પ્રમાણે ગોઠવો: નાનું ➔ મધ્યમ ➔ મોટું
        </h3>
        <p className="text-sm text-slate-600 font-gujarati">
          બ્લૉકને તેના કદ મુજબ નાનાથી મોટા ક્રમમાં પસંદ કરો:
        </p>
      </div>

      {/* Target Placement Slots */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-4">
        {[0, 1, 2].map((slotIdx) => {
          const filled = selectedItems[slotIdx];
          const slotLabels = ['૧. સૌથી નાનું', '૨. મધ્યમ', '૩. સૌથી મોટું'];

          return (
            <div
              key={slotIdx}
              className="h-36 rounded-2xl border-2 border-dashed border-slate-300 bg-white/80 flex flex-col items-center justify-center p-2 shadow-xs"
            >
              {filled ? (
                <div className="animate-scale-in">
                  <SvgObject name="block" size={filled.size} />
                  <span className="text-[10px] font-bold text-slate-700 font-gujarati block mt-1">
                    {filled.label}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-400 font-gujarati">
                  {slotLabels[slotIdx]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Available Clickable Blocks */}
      <div className="flex items-center justify-center gap-6">
        {availableItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handlePick(item)}
            className="cursor-pointer hover:scale-105 transition-all p-2 bg-white rounded-2xl border border-slate-200 shadow-xs"
          >
            <SvgObject name="block" size={item.size} />
          </div>
        ))}
      </div>

      {selectedItems.length > 0 && selectedItems.length < 3 && (
        <button
          onClick={handleReset}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 font-gujarati underline"
        >
          ફરીથી ગોઠવો (Reset)
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------
   Step 7 Subcomponent: Real World Comparisons
------------------------------------------------------------- */
function Step7RealWorldActivity({ onComplete }) {
  const [subQuestion, setSubQuestion] = useState(0);

  const realQuestions = [
    {
      prompt: 'હાથી અને ઉંદરમાંથી સૌથી મોટું કોણ છે?',
      items: [
        { name: 'elephant', size: 'large', label: 'હાથી', isCorrect: true },
        { name: 'mouse', size: 'small', label: 'ઉંદર', isCorrect: false },
      ],
    },
    {
      prompt: 'ઝાડ અને ફૂલમાંથી સૌથી નાનું કયું છે?',
      items: [
        { name: 'tree', size: 'large', label: 'ઝાડ', isCorrect: false },
        { name: 'flower', size: 'small', label: 'ફૂલ', isCorrect: true },
      ],
    },
    {
      prompt: 'ગાડી અને દડામાંથી સૌથી મોટી વસ્તુ કઈ છે?',
      items: [
        { name: 'ball', size: 'small', label: 'દડો', isCorrect: false },
        { name: 'car', size: 'large', label: 'ગાડી', isCorrect: true },
      ],
    },
  ];

  const q = realQuestions[subQuestion];

  const handleAnswer = (item) => {
    if (item.isCorrect) {
      playSuccessSound();
      if (subQuestion < realQuestions.length - 1) {
        setSubQuestion(subQuestion + 1);
      } else {
        onComplete();
      }
    } else {
      playErrorSound();
      speakGujarati('ફરીથી વિચારો. બંને વસ્તુઓનું કદ જુઓ!');
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-1">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-gujarati">
          પગથિયું ૭ (Step 7 - Real World)
        </span>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
          {q.prompt}
        </h3>
        <span className="text-xs font-mono font-bold text-slate-400">
          પ્રશ્ન {subQuestion + 1} / {realQuestions.length}
        </span>
      </div>

      <div className="flex items-center justify-center gap-10 py-6">
        {q.items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleAnswer(item)}
            className="cursor-pointer hover:scale-105 transition-all p-4 bg-white rounded-3xl border-2 border-slate-200 shadow-sm text-center space-y-2"
          >
            <SvgObject name={item.name} size={item.size} />
            <span className="block text-xs font-bold text-slate-800 font-gujarati">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   STAGE 3: PRACTICE STAGE (10 FORGIVING ACTIVITIES)
   ========================================================================== */
function PracticeStage({ moduleState, onPracticeComplete, onGoToTest }) {
  const [activityIndex, setActivityIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [practiceDone, setPracticeDone] = useState(moduleState.practiceCompleted || false);

  // 10 Practice Activities covering all comparison variations
  const activities = [
    {
      id: 1,
      type: 'smallest',
      prompt: 'આમાંથી સૌથી નાની વસ્તુ શોધો:',
      items: [
        { name: 'apple', size: 'large', isCorrect: false },
        { name: 'apple', size: 'small', isCorrect: true },
        { name: 'apple', size: 'medium', isCorrect: false },
      ],
      hint: 'જે સફરજનનું કદ સૌથી ઓછું છે તે સૌથી નાનું કહેવાય.',
    },
    {
      id: 2,
      type: 'largest',
      prompt: 'આમાંથી સૌથી મોટી વસ્તુ પસંદ કરો:',
      items: [
        { name: 'ball', size: 'medium', isCorrect: false },
        { name: 'ball', size: 'large', isCorrect: true },
        { name: 'ball', size: 'small', isCorrect: false },
      ],
      hint: 'જે દડો સૌથી વિશાળ દેખાય તે સૌથી મોટો છે.',
    },
    {
      id: 3,
      type: 'smaller_pair',
      prompt: 'આ બે બોટલમાંથી કઈ બોટલ નાની છે?',
      items: [
        { name: 'bottle', size: 'small', isCorrect: true },
        { name: 'bottle', size: 'large', isCorrect: false },
      ],
      hint: 'ઓછી ઊંચાઈ વાળી બોટલ નાની છે.',
    },
    {
      id: 4,
      type: 'larger_pair',
      prompt: 'આ બે કપમાંથી કયો કપ મોટો છે?',
      items: [
        { name: 'cup', size: 'small', isCorrect: false },
        { name: 'cup', size: 'large', isCorrect: true },
      ],
      hint: 'વધારે કદ વાળો કપ મોટો છે.',
    },
    {
      id: 5,
      type: 'smallest_three',
      prompt: 'ત્રણ પેન્સિલોમાંથી સૌથી નાની પેન્સિલ પર ટેપ કરો:',
      items: [
        { name: 'pencil', size: 'medium', isCorrect: false },
        { name: 'pencil', size: 'large', isCorrect: false },
        { name: 'pencil', size: 'small', isCorrect: true },
      ],
      hint: 'સૌથી ટૂંકી પેન્સિલ સૌથી નાની છે.',
    },
    {
      id: 6,
      type: 'largest_three',
      prompt: 'ત્રણ ઝાડમાંથી સૌથી મોટું ઝાડ કયું છે?',
      items: [
        { name: 'tree', size: 'large', isCorrect: true },
        { name: 'tree', size: 'small', isCorrect: false },
        { name: 'tree', size: 'medium', isCorrect: false },
      ],
      hint: 'સૌથી મોટું અને ઘેઘૂર ઝાડ પસંદ કરો.',
    },
    {
      id: 7,
      type: 'real_world_compare',
      prompt: 'હાથી અને માછલીમાંથી કઈ વસ્તુ કદમાં સૌથી નાની છે?',
      items: [
        { name: 'elephant', size: 'large', label: 'હાથી', isCorrect: false },
        { name: 'fish', size: 'small', label: 'માછલી', isCorrect: true },
      ],
      hint: 'માછલીનું કદ હાથી કરતાં ઘણું નાનું હોય છે.',
    },
    {
      id: 8,
      type: 'real_world_large',
      prompt: 'ગાડી અને ફૂલમાંથી કઈ વસ્તુ કદમાં મોટી છે?',
      items: [
        { name: 'car', size: 'large', label: 'ગાડી', isCorrect: true },
        { name: 'flower', size: 'small', label: 'ફૂલ', isCorrect: false },
      ],
      hint: 'ગાડી ફૂલ કરતાં ઘણી મોટી હોય છે.',
    },
    {
      id: 9,
      type: 'watermelon_compare',
      prompt: 'આ ત્રણ તરબૂચમાંથી સૌથી મોટું તરબૂચ શોધો:',
      items: [
        { name: 'watermelon', size: 'small', isCorrect: false },
        { name: 'watermelon', size: 'medium', isCorrect: false },
        { name: 'watermelon', size: 'large', isCorrect: true },
      ],
      hint: 'સૌથી મોટો ટુકડો પસંદ કરો.',
    },
    {
      id: 10,
      type: 'mixed_smallest',
      prompt: 'આમાંથી સૌથી નાની વસ્તુ શોધો:',
      items: [
        { name: 'block', size: 'large', isCorrect: false },
        { name: 'block', size: 'small', isCorrect: true },
        { name: 'block', size: 'medium', isCorrect: false },
      ],
      hint: 'નાના કદનો બ્લૉક પસંદ કરો.',
    },
  ];

  const currentAct = activities[activityIndex];

  const handleChoice = (item) => {
    if (item.isCorrect) {
      playSuccessSound();
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      setFeedback({ correct: true, text: '🎉 ઉત્તમ! સાચો જવાબ છે.' });

      setTimeout(() => {
        setFeedback(null);
        if (activityIndex < activities.length - 1) {
          setActivityIndex(activityIndex + 1);
        } else {
          // Finished Practice
          const accuracy = Math.round((nextCorrect / activities.length) * 100);
          setPracticeDone(true);
          onPracticeComplete({
            accuracy,
            score: nextCorrect,
            total: activities.length,
          });
        }
      }, 900);
    } else {
      // Forgiving feedback
      playErrorSound();
      setFeedback({
        correct: false,
        text: `ફરીથી પ્રયત્ન કરો. ${currentAct.hint}`,
      });
      speakGujarati(`ફરીથી પ્રયત્ન કરો. ${currentAct.hint}`);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-300 shadow-xl space-y-6">
      {/* Practice Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold font-gujarati mb-1">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>તબક્કો ૩: સ્વતંત્ર મહાવરો (Stage 3 - Independent Practice)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
            મહાવરો પ્રવૃત્તિ: {activityIndex + 1} / {activities.length}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-gujarati">
            કદ ધ્યાનથી જુઓ અને સાચો વિકલ્પ પસંદ કરો. ભૂલ પડે તો ફરી પ્રયાસ કરો!
          </p>
        </div>

        <GujaratiVoiceButton
          text={currentAct.prompt}
          label="પ્રશ્ન સાંભળો"
          size="md"
        />
      </div>

      {!practiceDone ? (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 space-y-6 text-center">
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((activityIndex + 1) / activities.length) * 100}%` }}
            />
          </div>

          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati">
            {currentAct.prompt}
          </h3>

          {/* Interactive Objects */}
          <div className="flex items-end justify-center gap-8 py-6 flex-wrap">
            {currentAct.items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleChoice(item)}
                className="cursor-pointer hover:scale-105 active:scale-95 transition-all p-4 bg-white rounded-3xl border-2 border-slate-200 hover:border-purple-300 shadow-sm text-center"
              >
                <SvgObject name={item.name} size={item.size} />
                {item.label && (
                  <span className="block text-xs font-bold text-slate-700 font-gujarati mt-1">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl font-gujarati text-sm font-bold flex items-center justify-center gap-2 ${
                feedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300 animate-shake'
              }`}
            >
              {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Lightbulb className="w-5 h-5 text-amber-600" />}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      ) : (
        /* Practice Completed Card */
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-100 rounded-3xl p-8 border-2 border-purple-400 text-center space-y-6 shadow-xl animate-fade-in">
          <div className="w-16 h-16 bg-purple-500 text-white rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-md">
            🎉
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black text-purple-950 font-gujarati">
              પ્રેક્ટિસ પૂર્ણ! (Practice Completed)
            </h3>
            <p className="text-sm font-semibold text-purple-800 font-gujarati">
              તમે બધી ૧૦ પ્રવૃત્તિઓ સફળતાપૂર્વક પૂર્ણ કરી છે.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
            <div className="flex-1 bg-white p-3.5 rounded-2xl border border-purple-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-gujarati block">પ્રવૃત્તિઓ</span>
              <span className="text-xl font-black text-purple-700 font-mono">૧૦ / ૧૦</span>
            </div>
            <div className="flex-1 bg-white p-3.5 rounded-2xl border border-purple-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-gujarati block">ચોકસાઈ</span>
              <span className="text-xl font-black text-emerald-600 font-mono">
                {Math.round((correctCount / activities.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onGoToTest}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-purple-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
            >
              <span>હવે તમે ટેસ્ટ માટે તૈયાર છો! (ટેસ્ટ શરૂ કરો →)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAGE 4: TEST STAGE (10 ASSESSMENT QUESTIONS - 80% PASS THRESHOLD)
   ========================================================================== */
function TestStage({ moduleState, onTestFinished, onRetryPractice, onGoToComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(moduleState.passed || false);
  const [testResult, setTestResult] = useState(null);

  // 10 Comprehensive Assessment Questions (2 smallest, 2 largest, 2 pair compare, 2 three-item compare, 2 ordering)
  const testQuestions = [
    {
      id: 1,
      type: 'smallest',
      prompt: 'પ્રશ્ન ૧: નીચેનામાંથી સૌથી નાનો દડો પસંદ કરો:',
      options: [
        { id: 'opt1', name: 'ball', size: 'large' },
        { id: 'opt2', name: 'ball', size: 'small', isCorrect: true },
        { id: 'opt3', name: 'ball', size: 'medium' },
      ],
    },
    {
      id: 2,
      type: 'largest',
      prompt: 'પ્રશ્ન ૨: નીચેનામાંથી સૌથી મોટું સફરજન કયું છે?',
      options: [
        { id: 'opt1', name: 'apple', size: 'small' },
        { id: 'opt2', name: 'apple', size: 'medium' },
        { id: 'opt3', name: 'apple', size: 'large', isCorrect: true },
      ],
    },
    {
      id: 3,
      type: 'pair_smaller',
      prompt: 'પ્રશ્ન ૩: કઈ બોટલ નાની છે?',
      options: [
        { id: 'opt1', name: 'bottle', size: 'small', isCorrect: true },
        { id: 'opt2', name: 'bottle', size: 'large' },
      ],
    },
    {
      id: 4,
      type: 'pair_larger',
      prompt: 'પ્રશ્ન ૪: કયો કપ મોટો છે?',
      options: [
        { id: 'opt1', name: 'cup', size: 'large', isCorrect: true },
        { id: 'opt2', name: 'cup', size: 'small' },
      ],
    },
    {
      id: 5,
      type: 'three_smallest',
      prompt: 'પ્રશ્ન ૫: આમાંથી સૌથી નાની પેન્સિલ શોધો:',
      options: [
        { id: 'opt1', name: 'pencil', size: 'large' },
        { id: 'opt2', name: 'pencil', size: 'small', isCorrect: true },
        { id: 'opt3', name: 'pencil', size: 'medium' },
      ],
    },
    {
      id: 6,
      type: 'three_largest',
      prompt: 'પ્રશ્ન ૬: આમાંથી સૌથી મોટો બ્લૉક શોધો:',
      options: [
        { id: 'opt1', name: 'block', size: 'medium' },
        { id: 'opt2', name: 'block', size: 'small' },
        { id: 'opt3', name: 'block', size: 'large', isCorrect: true },
      ],
    },
    {
      id: 7,
      type: 'real_world_smallest',
      prompt: 'પ્રશ્ન ૭: હાથી, કપ અને ઉંદરમાંથી સૌથી નાનું કોણ છે?',
      options: [
        { id: 'opt1', name: 'elephant', size: 'large', label: 'હાથી' },
        { id: 'opt2', name: 'cup', size: 'medium', label: 'કપ' },
        { id: 'opt3', name: 'mouse', size: 'small', label: 'ઉંદર', isCorrect: true },
      ],
    },
    {
      id: 8,
      type: 'real_world_largest',
      prompt: 'પ્રશ્ન ૮: દડો, ઝાડ અને ફૂલમાંથી સૌથી મોટી વસ્તુ કઈ છે?',
      options: [
        { id: 'opt1', name: 'tree', size: 'large', label: 'ઝાડ', isCorrect: true },
        { id: 'opt2', name: 'flower', size: 'small', label: 'ફૂલ' },
        { id: 'opt3', name: 'ball', size: 'small', label: 'દડો' },
      ],
    },
    {
      id: 9,
      type: 'ordering_small_to_big',
      prompt: 'પ્રશ્ન ૯: સૌથી નાનાથી સૌથી મોટા ક્રમમાં પહેલી કઈ વસ્તુ આવે?',
      options: [
        { id: 'opt1', name: 'watermelon', size: 'small', label: 'નાનું તરબૂચ', isCorrect: true },
        { id: 'opt2', name: 'watermelon', size: 'large', label: 'મોટું તરબૂચ' },
      ],
    },
    {
      id: 10,
      type: 'ordering_big_to_small',
      prompt: 'પ્રશ્ન ૧૦: સૌથી મોટાથી સૌથી નાના ક્રમમાં પહેલી કઈ ગાડી આવે?',
      options: [
        { id: 'opt1', name: 'car', size: 'large', label: 'મોટી ગાડી', isCorrect: true },
        { id: 'opt2', name: 'car', size: 'small', label: 'નાની ગાડી' },
      ],
    },
  ];

  const currentQ = testQuestions[questionIndex];
  const selectedOpt = userAnswers[currentQ?.id];

  const handleOptionSelect = (optId) => {
    playClickSound();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const handleNext = () => {
    if (questionIndex < testQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      playClickSound();
    }
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      playClickSound();
    }
  };

  const handleTestSubmit = () => {
    let score = 0;
    testQuestions.forEach((q) => {
      const selected = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (selected === correctOpt?.id) {
        score += 1;
      }
    });

    const total = testQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 80; // 80% passing threshold

    const res = { score, total, percentage, passed };
    setTestResult(res);
    setTestSubmitted(true);
    onTestFinished(res);
  };

  const allAnswered = Object.keys(userAnswers).length === testQuestions.length;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-300 shadow-xl space-y-6">
      {/* Test Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold font-gujarati mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>તબક્કો ૪: ક્ષમતા મૂલ્યાંકન કસોટી (Stage 4 - Competency Test)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
            {!testSubmitted ? `પ્રશ્ન ${questionIndex + 1} / ${testQuestions.length}` : 'કસોટી પરિણામ (Test Result)'}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-gujarati">
            પાસ થવા માટે ઓછામાં ઓછા ૮૦% (૮/૧૦ ગુણ) જરૂરી છે.
          </p>
        </div>

        {!testSubmitted && (
          <GujaratiVoiceButton
            text={currentQ.prompt}
            label="પ્રશ્ન સાંભળો"
            size="md"
          />
        )}
      </div>

      {!testSubmitted ? (
        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border-2 border-slate-200 space-y-6">
          {/* Question Navigation Bubbles */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2">
            {testQuestions.map((q, idx) => {
              const isAnswered = Boolean(userAnswers[q.id]);
              const isCurrent = idx === questionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setQuestionIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                    isCurrent
                      ? 'bg-rose-500 text-white ring-2 ring-rose-300 scale-110'
                      : isAnswered
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <h3 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati text-center">
            {currentQ.prompt}
          </h3>

          {/* Options Grid */}
          <div className="flex items-end justify-center gap-8 py-6 flex-wrap">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOpt === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.id)}
                  className={`cursor-pointer hover:scale-105 transition-all p-4 rounded-3xl border-3 text-center space-y-2 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-md ring-4 ring-emerald-200'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <SvgObject name={opt.name} size={opt.size} />
                  {opt.label && (
                    <span className="block text-xs font-bold text-slate-800 font-gujarati">
                      {opt.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={handlePrev}
              disabled={questionIndex === 0}
              className="px-4 py-2 bg-white border border-slate-300 disabled:opacity-40 rounded-xl text-xs font-bold font-gujarati flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>પાછળ</span>
            </button>

            {questionIndex < testQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md font-gujarati flex items-center gap-1"
              >
                <span>આગળ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleTestSubmit}
                disabled={!allAnswered}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md font-gujarati flex items-center gap-1"
              >
                <span>કસોટી જમા કરો (Submit Test)</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : testResult?.passed ? (
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
              અભિનંદન! તમે આ મોડ્યુલ સફળતાપૂર્વક પૂર્ણ કર્યું. 🎉
            </h3>
            <p className="text-sm font-bold text-emerald-800 font-gujarati">
              સિદ્ધિ સ્તર: <span className="text-emerald-900 underline">નિપુણ (Mastered)</span>
            </p>
          </div>

          {/* Unlocked Message */}
          <div className="bg-emerald-100/70 rounded-2xl p-4 border border-emerald-300 text-emerald-900 font-gujarati text-xs font-bold max-w-md mx-auto">
            🔓 આગળનું મોડ્યુલ (Module 2: અવકાશીય સંકલ્પના) હવે ખુલ્લું છે!
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

          {/* Action Buttons */}
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
                setTestSubmitted(false);
                setQuestionIndex(0);
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
   STAGE 5: COMPLETED STAGE COMPONENT (CERTIFICATE & SUMMARY)
   ========================================================================== */
function CompletedStage({ moduleState, onRevisitVideo, onRevisitLearning, onRevisitPractice, onProceedNextModule }) {
  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-emerald-50 rounded-3xl p-8 border-4 border-emerald-400 text-center space-y-6 shadow-2xl">
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 text-white rounded-3xl flex items-center justify-center mx-auto text-5xl shadow-xl shadow-emerald-200 animate-bounce">
        🏆
      </div>

      <div className="space-y-2">
        <span className="px-4 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full font-gujarati uppercase">
          મોડ્યુલ ૧ સફળતાપૂર્વક પૂર્ણ ✅
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-gujarati">
          સૌથી નાની અને સૌથી મોટી વસ્તુઓની સરખામણી
        </h2>
        <p className="text-sm font-semibold text-emerald-700 font-gujarati max-w-md mx-auto">
          તમે વિડિયો, ૭ શીખવાના પગથિયાં, ૧૦ મહાવરો પ્રવૃત્તિઓ અને આખરી કસોટીમાં ઉત્કૃષ્ટ સિદ્ધિ મેળવી છે!
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto py-2">
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">વિડિયો</span>
          <span className="text-base font-black text-emerald-700 font-gujarati">✅ પૂર્ણ</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">શીખવું</span>
          <span className="text-base font-black text-emerald-700 font-mono">૭ / ૭</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">મહાવરો</span>
          <span className="text-base font-black text-purple-700 font-mono">૧૦૦%</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 font-gujarati block">ટેસ્ટ સ્કોર</span>
          <span className="text-base font-black text-emerald-600 font-mono">{moduleState.latestTestScore || 100}%</span>
        </div>
      </div>

      {/* Revision Options */}
      <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={onRevisitVideo}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl font-gujarati"
        >
          🎬 વિડિયો જુઓ
        </button>
        <button
          onClick={onRevisitLearning}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl font-gujarati"
        >
          📚 પુનરાવર્તન કરો
        </button>
        <button
          onClick={onRevisitPractice}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl font-gujarati"
        >
          🎮 મહાવરો રમો
        </button>
      </div>

      {/* Main Next Module CTA */}
      <div className="pt-4 border-t border-emerald-100">
        <button
          onClick={onProceedNextModule}
          className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-200 flex items-center gap-2 mx-auto active:scale-95 transition-all font-gujarati"
        >
          <span>આગળના મોડ્યુલ પર જાઓ (Next Module M-02 ➔)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
