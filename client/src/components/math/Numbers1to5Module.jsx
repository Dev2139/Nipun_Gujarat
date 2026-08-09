import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  Target,
  Volume2,
  Lightbulb,
  Search,
  Check,
  Flame,
  Music,
  Smile
} from 'lucide-react';

export default function Numbers1to5Module({ competency, progress, onTestReady }) {
  const navigate = useNavigate();

  // Active Flow Stage
  // 1: welcome, 2: video, 3: explore, 4: act1_find, 5: act2_quantity, 6: act3_count,
  // 7: act4_drag, 8: act5_sequence, 9: act6_order, 10: act7_hunt, 11: act8_scene,
  // 12: practice, 13: mini_check, 14: final_test, 15: result
  const [currentStage, setCurrentStage] = useState(1);

  // Tracking metrics
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(progress?.videoWatched || false);
  const [videoWatchedPercentage, setVideoWatchedPercentage] = useState(progress?.videoWatchedPercentage || 0);
  const [activitiesDone, setActivitiesDone] = useState(progress?.activitiesCompleted || 0);
  const [hintsUsedCount, setHintsUsedCount] = useState(progress?.hintsUsed || 0);
  const [practiceScore, setPracticeScore] = useState(progress?.practiceScore || 0);
  const [practiceFinished, setPracticeFinished] = useState(progress?.practiceCompleted || false);
  const [isTestUnlocked, setIsTestUnlocked] = useState(progress?.assessmentUnlocked || false);

  // Audio helper using SpeechSynthesis if available
  const speakGujarati = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'gu-IN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Sync with backend API
  const saveActivityProgress = async (patch) => {
    try {
      await api.post('/progress/activity-update', {
        competencyCode: 'M-03',
        ...patch,
      });
    } catch (err) {
      console.warn('[M-03 Module] Activity tracking sync error:', err);
    }
  };

  /* -------------------------------------------------------------
     STAGE 2: VIDEO TRACKING
  ------------------------------------------------------------- */
  const handleVideoStart = () => {
    setVideoStarted(true);
    saveActivityProgress({ videoWatchedPercentage: 25 });
  };

  const handleVideoCompleted = () => {
    setVideoCompleted(true);
    setVideoWatchedPercentage(100);
    saveActivityProgress({
      videoWatched: true,
      videoWatchedPercentage: 100,
    });
  };

  /* -------------------------------------------------------------
     STAGE 3: VISUAL NUMBER EXPLORATION (1 to 5)
  ------------------------------------------------------------- */
  const numberCards = [
    { num: '૧', english: 1, name: 'એક', emoji: '🍎', count: 1, label: 'એક સફરજન', phrase: 'આ ૧ છે. એક સૂર્ય ☀️' },
    { num: '૨', english: 2, name: 'બે', emoji: '🍎', count: 2, label: 'બે સફરજન', phrase: 'આ ૨ છે. બે આંખો 👀' },
    { num: '૩', english: 3, name: 'ત્રણ', emoji: '🍎', count: 3, label: 'ત્રણ સફરજન', phrase: 'આ ૩ છે. ત્રણ પૈડાંની રીક્ષા 🛺' },
    { num: '૪', english: 4, name: 'ચાર', emoji: '🍎', count: 4, label: 'ચાર સફરજન', phrase: 'આ ૪ છે. ચાર પગવાળી ગાય 🐄' },
    { num: '૫', english: 5, name: 'પાંચ', emoji: '🍎', count: 5, label: 'પાંચ સફરજન', phrase: 'આ ૫ છે. હાથની પાંચ આંગળીઓ 🖐️' },
  ];
  const [activeExploreNum, setActiveExploreNum] = useState(1);

  /* -------------------------------------------------------------
     STAGE 4: ACTIVITY 1 - FIND THE NUMBER (“નંબર શોધો 🔎”)
  ------------------------------------------------------------- */
  const act1Rounds = [
    { target: '૫', targetName: 'પાંચ', options: ['૨', '૫', '૩'], prompt: '૫ (પાંચ) શોધો.' },
    { target: '૩', targetName: 'ત્રણ', options: ['૩', '૧', '૪'], prompt: '૩ (ત્રણ) શોધો.' },
    { target: '૧', targetName: 'એક', options: ['૫', '૪', '૧'], prompt: '૧ (એક) શોધો.' },
    { target: '૪', targetName: 'ચાર', options: ['૪', '૨', '૫'], prompt: '૪ (ચાર) શોધો.' },
    { target: '૨', targetName: 'બે', options: ['૩', '૨', '૧'], prompt: '૨ (બે) શોધો.' },
  ];
  const [act1Index, setAct1Index] = useState(0);
  const [act1Selected, setAct1Selected] = useState(null);
  const [act1Feedback, setAct1Feedback] = useState(null);
  const [act1Attempts, setAct1Attempts] = useState(0);

  const handleAct1Check = (option) => {
    setAct1Selected(option);
    const round = act1Rounds[act1Index];
    if (option === round.target) {
      setAct1Feedback({ correct: true, text: `🎉 સરસ! આ ${round.target} (${round.targetName}) છે.` });
      speakGujarati(`સરસ! આ ${round.targetName} છે.`);
      const nextDone = Math.max(activitiesDone, 1);
      setActivitiesDone(nextDone);
      saveActivityProgress({ activitiesCompleted: nextDone });
    } else {
      setAct1Attempts(prev => prev + 1);
      setAct1Feedback({ correct: false, text: `ફરીથી જુઓ. ${round.target} ક્યાં છે?` });
      speakGujarati(`ફરીથી જુઓ. ${round.targetName} ક્યાં છે?`);
    }
  };

  const handleAct1Next = () => {
    setAct1Selected(null);
    setAct1Feedback(null);
    setAct1Attempts(0);
    setAct1Index((act1Index + 1) % act1Rounds.length);
  };

  /* -------------------------------------------------------------
     STAGE 5: ACTIVITY 2 - MATCH NUMBER WITH QUANTITY
  ------------------------------------------------------------- */
  const act2Rounds = [
    { number: '૩', numName: 'ત્રણ', correctCount: 3, options: [2, 3, 5], theme: '🍎' },
    { number: '૫', numName: 'પાંચ', correctCount: 5, options: [5, 4, 2], theme: '⭐' },
    { number: '૨', numName: 'બે', correctCount: 2, options: [1, 2, 4], theme: '🐟' },
    { number: '૪', numName: 'ચાર', correctCount: 4, options: [3, 4, 5], theme: '🌸' },
    { number: '૧', numName: 'એક', correctCount: 1, options: [2, 1, 3], theme: '⚽' },
  ];
  const [act2Index, setAct2Index] = useState(0);
  const [act2Selected, setAct2Selected] = useState(null);
  const [act2Feedback, setAct2Feedback] = useState(null);

  const handleAct2Check = (count) => {
    setAct2Selected(count);
    const round = act2Rounds[act2Index];
    if (count === round.correctCount) {
      setAct2Feedback({ correct: true, text: `🎉 ખૂબ સરસ! આ ${round.number} વસ્તુઓ છે.` });
      speakGujarati(`ખૂબ સરસ! આ ${round.numName} વસ્તુઓ છે.`);
      const nextDone = Math.max(activitiesDone, 2);
      setActivitiesDone(nextDone);
      saveActivityProgress({ activitiesCompleted: nextDone });
    } else {
      setAct2Feedback({ correct: false, text: 'વસ્તુઓ ફરીથી એક-એક કરીને ગણો.' });
      speakGujarati('વસ્તુઓ ફરીથી એક-એક કરીને ગણો.');
    }
  };

  const handleAct2Next = () => {
    setAct2Selected(null);
    setAct2Feedback(null);
    setAct2Index((act2Index + 1) % act2Rounds.length);
  };

  /* -------------------------------------------------------------
     STAGE 6: ACTIVITY 3 - COUNT THE OBJECTS (ONE-BY-ONE TAPPING)
  ------------------------------------------------------------- */
  const act3Rounds = [
    { total: 4, theme: '🍎', gujCount: '૪', name: 'ચાર', options: ['૩', '૪', '૫'] },
    { total: 3, theme: '⭐', gujCount: '૩', name: 'ત્રણ', options: ['૨', '૩', '૪'] },
    { total: 5, theme: '🎈', gujCount: '૫', name: 'પાંચ', options: ['૪', '૫', '૨'] },
    { total: 2, theme: '⚽', gujCount: '૨', name: 'બે', options: ['૧', '૨', '૩'] },
  ];
  const [act3Index, setAct3Index] = useState(0);
  const [tappedIndices, setTappedIndices] = useState([]);
  const [act3SelectedAnswer, setAct3SelectedAnswer] = useState(null);
  const [act3Feedback, setAct3Feedback] = useState(null);

  const handleTapObject = (idx) => {
    if (!tappedIndices.includes(idx)) {
      const nextTapped = [...tappedIndices, idx];
      setTappedIndices(nextTapped);
      const countNames = ['એક', 'બે', 'ત્રણ', 'ચાર', 'પાંચ'];
      speakGujarati(countNames[nextTapped.length - 1] || `${nextTapped.length}`);
    }
  };

  const handleAct3Check = (ans) => {
    setAct3SelectedAnswer(ans);
    const round = act3Rounds[act3Index];
    if (ans === round.gujCount) {
      setAct3Feedback({ correct: true, text: `🎉 સાચો જવાબ! કુલ ${round.gujCount} (${round.name}) વસ્તુઓ છે.` });
      speakGujarati(`સાચો જવાબ! કુલ ${round.name} વસ્તુઓ છે.`);
      const nextDone = Math.max(activitiesDone, 3);
      setActivitiesDone(nextDone);
      saveActivityProgress({ activitiesCompleted: nextDone });
    } else {
      setAct3Feedback({ correct: false, text: 'તમે ટેપ કરીને ફરી ગણો.' });
      speakGujarati('તમે ટેપ કરીને ફરી ગણો.');
    }
  };

  const handleAct3Next = () => {
    setTappedIndices([]);
    setAct3SelectedAnswer(null);
    setAct3Feedback(null);
    setAct3Index((act3Index + 1) % act3Rounds.length);
  };

  /* -------------------------------------------------------------
     STAGE 7: ACTIVITY 4 - NUMBER AND QUANTITY MATCHING (PAIRING)
  ------------------------------------------------------------- */
  const [matchedPairs, setMatchedPairs] = useState({});
  const [selectedNumCard, setSelectedNumCard] = useState(null);
  const [act4Feedback, setAct4Feedback] = useState(null);

  const handleSelectNumberForPair = (num) => {
    setSelectedNumCard(num);
  };

  const handleSelectGroupForPair = (count) => {
    if (!selectedNumCard) {
      speakGujarati('પહેલાં ડાબી બાજુથી નંબર પસંદ કરો.');
      return;
    }
    const numToCount = { '૧': 1, '૨': 2, '૩': 3, '૪': 4, '૫': 5 };
    if (numToCount[selectedNumCard] === count) {
      const nextMatched = { ...matchedPairs, [selectedNumCard]: count };
      setMatchedPairs(nextMatched);
      setSelectedNumCard(null);
      speakGujarati(`વાહ! ${selectedNumCard} સાચું જોડાયું.`);

      if (Object.keys(nextMatched).length === 5) {
        setAct4Feedback({ correct: true, text: '🎉 વાહ! તમે સંખ્યાઓને વસ્તુઓ સાથે સફળતાપૂર્વક જોડ્યાં.' });
        const nextDone = Math.max(activitiesDone, 4);
        setActivitiesDone(nextDone);
        saveActivityProgress({ activitiesCompleted: nextDone });
      }
    } else {
      speakGujarati('આ જૂથ યોગ્ય નથી. ફરીથી ગણો.');
    }
  };

  const resetAct4 = () => {
    setMatchedPairs({});
    setSelectedNumCard(null);
    setAct4Feedback(null);
  };

  /* -------------------------------------------------------------
     STAGE 8: ACTIVITY 5 - NUMBER SEQUENCE (MISSING NUMBER)
  ------------------------------------------------------------- */
  const act5Rounds = [
    { sequence: ['૧', '૨', '__', '૪', '૫'], missing: '૩', missingName: 'ત્રણ', options: ['૧', '૩', '૫'] },
    { sequence: ['૧', '__', '૩', '૪', '૫'], missing: '૨', missingName: 'બે', options: ['૨', '૪', '૫'] },
    { sequence: ['__', '૨', '૩', '૪', '૫'], missing: '૧', missingName: 'એક', options: ['૧', '૩', '૫'] },
    { sequence: ['૧', '૨', '૩', '__', '૫'], missing: '૪', missingName: 'ચાર', options: ['૨', '૪', '૩'] },
    { sequence: ['૧', '૨', '૩', '૪', '__'], missing: '૫', missingName: 'પાંચ', options: ['૫', '૧', '૪'] },
  ];
  const [act5Index, setAct5Index] = useState(0);
  const [act5Selected, setAct5Selected] = useState(null);
  const [act5Feedback, setAct5Feedback] = useState(null);

  const handleAct5Check = (opt) => {
    setAct5Selected(opt);
    const round = act5Rounds[act5Index];
    if (opt === round.missing) {
      setAct5Feedback({ correct: true, text: `🎉 ઉત્તમ! ખૂટતી સંખ્યા ${round.missing} (${round.missingName}) છે.` });
      speakGujarati(`ઉત્તમ! ખૂટતી સંખ્યા ${round.missingName} છે.`);
      const nextDone = Math.max(activitiesDone, 5);
      setActivitiesDone(nextDone);
      saveActivityProgress({ activitiesCompleted: nextDone });
    } else {
      setAct5Feedback({ correct: false, text: 'ક્રમ ફરીથી બોલો: ૧, ૨, ૩, ૪, ૫.' });
      speakGujarati('ક્રમ ફરીથી બોલો: એક, બે, ત્રણ, ચાર, પાંચ.');
    }
  };

  const handleAct5Next = () => {
    setAct5Selected(null);
    setAct5Feedback(null);
    setAct5Index((act5Index + 1) % act5Rounds.length);
  };

  /* -------------------------------------------------------------
     STAGE 9: ACTIVITY 6 - NUMBER ORDER DRAG / TAP GAME
  ------------------------------------------------------------- */
  const [orderSlots, setOrderSlots] = useState([]);
  const [orderPool, setOrderPool] = useState(['૪', '૧', '૫', '૨', '૩']);
  const [orderFeedback, setOrderFeedback] = useState(null);

  const handleAddToOrder = (num) => {
    if (orderSlots.includes(num)) return;
    const nextSlots = [...orderSlots, num];
    setOrderSlots(nextSlots);
    setOrderPool(orderPool.filter(n => n !== num));

    if (nextSlots.length === 5) {
      const isCorrect = nextSlots.join('') === '૧૨૩૪૫';
      if (isCorrect) {
        setOrderFeedback({ correct: true, text: '🎉 સરસ! ૧ થી ૫ સુધીનો સાચો ક્રમ તમને આવડે છે.' });
        speakGujarati('સરસ! ૧ થી ૫ સુધીનો સાચો ક્રમ તમને આવડે છે.');
        const nextDone = Math.max(activitiesDone, 5);
        setActivitiesDone(nextDone);
        saveActivityProgress({ activitiesCompleted: nextDone });
      } else {
        setOrderFeedback({ correct: false, text: 'ક્રમ સાચો નથી. રીસેટ કરીને ૧ થી ૫ ગોઠવો.' });
        speakGujarati('ક્રમ સાચો નથી. રીસેટ કરીને ફરી ગોઠવો.');
      }
    }
  };

  const resetOrder = () => {
    setOrderSlots([]);
    setOrderPool(['૪', '૧', '૫', '૨', '૩']);
    setOrderFeedback(null);
  };

  /* -------------------------------------------------------------
     STAGE 10: ACTIVITY 7 - NUMBER HUNT GAME (“નંબર પકડો! 🎯”)
  ------------------------------------------------------------- */
  const huntTargets = [
    { target: '૩', name: 'ત્રણ' },
    { target: '૫', name: 'પાંચ' },
    { target: '૨', name: 'બે' },
    { target: '૪', name: 'ચાર' },
    { target: '૧', name: 'એક' },
  ];
  const [huntIndex, setHuntIndex] = useState(0);
  const [huntStars, setHuntStars] = useState(0);
  const [huntFeedback, setHuntFeedback] = useState(null);
  const [huntMotionEnabled, setHuntMotionEnabled] = useState(true);

  const handleHuntTap = (num) => {
    const currentTarget = huntTargets[huntIndex];
    if (num === currentTarget.target) {
      setHuntStars(prev => prev + 10);
      setHuntFeedback({ correct: true, text: `⭐ +10! તમે સાચો નંબર ${currentTarget.target} પકડ્યો!` });
      speakGujarati(`વાહ! તમે ${currentTarget.name} પકડ્યો.`);
      setTimeout(() => {
        setHuntFeedback(null);
        setHuntIndex((huntIndex + 1) % huntTargets.length);
      }, 1200);
    } else {
      setHuntFeedback({ correct: false, text: `આ ${num} છે. આપણે ${currentTarget.target} (${currentTarget.name}) શોધવાનો છે.` });
      speakGujarati(`આપણે ${currentTarget.name} શોધવાનો છે.`);
    }
  };

  /* -------------------------------------------------------------
     STAGE 11: ACTIVITY 8 - VISUAL COUNTING SCENE GAME
  ------------------------------------------------------------- */
  const sceneRounds = [
    {
      title: '🌳 સુંદર સફરજનનું ઝાડ',
      prompt: 'ઝાડ પર કેટલા સફરજન છે?',
      items: ['🍎', '🍎', '🍎'],
      countGuj: '૩',
      name: 'ત્રણ',
      options: ['૨', '૩', '૪'],
    },
    {
      title: '🌸 બગીચામાં પતંગિયા',
      prompt: 'બગીચામાં કેટલા પતંગિયા ઊડે છે?',
      items: ['🦋', '🦋', '🦋', '🦋'],
      countGuj: '૪',
      name: 'ચાર',
      options: ['૩', '૪', '૫'],
    },
    {
      title: '🌊 તળાવમાં માછલીઓ',
      prompt: 'તળાવમાં કેટલી માછલીઓ તરે છે?',
      items: ['🐟', '🐟', '🐟', '🐟', '🐟'],
      countGuj: '૫',
      name: 'પાંચ',
      options: ['૪', '૫', '૨'],
    },
  ];
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneSelected, setSceneSelected] = useState(null);
  const [sceneFeedback, setSceneFeedback] = useState(null);

  const handleSceneCheck = (ans) => {
    setSceneSelected(ans);
    const round = sceneRounds[sceneIndex];
    if (ans === round.countGuj) {
      setSceneFeedback({ correct: true, text: `🎉 અદ્ભુત! ચિત્રમાં કુલ ${round.countGuj} (${round.name}) છે.` });
      speakGujarati(`અદ્ભુત! ચિત્રમાં કુલ ${round.name} છે.`);
      const nextDone = Math.max(activitiesDone, 5);
      setActivitiesDone(nextDone);
      saveActivityProgress({ activitiesCompleted: nextDone });
    } else {
      setSceneFeedback({ correct: false, text: 'ચિત્રને ધ્યાનથી જોઈને ફરીથી ગણો.' });
      speakGujarati('ચિત્રને ધ્યાનથી જોઈને ફરીથી ગણો.');
    }
  };

  const handleSceneNext = () => {
    setSceneSelected(null);
    setSceneFeedback(null);
    setSceneIndex((sceneIndex + 1) % sceneRounds.length);
  };

  /* -------------------------------------------------------------
     STAGE 12: PRACTICE ROUND (8 ACTIVITIES WITH PROGRESSIVE HINTS)
  ------------------------------------------------------------- */
  const practiceQuestions = [
    {
      id: 'p1',
      prompt: '૪ (ચાર) શોધો:',
      audio: 'ચાર શોધો',
      options: ['૨', '૪', '૫'],
      correct: '૪',
      hint1: 'ફરીથી ધ્યાનથી જુઓ.',
      hint2: '૪ એટલે ચાર.',
      visualHint: '૪ 🐄',
    },
    {
      id: 'p2',
      prompt: 'કેટલા દડા છે? ⚽ ⚽',
      audio: 'કેટલા દડા છે?',
      options: ['૧', '૨', '૩'],
      correct: '૨',
      hint1: 'ફરીથી ધ્યાનથી જુઓ.',
      hint2: 'વસ્તુઓ એક-એક કરીને ગણો: ૧, ૨.',
      visualHint: '⚽(૧) ⚽(૨)',
    },
    {
      id: 'p3',
      prompt: '૫ વસ્તુઓવાળો સમૂહ પસંદ કરો:',
      audio: 'પાંચ વસ્તુઓવાળો સમૂહ પસંદ કરો',
      options: ['⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐'],
      correct: '⭐⭐⭐⭐⭐',
      hint1: 'તારાઓ એક-એક કરીને ગણો.',
      hint2: 'પાંચ તારા હોવા જોઈએ.',
      visualHint: '⭐ ⭐ ⭐ ⭐ ⭐ (૫)',
    },
    {
      id: 'p4',
      prompt: '૧ → ૨ → __ → ૪ → ૫ માં ખૂટતી સંખ્યા:',
      audio: 'ખૂટતી સંખ્યા શોધો',
      options: ['૧', '૩', '૫'],
      correct: '૩',
      hint1: '૨ પછી કયો નંબર આવે?',
      hint2: '૧, ૨ પછી ૩ આવે.',
      visualHint: '૧ → ૨ → [૩] → ૪ → ૫',
    },
    {
      id: 'p5',
      prompt: '૧ (એક) શોધો:',
      audio: 'એક શોધો',
      options: ['૩', '૫', '૧'],
      correct: '૧',
      hint1: 'પ્રથમ અંક શોધો.',
      hint2: '૧ એટલે એક.',
      visualHint: '૧ ☀️',
    },
    {
      id: 'p6',
      prompt: 'કેટલા સફરજન છે? 🍎 🍎 🍎 🍎',
      audio: 'કેટલા સફરજન છે?',
      options: ['૩', '૪', '૫'],
      correct: '૪',
      hint1: 'એક-એક સફરજન ગણો.',
      hint2: '૧, ૨, ૩, ૪ સફરજન છે.',
      visualHint: '🍎 🍎 🍎 🍎 (૪)',
    },
    {
      id: 'p7',
      prompt: '૩ ફૂલો વાળો સમૂહ પસંદ કરો:',
      audio: 'ત્રણ ફૂલો વાળો સમૂહ પસંદ કરો',
      options: ['🌸🌸🌸', '🌸🌸🌸🌸', '🌸'],
      correct: '🌸🌸🌸',
      hint1: 'ફૂલો ગણો.',
      hint2: 'ત્રણ ફૂલો પસંદ કરો.',
      visualHint: '🌸 🌸 🌸 (૩)',
    },
    {
      id: 'p8',
      prompt: '__ → ૨ → ૩ → ૪ → ૫ માં પ્રથમ સંખ્યા:',
      audio: 'પ્રથમ સંખ્યા શોધો',
      options: ['૧', '૪', '૫'],
      correct: '૧',
      hint1: 'ગણતરી ક્યાંથી શરૂ થાય?',
      hint2: 'ગણતરી ૧ થી શરૂ થાય.',
      visualHint: '[૧] → ૨ → ૩ → ૪ → ૫',
    },
  ];

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceSelected, setPracticeSelected] = useState(null);
  const [practiceFeedback, setPracticeFeedback] = useState(null);
  const [practiceScoreCalc, setPracticeScoreCalc] = useState(0);
  const [practiceAttempts, setPracticeAttempts] = useState(0);
  const [activeHintLevel, setActiveHintLevel] = useState(0);

  const handlePracticeSubmit = (opt) => {
    setPracticeSelected(opt);
    const q = practiceQuestions[practiceIdx];
    if (opt === q.correct) {
      setPracticeFeedback({ correct: true, text: '🎉 સાચો જવાબ! ખૂબ સરસ.' });
      speakGujarati('સાચો જવાબ! ખૂબ સરસ.');
      if (practiceAttempts === 0) {
        setPracticeScoreCalc(prev => prev + 1);
      }
    } else {
      const nextAtt = practiceAttempts + 1;
      setPracticeAttempts(nextAtt);
      setActiveHintLevel(Math.min(nextAtt, 3));
      setHintsUsedCount(prev => prev + 1);

      let hintMsg = q.hint1;
      if (nextAtt === 2) hintMsg = q.hint2;
      if (nextAtt >= 3) hintMsg = `સંકેત: ${q.visualHint}`;

      setPracticeFeedback({ correct: false, text: hintMsg });
      speakGujarati(hintMsg);
    }
  };

  const handlePracticeNext = () => {
    setPracticeSelected(null);
    setPracticeFeedback(null);
    setPracticeAttempts(0);
    setActiveHintLevel(0);

    if (practiceIdx < practiceQuestions.length - 1) {
      setPracticeIdx(practiceIdx + 1);
    } else {
      const finalScore = Math.round((practiceScoreCalc / practiceQuestions.length) * 100);
      setPracticeScore(finalScore);
      setPracticeFinished(true);
      saveActivityProgress({
        practiceScore: finalScore,
        hintsUsed: hintsUsedCount,
        practiceCompleted: true,
      });
      setCurrentStage(13);
    }
  };

  /* -------------------------------------------------------------
     STAGE 13: MINI CHECK (5 QUESTIONS)
  ------------------------------------------------------------- */
  const miniCheckQuestions = [
    { prompt: '૧. ૩ (ત્રણ) શોધો:', options: ['૧', '૩', '૫'], correct: '૩' },
    { prompt: '૨. 🍎 🍎 🍎 🍎 કેટલા સફરજન છે?', options: ['૩', '૪', '૫'], correct: '૪' },
    { prompt: '૩. ૧ → ૨ → __ → ૪ → ૫ માં ખૂટતી સંખ્યા:', options: ['૩', '૧', '૫'], correct: '૩' },
    { prompt: '૪. ૫ તારાઓ વાળો સમૂહ પસંદ કરો:', options: ['⭐⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐'], correct: '⭐⭐⭐⭐⭐' },
    { prompt: '૫. સાચો ક્રમ કયો છે?', options: ['૧ → ૨ → ૩ → ૪ → ૫', '૫ → ૪ → ૩ → ૨ → ૧', '૨ → ૧ → ૪ → ૩ → ૫'], correct: '૧ → ૨ → ૩ → ૪ → ૫' },
  ];
  const [miniCheckIdx, setMiniCheckIdx] = useState(0);
  const [miniCheckAnswers, setMiniCheckAnswers] = useState([]);
  const [miniCheckDone, setMiniCheckDone] = useState(false);
  const [miniCheckScore, setMiniCheckScore] = useState(0);

  const handleMiniCheckAnswer = (opt) => {
    const nextAnswers = [...miniCheckAnswers, opt];
    setMiniCheckAnswers(nextAnswers);

    if (miniCheckIdx < miniCheckQuestions.length - 1) {
      setMiniCheckIdx(miniCheckIdx + 1);
    } else {
      let correct = 0;
      nextAnswers.forEach((ans, i) => {
        if (ans === miniCheckQuestions[i].correct) correct += 1;
      });
      const score = Math.round((correct / miniCheckQuestions.length) * 100);
      setMiniCheckScore(score);
      setMiniCheckDone(true);
      setIsTestUnlocked(true);
      if (onTestReady) onTestReady();
      saveActivityProgress({
        unlockAssessment: true,
        activityDetails: { miniCheckScore: score },
      });
    }
  };

  /* -------------------------------------------------------------
     STAGE 14: FINAL ASSESSMENT (10 QUESTIONS ONLY 1 TO 5)
  ------------------------------------------------------------- */
  const testQuestions = [
    {
      id: 't1',
      category: 'number_recognition',
      promptGujarati: '૨, ૪, ૫ માંથી ૪ પસંદ કરો:',
      options: [
        { id: 'opt1', text: '૪', emoji: '4️⃣' },
        { id: 'opt2', text: '૨', emoji: '2️⃣' },
        { id: 'opt3', text: '૫', emoji: '5️⃣' },
      ],
      correctId: 'opt1',
      explain: 'આપેલ સંખ્યાઓમાં ૪ સાચો નંબર છે.',
    },
    {
      id: 't2',
      category: 'counting',
      promptGujarati: '🍎 🍎 🍎 🍎 🍎 કેટલા સફરજન છે?',
      options: [
        { id: 'opt1', text: '૫ (પાંચ)', emoji: '5️⃣' },
        { id: 'opt2', text: '૩ (ત્રણ)', emoji: '3️⃣' },
        { id: 'opt3', text: '૪ (ચાર)', emoji: '4️⃣' },
      ],
      correctId: 'opt1',
      explain: 'કુલ ૫ સફરજન છે.',
    },
    {
      id: 't3',
      category: 'number_quantity_matching',
      promptGujarati: 'સંખ્યા ૩ સાથે ૩ વસ્તુઓ ધરાવતો સમૂહ પસંદ કરો:',
      options: [
        { id: 'opt1', text: '⭐⭐⭐ (૩ તારા)', emoji: '⭐⭐⭐' },
        { id: 'opt2', text: '⭐ (૧ તારો)', emoji: '⭐' },
        { id: 'opt3', text: '⭐⭐⭐⭐⭐ (૫ તારા)', emoji: '⭐⭐⭐⭐⭐' },
      ],
      correctId: 'opt1',
      explain: 'સંખ્યા ૩ સાથે ૩ તારાઓ જોડાય છે.',
    },
    {
      id: 't4',
      category: 'sequence',
      promptGujarati: '૧ → ૨ → __ → ૪ → ૫ માં ખૂટતી સંખ્યા કઈ છે?',
      options: [
        { id: 'opt1', text: '૩', emoji: '3️⃣' },
        { id: 'opt2', text: '૧', emoji: '1️⃣' },
        { id: 'opt3', text: '૫', emoji: '5️⃣' },
      ],
      correctId: 'opt1',
      explain: '૨ પછી અને ૪ પહેલાં ૩ આવે છે.',
    },
    {
      id: 't5',
      category: 'ordering',
      promptGujarati: '૩, ૧, ૫, ૨, ૪ ને યોગ્ય ૧ થી ૫ ના ક્રમમાં ગોઠવો:',
      options: [
        { id: 'opt1', text: '૧ → ૨ → ૩ → ૪ → ૫', emoji: '📈' },
        { id: 'opt2', text: '૫ → ૪ → ૩ → ૨ → ૧', emoji: '📉' },
        { id: 'opt3', text: '૧ → ૩ → ૨ → ૪ → ૫', emoji: '❌' },
      ],
      correctId: 'opt1',
      explain: 'સાચો ક્રમ: ૧ → ૨ → ૩ → ૪ → ૫ છે.',
    },
    {
      id: 't6',
      category: 'number_recognition',
      promptGujarati: '૧, ૩, ૫, ૨, ૪ કાર્ડમાંથી ૫ શોધો:',
      options: [
        { id: 'opt1', text: '૫', emoji: '5️⃣' },
        { id: 'opt2', text: '૩', emoji: '3️⃣' },
        { id: 'opt3', text: '૨', emoji: '2️⃣' },
      ],
      correctId: 'opt1',
      explain: '૫ એ પાંચ દર્શાવતો અંક છે.',
    },
    {
      id: 't7',
      category: 'counting',
      promptGujarati: 'આ કેટલા દડા છે? ⚽ ⚽',
      options: [
        { id: 'opt1', text: '૨ (બે)', emoji: '2️⃣' },
        { id: 'opt2', text: '૧ (એક)', emoji: '1️⃣' },
        { id: 'opt3', text: '૩ (ત્રણ)', emoji: '3️⃣' },
      ],
      correctId: 'opt1',
      explain: 'કુલ ૨ દડા છે.',
    },
    {
      id: 't8',
      category: 'number_quantity_matching',
      promptGujarati: 'સંખ્યા ૫ માટે ૫ ફૂલોવાળો સમૂહ પસંદ કરો:',
      options: [
        { id: 'opt1', text: '🌸🌸🌸🌸🌸 (૫ ફૂલો)', emoji: '🌸🌸🌸🌸🌸' },
        { id: 'opt2', text: '🌸🌸 (૨ ફૂલો)', emoji: '🌸🌸' },
        { id: 'opt3', text: '🌸🌸🌸 (૩ ફૂલો)', emoji: '🌸🌸🌸' },
      ],
      correctId: 'opt1',
      explain: '૫ ફૂલોવાળો સમૂહ સંખ્યા ૫ સાથે મેળ ખાય છે.',
    },
    {
      id: 't9',
      category: 'sequence',
      promptGujarati: '__ → ૨ → ૩ → ૪ → ૫ માં પ્રથમ સંખ્યા કઈ આવશે?',
      options: [
        { id: 'opt1', text: '૧ (એક)', emoji: '1️⃣' },
        { id: 'opt2', text: '૩ (ત્રણ)', emoji: '3️⃣' },
        { id: 'opt3', text: '૪ (ચાર)', emoji: '4️⃣' },
      ],
      correctId: 'opt1',
      explain: 'ગણતરીની શરૂઆત ૧ થી થાય છે.',
    },
    {
      id: 't10',
      category: 'counting',
      promptGujarati: 'ઝાડ પર કેટલા સફરજન છે? 🌳 🍎 🍎 🍎',
      options: [
        { id: 'opt1', text: '૩ (ત્રણ)', emoji: '3️⃣' },
        { id: 'opt2', text: '૨ (બે)', emoji: '2️⃣' },
        { id: 'opt3', text: '૪ (ચાર)', emoji: '4️⃣' },
      ],
      correctId: 'opt1',
      explain: 'ઝાડ પર કુલ ૩ સફરજન છે.',
    },
  ];

  const [testIdx, setTestIdx] = useState(0);
  const [testUserAnswers, setTestUserAnswers] = useState({});
  const [testResultData, setTestResultData] = useState(null);
  const [submittingTest, setSubmittingTest] = useState(false);

  const handleSelectTestAnswer = (optId) => {
    setTestUserAnswers({ ...testUserAnswers, [testIdx]: optId });
  };

  const handleNextTestQuestion = () => {
    if (testIdx < testQuestions.length - 1) {
      setTestIdx(testIdx + 1);
    }
  };

  const handlePrevTestQuestion = () => {
    if (testIdx > 0) {
      setTestIdx(testIdx - 1);
    }
  };

  const handleSubmitFinalAssessment = async () => {
    setSubmittingTest(true);
    let correctCount = 0;
    const categoryMistakes = {
      number_recognition: 0,
      counting: 0,
      number_quantity_matching: 0,
      sequence: 0,
      ordering: 0,
    };

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

    // Diagnose weak areas
    const diagnosedWeakAreas = [];
    if (categoryMistakes.number_recognition > 0) diagnosedWeakAreas.push('નંબર ઓળખ (Number Recognition)');
    if (categoryMistakes.counting > 0) diagnosedWeakAreas.push('વસ્તુઓની ગણતરી (Counting Objects)');
    if (categoryMistakes.number_quantity_matching > 0) diagnosedWeakAreas.push('સંખ્યા અને જથ્થો (Number Quantity Matching)');
    if (categoryMistakes.sequence > 0 || categoryMistakes.ordering > 0) diagnosedWeakAreas.push('સંખ્યા ક્રમ (Number Sequence & Ordering)');

    const resultPayload = {
      score: scorePct,
      correctCount,
      totalQuestions: testQuestions.length,
      isMastered,
      status: isMastered ? 'MASTERED' : scorePct >= 31 ? 'DEVELOPING' : 'NEEDS_SUPPORT',
      weakAreas: diagnosedWeakAreas,
    };

    try {
      await api.post('/assessments/submit', {
        competencyCode: 'M-03',
        score: scorePct,
        answers: Object.keys(testUserAnswers).map(k => ({
          questionIndex: Number(k),
          selectedOptionId: testUserAnswers[k],
        })),
        weakAreas: diagnosedWeakAreas,
      });

      setTestResultData(resultPayload);
      setCurrentStage(15);
    } catch (err) {
      console.warn('[M-03] Test submit API fallback:', err);
      setTestResultData(resultPayload);
      setCurrentStage(15);
    } finally {
      setSubmittingTest(false);
    }
  };

  /* -------------------------------------------------------------
     PROGRESS STEPS LIST FOR NAVIGATION
  ------------------------------------------------------------- */
  const stageTitles = [
    { num: 1, name: 'પરિચય', icon: '🌟' },
    { num: 2, name: 'વિડિયો', icon: '🎬' },
    { num: 3, name: 'સંખ્યા ઓળખ', icon: '🔢' },
    { num: 4, name: 'રમત ૧: શોધો', icon: '🔎' },
    { num: 5, name: 'રમત ૨: જથ્થો', icon: '🍎' },
    { num: 6, name: 'રમત ૩: ગણતરી', icon: '👆' },
    { num: 7, name: 'રમત ૪: જોડકાં', icon: '🧩' },
    { num: 8, name: 'રમત ૫: ક્રમ', icon: '➡️' },
    { num: 9, name: 'રમત ૬: ગોઠવો', icon: '📊' },
    { num: 10, name: 'રમત ૭: પકડો', icon: '🎯' },
    { num: 11, name: 'રમત ૮: દ્રશ્ય', icon: '🌳' },
    { num: 12, name: 'મહાવરો', icon: '⭐' },
    { num: 13, name: 'ચેકપોઈન્ટ', icon: '✓' },
    { num: 14, name: 'કસોટી', icon: '📝' },
    { num: 15, name: 'પરિણામ', icon: '🏆' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-gujarati">

      {/* Top Header Badge & Stage Navigation Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🔢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                  M-03 • બાલવાટિકા
                </span>
                <span className="text-xs font-bold text-emerald-100">ગણિત ક્ષમતા ૩</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white">
                ૧ થી ૫ સુધીની સંખ્યાઓ (Numbers 1 to 5)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <GujaratiVoiceButton
              text="ચાલો ૧ થી ૫ સુધીની સંખ્યાઓ શીખીએ! એક, બે, ત્રણ, ચાર, પાંચ."
              label="સાંભળો"
              className="bg-white/20 hover:bg-white/30 text-white border-0 py-1.5 px-3 text-xs"
            />
          </div>
        </div>

        {/* Child-Friendly Stage Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-1 text-xs">
          {stageTitles.map((st) => {
            const isActive = currentStage === st.num;
            const isCompleted = currentStage > st.num;
            return (
              <button
                key={st.num}
                onClick={() => setCurrentStage(st.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-white text-emerald-900 shadow-md scale-105 ring-2 ring-amber-300'
                    : isCompleted
                    ? 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.name}</span>
                {isCompleted && <Check className="w-3 h-3 text-amber-300 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          STAGE 1: LESSON INTRODUCTION
      ========================================================= */}
      {currentStage === 1 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg text-center space-y-6 animate-in fade-in">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center text-5xl shadow-lg animate-bounce">
            🎈
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              નમસ્તે બાળમિત્રો! ચાલો ૧ થી ૫ સંખ્યાઓ શીખીએ
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              આ પાઠમાં આપણે ૧ થી ૫ અંકો ઓળખીશું, વસ્તુઓ ગણીશું, સંખ્યા મુજબ જોડકાં બનાવીશું અને મજેદાર રમતો રમીશું!
            </p>
          </div>

          {/* Large Visual Numerals Preview */}
          <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
            {['૧', '૨', '૩', '૪', '૫'].map((n, i) => (
              <div
                key={n}
                onClick={() => speakGujarati(`${n}`)}
                className="w-14 h-16 md:w-16 md:h-20 rounded-2xl bg-gradient-to-b from-emerald-50 to-teal-100 border-2 border-emerald-300 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:scale-110 active:scale-95 transition-all"
              >
                <span className="text-2xl md:text-3xl font-black text-emerald-800">{n}</span>
                <span className="text-[10px] text-emerald-600 font-bold">{['એક', 'બે', 'ત્રણ', 'ચાર', 'પાંચ'][i]}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setCurrentStage(2)}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>ચાલો શરૂ કરીએ (Start Learning)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 2: VIDEO SECTION (CHILD-FRIENDLY EMBEDDED PLAYER)
      ========================================================= */}
      {currentStage === 2 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl">
                🎬
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  ચાલો 1 થી 5 સુધીની સંખ્યાઓ શીખીએ! 🔢
                </h2>
                <p className="text-xs text-slate-500">
                  વિડિયો ધ્યાનથી જુઓ અને પછી રમતો રમો! 🎮
                </p>
              </div>
            </div>

            <GujaratiVoiceButton
              text="વિડિયો ધ્યાનથી જુઓ અને પછી રમતો રમો."
              label="સાંભળો"
              className="self-start sm:self-auto text-xs"
            />
          </div>

          {/* Child-Friendly Video Embed (Inside Nipun Gujarat Environment) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 aspect-video max-w-2xl mx-auto border-4 border-emerald-100">
            <iframe
              src="https://www.youtube.com/embed/eeEqwHkgqrI?rel=0&modestbranding=1&enablejsapi=1"
              title="ચાલો 1 થી 5 સુધીની સંખ્યાઓ શીખીએ"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoStart}
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-3 max-w-lg mx-auto">
            <p className="text-xs font-bold text-emerald-900">
              {videoCompleted ? '✓ વિડિયો પૂર્ણ થયો છે! હવે આગળની પ્રવૃત્તિઓ કરો.' : 'વિડિયો જોયા પછી નીચેનું બટન દબાવો:'}
            </p>

            <button
              onClick={() => {
                handleVideoCompleted();
                setCurrentStage(3);
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>મેં વિડિયો જોયો ✓ (Explore Numbers)</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 3: VISUAL NUMBER EXPLORATION (1 TO 5)
      ========================================================= */}
      {currentStage === 3 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              સંખ્યા અને જથ્થાની ઓળખ
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              અંક પર ક્લિક કરો અને જથ્થો જુઓ! 🍎
            </h2>
            <p className="text-xs text-slate-500">
              દરેક નંબર માટે વસ્તુઓની સંખ્યા ગણો અને અવાજ સાંભળો
            </p>
          </div>

          {/* Number Selector Tabs */}
          <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-xl mx-auto">
            {numberCards.map((c) => (
              <button
                key={c.english}
                onClick={() => {
                  setActiveExploreNum(c.english);
                  speakGujarati(c.phrase);
                }}
                className={`py-3 md:py-4 rounded-2xl border-2 font-black text-xl md:text-3xl flex flex-col items-center gap-1 transition-all active:scale-95 ${
                  activeExploreNum === c.english
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg scale-105 ring-4 ring-emerald-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                }`}
              >
                <span>{c.num}</span>
                <span className={`text-[11px] font-bold ${activeExploreNum === c.english ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>

          {/* Active Number Display Card */}
          {(() => {
            const currentCard = numberCards.find(c => c.english === activeExploreNum) || numberCards[0];
            return (
              <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-3xl p-6 md:p-8 border-2 border-amber-200 text-center space-y-5 max-w-lg mx-auto shadow-inner">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-6xl md:text-7xl font-black text-amber-900 drop-shadow-xs">
                    {currentCard.num}
                  </span>
                  <div className="text-left">
                    <div className="text-xl font-black text-amber-800">
                      {currentCard.name} ({currentCard.english})
                    </div>
                    <div className="text-xs text-amber-700 font-bold">
                      {currentCard.phrase}
                    </div>
                  </div>
                </div>

                {/* Visual Quantity Representation */}
                <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs flex items-center justify-center gap-3 flex-wrap min-h-[80px]">
                  {Array.from({ length: currentCard.count }).map((_, idx) => (
                    <span key={idx} className="text-4xl md:text-5xl animate-in zoom-in duration-200 hover:scale-125 transition-transform cursor-pointer" title={`વસ્તુ ${idx + 1}`}>
                      {currentCard.emoji}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => speakGujarati(currentCard.phrase)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>ઉચ્ચારણ સાંભળો</span>
                  </button>
                </div>
              </div>
            );
          })()}

          <div className="flex justify-between items-center max-w-lg mx-auto pt-2">
            <button
              onClick={() => setActiveExploreNum(prev => Math.max(1, prev - 1))}
              disabled={activeExploreNum === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30"
            >
              ← પાછળનો અંક
            </button>
            <button
              onClick={() => {
                if (activeExploreNum < 5) {
                  setActiveExploreNum(prev => prev + 1);
                } else {
                  setCurrentStage(4);
                }
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>{activeExploreNum === 5 ? 'રમત ૧ શરૂ કરો 🎮' : 'આગળનો અંક →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 4: ACTIVITY 1 - FIND THE NUMBER (“નંબર શોધો 🔎”)
      ========================================================= */}
      {currentStage === 4 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
              પ્રવૃત્તિ ૧: નંબર શોધો 🔎
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              “{act1Rounds[act1Index].target} ({act1Rounds[act1Index].targetName}) શોધો.”
            </h2>
            <p className="text-xs text-slate-500">
              નીચે આપેલા ત્રણ કાર્ડમાંથી સાચો નંબર પસંદ કરો
            </p>
          </div>

          <div className="flex justify-center">
            <GujaratiVoiceButton
              text={act1Rounds[act1Index].prompt}
              label="સૂચના સાંભળો"
              className="text-xs"
            />
          </div>

          {/* 3 Large Number Cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-md mx-auto pt-2">
            {act1Rounds[act1Index].options.map((opt) => {
              const isSelected = act1Selected === opt;
              const isTarget = opt === act1Rounds[act1Index].target;
              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-amber-50 hover:border-amber-300';
              if (isSelected) {
                btnStyle = isTarget
                  ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-xl ring-4 ring-emerald-200'
                  : 'bg-rose-500 text-white border-rose-600 scale-95 shadow-md';
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleAct1Check(opt)}
                  className={`h-28 md:h-36 rounded-3xl border-4 font-black text-4xl md:text-5xl flex items-center justify-center shadow-sm active:scale-90 transition-all ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {act1Feedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold animate-in zoom-in duration-150 max-w-md mx-auto ${
              act1Feedback.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {act1Feedback.text}
            </div>
          )}

          <div className="flex justify-between items-center max-w-md mx-auto pt-2">
            <button
              onClick={handleAct1Next}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>બીજો રાઉન્ડ</span>
            </button>

            <button
              onClick={() => setCurrentStage(5)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>આગળની રમત (Activity 2) →</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 5: ACTIVITY 2 - MATCH NUMBER WITH QUANTITY
      ========================================================= */}
      {currentStage === 5 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
              પ્રવૃત્તિ ૨: સંખ્યા મુજબ જથ્થો પસંદ કરો 🍎
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black text-blue-700">{act2Rounds[act2Index].number}</span>
              <span className="text-lg font-bold text-slate-800">
                ({act2Rounds[act2Index].numName}) વસ્તુઓવાળો સમૂહ પસંદ કરો
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GujaratiVoiceButton
              text={`${act2Rounds[act2Index].numName} વસ્તુઓવાળો સમૂહ પસંદ કરો.`}
              label="સૂચના સાંભળો"
              className="text-xs"
            />
          </div>

          {/* 3 Quantity Group Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-lg mx-auto pt-2">
            {act2Rounds[act2Index].options.map((cnt) => {
              const isSelected = act2Selected === cnt;
              const isCorrect = cnt === act2Rounds[act2Index].correctCount;
              let style = 'bg-slate-50 border-slate-200 hover:bg-blue-50';
              if (isSelected) {
                style = isCorrect
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                  : 'bg-rose-50 border-rose-400 ring-2 ring-rose-200';
              }
              return (
                <button
                  key={cnt}
                  onClick={() => handleAct2Check(cnt)}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 min-h-[110px] shadow-xs active:scale-95 transition-all ${style}`}
                >
                  <div className="flex flex-wrap items-center justify-center gap-1.5 text-2xl">
                    {Array.from({ length: cnt }).map((_, i) => (
                      <span key={i}>{act2Rounds[act2Index].theme}</span>
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {cnt} વસ્તુઓ
                  </span>
                </button>
              );
            })}
          </div>

          {act2Feedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold animate-in zoom-in duration-150 max-w-lg mx-auto ${
              act2Feedback.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {act2Feedback.text}
            </div>
          )}

          <div className="flex justify-between items-center max-w-lg mx-auto pt-2">
            <button
              onClick={handleAct2Next}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>બીજો રાઉન્ડ</span>
            </button>

            <button
              onClick={() => setCurrentStage(6)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>આગળની રમત (Activity 3) →</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 6: ACTIVITY 3 - COUNT THE OBJECTS (ONE-BY-ONE TAPPING)
      ========================================================= */}
      {currentStage === 6 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
              પ્રવૃત્તિ ૩: એક-એક ટેપ કરીને ગણો 👆
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              દરેક વસ્તુ પર ટેપ કરો અને કુલ સંખ્યા જણાવો
            </h2>
            <p className="text-xs text-slate-500">
              ટેપ કરેલી વસ્તુઓ લીલી થશે: ૧ → ૨ → ૩ → ૪
            </p>
          </div>

          {/* Interactive Objects Area */}
          <div className="bg-purple-50/50 rounded-3xl p-6 border-2 border-dashed border-purple-200 flex flex-wrap items-center justify-center gap-4 md:gap-6 max-w-md mx-auto min-h-[120px]">
            {Array.from({ length: act3Rounds[act3Index].total }).map((_, idx) => {
              const isTapped = tappedIndices.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleTapObject(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 flex flex-col items-center justify-center text-3xl md:text-4xl shadow-sm transition-all active:scale-90 ${
                    isTapped
                      ? 'bg-emerald-100 border-emerald-400 scale-105 ring-2 ring-emerald-300'
                      : 'bg-white border-purple-200 hover:scale-110'
                  }`}
                >
                  <span>{act3Rounds[act3Index].theme}</span>
                  {isTapped && (
                    <span className="text-[11px] font-mono font-black text-emerald-800 bg-emerald-200 px-1.5 py-0.2 rounded-md">
                      {['૧', '૨', '૩', '૪', '૫'][tappedIndices.indexOf(idx)]} ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-center text-xs font-bold text-slate-600">
            ગણેલી વસ્તુઓ: <span className="text-purple-700 font-mono text-base">{tappedIndices.length}</span> / {act3Rounds[act3Index].total}
          </div>

          {/* Question: How many objects? */}
          <div className="space-y-3 text-center max-w-sm mx-auto">
            <div className="text-sm font-black text-slate-800">
              કુલ કેટલી વસ્તુઓ છે?
            </div>
            <div className="grid grid-cols-3 gap-3">
              {act3Rounds[act3Index].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAct3Check(opt)}
                  className={`py-3 rounded-2xl border-2 font-black text-xl active:scale-95 shadow-xs transition-all ${
                    act3SelectedAnswer === opt
                      ? opt === act3Rounds[act3Index].gujCount
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-rose-500 text-white border-rose-600'
                      : 'bg-slate-50 border-slate-200 hover:bg-purple-50 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {act3Feedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold animate-in zoom-in duration-150 max-w-sm mx-auto ${
              act3Feedback.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {act3Feedback.text}
            </div>
          )}

          <div className="flex justify-between items-center max-w-md mx-auto pt-2">
            <button
              onClick={handleAct3Next}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>બીજો રાઉન્ડ</span>
            </button>

            <button
              onClick={() => setCurrentStage(7)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>આગળની રમત (Activity 4) →</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 7: ACTIVITY 4 - NUMBER AND QUANTITY MATCHING (PAIRING)
      ========================================================= */}
      {currentStage === 7 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
              પ્રવૃત્તિ ૪: સંખ્યા અને જથ્થાના જોડકાં 🧩
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              ડાબી બાજુનો નંબર પસંદ કરો અને જમણી બાજુ સાચા સમૂહ સાથે જોડો
            </h2>
            <p className="text-xs text-slate-500">
              ટચ અથવા ક્લિક વડે ૧ થી ૫ સુધીના તમામ જોડકાં બનાવો
            </p>
          </div>

          {/* 2-Column Pairing Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-lg mx-auto pt-2">
            {/* Left: Number Cards */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-500 text-center uppercase">સંખ્યાઓ</div>
              {['૧', '૨', '૩', '૪', '૫'].map((n) => {
                const isMatched = Boolean(matchedPairs[n]);
                const isSelected = selectedNumCard === n;
                return (
                  <button
                    key={n}
                    disabled={isMatched}
                    onClick={() => handleSelectNumberForPair(n)}
                    className={`w-full py-3 rounded-2xl border-2 font-black text-xl flex items-center justify-between px-4 transition-all ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 opacity-60 cursor-default'
                        : isSelected
                        ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-4 ring-teal-100 scale-105'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-teal-50'
                    }`}
                  >
                    <span>{n}</span>
                    <span className="text-xs font-normal">
                      {isMatched ? '✓ જોડાઈ ગયું' : isSelected ? '👉 પસંદ કરેલ' : 'પસંદ કરો'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Quantity Cards (Randomized arrangement: 3, 1, 5, 2, 4) */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-500 text-center uppercase">વસ્તુઓ</div>
              {[3, 1, 5, 2, 4].map((cnt) => {
                const isAlreadyPaired = Object.values(matchedPairs).includes(cnt);
                return (
                  <button
                    key={cnt}
                    disabled={isAlreadyPaired}
                    onClick={() => handleSelectGroupForPair(cnt)}
                    className={`w-full py-3 rounded-2xl border-2 flex items-center justify-between px-3 transition-all ${
                      isAlreadyPaired
                        ? 'bg-emerald-50 border-emerald-300 opacity-60 cursor-default'
                        : 'bg-slate-50 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex gap-1 text-lg">
                      {Array.from({ length: cnt }).map((_, i) => (
                        <span key={i}>🍎</span>
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      {isAlreadyPaired ? '✓' : `${cnt} 🍎`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {act4Feedback && (
            <div className="p-4 rounded-2xl text-center text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 max-w-lg mx-auto animate-in zoom-in">
              {act4Feedback.text}
            </div>
          )}

          <div className="flex justify-between items-center max-w-lg mx-auto pt-2">
            <button
              onClick={resetAct4}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ફરીથી જોડો</span>
            </button>

            <button
              onClick={() => setCurrentStage(8)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>આગળની રમત (Activity 5) →</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 8: ACTIVITY 5 - NUMBER SEQUENCE (MISSING NUMBER)
      ========================================================= */}
      {currentStage === 8 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
              પ્રવૃત્તિ ૫: ખૂટતી સંખ્યા શોધો ➡️
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              ૧ → ૨ → ૩ → ૪ → ૫ નો સાચો ક્રમ
            </h2>
            <p className="text-xs text-slate-500">
              ખાલી જગ્યામાં કયો નંબર આવશે તે પસંદ કરો
            </p>
          </div>

          {/* Sequence Display */}
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap max-w-md mx-auto pt-2">
            {act5Rounds[act5Index].sequence.map((item, idx) => (
              <React.Fragment key={idx}>
                {item === '__' ? (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-4 border-dashed border-amber-400 bg-amber-50 flex items-center justify-center font-black text-2xl text-amber-700 animate-pulse">
                    ?
                  </div>
                ) : (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-black text-2xl text-slate-800 shadow-xs">
                    {item}
                  </div>
                )}
                {idx < 4 && <span className="text-slate-400 font-bold text-lg">→</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Options */}
          <div className="space-y-2 max-w-xs mx-auto text-center pt-2">
            <div className="text-xs font-bold text-slate-600">યોગ્ય વિકલ્પ પસંદ કરો:</div>
            <div className="grid grid-cols-3 gap-3">
              {act5Rounds[act5Index].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAct5Check(opt)}
                  className={`py-3 rounded-2xl border-2 font-black text-2xl active:scale-95 shadow-xs transition-all ${
                    act5Selected === opt
                      ? opt === act5Rounds[act5Index].missing
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-rose-500 text-white border-rose-600'
                      : 'bg-slate-50 border-slate-200 hover:bg-amber-50 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {act5Feedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold animate-in zoom-in duration-150 max-w-xs mx-auto ${
              act5Feedback.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {act5Feedback.text}
            </div>
          )}

          <div className="flex justify-between items-center max-w-md mx-auto pt-2">
            <button
              onClick={handleAct5Next}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>બીજો ક્રમ</span>
            </button>

            <button
              onClick={() => setCurrentStage(9)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>આગળની રમત (Activity 6) →</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 9: ACTIVITY 6 - NUMBER ORDER DRAG / TAP GAME
      ========================================================= */}
      {currentStage === 9 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
              પ્રવૃત્તિ ૬: ૧ થી ૫ ક્રમમાં ગોઠવો 📊
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              નીચેના અંકોને ૧ → ૨ → ૩ → ૪ → ૫ ક્રમમાં ગોઠવો
            </h2>
            <p className="text-xs text-slate-500">
              અંક પર ટેપ કરીને ક્રમશઃ સ્લોટમાં મૂકો
            </p>
          </div>

          {/* Slots Target Area */}
          <div className="bg-indigo-50/50 rounded-3xl p-6 border-2 border-dashed border-indigo-200 max-w-md mx-auto space-y-2">
            <div className="text-xs font-bold text-indigo-900 text-center uppercase tracking-wider">
              તમારો ગોઠવેલો ક્રમ:
            </div>
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-2xl shadow-xs transition-all ${
                    orderSlots[i]
                      ? 'bg-indigo-600 text-white border-indigo-700 scale-105'
                      : 'bg-white border-dashed border-indigo-300 text-indigo-300'
                  }`}
                >
                  {orderSlots[i] || `${i + 1}`}
                </div>
              ))}
            </div>
          </div>

          {/* Available Numbers Pool */}
          <div className="space-y-2 max-w-md mx-auto text-center">
            <div className="text-xs font-bold text-slate-500">ઉપલબ્ધ સંખ્યાઓ (ટેપ કરો):</div>
            <div className="flex items-center justify-center gap-3">
              {orderPool.map((num) => (
                <button
                  key={num}
                  onClick={() => handleAddToOrder(num)}
                  className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 font-black text-2xl text-slate-800 shadow-md active:scale-90 transition-all"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {orderFeedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold animate-in zoom-in duration-150 max-w-md mx-auto ${
              orderFeedback.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {orderFeedback.text}
            </div>
          )}

          <div className="flex justify-between items-center max-w-md mx-auto pt-2">
            <button
              onClick={resetOrder}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>રીસેટ કરો</span>
            </button>

            <button
              onClick={() => setCurrentStage(10)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>આગળની રમત (Activity 7) →</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 10: ACTIVITY 7 - NUMBER HUNT GAME (“નંબર પકડો! 🎯”)
      ========================================================= */}
      {currentStage === 10 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
              પ્રવૃત્તિ ૭: નંબર પકડો! 🎯
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-700 font-bold text-base">લક્ષ્ય અંક:</span>
              <span className="text-4xl font-black text-rose-600 bg-rose-50 px-4 py-1 rounded-2xl border border-rose-200 shadow-xs">
                {huntTargets[huntIndex].target}
              </span>
              <span className="text-sm font-bold text-slate-600">({huntTargets[huntIndex].name})</span>
            </div>
            <p className="text-xs text-slate-500">
              તરતા કાર્ડમાંથી લક્ષ્ય અંક {huntTargets[huntIndex].target} પર ટેપ કરો!
            </p>
          </div>

          <div className="flex items-center justify-between max-w-md mx-auto text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1 text-amber-600">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              તારા: {huntStars}
            </span>
            <button
              onClick={() => setHuntMotionEnabled(!huntMotionEnabled)}
              className="text-[11px] text-slate-500 hover:underline"
            >
              {huntMotionEnabled ? 'એનિમેશન ધીમું કરો' : 'સામાન્ય એનિમેશન'}
            </button>
          </div>

          {/* Floating/Moving Number Cards */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-6 border-2 border-rose-200 max-w-md mx-auto min-h-[160px] flex items-center justify-around flex-wrap gap-3">
            {['૧', '૩', '૫', '૨', '૪'].map((num, i) => (
              <button
                key={num}
                onClick={() => handleHuntTap(num)}
                className={`w-16 h-16 rounded-2xl bg-white border-2 border-rose-200 font-black text-3xl text-slate-900 shadow-lg active:scale-90 transition-all flex items-center justify-center hover:bg-rose-50 ${
                  huntMotionEnabled ? (i % 2 === 0 ? 'animate-bounce' : 'animate-pulse') : ''
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {huntFeedback && (
            <div className={`p-3.5 rounded-2xl text-center text-sm font-bold animate-in zoom-in max-w-md mx-auto ${
              huntFeedback.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {huntFeedback.text}
            </div>
          )}

          <div className="flex justify-end max-w-md mx-auto pt-2">
            <button
              onClick={() => setCurrentStage(11)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>આગળની રમત (Activity 8) →</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 11: ACTIVITY 8 - VISUAL COUNTING SCENE GAME
      ========================================================= */}
      {currentStage === 11 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              પ્રવૃત્તિ ૮: દ્રશ્ય ગણતરી રમત 🌳
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              {sceneRounds[sceneIndex].title}
            </h2>
            <p className="text-xs text-slate-500">
              {sceneRounds[sceneIndex].prompt}
            </p>
          </div>

          {/* Visual Scene Box */}
          <div className="bg-gradient-to-b from-sky-100 to-emerald-50 rounded-3xl p-8 border-2 border-emerald-200 max-w-md mx-auto text-center space-y-4 shadow-inner">
            <div className="text-6xl">🌳</div>
            <div className="flex items-center justify-center gap-3 text-4xl">
              {sceneRounds[sceneIndex].items.map((it, i) => (
                <span key={i} className="animate-in zoom-in hover:scale-125 transition-transform">{it}</span>
              ))}
            </div>
          </div>

          {/* Option Buttons */}
          <div className="space-y-2 max-w-xs mx-auto text-center">
            <div className="text-xs font-bold text-slate-600">સાચો નંબર પસંદ કરો:</div>
            <div className="grid grid-cols-3 gap-3">
              {sceneRounds[sceneIndex].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSceneCheck(opt)}
                  className={`py-3 rounded-2xl border-2 font-black text-2xl active:scale-95 shadow-xs transition-all ${
                    sceneSelected === opt
                      ? opt === sceneRounds[sceneIndex].countGuj
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-rose-500 text-white border-rose-600'
                      : 'bg-slate-50 border-slate-200 hover:bg-emerald-50 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {sceneFeedback && (
            <div className={`p-4 rounded-2xl text-center text-sm font-bold animate-in zoom-in duration-150 max-w-xs mx-auto ${
              sceneFeedback.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {sceneFeedback.text}
            </div>
          )}

          <div className="flex justify-between items-center max-w-md mx-auto pt-2">
            <button
              onClick={handleSceneNext}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>બીજું દ્રશ્ય</span>
            </button>

            <button
              onClick={() => setCurrentStage(12)}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>મહાવરો રાઉન્ડ શરૂ કરો (Practice) ⭐</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 12: PRACTICE ROUND (8 QUESTIONS WITH PROGRESSIVE HINTS)
      ========================================================= */}
      {currentStage === 12 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                મહાવરો રાઉન્ડ (Practice Round)
              </span>
              <h2 className="text-xl font-black text-slate-900">
                પ્રશ્ન {practiceIdx + 1} / {practiceQuestions.length}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                સંકેતો વપરાયા: <span className="font-mono text-amber-700">{hintsUsedCount}</span>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${((practiceIdx + 1) / practiceQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Practice Question Card */}
          {(() => {
            const q = practiceQuestions[practiceIdx];
            return (
              <div className="space-y-6 max-w-lg mx-auto text-center">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">
                    {q.prompt}
                  </h3>
                  <GujaratiVoiceButton
                    text={q.audio}
                    label="પ્રશ્ન સાંભળો"
                    className="text-xs"
                  />
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePracticeSubmit(opt)}
                      className={`p-4 rounded-2xl border-2 font-black text-2xl active:scale-95 transition-all shadow-xs ${
                        practiceSelected === opt
                          ? opt === q.correct
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-rose-500 text-white border-rose-600'
                          : 'bg-slate-50 border-slate-200 hover:bg-amber-50 text-slate-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {practiceFeedback && (
                  <div className={`p-4 rounded-2xl text-center text-sm font-bold animate-in zoom-in duration-150 ${
                    practiceFeedback.correct ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {practiceFeedback.text}
                  </div>
                )}

                {/* Next Button */}
                {practiceSelected && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handlePracticeNext}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <span>{practiceIdx === practiceQuestions.length - 1 ? 'મહાવરો પૂર્ણ કરો (Finish)' : 'આગળનો પ્રશ્ન →'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================
          STAGE 13: MINI CHECK (5 QUESTIONS)
      ========================================================= */}
      {currentStage === 13 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
              ચેકપોઈન્ટ (Mini Check) ✓
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              કસોટી પહેલાં નાની ચકાસણી (૫ પ્રશ્નો)
            </h2>
            <p className="text-xs text-slate-500">
              પ્રશ્ન {miniCheckIdx + 1} / {miniCheckQuestions.length}
            </p>
          </div>

          {!miniCheckDone ? (
            <div className="space-y-6 max-w-md mx-auto text-center">
              <div className="text-xl font-black text-slate-800">
                {miniCheckQuestions[miniCheckIdx].prompt}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {miniCheckQuestions[miniCheckIdx].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleMiniCheckAnswer(opt)}
                    className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-400 font-black text-xl text-slate-900 active:scale-95 shadow-xs transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-teal-50 rounded-3xl p-6 border border-teal-200 text-center space-y-4 max-w-md mx-auto">
              <div className="text-4xl">🎯</div>
              <div className="text-xl font-black text-teal-950">
                ચેકપોઈન્ટ સ્કોર: {miniCheckScore}%
              </div>
              <p className="text-xs text-teal-800">
                {miniCheckScore >= 60
                  ? 'ખૂબ સરસ! તમે અંતિમ મૂલ્યાંકન કસોટી આપવા માટે તૈયાર છો.'
                  : 'તમે કસોટી આપી શકો છો અથવા ફરીથી મહાવરો કરી શકો છો.'}
              </p>

              <button
                onClick={() => setCurrentStage(14)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5" />
                <span>અંતિમ કસોટી શરૂ કરો (Start Final Test)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          STAGE 14: FINAL ASSESSMENT (10 QUESTIONS ONLY 1 TO 5)
      ========================================================= */}
      {currentStage === 14 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                અંતિમ મૂલ્યાંકન કસોટી (Final Assessment)
              </span>
              <h2 className="text-xl font-black text-slate-900">
                પ્રશ્ન {testIdx + 1} / {testQuestions.length}
              </h2>
            </div>

            <div className="text-xs font-mono font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              જવાબ આપ્યા: {Object.keys(testUserAnswers).length} / {testQuestions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${((testIdx + 1) / testQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Card */}
          {(() => {
            const q = testQuestions[testIdx];
            const currentSelected = testUserAnswers[testIdx];
            return (
              <div className="space-y-6 max-w-lg mx-auto text-center">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">
                    {q.promptGujarati}
                  </h3>
                  <p className="text-xs text-slate-400">
                    નીચેનામાંથી યોગ્ય વિકલ્પ પસંદ કરો
                  </p>
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-1 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = currentSelected === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectTestAnswer(opt.id)}
                        className={`p-4 rounded-2xl border-2 font-bold text-lg flex items-center justify-between px-5 active:scale-98 transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-200'
                            : 'bg-slate-50 border-slate-200 hover:bg-emerald-50/50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{opt.emoji}</span>
                          <span>{opt.text}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={handlePrevTestQuestion}
                    disabled={testIdx === 0}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-30"
                  >
                    ← પાછળનો પ્રશ્ન
                  </button>

                  {testIdx < testQuestions.length - 1 ? (
                    <button
                      onClick={handleNextTestQuestion}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md active:scale-95"
                    >
                      આગળનો પ્રશ્ન →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitFinalAssessment}
                      disabled={submittingTest || Object.keys(testUserAnswers).length < testQuestions.length}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>{submittingTest ? 'કસોટી ચકાસી રહ્યા છીએ...' : 'ટેસ્ટ પૂર્ણ કરો (Submit)'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================
          STAGE 15: RESULT SCREEN & WEAKNESS DIAGNOSIS (RELEARNING)
      ========================================================= */}
      {currentStage === 15 && testResultData && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl space-y-6 text-center animate-in zoom-in duration-200">
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-lg">
            {testResultData.isMastered ? '🎉' : '📚'}
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900">
              {testResultData.isMastered ? 'અભિનંદન! તમે નિપુણ બન્યા છો!' : 'ખૂબ સારો પ્રયાસ! થોડો વધુ મહાવરો કરીએ.'}
            </h2>
            <p className="text-sm text-slate-600">
              તમે ૧૦ માંથી {testResultData.correctCount} પ્રશ્નોના સાચા જવાબ આપ્યા.
            </p>
          </div>

          {/* Performance Badge */}
          <div className={`p-6 rounded-3xl border-2 max-w-sm mx-auto space-y-2 ${
            testResultData.isMastered
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <div className="text-4xl font-black font-mono">
              {testResultData.score}%
            </div>
            <div className="text-sm font-bold uppercase tracking-wider">
              {testResultData.isMastered ? '🟢 નિપુણ (MASTERED ≥80%)' : '🟡 પ્રગતિશીલ (RELEARN / DEVELOPING)'}
            </div>
          </div>

          {/* Diagnosed Weak Areas */}
          {testResultData.weakAreas && testResultData.weakAreas.length > 0 && (
            <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 text-left max-w-md mx-auto space-y-2">
              <div className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>સુધારણા માટેના મુદ્દાઓ (Weak Areas Diagnosed):</span>
              </div>
              <ul className="text-xs text-rose-800 space-y-1 pl-5 list-disc">
                {testResultData.weakAreas.map((area, idx) => (
                  <li key={idx} className="font-semibold">{area}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setTestIdx(0);
                setTestUserAnswers({});
                setCurrentStage(4); // Relearn starting from Activity 1
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>રમતો ફરીથી રમો (Relearn Activities)</span>
            </button>

            <button
              onClick={() => navigate('/student/path/mathematics')}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>અધ્યયન પથ પર પાછા જાઓ (Learning Path) →</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
