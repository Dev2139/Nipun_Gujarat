import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import GujaratiVoiceButton from '../GujaratiVoiceButton';
import { progressService } from '../../services';
import {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Trophy,
  Compass,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight
} from 'lucide-react';

export default function SpatialConceptsModule({ competency, progress, onTestReady }) {
  const navigate = useNavigate();

  // 11 pedagogical stages (including in-module test & result)
  const [currentStage, setCurrentStage] = useState(1);
  const totalStages = 11;

  // Tracking metrics
  const [activitiesDone, setActivitiesDone] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // In-Module Final Assessment State
  const [testIdx, setTestIdx] = useState(0);
  const [testUserAnswers, setTestUserAnswers] = useState({});
  const [testResultData, setTestResultData] = useState(null);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Test questions for M-02
  const testQuestions = [
    {
      id: 't1',
      category: 'ઉપર અને નીચે (Basic Up & Down)',
      promptGujarati: 'પક્ષી વૃક્ષની ક્યાં છે? (🐦 ઉપર / 🌳 વૃક્ષ)',
      visual: '🌳\n🐦 (ઉપર)',
      options: [
        { id: 'opt1', text: 'વૃક્ષની ઉપર (Top / Above ⬆️)', emoji: '🐦' },
        { id: 'opt2', text: 'વૃક્ષની નીચે (Bottom / Below ⬇️)', emoji: '🌳' },
      ],
      correctId: 'opt1',
      explain: 'પક્ષી વૃક્ષની ટોચ પર (ઉપર) બેઠું છે.',
    },
    {
      id: 't2',
      category: 'ઉપર અને નીચે (Basic Up & Down)',
      promptGujarati: 'કૂતરો વૃક્ષની ક્યાં બેઠો છે? (🐕 નીચે / 🌳 વૃક્ષ)',
      visual: '🌳\n🐕 (નીચે)',
      options: [
        { id: 'opt1', text: 'વૃક્ષની નીચે (Bottom / Below ⬇️)', emoji: '🐕' },
        { id: 'opt2', text: 'વૃક્ષની ઉપર (Top / Above ⬆️)', emoji: '🌳' },
      ],
      correctId: 'opt1',
      explain: 'કૂતરો જમીન પર વૃક્ષના થડ પાસે નીચે બેઠો છે.',
    },
    {
      id: 't3',
      category: 'ની ઉપર અને ની નીચે (Relative Position: Above & Below)',
      promptGujarati: 'સફરજન ટોપલીની ક્યાં છે? (🍎 સફરજન / 🧺 ટોપલી)',
      visual: '🍎 (ઉપર)\n🧺 (ટોપલી)',
      options: [
        { id: 'opt1', text: 'ટોપલીની ઉપર (On / Above Basket ⬆️)', emoji: '🍎' },
        { id: 'opt2', text: 'ટોપલીની નીચે (Below Basket ⬇️)', emoji: '🧺' },
      ],
      correctId: 'opt1',
      explain: 'સફરજન ટોપલીની ઉપર મુકેલું છે.',
    },
    {
      id: 't4',
      category: 'ની ઉપર અને ની નીચે (Relative Position: Above & Below)',
      promptGujarati: 'છોકરો પતંગની ક્યાં ઊભો છે? (🪁 આકાશમાં પતંગ / 👦 છોકરો)',
      visual: '🪁 (આકાશમાં)\n👦 (જમીન પર)',
      options: [
        { id: 'opt1', text: 'પતંગની નીચે જમીન પર (Below ⬇️)', emoji: '👦' },
        { id: 'opt2', text: 'પતંગની ઉપર આકાશમાં (Above ⬆️)', emoji: '🪁' },
      ],
      correctId: 'opt1',
      explain: 'પતંગ આકાશમાં ઊડે છે અને છોકરો તેની નીચે જમીન પર ઊભો છે.',
    },
    {
      id: 't5',
      category: 'ઉપરથી નીચે / નીચેથી ઉપર (Vertical Ordering)',
      promptGujarati: 'ફળોને ઉપરથી નીચેના ક્રમમાં (૧ થી ૩) ગોઠવો: 🍉(૧), 🍎(૨), 🍇(૩)',
      visual: '🍉 (૧ - ટોચ)\n🍎 (૨ - વચ્ચે)\n🍇 (૩ - તળિયે)',
      options: [
        { id: 'opt1', text: '🍉 → 🍎 → 🍇 (ઉપરથી નીચે ⬇️)', emoji: '🎯' },
        { id: 'opt2', text: '🍇 → 🍎 → 🍉 (નીચેથી ઉપર ⬆️)', emoji: '❌' },
        { id: 'opt3', text: '🍎 → 🍉 → 🍇 (અયોગ્ય ક્રમ)', emoji: '❌' },
      ],
      correctId: 'opt1',
      explain: 'ઉપરથી નીચે ક્રમ: 🍉 (સૌથી ઉપર) → 🍎 (વચ્ચે) → 🍇 (સૌથી નીચે).',
    },
    {
      id: 't6',
      category: 'ઉપરથી નીચે / નીચેથી ઉપર (Vertical Ordering)',
      promptGujarati: 'નીચેથી ઉપરના ક્રમમાં (⬆️) ગોઠવો: 🍇(તળિયે), 🍎(વચ્ચે), 🍉(ટોચ)',
      visual: '🍉 (ટોચ)\n🍎 (વચ્ચે)\n🍇 (તળિયે)',
      options: [
        { id: 'opt1', text: '🍇 → 🍎 → 🍉 (નીચેથી ઉપર ⬆️)', emoji: '🎯' },
        { id: 'opt2', text: '🍉 → 🍎 → 🍇 (ઉપરથી નીચે ⬇️)', emoji: '❌' },
        { id: 'opt3', text: '🍇 → 🍉 → 🍎 (અયોગ્ય ક્રમ)', emoji: '❌' },
      ],
      correctId: 'opt1',
      explain: 'નીચેથી ઉપર ક્રમ: 🍇 → 🍎 → 🍉.',
    },
    {
      id: 't7',
      category: 'નજીક અને દૂર (Near & Far)',
      promptGujarati: 'ચિત્ર જુઓ: 👦 ⚽ — બોલ બાળકની ક્યાં છે?',
      visual: '👦 ⚽ (સાથે)',
      options: [
        { id: 'opt1', text: 'બાળકની નજીક (Near 🟢)', emoji: '⚽' },
        { id: 'opt2', text: 'બાળકથી દૂર (Far 🔴)', emoji: '📍' },
      ],
      correctId: 'opt1',
      explain: 'બોલ બાળકની એકદમ પાસે એટલે નજીક છે.',
    },
    {
      id: 't8',
      category: 'નજીક અને દૂર (Near & Far)',
      promptGujarati: 'ચિત્ર જુઓ: 👦 . . . . . ⚽ — બોલ બાળકની ક્યાં છે?',
      visual: '👦  - - - - -  ⚽',
      options: [
        { id: 'opt1', text: 'બાળકથી દૂર (Far 🔴)', emoji: '⚽' },
        { id: 'opt2', text: 'બાળકની નજીક (Near 🟢)', emoji: '📍' },
      ],
      correctId: 'opt1',
      explain: 'બોલ અને બાળક વચ્ચે ઘણું અંતર છે, એટલે બોલ દૂર છે.',
    },
    {
      id: 't9',
      category: 'ની ઉપર અને ની નીચે (Relative Position: Above & Below)',
      promptGujarati: 'બિલાડી ખુરશીની ક્યાં સંતાઈ છે? (🪑 ખુરશી / 🐱 બિલાડી)',
      visual: '🪑 (ખુરશી)\n🐱 (પાયા વચ્ચે નીચે)',
      options: [
        { id: 'opt1', text: 'ખુરશીની નીચે (Under / Below ⬇️)', emoji: '🐱' },
        { id: 'opt2', text: 'ખુરશીની ઉપર (On chair ⬆️)', emoji: '🪑' },
      ],
      correctId: 'opt1',
      explain: 'બિલાડી ખુરશીની નીચે બેઠી છે.',
    },
    {
      id: 't10',
      category: 'ની ઉપર અને ની નીચે (Relative Position: Above & Below)',
      promptGujarati: 'રંગબેરંગી ફુગ્ગો ઘરની ક્યાં ઊડી રહ્યો છે? (🎈 ફુગ્ગો / 🏠 ઘર)',
      visual: '🎈 (આકાશમાં)\n🏠 (જમીન પર)',
      options: [
        { id: 'opt1', text: 'ઘરની ઉપર આકાશમાં (Above house ⬆️)', emoji: '🎈' },
        { id: 'opt2', text: 'ઘરની નીચે જમીનમાં (Below house ⬇️)', emoji: '🏠' },
      ],
      correctId: 'opt1',
      explain: 'ફુગ્ગો ઘરની ઉપર આકાશમાં ઊડે છે.',
    },
  ];

  const handleSubmitFinalAssessment = async () => {
    setSubmittingTest(true);
    let correctCount = 0;
    const categoryMistakes = {};

    testQuestions.forEach((q, i) => {
      const selected = testUserAnswers[i];
      if (selected === q.correctId) {
        correctCount += 1;
      } else {
        categoryMistakes[q.category] = (categoryMistakes[q.category] || 0) + 1;
      }
    });

    const scorePct = Math.round((correctCount / testQuestions.length) * 100);
    const isMastered = scorePct >= 80;
    const diagnosedWeakAreas = Object.keys(categoryMistakes);

    const resultPayload = {
      score: scorePct,
      correctCount,
      totalQuestions: testQuestions.length,
      isMastered,
      status: isMastered ? 'MASTERED' : scorePct >= 31 ? 'DEVELOPING' : 'NEEDS_SUPPORT',
      weakAreas: diagnosedWeakAreas,
    };

    try {
      await progressService.submitAssessment({
        competencyCode: 'M-02',
        answers: Object.keys(testUserAnswers).map(k => ({
          questionIndex: Number(k),
          selectedOptionId: testUserAnswers[k],
        })),
        weakAreas: diagnosedWeakAreas,
      });
      if (isMastered) triggerWin();
      setTestResultData(resultPayload);
      setCurrentStage(11);
    } catch (err) {
      console.warn('[SpatialConceptsModule] Submit error:', err);
      if (isMastered) triggerWin();
      setTestResultData(resultPayload);
      setCurrentStage(11);
    } finally {
      setSubmittingTest(false);
    }
  };

  // Sync activity progress to backend
  const updateBackend = async (data = {}) => {
    try {
      await progressService.trackLearningActivity({
        competencyCode: 'M-02',
        ...data,
      });
    } catch (e) {
      console.warn('[SpatialConceptsModule] Progress sync error:', e.message);
    }
  };

  const nextStage = () => {
    if (currentStage < totalStages) {
      const next = currentStage + 1;
      setCurrentStage(next);
      const acts = Math.min(6, Math.max(activitiesDone, next - 2));
      setActivitiesDone(acts);
      updateBackend({
        activitiesCompleted: acts,
        timeSpentSeconds: 45,
      });
    }
  };

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  // Trigger celebration confetti
  const triggerWin = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  /* ========================================================
     STAGE 2: Visual Concept Animations Demo State
     ======================================================== */
  const [demoMode, setDemoMode] = useState('up'); // 'up', 'down', 'near', 'far'

  /* ========================================================
     STAGE 3: Activity 1 (ઉપર અને નીચે) State
     ======================================================== */
  const [act1Step, setAct1Step] = useState(1); // 1: Bird above cat, 2: Dog below cat
  const [act1Feedback, setAct1Feedback] = useState(null);

  const handleAct1Answer = (choice) => {
    if (act1Step === 1) {
      if (choice === 'up') {
        setAct1Feedback({ correct: true, msg: '🎉 સરસ! પક્ષી ઉપર છે.' });
        triggerWin();
      } else {
        setAct1Feedback({ correct: false, msg: 'ફરી જુઓ. પક્ષી બિલાડીની કઈ બાજુ છે?' });
      }
    } else {
      if (choice === 'down') {
        setAct1Feedback({ correct: true, msg: '🎉 અદ્ભુત! કૂતરો બિલાડીની નીચે છે.' });
        triggerWin();
      } else {
        setAct1Feedback({ correct: false, msg: 'ફરીથી ચિત્ર જુઓ. કૂતરો ક્યાં છે?' });
      }
    }
  };

  /* ========================================================
     STAGE 4: Activity 2 (Drag/Tap Placement ઉપર / નીચે) State
     ======================================================== */
  const [placedTop, setPlacedTop] = useState(null); // 'bird'
  const [placedBottom, setPlacedBottom] = useState(null); // 'ball'
  const [act2Target, setAct2Target] = useState('top'); // 'top' -> 'bottom'
  const [act2Success, setAct2Success] = useState(false);

  const handleAct2Place = (slot) => {
    if (act2Target === 'top' && slot === 'top') {
      setPlacedTop('🐦');
      setAct2Target('bottom');
      triggerWin();
    } else if (act2Target === 'bottom' && slot === 'bottom') {
      setPlacedBottom('⚽');
      setAct2Success(true);
      triggerWin();
    }
  };

  /* ========================================================
     STAGE 5: Activity 3 (ની ઉપર / ની નીચે Relative) State
     ======================================================== */
  const [act3Step, setAct3Step] = useState(1);
  const [act3Feedback, setAct3Feedback] = useState(null);

  const act3Items = [
    {
      step: 1,
      topItem: '🍎 સફરજન',
      topEmoji: '🍎',
      bottomItem: '🧺 ટોપલી',
      bottomEmoji: '🧺',
      question: 'સફરજન ટોપલીની ક્યાં છે?',
      correct: 'above',
      optAbove: 'ટોપલીની ઉપર ⬆️',
      optBelow: 'ટોપલીની નીચે ⬇️',
    },
    {
      step: 2,
      topItem: '🪁 પતંગ',
      topEmoji: '🪁',
      bottomItem: '👦 છોકરો',
      bottomEmoji: '👦',
      question: 'છોકરો પતંગની ક્યાં છે?',
      correct: 'below',
      optAbove: 'પતંગની ઉપર ⬆️',
      optBelow: 'પતંગની નીચે ⬇️',
    },
    {
      step: 3,
      topItem: '📚 પુસ્તક',
      topEmoji: '📚',
      bottomItem: '🪑 ખુરશી',
      bottomEmoji: '🪑',
      question: 'પુસ્તક ખુરશીની ક્યાં છે?',
      correct: 'above',
      optAbove: 'ખુરશીની ઉપર ⬆️',
      optBelow: 'ખુરશીની નીચે ⬇️',
    }
  ];

  const handleAct3Answer = (choice) => {
    const current = act3Items[act3Step - 1];
    if (choice === current.correct) {
      setAct3Feedback({ correct: true, msg: '🎉 સાચો જવાબ! ખૂબ સરસ!' });
      triggerWin();
      setTimeout(() => {
        if (act3Step < act3Items.length) {
          setAct3Step(act3Step + 1);
          setAct3Feedback(null);
        }
      }, 1200);
    } else {
      setAct3Feedback({ correct: false, msg: 'ફરીથી જુઓ અને સાચો વિકલ્પ પસંદ કરો.' });
    }
  };

  /* ========================================================
     STAGE 6: Activity 4 (ઉપરથી નીચે ⬇ / નીચેથી ઉપર ⬆) State
     ======================================================== */
  const [orderMode, setOrderMode] = useState('top_down'); // 'top_down' or 'bottom_up'
  const [topDownPlaced, setTopDownPlaced] = useState([]); // ['🍎', '🍌', '🍊']
  const [bottomUpPlaced, setBottomUpPlaced] = useState([]); // ['🌳', '🐱', '🐦']
  const [orderFeedback, setOrderFeedback] = useState(null);

  const topDownPool = ['🍊 નારંગી', '🍎 સફરજન', '🍌 કેળું'];
  const bottomUpPool = ['🐦 પક્ષી', '🌳 વૃક્ષ', '🐱 બિલાડી'];

  const handleTopDownTap = (item) => {
    const emoji = item.split(' ')[0];
    if (topDownPlaced.includes(emoji)) return;
    const newPlaced = [...topDownPlaced, emoji];
    setTopDownPlaced(newPlaced);

    if (newPlaced.length === 3) {
      if (newPlaced[0] === '🍎' && newPlaced[1] === '🍌' && newPlaced[2] === '🍊') {
        setOrderFeedback({ correct: true, msg: '🎉 સરસ! ઉપરથી નીચેનો સાચો ક્રમ: 🍎 → 🍌 → 🍊' });
        triggerWin();
      } else {
        setOrderFeedback({ correct: false, msg: 'ક્રમ ખોટો છે. ફરી પ્રયત્ન કરો (૧: સફરજન, ૨: કેળું, ૩: નારંગી).' });
      }
    }
  };

  const handleBottomUpTap = (item) => {
    const emoji = item.split(' ')[0];
    if (bottomUpPlaced.includes(emoji)) return;
    const newPlaced = [...bottomUpPlaced, emoji];
    setBottomUpPlaced(newPlaced);

    if (newPlaced.length === 3) {
      if (newPlaced[0] === '🌳' && newPlaced[1] === '🐱' && newPlaced[2] === '🐦') {
        setOrderFeedback({ correct: true, msg: '🎉 અદ્ભુત! નીચેથી ઉપરનો સાચો ક્રમ: 🌳 → 🐱 → 🐦' });
        triggerWin();
      } else {
        setOrderFeedback({ correct: false, msg: 'ક્રમ ખોટો છે. ફરી પ્રયત્ન કરો (૧: વૃક્ષ, ૨: બિલાડી, ૩: પક્ષી).' });
      }
    }
  };

  /* ========================================================
     STAGE 7: Activity 5 (નજીક અને દૂર) State
     ======================================================== */
  const [distTarget, setDistTarget] = useState('near'); // 'near' or 'far'
  const [ballPosition, setBallPosition] = useState(30); // 0 to 100
  const [nearFarFeedback, setNearFarFeedback] = useState(null);

  const checkNearFar = () => {
    if (distTarget === 'near') {
      if (ballPosition <= 30) {
        setNearFarFeedback({ correct: true, msg: '🎉 વાહ! બોલ બાળકની નજીક છે.' });
        triggerWin();
      } else {
        setNearFarFeedback({ correct: false, msg: 'બોલ દૂર છે. તેને બાળકની વધુ નજીક લાવો.' });
      }
    } else {
      if (ballPosition >= 70) {
        setNearFarFeedback({ correct: true, msg: '🎉 સરસ! બોલ બાળકથી ઘણો દૂર છે.' });
        triggerWin();
      } else {
        setNearFarFeedback({ correct: false, msg: 'બોલ નજીક છે. તેને બાળકથી વધુ દૂર લઈ જાઓ.' });
      }
    }
  };

  /* ========================================================
     STAGE 8: Activity 6 (“સ્થાન શોધો! 🔎” Mixed Game)
     ======================================================== */
  const [mixedRound, setMixedRound] = useState(0);
  const [mixedFeedback, setMixedFeedback] = useState(null);
  const [mixedScore, setMixedScore] = useState(0);

  const mixedChallenges = [
    {
      prompt: 'પક્ષી વૃક્ષની ક્યાં છે?',
      topEmoji: '🐦',
      bottomEmoji: '🌳',
      correct: 'ઉપર',
      options: ['ઉપર ⬆️', 'નીચે ⬇️'],
    },
    {
      prompt: 'બોલ બાળકની ક્યાં છે?',
      visual: '👦 ⚽',
      correct: 'નજીક',
      options: ['નજીક (Near)', 'દૂર (Far)'],
    },
    {
      prompt: 'ઘર બાળકથી કેવું છે?',
      visual: '👦              🏠',
      correct: 'દૂર',
      options: ['નજીક (Near)', 'દૂર (Far)'],
    },
    {
      prompt: 'બિલાડી ખુરશીની ક્યાં છે?',
      topEmoji: '🪑',
      bottomEmoji: '🐱',
      correct: 'નીચે',
      options: ['નીચે ⬇️', 'ઉપર ⬆️'],
    },
    {
      prompt: 'ફુગ્ગો ઘરની ક્યાં છે?',
      topEmoji: '🎈',
      bottomEmoji: '🏠',
      correct: 'ઉપર',
      options: ['ઉપર (Above) ⬆️', 'નીચે (Below) ⬇️'],
    }
  ];

  const handleMixedAnswer = (opt) => {
    const current = mixedChallenges[mixedRound];
    const isRight = opt.includes(current.correct);

    if (isRight) {
      setMixedScore(mixedScore + 1);
      setMixedFeedback({ correct: true, msg: `🎉 સાચો જવાબ! ${current.correct}` });
      triggerWin();
    } else {
      setMixedFeedback({ correct: false, msg: `ખોટો જવાબ. સાચો જવાબ: ${current.correct}` });
    }

    setTimeout(() => {
      if (mixedRound < mixedChallenges.length - 1) {
        setMixedRound(mixedRound + 1);
        setMixedFeedback(null);
      } else {
        setMixedFeedback({ correct: true, msg: '🏆 અભિનંદન! તમે રમતના બધા રાઉન્ડ પૂર્ણ કર્યા!' });
      }
    }, 1200);
  };

  /* ========================================================
     STAGE 9: Practice Round with 2-Tier Arrow Hints
     ======================================================== */
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceHintLevel, setPracticeHintLevel] = useState(0); // 0: None, 1: Text, 2: Arrow
  const [practiceFinished, setPracticeFinished] = useState(false);

  const practiceQuestions = [
    {
      id: 'p1',
      prompt: 'પક્ષી બિલાડીની કઈ બાજુ છે?',
      topVisual: '🐦',
      bottomVisual: '🐱',
      type: 'up_down',
      options: ['ઉપર ⬆️', 'નીચે ⬇️'],
      correct: 'ઉપર ⬆️',
      hint1: 'ચિત્રને ધ્યાનથી જુઓ.',
      hint2Arrow: '⬆️ (ઉપર તરફ જુઓ)',
    },
    {
      id: 'p2',
      prompt: 'કૂતરો ઝાડની કઈ બાજુ ઊભો છે?',
      topVisual: '🌳',
      bottomVisual: '🐶',
      type: 'up_down',
      options: ['નીચે ⬇️', 'ઉપર ⬆️'],
      correct: 'નીચે ⬇️',
      hint1: 'ચિત્રને ધ્યાનથી જુઓ.',
      hint2Arrow: '⬇️ (નીચે તરફ જુઓ)',
    },
    {
      id: 'p3',
      prompt: 'સફરજન ટોપલીની ક્યાં મૂકેલું છે?',
      topVisual: '🍎',
      bottomVisual: '🧺',
      type: 'above_below',
      options: ['ટોપલીની ઉપર', 'ટોપલીની નીચે'],
      correct: 'ટોપલીની ઉપર',
      hint1: 'સફરજન અને ટોપલીનું સ્થાન સરખાવો.',
      hint2Arrow: '⬆️ (ટોપલીની ઉપર છે)',
    },
    {
      id: 'p4',
      prompt: 'છોકરો પતંગની ક્યાં છે?',
      topVisual: '🪁',
      bottomVisual: '👦',
      type: 'above_below',
      options: ['પતંગની નીચે', 'પતંગની ઉપર'],
      correct: 'પતંગની નીચે',
      hint1: 'પતંગ આકાશમાં છે અને છોકરો નીચે.',
      hint2Arrow: '⬇️ (પતંગની નીચે છે)',
    },
    {
      id: 'p5',
      prompt: 'ચિત્ર જુઓ: 👦 ⚽ — બોલ બાળકની ક્યાં છે?',
      visual: '👦 ⚽',
      type: 'near_far',
      options: ['નજીક (Near)', 'દૂર (Far)'],
      correct: 'નજીક (Near)',
      hint1: 'બાળક અને બોલ વચ્ચેનું અંતર ઓછું છે.',
      hint2Arrow: '↔️ (નાનું અંતર - નજીક)',
    },
    {
      id: 'p6',
      prompt: 'ચિત્ર જુઓ: 👦                 🏠 — ઘર બાળકથી કેવું છે?',
      visual: '👦                 🏠',
      type: 'near_far',
      options: ['દૂર (Far)', 'નજીક (Near)'],
      correct: 'દૂર (Far)',
      hint1: 'બાળક અને ઘર વચ્ચે વધુ જગ્યા છે.',
      hint2Arrow: '⟷ (મોટું અંતર - દૂર)',
    },
    {
      id: 'p7',
      prompt: 'ઉપરથી નીચેનો (⬇) સાચો ક્રમ પસંદ કરો:',
      type: 'ordering',
      options: ['૧: 🍎 → ૨: 🍌 → ૩: 🍊', '૧: 🍊 → ૨: 🍌 → ૩: 🍎'],
      correct: '૧: 🍎 → ૨: 🍌 → ૩: 🍊',
      hint1: 'સૌથી ઉપર સફરજન 🍎 છે.',
      hint2Arrow: '⬇️ (ઉપરથી નીચે તરફ)',
    },
    {
      id: 'p8',
      prompt: 'નીચેથી ઉપરનો (⬆) સાચો ક્રમ પસંદ કરો:',
      type: 'ordering',
      options: ['૧: 🌳 → ૨: 🐱 → ૩: 🐦', '૧: 🐦 → ૨: 🐱 → ૩: 🌳'],
      correct: '૧: 🌳 → ૨: 🐱 → ૩: 🐦',
      hint1: 'સૌથી નીચે વૃક્ષ 🌳 જમીન પર છે.',
      hint2Arrow: '⬆️ (નીચેથી ઉપર તરફ)',
    },
  ];

  const currentPQ = practiceQuestions[practiceIndex];

  const handlePracticeSelect = (opt) => {
    setPracticeAnswers({
      ...practiceAnswers,
      [currentPQ.id]: opt,
    });
  };

  const handleNextPractice = () => {
    setPracticeHintLevel(0);
    if (practiceIndex < practiceQuestions.length - 1) {
      setPracticeIndex(practiceIndex + 1);
    } else {
      // Calculate practice score
      let correct = 0;
      practiceQuestions.forEach((q) => {
        if (practiceAnswers[q.id] === q.correct) correct++;
      });
      const finalScore = Math.round((correct / practiceQuestions.length) * 100);
      setPracticeScore(finalScore);
      setPracticeFinished(true);
      triggerWin();
      updateBackend({
        practiceScore: finalScore,
        hintsUsed,
        unlockAssessment: true,
      });
      if (onTestReady) onTestReady();
    }
  };

  const handleUseHint = () => {
    if (practiceHintLevel < 2) {
      setPracticeHintLevel(practiceHintLevel + 1);
      setHintsUsed(hintsUsed + 1);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 font-gujarati">
      {/* 10-Stage Progress Stepper */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              🧭
            </span>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900">
                ઉપર, નીચે, ઉપર-નીચે, નીચે-ઉપર, દૂર અને નજીક
              </h2>
              <span className="text-[11px] text-slate-500">
                પગલું {currentStage} / {totalStages}: {
                  currentStage === 1 ? 'પરિચય' :
                  currentStage === 2 ? 'એનિમેશન સમજ' :
                  currentStage === 3 ? 'રમત ૧: ઉપર / નીચે' :
                  currentStage === 4 ? 'રમત ૨: ખસેડો & મૂકો' :
                  currentStage === 5 ? 'રમત ૩: ની ઉપર / ની નીચે' :
                  currentStage === 6 ? 'રમત ૪: ક્રમ ગોઠવો' :
                  currentStage === 7 ? 'રમત ૫: નજીક / દૂર' :
                  currentStage === 8 ? 'રમત ૬: સ્થાન શોધો!' :
                  currentStage === 9 ? 'મહાવરો રાઉન્ડ' : 'કસોટી તૈયાર'
                }
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg text-xs">
              {Math.round((currentStage / totalStages) * 100)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5">
          {Array.from({ length: totalStages }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all ${
                i + 1 <= currentStage ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================
          STAGE 1: INTRODUCTION SCREEN
          ======================================================== */}
      {currentStage === 1 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6 text-center animate-in fade-in duration-300">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              પ્રથમ પગલું • પરિચય
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              ચાલો સ્થાન ઓળખતા શીખીએ! 🚀
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              ઉપર, નીચે, આગળ, પાછળ, નજીક અને દૂરની સમજ મેળવો.
            </p>
          </div>

          {/* Child-Friendly Character Stack Visual */}
          <div className="py-6 max-w-xs mx-auto bg-gradient-to-b from-teal-50 via-emerald-50 to-amber-50 rounded-3xl border-2 border-emerald-300 shadow-inner flex flex-col items-center justify-center gap-2">
            {/* Bird (Top) */}
            <div className="p-3 bg-white rounded-2xl border-2 border-emerald-400 shadow-md text-4xl animate-bounce">
              🐦
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-emerald-800 bg-white/80 px-3 py-0.5 rounded-full">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>પક્ષી બિલાડીની ઉપર છે</span>
            </div>

            {/* Cat (Middle Reference) */}
            <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-lg text-4xl my-1">
              🐱
            </div>

            {/* Dog (Bottom) */}
            <div className="flex items-center gap-1 text-xs font-black text-amber-800 bg-white/80 px-3 py-0.5 rounded-full">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>કૂતરો બિલાડીની નીચે છે</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-amber-400 shadow-md text-4xl">
              🐶
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <GujaratiVoiceButton
              text="પક્ષી બિલાડીની ઉપર છે. કૂતરો બિલાડીની નીચે છે."
              label="પાઠ સાંભળો 🔊"
              size="md"
            />
            <button
              onClick={nextStage}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>એનિમેશન સમજ જુઓ ▶</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 2: VISUAL DEMO ANIMATIONS
          ======================================================== */}
      {currentStage === 2 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="px-3 py-0.5 bg-teal-100 text-teal-800 rounded-full text-xs font-black">
              પ્રત્યક્ષ ઉદાહરણ
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              હલનચલન અને અંતર જુઓ ✨
            </h2>
            <p className="text-xs text-slate-600">
              નીચેના બટનો દબાવીને ઉપર, નીચે, નજીક અને દૂર થતી વસ્તુઓ જુઓ:
            </p>
          </div>

          {/* Interactive Animation Box */}
          <div className="h-56 bg-slate-900 rounded-3xl border-4 border-slate-700 shadow-inner relative overflow-hidden flex items-center justify-center p-4">
            {/* Up Animation */}
            {demoMode === 'up' && (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-5xl animate-bounce">🎈</div>
                <span className="text-xs font-bold text-emerald-400 bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" />
                  <span>ઉપર જાય છે (Going UP) ⬆️</span>
                </span>
              </div>
            )}

            {/* Down Animation */}
            {demoMode === 'down' && (
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-xs font-bold text-amber-400 bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <ArrowDown className="w-4 h-4" />
                  <span>નીચે પડે છે (Going DOWN) ⬇️</span>
                </span>
                <div className="text-5xl animate-bounce">🏀</div>
              </div>
            )}

            {/* Near Animation */}
            {demoMode === 'near' && (
              <div className="flex items-center justify-center gap-3">
                <div className="text-5xl">👦</div>
                <div className="text-4xl animate-pulse">⚽</div>
                <span className="text-xs font-bold text-cyan-400 bg-slate-800 px-3 py-1 rounded-full">
                  નજીક છે (Near) 🤏
                </span>
              </div>
            )}

            {/* Far Animation */}
            {demoMode === 'far' && (
              <div className="flex items-center justify-between w-full max-w-sm px-4">
                <div className="text-5xl">👦</div>
                <div className="h-0.5 border-t-2 border-dashed border-slate-600 flex-1 mx-4"></div>
                <div className="text-5xl">🏠</div>
                <span className="text-xs font-bold text-rose-400 bg-slate-800 px-3 py-1 rounded-full absolute bottom-4 left-1/2 -translate-x-1/2">
                  દૂર છે (Far) 📏
                </span>
              </div>
            )}
          </div>

          {/* Mode Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => setDemoMode('up')}
              className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                demoMode === 'up' ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-105 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-2xl">🎈</span>
              <span>ઉપર (Up ⬆️)</span>
            </button>
            <button
              onClick={() => setDemoMode('down')}
              className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                demoMode === 'down' ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-105 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-2xl">🏀</span>
              <span>નીચે (Down ⬇️)</span>
            </button>
            <button
              onClick={() => setDemoMode('near')}
              className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                demoMode === 'near' ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-105 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-2xl">👦⚽</span>
              <span>નજીક (Near)</span>
            </button>
            <button
              onClick={() => setDemoMode('far')}
              className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                demoMode === 'far' ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-105 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="text-2xl">👦...🏠</span>
              <span>દૂર (Far)</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={prevStage} className="px-4 py-2.5 border rounded-xl font-bold text-xs text-slate-600">
              ← પાછળ
            </button>
            <button onClick={nextStage} className="px-6 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95">
              <span>રમત ૧: ઉપર / નીચે ▶</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 3: ACTIVITY 1 (ઉપર અને નીચે)
          ======================================================== */}
      {currentStage === 3 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="px-3 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-black">
              પ્રવૃત્તિ ૧ • ઉપર અને નીચે
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {act1Step === 1 ? 'પક્ષી ક્યાં છે?' : 'કૂતરો ક્યાં છે?'}
            </h2>
            <p className="text-xs text-slate-600">ચિત્ર જોઈને સાચો જવાબ પસંદ કરો:</p>
          </div>

          {/* Question Visual Card */}
          <div className="py-8 max-w-xs mx-auto bg-gradient-to-b from-teal-50 to-emerald-50 rounded-3xl border-2 border-emerald-300 flex flex-col items-center justify-center gap-3">
            {act1Step === 1 ? (
              <>
                <div className="p-3.5 bg-white rounded-2xl border-2 border-emerald-400 text-4xl shadow-md animate-bounce">
                  🐦
                </div>
                <ArrowUp className="w-5 h-5 text-emerald-700 animate-pulse" />
                <div className="p-4 bg-emerald-600 text-white rounded-2xl text-4xl shadow-lg">
                  🐱
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-emerald-600 text-white rounded-2xl text-4xl shadow-lg">
                  🐱
                </div>
                <ArrowDown className="w-5 h-5 text-amber-700 animate-pulse" />
                <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-400 text-4xl shadow-md animate-bounce">
                  🐶
                </div>
              </>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={() => handleAct1Answer('up')}
              className="p-4 rounded-2xl border-2 border-emerald-300 bg-white hover:bg-emerald-50 text-slate-900 font-black text-base md:text-lg shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ArrowUp className="w-5 h-5 text-emerald-600" />
              <span>ઉપર (Up)</span>
            </button>
            <button
              onClick={() => handleAct1Answer('down')}
              className="p-4 rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-slate-900 font-black text-base md:text-lg shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ArrowDown className="w-5 h-5 text-amber-600" />
              <span>નીચે (Down)</span>
            </button>
          </div>

          {/* Feedback Banner */}
          {act1Feedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold border-2 ${
              act1Feedback.correct ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              {act1Feedback.msg}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={prevStage} className="px-4 py-2.5 border rounded-xl font-bold text-xs text-slate-600">
              ← પાછળ
            </button>
            {act1Step === 1 ? (
              <button
                onClick={() => {
                  setAct1Step(2);
                  setAct1Feedback(null);
                }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md active:scale-95"
              >
                આગળનો પ્રશ્ન (કૂતરો ક્યાં છે?) ▶
              </button>
            ) : (
              <button onClick={nextStage} className="px-6 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95">
                <span>રમત ૨: ખસેડો & મૂકો ▶</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 4: ACTIVITY 2 (DRAG / TAP PLACEMENT)
          ======================================================== */}
      {currentStage === 4 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="px-3 py-0.5 bg-teal-100 text-teal-800 rounded-full text-xs font-black">
              પ્રવૃત્તિ ૨ • સ્થાન પર ગોઠવો
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {act2Target === 'top' ? 'બિલાડીની ઉપર પક્ષી મૂકો 🐦' : 'બિલાડીની નીચે બોલ મૂકો ⚽'}
            </h2>
            <p className="text-xs text-slate-600">
              સાચા સ્થાન (સ્લોટ) પર ક્લિક કરીને વસ્તુ મૂકો:
            </p>
          </div>

          {/* Interactive 3-Tier Vertical Slot Board */}
          <div className="py-6 max-w-xs mx-auto bg-slate-50 rounded-3xl border-2 border-slate-200 p-4 flex flex-col items-center justify-center gap-3">
            {/* Top Slot */}
            <button
              onClick={() => handleAct2Place('top')}
              className={`w-full py-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                placedTop
                  ? 'bg-emerald-100 border-emerald-500 text-4xl'
                  : act2Target === 'top'
                  ? 'border-emerald-400 bg-emerald-50/50 animate-pulse text-emerald-800 text-xs font-bold'
                  : 'border-slate-300 bg-white text-slate-400 text-xs'
              }`}
            >
              {placedTop ? placedTop : '👆 અહીં પક્ષી 🐦 મૂકો (ઉપર)'}
            </button>

            {/* Middle Reference (Cat) */}
            <div className="p-4 bg-emerald-600 text-white rounded-2xl text-4xl shadow-md w-24 text-center">
              🐱
            </div>

            {/* Bottom Slot */}
            <button
              onClick={() => handleAct2Place('bottom')}
              className={`w-full py-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                placedBottom
                  ? 'bg-amber-100 border-amber-500 text-4xl'
                  : act2Target === 'bottom'
                  ? 'border-amber-400 bg-amber-50/50 animate-pulse text-amber-800 text-xs font-bold'
                  : 'border-slate-300 bg-white text-slate-400 text-xs'
              }`}
            >
              {placedBottom ? placedBottom : '👇 અહીં બોલ ⚽ મૂકો (નીચે)'}
            </button>
          </div>

          {act2Success && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-950 font-bold text-center text-sm">
              🎉 ખૂબ સરસ! પક્ષી ઉપર છે અને બોલ નીચે છે.
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={prevStage} className="px-4 py-2.5 border rounded-xl font-bold text-xs text-slate-600">
              ← પાછળ
            </button>
            <button
              onClick={nextStage}
              disabled={!act2Success}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>રમત ૩: ની ઉપર / ની નીચે ▶</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 5: ACTIVITY 3 (ની ઉપર / ની નીચે RELATIVE)
          ======================================================== */}
      {currentStage === 5 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="px-3 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-black">
              પ્રવૃત્તિ ૩ • ની ઉપર અને ની નીચે ({act3Step}/3)
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {act3Items[act3Step - 1].question}
            </h2>
            <p className="text-xs text-slate-600">વસ્તુઓની સાપેક્ષ સ્થિતિ ઓળખો:</p>
          </div>

          {/* Visual Pair Card */}
          <div className="py-6 max-w-xs mx-auto bg-gradient-to-b from-cyan-50 to-blue-50 rounded-3xl border-2 border-blue-200 flex flex-col items-center justify-center gap-3">
            <div className="p-3.5 bg-white rounded-2xl border-2 border-blue-400 text-4xl shadow-md">
              {act3Items[act3Step - 1].topEmoji}
            </div>
            <div className="h-6 w-0.5 bg-blue-300 border-l-2 border-dashed border-blue-400"></div>
            <div className="p-3.5 bg-white rounded-2xl border-2 border-blue-400 text-4xl shadow-md">
              {act3Items[act3Step - 1].bottomEmoji}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            <button
              onClick={() => handleAct3Answer('above')}
              className="p-4 rounded-2xl border-2 border-blue-300 bg-white hover:bg-blue-50 text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>{act3Items[act3Step - 1].optAbove}</span>
            </button>
            <button
              onClick={() => handleAct3Answer('below')}
              className="p-4 rounded-2xl border-2 border-blue-300 bg-white hover:bg-blue-50 text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>{act3Items[act3Step - 1].optBelow}</span>
            </button>
          </div>

          {act3Feedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold border-2 ${
              act3Feedback.correct ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              {act3Feedback.msg}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={prevStage} className="px-4 py-2.5 border rounded-xl font-bold text-xs text-slate-600">
              ← પાછળ
            </button>
            <button onClick={nextStage} className="px-6 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95">
              <span>રમત ૪: ક્રમ ગોઠવો ▶</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 6: ACTIVITY 4 (ઉપરથી નીચે ⬇ / નીચેથી ઉપર ⬆)
          ======================================================== */}
      {currentStage === 6 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="px-3 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-black">
              પ્રવૃત્તિ ૪ • ક્રમ ગોઠવણી
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {orderMode === 'top_down' ? 'ઉપરથી નીચે ગોઠવો (⬇)' : 'નીચેથી ઉપર ગોઠવો (⬆)'}
            </h2>
            <p className="text-xs text-slate-600">
              {orderMode === 'top_down'
                ? 'ફળો પર ક્લિક કરીને ૧: 🍎 ઉપર, ૨: 🍌 વચ્ચે, ૩: 🍊 નીચે ગોઠવો:'
                : 'વસ્તુઓ પર ક્લિક કરીને ૧: 🌳 નીચે, ૨: 🐱 વચ્ચે, ૩: 🐦 ઉપર ગોઠવો:'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setOrderMode('top_down');
                setTopDownPlaced([]);
                setOrderFeedback(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                orderMode === 'top_down' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}
            >
              ઉપરથી નીચે (Top to Bottom ⬇)
            </button>
            <button
              onClick={() => {
                setOrderMode('bottom_up');
                setBottomUpPlaced([]);
                setOrderFeedback(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                orderMode === 'bottom_up' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}
            >
              નીચેથી ઉપર (Bottom to Top ⬆)
            </button>
          </div>

          {/* Sorting Slots & Pool */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
            {/* Target Slots */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-center">
              <div className="text-xs font-bold text-slate-500 mb-2 flex items-center justify-center gap-1">
                {orderMode === 'top_down' ? <ArrowDown className="w-4 h-4 text-purple-600" /> : <ArrowUp className="w-4 h-4 text-purple-600" />}
                <span>ગોઠવેલ ક્રમ (Target Slots)</span>
              </div>

              {[1, 2, 3].map((num) => {
                const item = orderMode === 'top_down' ? topDownPlaced[num - 1] : bottomUpPlaced[num - 1];
                return (
                  <div
                    key={num}
                    className="p-3 bg-white rounded-xl border-2 border-dashed border-purple-300 font-bold text-sm flex items-center justify-between px-4"
                  >
                    <span className="font-mono text-xs text-purple-700">પગલું #{num}</span>
                    <span className="text-2xl">{item || '—'}</span>
                  </div>
                );
              })}
            </div>

            {/* Selection Pool */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-500 mb-2 text-center">
                વસ્તુ પસંદ કરો (Tap to place):
              </div>
              {(orderMode === 'top_down' ? topDownPool : bottomUpPool).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => orderMode === 'top_down' ? handleTopDownTap(item) : handleBottomUpTap(item)}
                  className="w-full p-3 bg-white hover:bg-purple-50 rounded-xl border border-slate-300 font-bold text-sm text-left shadow-xs flex items-center gap-2 active:scale-95"
                >
                  <span className="text-2xl">{item.split(' ')[0]}</span>
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>

          {orderFeedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold border-2 ${
              orderFeedback.correct ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              {orderFeedback.msg}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={prevStage} className="px-4 py-2.5 border rounded-xl font-bold text-xs text-slate-600">
              ← પાછળ
            </button>
            <button onClick={nextStage} className="px-6 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95">
              <span>રમત ૫: નજીક / દૂર ▶</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 7: ACTIVITY 5 (નજીક અને દૂર)
          ======================================================== */}
      {currentStage === 7 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="px-3 py-0.5 bg-rose-100 text-rose-800 rounded-full text-xs font-black">
              પ્રવૃત્તિ ૫ • નજીક અને દૂર
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {distTarget === 'near' ? 'બાળકની નજીક બોલ મૂકો 🤏' : 'બાળકથી દૂર બોલ મૂકો 📏'}
            </h2>
            <p className="text-xs text-slate-600">
              સ્લાઇડર ખસેડીને બોલને બાળકની નજીક અથવા દૂર લઈ જાઓ:
            </p>
          </div>

          {/* Target Mode Toggle */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setDistTarget('near');
                setNearFarFeedback(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                distTarget === 'near' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}
            >
              લક્ષ્ય: નજીક લાવો (Near 👦⚽)
            </button>
            <button
              onClick={() => {
                setDistTarget('far');
                setNearFarFeedback(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                distTarget === 'far' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}
            >
              લક્ષ્ય: દૂર લઈ જાઓ (Far 👦...⚽)
            </button>
          </div>

          {/* Interactive Distance Board */}
          <div className="p-6 bg-gradient-to-r from-amber-50 to-rose-50 rounded-3xl border-2 border-rose-200 space-y-6">
            <div className="relative h-24 bg-white rounded-2xl border border-rose-200 flex items-center px-4 overflow-hidden">
              {/* Boy (Fixed at left) */}
              <div className="text-5xl shrink-0 z-10">👦</div>

              {/* Movable Ball */}
              <div
                className="absolute text-4xl transition-all duration-150"
                style={{ left: `calc(${ballPosition}% + 20px)` }}
              >
                ⚽
              </div>
            </div>

            {/* Slider Controls */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="85"
                value={ballPosition}
                onChange={(e) => setBallPosition(Number(e.target.value))}
                className="w-full h-3 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>👈 નજીક (Near)</span>
                <span>દૂર (Far) 👉</span>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={checkNearFar}
                className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-200 active:scale-95 transition-all"
              >
                ચકાસો (Check Distance) ✓
              </button>
            </div>
          </div>

          {nearFarFeedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold border-2 ${
              nearFarFeedback.correct ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              {nearFarFeedback.msg}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={prevStage} className="px-4 py-2.5 border rounded-xl font-bold text-xs text-slate-600">
              ← પાછળ
            </button>
            <button onClick={nextStage} className="px-6 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95">
              <span>રમત ૬: સ્થાન શોધો! ▶</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 8: ACTIVITY 6 (“સ્થાન શોધો! 🔎” MIXED GAME)
          ======================================================== */}
      {currentStage === 8 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
              પ્રવૃત્તિ ૬ • સ્થાન શોધો! 🔎 (રાઉન્ડ {mixedRound + 1}/5)
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {mixedChallenges[mixedRound].prompt}
            </h2>
          </div>

          {/* Question Visual Card */}
          <div className="py-8 max-w-sm mx-auto bg-slate-50 rounded-3xl border-2 border-slate-200 flex flex-col items-center justify-center gap-3">
            {mixedChallenges[mixedRound].visual ? (
              <div className="text-4xl font-bold">{mixedChallenges[mixedRound].visual}</div>
            ) : (
              <>
                <div className="p-3 bg-white rounded-2xl border shadow-sm text-4xl">
                  {mixedChallenges[mixedRound].topEmoji}
                </div>
                <div className="h-4 w-0.5 bg-slate-300 border-l border-dashed border-slate-400"></div>
                <div className="p-3 bg-white rounded-2xl border shadow-sm text-4xl">
                  {mixedChallenges[mixedRound].bottomEmoji}
                </div>
              </>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {mixedChallenges[mixedRound].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleMixedAnswer(opt)}
                className="p-4 rounded-2xl border-2 border-emerald-300 bg-white hover:bg-emerald-50 text-slate-900 font-black text-base shadow-sm active:scale-95 transition-all text-center"
              >
                {opt}
              </button>
            ))}
          </div>

          {mixedFeedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold border-2 ${
              mixedFeedback.correct ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              {mixedFeedback.msg}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={prevStage} className="px-4 py-2.5 border rounded-xl font-bold text-xs text-slate-600">
              ← પાછળ
            </button>
            <button onClick={nextStage} className="px-6 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95">
              <span>મહાવરો રાઉન્ડ ▶</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 9: PRACTICE ROUND (2-TIER ARROW HINTS)
          ======================================================== */}
      {currentStage === 9 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
              મહાવરો • પ્રશ્ન {practiceIndex + 1} / {practiceQuestions.length}
            </span>

            {/* Hint Button */}
            <button
              onClick={handleUseHint}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 flex items-center gap-1 active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span>સંકેત / મદદ ({2 - practiceHintLevel} બાકી)</span>
            </button>
          </div>

          {/* Question Prompt */}
          <div className="space-y-1 text-center">
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              {currentPQ.prompt}
            </h2>
          </div>

          {/* Visual Box */}
          <div className="py-6 max-w-sm mx-auto bg-slate-50 rounded-3xl border-2 border-slate-200 flex flex-col items-center justify-center gap-2">
            {currentPQ.visual ? (
              <div className="text-4xl font-bold py-2">{currentPQ.visual}</div>
            ) : (
              <>
                <div className="text-4xl">{currentPQ.topVisual}</div>
                <div className="text-4xl">{currentPQ.bottomVisual}</div>
              </>
            )}

            {/* Visual Arrow Hint Overlay */}
            {practiceHintLevel >= 2 && currentPQ.hint2Arrow && (
              <div className="mt-2 px-3 py-1 bg-amber-200 text-amber-950 font-black text-xs rounded-full border border-amber-400 animate-pulse">
                {currentPQ.hint2Arrow}
              </div>
            )}
          </div>

          {/* Hint Text 1 */}
          {practiceHintLevel >= 1 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs font-bold text-center">
              💡 સંકેત: {currentPQ.hint1}
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            {currentPQ.options.map((opt, i) => {
              const isSelected = practiceAnswers[currentPQ.id] === opt;
              return (
                <button
                  key={i}
                  onClick={() => handlePracticeSelect(opt)}
                  className={`p-4 rounded-2xl border-2 font-black text-sm text-center shadow-xs transition-all active:scale-95 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-4 ring-emerald-100'
                      : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={prevStage} className="px-4 py-2.5 border rounded-xl font-bold text-xs text-slate-600">
              ← પાછળ
            </button>
            <button
              onClick={handleNextPractice}
              disabled={!practiceAnswers[currentPQ.id]}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>{practiceIndex < practiceQuestions.length - 1 ? 'આગળનો પ્રશ્ન ▶' : 'મહાવરો પૂર્ણ કરો ✓'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 10: IN-MODULE FINAL ASSESSMENT (10 QUESTIONS)
          ======================================================== */}
      {currentStage === 10 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-300 shadow-2xl space-y-6 animate-in fade-in-50 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
                અંતિમ કસોટી (Final Test)
              </span>
              <div className="text-xs text-slate-500 font-bold mt-1">
                પ્રશ્ન {testIdx + 1} / {testQuestions.length}
              </div>
            </div>
            <GujaratiVoiceButton
              text={testQuestions[testIdx]?.promptGujarati}
              label="સાંભળો"
              size="sm"
            />
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
            {testQuestions.map((q, i) => {
              const isAnswered = testUserAnswers[i] !== undefined;
              const isCurrent = i === testIdx;
              return (
                <button
                  key={i}
                  onClick={() => setTestIdx(i)}
                  className={`w-7 h-7 rounded-xl font-mono text-xs font-black transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 scale-110'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Question Prompt */}
          <div className="text-center space-y-3">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
              {testQuestions[testIdx]?.promptGujarati}
            </h2>

            {/* Visual Preview */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-center font-bold text-slate-700 whitespace-pre-line text-sm">
              {testQuestions[testIdx]?.visual}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            {testQuestions[testIdx]?.options.map((opt) => {
              const isSelected = testUserAnswers[testIdx] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setTestUserAnswers({ ...testUserAnswers, [testIdx]: opt.id })}
                  className={`p-4 rounded-2xl border-2 font-black text-sm text-center shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-4 ring-emerald-100'
                      : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setTestIdx(Math.max(0, testIdx - 1))}
              disabled={testIdx === 0}
              className="px-4 py-2.5 border rounded-xl font-bold text-xs text-slate-600 disabled:opacity-30"
            >
              ← પાછળ
            </button>

            {testIdx < testQuestions.length - 1 ? (
              <button
                onClick={() => setTestIdx(testIdx + 1)}
                disabled={!testUserAnswers[testIdx]}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
              >
                <span>આગળનો પ્રશ્ન ▶</span>
              </button>
            ) : (
              <button
                onClick={handleSubmitFinalAssessment}
                disabled={Object.keys(testUserAnswers).length < testQuestions.length || submittingTest}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-xl shadow-emerald-200 flex items-center gap-2 active:scale-95"
              >
                <span>{submittingTest ? 'પરિણામ તપાસી રહ્યા છીએ...' : 'કસોટી સબમિટ કરો (Submit Test) ✓'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 11: FINAL RESULT SCREEN & WEAKNESS DIAGNOSIS
          ======================================================== */}
      {currentStage === 11 && testResultData && (
        <div className={`rounded-3xl p-8 border-4 text-center shadow-2xl space-y-6 animate-in zoom-in-95 duration-300 ${
          testResultData.isMastered
            ? 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50 border-emerald-400'
            : testResultData.score >= 31
            ? 'bg-gradient-to-b from-amber-50 via-white to-amber-50 border-amber-400'
            : 'bg-gradient-to-b from-rose-50 via-white to-rose-50 border-rose-400'
        }`}>
          <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-xl animate-bounce ${
            testResultData.isMastered
              ? 'bg-emerald-500 text-white ring-8 ring-emerald-100'
              : testResultData.score >= 31
              ? 'bg-amber-400 text-white ring-8 ring-amber-100'
              : 'bg-rose-400 text-white ring-8 ring-rose-100'
          }`}>
            {testResultData.isMastered ? '🎉' : (testResultData.score >= 31 ? '👍' : '💪')}
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono bg-white shadow-xs">
              સ્કોર: {testResultData.correctCount} / {testResultData.totalQuestions} ({testResultData.score}%)
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {testResultData.isMastered
                ? '🎉 અભિનંદન! તમે સ્થાનિક સંકલ્પનાઓ (M-02) માં નિપુણતા મેળવી!'
                : (testResultData.score >= 31
                  ? 'તમે થોડું વધુ શીખવાની જરૂર છે 👍'
                  : 'ચાલો ફરીથી શીખીએ! ✨')}
            </h1>

            <p className="text-sm font-semibold text-slate-600 max-w-md mx-auto">
              {testResultData.isMastered
                ? 'તમે ઉપર, નીચે, ની ઉપર, ની નીચે, ઉપરથી નીચે, નીચેથી ઉપર, નજીક અને દૂર બધી સંકલ્પનાઓ સરસ રીતે સમજી લીધી છે. આગળનું પગલું (M-03) અનલૉક થઈ ગયું છે!'
                : 'નીચે આપેલ નબળા મુદ્દાઓ પર ફરી મહાવરો કરો અને પછી ફરી કસોટી આપો.'}
            </p>
          </div>

          {/* Weakness Diagnosis */}
          {!testResultData.isMastered && testResultData.weakAreas && testResultData.weakAreas.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="font-black text-amber-950 flex items-center gap-1.5">
                <span>🎯 ધ્યાન આપવાની જરૂર (Diagnosed Areas):</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {testResultData.weakAreas.map((wa, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 font-bold text-[11px]">
                    ⚠️ {wa}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            {testResultData.isMastered ? (
              <>
                <button
                  onClick={() => navigate('/student/learn/M-03')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>આગળનું પગલું (૧ થી ૫ સુધીની સંખ્યાઓ - M-03) ▶</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/student/path/mathematics')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-700 border border-slate-300 font-bold text-xs rounded-2xl hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>ગણિત અધ્યયન માર્ગ (Learning Path)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCurrentStage(3); // Go to Activity 1
                    setTestUserAnswers({});
                    setTestIdx(0);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>રમતો ફરીથી રમો (Replay Activities)</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentStage(10); // Retake Test
                    setTestUserAnswers({});
                    setTestIdx(0);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>કસોટી ફરી આપો (Retake Test)</span>
                </button>
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-700 border border-slate-300 font-bold text-xs rounded-2xl hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>મુખ્ય પેજ</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
