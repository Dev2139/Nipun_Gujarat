import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GujaratiVoiceButton from '../GujaratiVoiceButton';
import api from '../../services/api';
import {
  Play,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Star,
  Award,
  Video,
  Layers,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

export default function SmallestBiggestModule({ competency, progress, onTestReady }) {
  const navigate = useNavigate();

  // Active Tab / Flow Stage
  // 1: welcome, 2: video, 3: concept, 4: act1_groups, 5: act2_smallest, 6: act3_biggest, 7: act4_both, 8: ordering, 9: numberline, 10: practice, 11: test_ready
  const [currentStage, setCurrentStage] = useState(1);

  // Tracking metrics
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(progress?.videoWatched || false);
  const [activitiesDone, setActivitiesDone] = useState(progress?.activitiesCompleted || 0);
  const [hintsUsedCount, setHintsUsedCount] = useState(progress?.hintsUsed || 0);
  const [practiceScore, setPracticeScore] = useState(progress?.practiceScore || 0);
  const [practiceFinished, setPracticeFinished] = useState(progress?.practiceCompleted || false);
  const [isTestUnlocked, setIsTestUnlocked] = useState(progress?.assessmentUnlocked || false);

  // Sync with backend API
  const saveActivityProgress = async (patch) => {
    try {
      await api.post('/progress/activity-update', {
        competencyCode: 'M-01',
        ...patch,
      });
    } catch (err) {
      console.warn('[M-01 Module] Activity tracking sync error:', err);
    }
  };

  /* -------------------------------------------------------------
     STEP 2: VIDEO TRACKING
  ------------------------------------------------------------- */
  const handleVideoCompleted = () => {
    setVideoCompleted(true);
    saveActivityProgress({
      videoWatched: true,
      videoWatchedPercentage: 100,
    });
  };

  /* -------------------------------------------------------------
     STEP 3: VISUAL CONCEPT INTRO STATE
  ------------------------------------------------------------- */
  const [conceptSelectedGroup, setConceptSelectedGroup] = useState(null);

  /* -------------------------------------------------------------
     STEP 4: ACTIVITY 1 - OBJECT COMPARISON (DYNAMIC OBJECTS)
  ------------------------------------------------------------- */
  const objectThemes = [
    { emoji: '🍎', name: 'સફરજન' },
    { emoji: '🍊', name: 'નારંગી' },
    { emoji: '⭐', name: 'તારા' },
    { emoji: '🐟', name: 'માછલીઓ' },
    { emoji: '🌸', name: 'ફૂલો' },
    { emoji: '🧸', name: 'ઢીંગલીઓ' },
    { emoji: '⚽', name: 'દડા' },
  ];
  const [act1ThemeIndex, setAct1ThemeIndex] = useState(0);
  const [act1Counts, setAct1Counts] = useState({ left: 3, right: 6 });
  const [act1Selected, setAct1Selected] = useState(null);
  const [act1Feedback, setAct1Feedback] = useState(null);

  const resetAct1 = () => {
    const nextIdx = (act1ThemeIndex + 1) % objectThemes.length;
    setAct1ThemeIndex(nextIdx);
    const left = Math.floor(Math.random() * 4) + 2; // 2 to 5
    let right = Math.floor(Math.random() * 5) + 3; // 3 to 7
    if (right === left) right += 2;
    setAct1Counts({ left, right });
    setAct1Selected(null);
    setAct1Feedback(null);
  };

  const handleAct1Check = (choice) => {
    setAct1Selected(choice);
    const isCorrect = (choice === 'left' && act1Counts.left > act1Counts.right) ||
                      (choice === 'right' && act1Counts.right > act1Counts.left);
    if (isCorrect) {
      setAct1Feedback({ correct: true, text: '🎉 સરસ! આ સમૂહ મોટો છે.' });
      const nextDone = Math.max(activitiesDone, 1);
      setActivitiesDone(nextDone);
      saveActivityProgress({ activitiesCompleted: nextDone });
    } else {
      setAct1Feedback({ correct: false, text: 'ફરીથી જુઓ. કયા સમૂહમાં વધુ વસ્તુઓ છે?' });
    }
  };

  /* -------------------------------------------------------------
     STEP 5: ACTIVITY 2 - SMALLEST NUMBER (3 LEVELS)
  ------------------------------------------------------------- */
  const act2Levels = [
    { level: 'સરળ (Easy)', numbers: [2, 5, 7], correct: 2 },
    { level: 'મધ્યમ (Medium)', numbers: [8, 3, 6], correct: 3 },
    { level: 'પડકાર (Harder)', numbers: [12, 7, 15], correct: 7 },
  ];
  const [act2LevelIdx, setAct2LevelIdx] = useState(0);
  const [act2Selected, setAct2Selected] = useState(null);
  const [act2Feedback, setAct2Feedback] = useState(null);

  const handleAct2Check = (num) => {
    setAct2Selected(num);
    const current = act2Levels[act2LevelIdx];
    if (num === current.correct) {
      setAct2Feedback({ correct: true, text: `🎉 વાહ! ${num} સૌથી નાનો છે.` });
      const nextDone = Math.max(activitiesDone, 2);
      setActivitiesDone(nextDone);
      saveActivityProgress({ activitiesCompleted: nextDone });
    } else {
      setAct2Feedback({ correct: false, text: 'ફરી પ્રયત્ન કરો. કઈ સંખ્યા સૌથી ઓછી છે?' });
    }
  };

  /* -------------------------------------------------------------
     STEP 6: ACTIVITY 3 - BIGGEST NUMBER
  ------------------------------------------------------------- */
  const act3Rounds = [
    { numbers: [4, 9, 6], correct: 9 },
    { numbers: [14, 8, 11], correct: 14 },
    { numbers: [5, 18, 12], correct: 18 },
  ];
  const [act3RoundIdx, setAct3RoundIdx] = useState(0);
  const [act3Selected, setAct3Selected] = useState(null);
  const [act3Feedback, setAct3Feedback] = useState(null);

  const handleAct3Check = (num) => {
    setAct3Selected(num);
    const current = act3Rounds[act3RoundIdx];
    if (num === current.correct) {
      setAct3Feedback({ correct: true, text: `🎉 સાચો જવાબ! ${num} સૌથી મોટો નંબર છે.` });
      const nextDone = Math.max(activitiesDone, 3);
      setActivitiesDone(nextDone);
      saveActivityProgress({ activitiesCompleted: nextDone });
    } else {
      setAct3Feedback({ correct: false, text: 'ફરીથી વિચારો. કઈ સંખ્યા સૌથી મોટી છે?' });
    }
  };

  /* -------------------------------------------------------------
     STEP 7: ACTIVITY 4 - FIND BOTH (SMALLEST & BIGGEST)
  ------------------------------------------------------------- */
  const act4Data = {
    numbers: [12, 7, 18, 9],
    correctSmallest: 7,
    correctBiggest: 18,
  };
  const [act4Smallest, setAct4Smallest] = useState(null);
  const [act4Biggest, setAct4Biggest] = useState(null);
  const [act4Feedback, setAct4Feedback] = useState(null);

  const handleAct4Validate = () => {
    if (!act4Smallest || !act4Biggest) {
      setAct4Feedback({ correct: false, text: 'કૃપા કરીને બંને સંખ્યાઓ (નાની અને મોટી) પસંદ કરો.' });
      return;
    }
    if (act4Smallest === act4Data.correctSmallest && act4Biggest === act4Data.correctBiggest) {
      setAct4Feedback({ correct: true, text: '🎉 અદ્ભુત! સૌથી નાનો ૭ અને સૌથી મોટો ૧૮ છે.' });
      const nextDone = Math.max(activitiesDone, 4);
      setActivitiesDone(nextDone);
      saveActivityProgress({ activitiesCompleted: nextDone });
    } else {
      setAct4Feedback({ correct: false, text: 'ફરીથી તપાસો. ૧૨, ૭, ૧૮, ૯ માંથી કઈ સૌથી નાની અને કઈ સૌથી મોટી છે?' });
    }
  };

  /* -------------------------------------------------------------
     STEP 8: TOUCH DRAG-AND-DROP / TAP ORDERING
  ------------------------------------------------------------- */
  // Ascending Round
  const [ascPool, setAscPool] = useState([7, 2, 5, 3]);
  const [ascSelected, setAscSelected] = useState([]);
  const [ascFeedback, setAscFeedback] = useState(null);

  const handleAscTap = (num) => {
    if (ascSelected.includes(num)) return;
    const nextArr = [...ascSelected, num];
    setAscSelected(nextArr);
    if (nextArr.length === 4) {
      const isCorrect = nextArr.join(',') === '2,3,5,7';
      if (isCorrect) {
        setAscFeedback({ correct: true, text: '🎉 ખૂબ સરસ! તમે સંખ્યાઓને નાનાથી મોટા ક્રમમાં ગોઠવી (૨ → ૩ → ૫ → ૮).' });
      } else {
        setAscFeedback({ correct: false, text: 'ક્રમ યોગ્ય નથી. ફરી પ્રયત્ન કરો!' });
      }
    }
  };

  const resetAsc = () => {
    setAscSelected([]);
    setAscFeedback(null);
  };

  // Descending Round
  const [descPool] = useState([9, 3, 7, 5]);
  const [descSelected, setDescSelected] = useState([]);
  const [descFeedback, setDescFeedback] = useState(null);

  const handleDescTap = (num) => {
    if (descSelected.includes(num)) return;
    const nextArr = [...descSelected, num];
    setDescSelected(nextArr);
    if (nextArr.length === 4) {
      const isCorrect = nextArr.join(',') === '9,7,5,3';
      if (isCorrect) {
        setDescFeedback({ correct: true, text: '🎉 ખૂબ સરસ! તમે સંખ્યાઓને મોટાથી નાના ક્રમમાં ગોઠવી (૯ → ૭ → ૫ → ૩).' });
      } else {
        setDescFeedback({ correct: false, text: 'ક્રમ યોગ્ય નથી. ફરી પ્રયત્ન કરો!' });
      }
    }
  };

  const resetDesc = () => {
    setDescSelected([]);
    setDescFeedback(null);
  };

  /* -------------------------------------------------------------
     STEP 9: INTERACTIVE NUMBER LINE (BUNNY HOPPING)
  ------------------------------------------------------------- */
  const [bunnyPosition, setBunnyPosition] = useState(1);
  const [numberLineQuestion, setNumberLineQuestion] = useState('smallest'); // 'smallest' | 'biggest'
  const [numberLineFeedback, setNumberLineFeedback] = useState(null);

  const handleNumberLineTap = (num) => {
    setBunnyPosition(num);
    if (numberLineQuestion === 'smallest') {
      if (num === 1) {
        setNumberLineFeedback({ correct: true, text: '🎉 સાચું! ૧ એ સૌથી નાની સંખ્યા છે (સસલું શરૂઆતમાં છે 🐰).' });
      } else {
        setNumberLineFeedback({ correct: false, text: 'ડાબી બાજુ સૌથી નાની સંખ્યા ૧ છે.' });
      }
    } else {
      if (num === 10) {
        setNumberLineFeedback({ correct: true, text: '🎉 સાચું! ૧૦ એ સૌથી મોટી સંખ્યા છે (સસલું છેડે પહોંચી ગયું 🐰).' });
      } else {
        setNumberLineFeedback({ correct: false, text: 'જમણી બાજુ સૌથી મોટી સંખ્યા ૧૦ છે.' });
      }
    }
  };

  /* -------------------------------------------------------------
     STEP 10: PRACTICE ROUND (8 QUESTIONS WITH 3-TIER HINTS)
  ------------------------------------------------------------- */
  const practiceQuestions = [
    {
      id: 'P1',
      type: 'smallest_group',
      questionText: 'સૌથી ઓછી વસ્તુઓ વાળો સમૂહ પસંદ કરો:',
      options: [
        { label: '🐟🐟🐟 (૩ માછલીઓ)', value: 'A', items: '🐟🐟🐟' },
        { label: '🐟🐟 (૨ માછલીઓ)', value: 'B', items: '🐟🐟' },
      ],
      correct: 'B',
      hint1: 'બંને સમૂહ ગણો.',
      hint2: '૨ માછલીઓ ઓછી છે કે ૩?',
      hint3: 'સાચો જવાબ B (૨ માછલીઓ) છે.',
    },
    {
      id: 'P2',
      type: 'biggest_group',
      questionText: 'સૌથી વધુ તારા (મોટો સમૂહ) પસંદ કરો:',
      options: [
        { label: '⭐⭐⭐⭐⭐ (૫ તારા)', value: 'A', items: '⭐⭐⭐⭐⭐' },
        { label: '⭐⭐⭐ (૩ તારા)', value: 'B', items: '⭐⭐⭐' },
      ],
      correct: 'A',
      hint1: 'તારા ગણો.',
      hint2: '૫ તારા ૩ કરતાં વધુ છે.',
      hint3: 'સાચો જવાબ A (૫ તારા) છે.',
    },
    {
      id: 'P3',
      type: 'smallest_number',
      questionText: '૬, ૧, ૪ માંથી સૌથી નાનો નંબર કયો છે?',
      options: [
        { label: '૬', value: '6' },
        { label: '૧', value: '1' },
        { label: '૪', value: '4' },
      ],
      correct: '1',
      hint1: 'સંખ્યા ફરીથી ધ્યાનથી જુઓ.',
      hint2: 'કઈ સંખ્યા સૌથી ઓછી છે?',
      hint3: '૧ સૌથી નાનો નંબર છે.',
    },
    {
      id: 'P4',
      type: 'biggest_number',
      questionText: '૫, ૯, ૨ માંથી સૌથી મોટો નંબર કયો છે?',
      options: [
        { label: '૫', value: '5' },
        { label: '૯', value: '9' },
        { label: '૨', value: '2' },
      ],
      correct: '9',
      hint1: 'ગણતરી કરો ૧ થી ૯.',
      hint2: 'સૌથી છેલ્લે કઈ સંખ્યા આવે?',
      hint3: '૯ સૌથી મોટો નંબર છે.',
    },
    {
      id: 'P5',
      type: 'smallest_number',
      questionText: '૧૧, ૪, ૮ માંથી સૌથી નાનો નંબર કયો છે?',
      options: [
        { label: '૧૧', value: '11' },
        { label: '૪', value: '4' },
        { label: '૮', value: '8' },
      ],
      correct: '4',
      hint1: 'સંખ્યાઓ ફરીથી જુઓ.',
      hint2: '૪ સૌથી નાની સંખ્યા છે.',
      hint3: 'સાચો જવાબ ૪ છે.',
    },
    {
      id: 'P6',
      type: 'biggest_number',
      questionText: '૭, ૧૫, ૧૦ માંથી સૌથી મોટો નંબર કયો છે?',
      options: [
        { label: '૭', value: '7' },
        { label: '૧૫', value: '15' },
        { label: '૧૦', value: '10' },
      ],
      correct: '15',
      hint1: 'દસકાથી મોટી સંખ્યા જુઓ.',
      hint2: '૧૫ સૌથી વધુ છે.',
      hint3: 'સાચો જવાબ ૧૫ છે.',
    },
    {
      id: 'P7',
      type: 'find_both',
      questionText: '૯, ૨, ૭ માંથી સૌથી નાનો અને સૌથી મોટો નંબર કયો?',
      options: [
        { label: 'નાનો: ૨, મોટો: ૯', value: 'correct' },
        { label: 'નાનો: ૭, મોટો: ૯', value: 'wrong1' },
        { label: 'નાનો: ૨, મોટો: ૭', value: 'wrong2' },
      ],
      correct: 'correct',
      hint1: 'સૌથી ઓછો ૨ અને સૌથી વધુ ૯ છે.',
      hint2: 'નાનો ૨ અને મોટો ૯ પસંદ કરો.',
      hint3: 'સાચો જવાબ પહેલો વિકલ્પ છે.',
    },
    {
      id: 'P8',
      type: 'ordering',
      questionText: '૧, ૫, ૩ ને નાનાથી મોટા ક્રમમાં ગોઠવો:',
      options: [
        { label: '૧ → ૩ → ૫', value: '1_3_5' },
        { label: '૫ → ૩ → ૧', value: '5_3_1' },
        { label: '૩ → ૧ → ૫', value: '3_1_5' },
      ],
      correct: '1_3_5',
      hint1: 'પહેલા સૌથી નાની સંખ્યા ૧ આવશે.',
      hint2: '૧ પછી ૩ અને પછી ૫.',
      hint3: 'સાચો જવાબ ૧ → ૩ → ૫ છે.',
    },
  ];

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceSelected, setPracticeSelected] = useState(null);
  const [practiceHintLevel, setPracticeHintLevel] = useState(0);
  const [practiceFeedback, setPracticeFeedback] = useState(null);
  const [practiceCorrectCount, setPracticeCorrectCount] = useState(0);

  const currentPracticeQ = practiceQuestions[practiceIdx];

  const handlePracticeSubmit = (val) => {
    setPracticeSelected(val);
    if (val === currentPracticeQ.correct) {
      setPracticeFeedback({ correct: true, text: '✓ સાચો જવાબ! (Correct)' });
      setPracticeCorrectCount((prev) => prev + 1);
    } else {
      setPracticeFeedback({ correct: false, text: '↻ ફરી પ્રયત્ન કરો (Try Again)' });
    }
  };

  const handlePracticeNext = () => {
    if (practiceIdx < practiceQuestions.length - 1) {
      setPracticeIdx(practiceIdx + 1);
      setPracticeSelected(null);
      setPracticeHintLevel(0);
      setPracticeFeedback(null);
    } else {
      // Completed practice
      const finalScore = Math.round(((practiceCorrectCount + (practiceFeedback?.correct ? 1 : 0)) / practiceQuestions.length) * 100);
      setPracticeScore(finalScore);
      setPracticeFinished(true);
      setIsTestUnlocked(true);
      saveActivityProgress({
        practiceScore: finalScore,
        practiceCompleted: true,
        hintsUsed: hintsUsedCount,
        unlockAssessment: true,
      });
      if (onTestReady) onTestReady();
    }
  };

  const usePracticeHint = () => {
    setPracticeHintLevel((prev) => Math.min(prev + 1, 3));
    setHintsUsedCount((prev) => prev + 1);
  };

  // Step Tabs definition
  const stages = [
    { id: 1, label: 'પરિચય', emoji: '👋' },
    { id: 2, label: 'વિડિયો', emoji: '🎬' },
    { id: 3, label: 'સંકલ્પના', emoji: '🍎' },
    { id: 4, label: 'સમૂહ', emoji: '⭐' },
    { id: 5, label: 'નાનો અંક', emoji: '🔢' },
    { id: 6, label: 'મોટો અંક', emoji: '🔝' },
    { id: 7, label: 'બંને શોધો', emoji: '🎯' },
    { id: 8, label: 'ક્રમ', emoji: '🔄' },
    { id: 9, label: 'સંખ્યા રેખા', emoji: '🐰' },
    { id: 10, label: 'મહાવરો', emoji: '🧩' },
  ];

  return (
    <div className="space-y-6 font-gujarati">
      {/* 12-Step Progress Indicator Ribbon */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 border border-emerald-200 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => setCurrentStage(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentStage === st.id
                  ? 'bg-emerald-600 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <span>{st.emoji}</span>
              <span>{st.label}</span>
              {st.id === 2 && videoCompleted && <CheckCircle2 className="w-3 h-3 text-amber-300 inline" />}
              {st.id >= 4 && st.id <= 7 && activitiesDone >= (st.id - 3) && (
                <CheckCircle2 className="w-3 h-3 text-emerald-200 inline" />
              )}
            </button>
          ))}

          <button
            onClick={() => setCurrentStage(11)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              currentStage === 11
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                : (isTestUnlocked
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-slate-100 text-slate-400 opacity-60')
            }`}
          >
            <span>📝</span>
            <span>કસોટી (Test)</span>
          </button>
        </div>
      </div>

      {/* =============================================================
          STAGE 1: WELCOME / INTRO
      ============================================================= */}
      {currentStage === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 text-center animate-in fade-in-50 duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-4xl shadow-lg shadow-emerald-200">
            🐘
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
              ગણિત • ક્ષમતા M-01
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              સૌથી નાનું અને સૌથી મોટું (Smallest & Biggest)
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              આ પાઠમાં આપણે વિડિયો જોઈશું, રમતો રમીશું, સંખ્યાઓ ગોઠવીશું અને નિપુણ બનીશું!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <GujaratiVoiceButton
              text="સૌથી નાનું અને સૌથી મોટું પાઠમાં તમારું સ્વાગત છે! ચાલો પહેલા સુંદર વિડિયો જોઈએ."
              label="પાઠ પરિચય સાંભળો"
            />

            <button
              onClick={() => setCurrentStage(2)}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-md active:scale-95 transition-all flex items-center gap-2 text-sm"
            >
              <span>વિડિયો જુઓ (Watch Video)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 2: EMBEDDED YOUTUBE VIDEO SECTION
      ============================================================= */}
      {currentStage === 2 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-300 shadow-xl space-y-5 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎬</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  ચાલો શીખીએ! 🎬
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                સૌથી નાનું અને સૌથી મોટું (Smallest and Biggest)
              </p>
            </div>

            <GujaratiVoiceButton
              text="વિડિયો ધ્યાનથી જુઓ અને પછી રમતો રમો!"
              label="સૂચના"
              size="sm"
            />
          </div>

          {/* Responsive Embedded YouTube Player */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg bg-slate-950">
            <iframe
              src="https://www.youtube.com/embed/osssUip3vHk?enablejsapi=1"
              title="શું નાનું, શું મોટું ? || small and big || smallest and biggest || maths std 1"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setVideoStarted(true)}
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-emerald-900 font-bold text-center sm:text-left">
              💡 વિડિયો ધ્યાનથી જુઓ અને પછી નીચે આપેલ રમતો રમો!
            </p>

            <button
              onClick={handleVideoCompleted}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-sm ${
                videoCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-500 text-slate-950 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{videoCompleted ? 'વિડિયો જોયો ✓' : 'મેં વિડિયો જોયો ✓'}</span>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStage(3)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>આગળ વધો (Explore Concept)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 3: CONCEPT EXPLORATION (VISUAL & SIMPLE)
      ============================================================= */}
      {currentStage === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 animate-in fade-in-50 duration-300">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              ચાલો સમજીએ 👇
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              સફરજનના સમૂહ પર ક્લિક કરીને સરખામણી કરો:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Group 1: 2 Apples */}
            <button
              onClick={() => setConceptSelectedGroup(2)}
              className={`p-6 rounded-3xl border-2 text-center transition-all ${
                conceptSelectedGroup === 2
                  ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-emerald-50/50'
              }`}
            >
              <div className="text-4xl sm:text-5xl tracking-widest mb-2">🍎🍎</div>
              <div className="font-black text-slate-800 text-base">૨ સફરજન (ઓછા)</div>
              <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                સૌથી નાનું સમૂહ ⬇
              </span>
            </button>

            {/* Group 2: 5 Apples */}
            <button
              onClick={() => setConceptSelectedGroup(5)}
              className={`p-6 rounded-3xl border-2 text-center transition-all ${
                conceptSelectedGroup === 5
                  ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-emerald-50/50'
              }`}
            >
              <div className="text-4xl sm:text-5xl tracking-widest mb-2">🍎🍎🍎🍎🍎</div>
              <div className="font-black text-slate-800 text-base">૫ સફરજન (વધુ)</div>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
                સૌથી મોટો સમૂહ ⬆
              </span>
            </button>
          </div>

          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center space-y-2">
            <p className="text-sm font-black text-emerald-900">
              👉 ૫ સફરજન વધુ છે અને ૨ સફરજન ઓછા છે.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-700">
              <span className="bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
                ⭐ સૌથી નાનું = સૌથી ઓછું
              </span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
                ⭐ સૌથી મોટું = સૌથી વધુ
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <GujaratiVoiceButton
              text="૫ સફરજન વધુ છે અને ૨ સફરજન ઓછા છે. સૌથી નાનું એટલે સૌથી ઓછું, સૌથી મોટું એટલે સૌથી વધુ."
              label="સમજૂતી સાંભળો"
            />

            <button
              onClick={() => setCurrentStage(4)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>રમત ૧: સમૂહ સરખામણી ▶</span>
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 4: ACTIVITY 1 - OBJECT COMPARISON (DYNAMIC)
      ============================================================= */}
      {currentStage === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black text-emerald-700 uppercase">રમત ૧ (Activity 1)</span>
              <h3 className="text-xl font-black text-slate-900">
                કયો સમૂહ મોટો છે?
              </h3>
            </div>
            <button
              onClick={resetAct1}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>નવા ચિત્રો</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 font-bold">
            પ્રશ્ન: સૌથી મોટો સમૂહ પસંદ કરો.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Group */}
            <button
              onClick={() => handleAct1Check('left')}
              className={`p-6 rounded-3xl border-2 text-center transition-all ${
                act1Selected === 'left'
                  ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200'
                  : 'border-slate-200 bg-slate-50 hover:bg-emerald-50/50'
              }`}
            >
              <div className="text-3xl sm:text-4xl tracking-widest mb-3 break-words">
                {Array(act1Counts.left).fill(objectThemes[act1ThemeIndex].emoji).join('')}
              </div>
              <div className="font-black text-sm text-slate-800">
                સમૂહ A: {act1Counts.left} {objectThemes[act1ThemeIndex].name}
              </div>
            </button>

            {/* Right Group */}
            <button
              onClick={() => handleAct1Check('right')}
              className={`p-6 rounded-3xl border-2 text-center transition-all ${
                act1Selected === 'right'
                  ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-200'
                  : 'border-slate-200 bg-slate-50 hover:bg-emerald-50/50'
              }`}
            >
              <div className="text-3xl sm:text-4xl tracking-widest mb-3 break-words">
                {Array(act1Counts.right).fill(objectThemes[act1ThemeIndex].emoji).join('')}
              </div>
              <div className="font-black text-sm text-slate-800">
                સમૂહ B: {act1Counts.right} {objectThemes[act1ThemeIndex].name}
              </div>
            </button>
          </div>

          {act1Feedback && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                act1Feedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {act1Feedback.text}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <GujaratiVoiceButton
              text={`કયો સમૂહ મોટો છે? સમૂહ A માં ${act1Counts.left} અને સમૂહ B માં ${act1Counts.right} વસ્તુઓ છે.`}
              label="પ્રશ્ન સાંભળો"
            />

            <button
              onClick={() => setCurrentStage(5)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>રમત ૨: સૌથી નાનો નંબર ▶</span>
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 5: ACTIVITY 2 - SMALLEST NUMBER (3 STAGES)
      ============================================================= */}
      {currentStage === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black text-emerald-700 uppercase">
                રમત ૨ • સ્તર: {act2Levels[act2LevelIdx].level}
              </span>
              <h3 className="text-xl font-black text-slate-900">
                સૌથી નાનો નંબર પસંદ કરો
              </h3>
            </div>

            <div className="flex gap-1.5">
              {act2Levels.map((lvl, idx) => (
                <button
                  key={lvl.level}
                  onClick={() => {
                    setAct2LevelIdx(idx);
                    setAct2Selected(null);
                    setAct2Feedback(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    act2LevelIdx === idx
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto py-2">
            {act2Levels[act2LevelIdx].numbers.map((num) => (
              <button
                key={num}
                onClick={() => handleAct2Check(num)}
                className={`py-8 sm:py-10 rounded-3xl font-black text-3xl sm:text-5xl shadow-md transition-all active:scale-95 ${
                  act2Selected === num
                    ? (num === act2Levels[act2LevelIdx].correct
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-105'
                      : 'bg-rose-500 text-white ring-4 ring-rose-300')
                    : 'bg-slate-100 text-slate-800 hover:bg-emerald-100 hover:text-emerald-900'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {act2Feedback && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                act2Feedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {act2Feedback.text}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <GujaratiVoiceButton
              text={`આ સંખ્યાઓમાંથી સૌથી નાનો નંબર કયો છે: ${act2Levels[act2LevelIdx].numbers.join(', ')}`}
              label="સાંભળો"
            />

            <button
              onClick={() => setCurrentStage(6)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>રમત ૩: સૌથી મોટો નંબર ▶</span>
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 6: ACTIVITY 3 - BIGGEST NUMBER
      ============================================================= */}
      {currentStage === 6 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black text-emerald-700 uppercase">
                રમત ૩ • રાઉન્ડ {act3RoundIdx + 1}/{act3Rounds.length}
              </span>
              <h3 className="text-xl font-black text-slate-900">
                સૌથી મોટો નંબર પસંદ કરો
              </h3>
            </div>

            <button
              onClick={() => {
                setAct3RoundIdx((prev) => (prev + 1) % act3Rounds.length);
                setAct3Selected(null);
                setAct3Feedback(null);
              }}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>બીજી સંખ્યાઓ</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto py-2">
            {act3Rounds[act3RoundIdx].numbers.map((num) => (
              <button
                key={num}
                onClick={() => handleAct3Check(num)}
                className={`py-8 sm:py-10 rounded-3xl font-black text-3xl sm:text-5xl shadow-md transition-all active:scale-95 ${
                  act3Selected === num
                    ? (num === act3Rounds[act3RoundIdx].correct
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-105'
                      : 'bg-rose-500 text-white ring-4 ring-rose-300')
                    : 'bg-slate-100 text-slate-800 hover:bg-emerald-100 hover:text-emerald-900'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {act3Feedback && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                act3Feedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {act3Feedback.text}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <GujaratiVoiceButton
              text={`આ સંખ્યાઓમાંથી સૌથી મોટો નંબર કયો છે: ${act3Rounds[act3RoundIdx].numbers.join(', ')}`}
              label="સાંભળો"
            />

            <button
              onClick={() => setCurrentStage(7)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>રમત ૪: બંને શોધો ▶</span>
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 7: ACTIVITY 4 - FIND BOTH (SMALLEST & BIGGEST)
      ============================================================= */}
      {currentStage === 7 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 animate-in fade-in-50 duration-300">
          <div className="text-center space-y-1">
            <span className="text-xs font-black text-emerald-700 uppercase">રમત ૪ (Advanced)</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              સૌથી નાનો અને સૌથી મોટો નંબર શોધો
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              આપેલ સંખ્યાઓ: <span className="font-mono text-base text-slate-800">૧૨, ૭, ૧૮, ૯</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {/* Box 1: Smallest */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-3">
              <span className="text-xs font-black text-amber-900 uppercase">⬇ સૌથી નાનો (Smallest)</span>
              <div className="text-2xl font-black text-slate-900 bg-white p-3 rounded-xl border border-amber-200 min-h-[50px] flex items-center justify-center">
                {act4Smallest !== null ? act4Smallest : '[ પસંદ કરો ]'}
              </div>
              <div className="flex justify-center gap-2">
                {act4Data.numbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => setAct4Smallest(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      act4Smallest === n
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-amber-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Box 2: Biggest */}
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-3">
              <span className="text-xs font-black text-emerald-900 uppercase">⬆ સૌથી મોટો (Biggest)</span>
              <div className="text-2xl font-black text-slate-900 bg-white p-3 rounded-xl border border-emerald-200 min-h-[50px] flex items-center justify-center">
                {act4Biggest !== null ? act4Biggest : '[ પસંદ કરો ]'}
              </div>
              <div className="flex justify-center gap-2">
                {act4Data.numbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => setAct4Biggest(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      act4Biggest === n
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-emerald-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleAct4Validate}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-md text-sm active:scale-95 transition-all"
            >
              ચકાસો (Check Answer) ✓
            </button>
          </div>

          {act4Feedback && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                act4Feedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {act4Feedback.text}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <GujaratiVoiceButton
              text="૧૨, ૭, ૧૮, અને ૯ માંથી સૌથી નાનો અને સૌથી મોટો નંબર પસંદ કરો."
              label="સાંભળો"
            />

            <button
              onClick={() => setCurrentStage(8)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>ક્રમ ગોઠવણી (Ordering) ▶</span>
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 8: TOUCH DRAG-AND-DROP / TAP NUMBER ORDERING
      ============================================================= */}
      {currentStage === 8 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-7 animate-in fade-in-50 duration-300">
          <div className="text-center space-y-1">
            <span className="text-xs font-black text-emerald-700 uppercase">ક્રમ ગોઠવણી (Number Ordering)</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              સંખ્યાઓને યોગ્ય ક્રમમાં ગોઠવો
            </h3>
          </div>

          {/* Section A: Smallest -> Biggest */}
          <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>૧. નાનાથી મોટા ક્રમમાં ગોઠવો (Ascending):</span>
              </div>
              <button
                onClick={resetAsc}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline"
              >
                ફરીથી
              </button>
            </div>

            {/* Target Slots */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((slotIdx) => (
                <div
                  key={slotIdx}
                  className="h-14 rounded-2xl bg-white border-2 border-dashed border-emerald-300 flex items-center justify-center font-black text-xl text-emerald-700 shadow-inner"
                >
                  {ascSelected[slotIdx] !== undefined ? ascSelected[slotIdx] : `${slotIdx + 1}️⃣`}
                </div>
              ))}
            </div>

            {/* Tap Pool */}
            <div className="flex justify-center gap-2 pt-1">
              {ascPool.map((n) => (
                <button
                  key={n}
                  onClick={() => handleAscTap(n)}
                  disabled={ascSelected.includes(n)}
                  className={`w-12 h-12 rounded-2xl font-black text-base shadow-sm transition-all ${
                    ascSelected.includes(n)
                      ? 'bg-slate-200 text-slate-400 opacity-40'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {ascFeedback && (
              <p
                className={`text-xs font-bold text-center ${
                  ascFeedback.correct ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {ascFeedback.text}
              </p>
            )}
          </div>

          {/* Section B: Biggest -> Smallest */}
          <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                <TrendingDown className="w-4 h-4 text-orange-600" />
                <span>૨. મોટાથી નાના ક્રમમાં ગોઠવો (Descending):</span>
              </div>
              <button
                onClick={resetDesc}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline"
              >
                ફરીથી
              </button>
            </div>

            {/* Target Slots */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((slotIdx) => (
                <div
                  key={slotIdx}
                  className="h-14 rounded-2xl bg-white border-2 border-dashed border-orange-300 flex items-center justify-center font-black text-xl text-orange-700 shadow-inner"
                >
                  {descSelected[slotIdx] !== undefined ? descSelected[slotIdx] : `${slotIdx + 1}️⃣`}
                </div>
              ))}
            </div>

            {/* Tap Pool */}
            <div className="flex justify-center gap-2 pt-1">
              {descPool.map((n) => (
                <button
                  key={n}
                  onClick={() => handleDescTap(n)}
                  disabled={descSelected.includes(n)}
                  className={`w-12 h-12 rounded-2xl font-black text-base shadow-sm transition-all ${
                    descSelected.includes(n)
                      ? 'bg-slate-200 text-slate-400 opacity-40'
                      : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {descFeedback && (
              <p
                className={`text-xs font-bold text-center ${
                  descFeedback.correct ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {descFeedback.text}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <GujaratiVoiceButton
              text="સંખ્યાઓને નાનાથી મોટા અને મોટાથી નાના ક્રમમાં ગોઠવો."
              label="સાંભળો"
            />

            <button
              onClick={() => setCurrentStage(9)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>સંખ્યા રેખા (Number Line) ▶</span>
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 9: INTERACTIVE NUMBER LINE (BUNNY 🐰 HOPPING)
      ============================================================= */}
      {currentStage === 9 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 animate-in fade-in-50 duration-300">
          <div className="text-center space-y-1">
            <span className="text-xs font-black text-emerald-700 uppercase">સંખ્યા રેખા (Number Line)</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              સસલું 🐰 અને ૧ થી ૧૦ ની સંખ્યા રેખા
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              સંખ્યા પર ક્લિક કરો અને સસલાને કૂદકો મારતો જુઓ:
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setNumberLineQuestion('smallest');
                setNumberLineFeedback(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                numberLineQuestion === 'smallest'
                  ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              પ્રશ્ન ૧: સૌથી નાની સંખ્યા શોધો ⬇
            </button>

            <button
              onClick={() => {
                setNumberLineQuestion('biggest');
                setNumberLineFeedback(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                numberLineQuestion === 'biggest'
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              પ્રશ્ન ૨: સૌથી મોટી સંખ્યા શોધો ⬆
            </button>
          </div>

          {/* Dynamic Number Line Track */}
          <div className="p-4 sm:p-6 bg-emerald-50/60 rounded-3xl border border-emerald-200 space-y-4">
            {/* Bunny Track */}
            <div className="relative h-12 flex items-center justify-between px-2">
              <div
                className="absolute text-3xl transition-all duration-300 transform -translate-x-1/2"
                style={{ left: `${((bunnyPosition - 1) / 9) * 90 + 5}%` }}
              >
                🐰
              </div>
            </div>

            {/* Line Bar */}
            <div className="h-2 bg-emerald-600 rounded-full relative">
              <div className="absolute left-0 right-0 -top-1 flex justify-between px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div key={n} className="w-4 h-4 rounded-full bg-emerald-700" />
                ))}
              </div>
            </div>

            {/* Number Buttons */}
            <div className="flex justify-between gap-1 overflow-x-auto pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNumberLineTap(n)}
                  className={`w-8 h-10 sm:w-10 sm:h-12 rounded-xl font-black text-sm sm:text-base flex items-center justify-center transition-all ${
                    bunnyPosition === n
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 scale-110 shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {numberLineFeedback && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                numberLineFeedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {numberLineFeedback.text}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <GujaratiVoiceButton
              text={
                numberLineQuestion === 'smallest'
                  ? 'સંખ્યા રેખા પર સૌથી નાની સંખ્યા ૧ છે.'
                  : 'સંખ્યા રેખા પર સૌથી મોટી સંખ્યા ૧૦ છે.'
              }
              label="સાંભળો"
            />

            <button
              onClick={() => setCurrentStage(10)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>મહાવરો રાઉન્ડ (Practice Round) ▶</span>
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 10: PRACTICE ROUND (8 QUESTIONS WITH 3-TIER HINTS)
      ============================================================= */}
      {currentStage === 10 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black text-emerald-700 uppercase">
                મહાવરો રાઉન્ડ (Practice) • {practiceIdx + 1}/{practiceQuestions.length}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {currentPracticeQ.questionText}
              </h3>
            </div>

            {/* Hint Button */}
            <button
              onClick={usePracticeHint}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>મદદ (Hint {practiceHintLevel > 0 ? `${practiceHintLevel}/3` : ''})</span>
            </button>
          </div>

          {/* Hint Ladder Display */}
          {practiceHintLevel > 0 && (
            <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900 space-y-1 animate-in fade-in-50">
              {practiceHintLevel >= 1 && <p>💡 સંકેત ૧: {currentPracticeQ.hint1}</p>}
              {practiceHintLevel >= 2 && <p>💡 સંકેત ૨: {currentPracticeQ.hint2}</p>}
              {practiceHintLevel >= 3 && <p className="text-emerald-800">💡 સંકેત ૩: {currentPracticeQ.hint3}</p>}
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentPracticeQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handlePracticeSubmit(opt.value)}
                className={`p-4 sm:p-5 rounded-2xl border-2 text-left font-black text-sm sm:text-base transition-all flex items-center justify-between ${
                  practiceSelected === opt.value
                    ? (opt.value === currentPracticeQ.correct
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-300'
                      : 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-300')
                    : (practiceHintLevel === 3 && opt.value === currentPracticeQ.correct
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-300 animate-pulse'
                      : 'border-slate-200 bg-slate-50 hover:bg-emerald-50/60 text-slate-800')
                }`}
              >
                <span>{opt.label}</span>
                {practiceSelected === opt.value && (
                  <span>{opt.value === currentPracticeQ.correct ? '✓' : '✗'}</span>
                )}
              </button>
            ))}
          </div>

          {practiceFeedback && (
            <div
              className={`p-3.5 rounded-2xl text-center font-black text-xs sm:text-sm ${
                practiceFeedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {practiceFeedback.text}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <GujaratiVoiceButton
              text={currentPracticeQ.questionText}
              label="પ્રશ્ન સાંભળો"
            />

            <button
              onClick={handlePracticeNext}
              disabled={!practiceSelected}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all disabled:opacity-40"
            >
              <span>{practiceIdx === practiceQuestions.length - 1 ? 'મહાવરો પૂર્ણ કરો 🎉' : 'આગળનો પ્રશ્ન ▶'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =============================================================
          STAGE 11: TEST UNLOCKED / READY SCREEN
      ============================================================= */}
      {currentStage === 11 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-xl space-y-6 text-center animate-in fade-in-50 duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center text-4xl shadow-lg shadow-amber-200">
            📝
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
              અંતિમ મૂલ્યાંકન (Final Assessment)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              તમે ટેસ્ટ આપવા માટે તૈયાર છો! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              આ કસોટીમાં ૧૦ સરળ પ્રશ્નો છે. ૮૦% કે તેથી વધુ ગુણ મેળવવાથી આગળનું પગલું અનલૉક થશે.
            </p>
          </div>

          {/* Readiness Checklist */}
          <div className="bg-slate-50 rounded-2xl p-4 max-w-sm mx-auto text-left text-xs font-bold text-slate-700 space-y-2 border border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>વિડિયો પાઠ: {videoCompleted ? 'પૂર્ણ ✓' : 'જોયેલ'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ઇન્ટરેક્ટિવ રમતો: {activitiesDone}/4 પૂર્ણ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>મહાવરો સ્કોર: {practiceScore}%</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/student/test/M-01')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>કસોટી શરૂ કરો (Start Test) 🚀</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
