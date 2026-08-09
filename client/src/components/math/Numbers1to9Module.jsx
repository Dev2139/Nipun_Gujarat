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
  Volume2,
  AlertTriangle,
  Lightbulb,
  Check,
  X,
  Target,
  Search,
  MoveRight,
  Eye
} from 'lucide-react';

const NUMBERS_DATA = [
  { num: '૧', english: 1, word: 'એક', emoji: '🍎', name: 'સફરજન' },
  { num: '૨', english: 2, word: 'બે', emoji: '⭐', name: 'તારા' },
  { num: '૩', english: 3, word: 'ત્રણ', emoji: '⚽', name: 'દડા' },
  { num: '૪', english: 4, word: 'ચાર', emoji: '🌸', name: 'ફૂલો' },
  { num: '૫', english: 5, word: 'પાંચ', emoji: '🐟', name: 'માછલીઓ' },
  { num: '૬', english: 6, word: 'છ', emoji: '🧸', name: 'ટેડી બેર' },
  { num: '૭', english: 7, word: 'સાત', emoji: '🍌', name: 'કેળાં' },
  { num: '૮', english: 8, word: 'આઠ', emoji: '🎈', name: 'ફુગ્ગા' },
  { num: '૯', english: 9, word: 'નવ', emoji: '🍓', name: 'સ્ટ્રોબેરી' },
];

export default function Numbers1to9Module({ competency, progress, onTestReady }) {
  const navigate = useNavigate();

  // Master Stage Flow
  // 1: intro, 2: video, 3: explore, 4: act1_find, 5: act2_count, 6: act3_group, 7: act4_match,
  // 8: act5_missing, 9: act6_order, 10: act7_hunt, 11: act8_scene, 12: act9_numline, 13: practice, 14: minicheck, 15: test, 16: result
  const [currentStage, setCurrentStage] = useState(1);

  // Tracking metrics
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(progress?.videoWatched || false);
  const [activitiesDone, setActivitiesDone] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [miniCheckPassed, setMiniCheckPassed] = useState(false);
  const [isTestUnlocked, setIsTestUnlocked] = useState(false);

  // Sync with backend API
  const saveActivityProgress = async (patch) => {
    try {
      await api.post('/progress/activity-update', {
        competencyCode: 'M-04',
        ...patch,
      });
    } catch (err) {
      console.warn('[Numbers 1 to 9] Progress sync error:', err);
    }
  };

  /* -------------------------------------------------------------
     STAGE 2: VIDEO
  ------------------------------------------------------------- */
  const handleVideoCompleted = () => {
    setVideoCompleted(true);
    saveActivityProgress({
      videoWatched: true,
      videoWatchedPercentage: 100,
    });
    setCurrentStage(3); // Explore
  };

  /* -------------------------------------------------------------
     STAGE 3: EXPLORE NUMBERS 1 TO 9
  ------------------------------------------------------------- */
  const [activeExploreIdx, setActiveExploreIdx] = useState(0);

  /* -------------------------------------------------------------
     STAGE 4: ACTIVITY 1 - FIND THE NUMBER 🔎
  ------------------------------------------------------------- */
  const [findRound, setFindRound] = useState(0);
  const findRounds = [
    { target: '૭', targetWord: 'સાત (૭)', options: ['૩', '૭', '૫', '૨'], correct: '૭' },
    { target: '૪', targetWord: 'ચાર (૪)', options: ['૧', '૮', '૪', '૬'], correct: '૪' },
    { target: '૯', targetWord: 'નવ (૯)', options: ['૬', '૩', '૯', '૫'], correct: '૯' },
    { target: '૨', targetWord: 'બે (૨)', options: ['૨', '૭', '૫', '૮'], correct: '૨' },
    { target: '૮', targetWord: 'આઠ (૮)', options: ['૯', '૧', '૮', '૬'], correct: '૮' },
  ];
  const [findFeedback, setFindFeedback] = useState(null);

  const handleFindSelect = (opt) => {
    const isCorrect = opt === findRounds[findRound].correct;
    if (isCorrect) {
      setFindFeedback({ correct: true, msg: `🎉 સરસ! તમે ${opt} શોધી કાઢ્યો.` });
      setTotalStars((prev) => prev + 1);
      setTimeout(() => {
        setFindFeedback(null);
        if (findRound < findRounds.length - 1) {
          setFindRound((prev) => prev + 1);
        } else {
          setActivitiesDone((prev) => Math.max(prev, 1));
          setCurrentStage(5); // Next Activity
        }
      }, 1200);
    } else {
      setFindFeedback({ correct: false, msg: `ફરીથી જુઓ. ${findRounds[findRound].target} ક્યાં છે?` });
    }
  };

  /* -------------------------------------------------------------
     STAGE 5: ACTIVITY 2 - COUNT THE OBJECTS ⭐
  ------------------------------------------------------------- */
  const [countRound, setCountRound] = useState(0);
  const countRounds = [
    { count: 6, emoji: '⭐', name: 'તારા', options: ['૫', '૬', '૭'], correct: '૬' },
    { count: 4, emoji: '🌸', name: 'ફૂલો', options: ['૩', '૪', '૫'], correct: '૪' },
    { count: 8, emoji: '🎈', name: 'ફુગ્ગા', options: ['૭', '૮', '૯'], correct: '૮' },
    { count: 5, emoji: '🐟', name: 'માછલીઓ', options: ['૪', '૫', '૬'], correct: '૫' },
    { count: 9, emoji: '🍓', name: 'સ્ટ્રોબેરી', options: ['૮', '૯', '૭'], correct: '૯' },
  ];
  const [tappedObjects, setTappedObjects] = useState([]);
  const [countFeedback, setCountFeedback] = useState(null);

  const handleObjectTap = (index) => {
    if (!tappedObjects.includes(index)) {
      setTappedObjects((prev) => [...prev, index]);
    }
  };

  const handleCountAnswer = (opt) => {
    const isCorrect = opt === countRounds[countRound].correct;
    if (isCorrect) {
      setCountFeedback({ correct: true, msg: `🎉 ખૂબ સરસ! અહીં ${opt} ${countRounds[countRound].name} છે.` });
      setTotalStars((prev) => prev + 1);
      setTimeout(() => {
        setCountFeedback(null);
        setTappedObjects([]);
        if (countRound < countRounds.length - 1) {
          setCountRound((prev) => prev + 1);
        } else {
          setActivitiesDone((prev) => Math.max(prev, 2));
          setCurrentStage(6); // Next Activity
        }
      }, 1200);
    } else {
      setCountFeedback({ correct: false, msg: 'ફરીથી એક-એક કરીને ગણો.' });
    }
  };

  /* -------------------------------------------------------------
     STAGE 6: ACTIVITY 3 - NUMBER TO QUANTITY (સમૂહ પસંદ કરો)
  ------------------------------------------------------------- */
  const [groupRound, setGroupRound] = useState(0);
  const groupRounds = [
    { targetNum: '૭', targetWord: 'સાત (૭)', emoji: '⭐', groups: [4, 7, 5], correctIdx: 1 },
    { targetNum: '૩', targetWord: 'ત્રણ (૩)', emoji: '🍎', groups: [3, 5, 2], correctIdx: 0 },
    { targetNum: '૯', targetWord: 'નવ (૯)', emoji: '🍓', groups: [8, 6, 9], correctIdx: 2 },
    { targetNum: '૫', targetWord: 'પાંચ (૫)', emoji: '🐟', groups: [4, 5, 7], correctIdx: 1 },
  ];
  const [groupFeedback, setGroupFeedback] = useState(null);

  const handleGroupSelect = (idx) => {
    const isCorrect = idx === groupRounds[groupRound].correctIdx;
    if (isCorrect) {
      setGroupFeedback({ correct: true, msg: `🎉 વાહ! બરાબર ${groupRounds[groupRound].targetNum} વસ્તુઓ છે.` });
      setTotalStars((prev) => prev + 1);
      setTimeout(() => {
        setGroupFeedback(null);
        if (groupRound < groupRounds.length - 1) {
          setGroupRound((prev) => prev + 1);
        } else {
          setActivitiesDone((prev) => Math.max(prev, 3));
          setCurrentStage(7);
        }
      }, 1200);
    } else {
      setGroupFeedback({ correct: false, msg: 'વસ્તુઓ ફરીથી ગણો.' });
    }
  };

  /* -------------------------------------------------------------
     STAGE 7: ACTIVITY 4 - MATCHING GAME
  ------------------------------------------------------------- */
  const [matchRound, setMatchRound] = useState(1); // 1: 1-3, 2: 4-6, 3: 7-9
  const matchDataByRound = {
    1: [
      { num: '૧', count: 1, emoji: '🍎' },
      { num: '૨', count: 2, emoji: '🍎' },
      { num: '૩', count: 3, emoji: '🍎' },
    ],
    2: [
      { num: '૪', count: 4, emoji: '🌸' },
      { num: '૫', count: 5, emoji: '🌸' },
      { num: '૬', count: 6, emoji: '🌸' },
    ],
    3: [
      { num: '૭', count: 7, emoji: '🎈' },
      { num: '૮', count: 8, emoji: '🎈' },
      { num: '૯', count: 9, emoji: '🎈' },
    ],
  };

  const [selectedNum, setSelectedNum] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const handleNumClick = (item) => {
    setSelectedNum(item);
  };

  const handleGroupClick = (count) => {
    if (!selectedNum) return;
    if (selectedNum.count === count) {
      const newMatched = [...matchedPairs, count];
      setMatchedPairs(newMatched);
      setSelectedNum(null);
      setTotalStars((prev) => prev + 1);

      if (newMatched.length === 3) {
        setTimeout(() => {
          if (matchRound < 3) {
            setMatchRound((prev) => prev + 1);
            setMatchedPairs([]);
          } else {
            setActivitiesDone((prev) => Math.max(prev, 4));
            setCurrentStage(8); // Missing Numbers
          }
        }, 1000);
      }
    } else {
      alert('ખોટી જોડી! ફરી પ્રયાસ કરો.');
      setSelectedNum(null);
    }
  };

  /* -------------------------------------------------------------
     STAGE 8: ACTIVITY 5 - MISSING NUMBER (ખૂટતો અંક)
  ------------------------------------------------------------- */
  const [missingRound, setMissingRound] = useState(0);
  const missingRounds = [
    { sequence: ['૧', '૨', '__', '૪', '૫'], missing: '૩', options: ['૩', '૬', '૮'], correct: '૩' },
    { sequence: ['૪', '૫', '__', '૭', '૮'], missing: '૬', options: ['૨', '૬', '૯'], correct: '૬' },
    { sequence: ['૬', '__', '૮', '૯'], missing: '૭', options: ['૭', '૪', '૧'], correct: '૭' },
    { sequence: ['__', '૨', '૩'], missing: '૧', options: ['૧', '૫', '૬'], correct: '૧' },
    { sequence: ['૭', '૮', '__'], missing: '૯', options: ['૫', '૯', '૪'], correct: '૯' },
  ];
  const [missingFeedback, setMissingFeedback] = useState(null);

  const handleMissingAnswer = (opt) => {
    const isCorrect = opt === missingRounds[missingRound].correct;
    if (isCorrect) {
      setMissingFeedback({ correct: true, msg: `🎉 સાચો અંક ${opt} છે!` });
      setTotalStars((prev) => prev + 1);
      setTimeout(() => {
        setMissingFeedback(null);
        if (missingRound < missingRounds.length - 1) {
          setMissingRound((prev) => prev + 1);
        } else {
          setActivitiesDone((prev) => Math.max(prev, 5));
          setCurrentStage(9); // Number Order
        }
      }, 1200);
    } else {
      setMissingFeedback({ correct: false, msg: 'ક્રમ ફરીથી ચકાસો.' });
    }
  };

  /* -------------------------------------------------------------
     STAGE 9: ACTIVITY 6 - NUMBER ORDER (યોગ્ય ક્રમ)
  ------------------------------------------------------------- */
  const [orderedItems, setOrderedItems] = useState([]);
  const mixedPool = ['૭', '૨', '૯', '૪', '૧', '૬', '૩', '૮', '૫'];
  const [availableNumbers, setAvailableNumbers] = useState(mixedPool);

  const handleOrderPick = (num) => {
    const nextExpected = (orderedItems.length + 1).toString();
    const gujMap = { '1': '૧', '2': '૨', '3': '૩', '4': '૪', '5': '૫', '6': '૬', '7': '૭', '8': '૮', '9': '૯' };

    if (num === gujMap[nextExpected]) {
      setOrderedItems((prev) => [...prev, num]);
      setAvailableNumbers((prev) => prev.filter((n) => n !== num));
      setTotalStars((prev) => prev + 1);

      if (orderedItems.length + 1 === 9) {
        setTimeout(() => {
          setActivitiesDone((prev) => Math.max(prev, 6));
          setCurrentStage(10); // Number Hunt
        }, 1200);
      }
    } else {
      alert(`હવે ${gujMap[nextExpected]} નો વારો છે!`);
    }
  };

  /* -------------------------------------------------------------
     STAGE 10: ACTIVITY 7 - NUMBER HUNT (નંબર પકડો! 🎯)
  ------------------------------------------------------------- */
  const [huntRound, setHuntRound] = useState(0);
  const huntRounds = [
    { target: '૮', pool: ['૩', '૮', '૧', '૬', '૫', '૯'] },
    { target: '૪', pool: ['૭', '૨', '૪', '૧', '૯', '૩'] },
    { target: '૯', pool: ['૫', '૬', '૨', '૯', '૮', '૧'] },
    { target: '૨', pool: ['૪', '૨', '૭', '૩', '૬', '૫'] },
  ];

  const handleHuntTap = (n) => {
    if (n === huntRounds[huntRound].target) {
      setTotalStars((prev) => prev + 10);
      if (huntRound < huntRounds.length - 1) {
        setHuntRound((prev) => prev + 1);
      } else {
        setCurrentStage(11); // Visual Scene
      }
    }
  };

  /* -------------------------------------------------------------
     STAGE 11: ACTIVITY 8 - VISUAL SCENE COUNTING (બગીચાની ગણતરી)
  ------------------------------------------------------------- */
  const [sceneRound, setSceneRound] = useState(0);
  const sceneRounds = [
    {
      sceneEmoji: '🌳 🌸🌸🌸🌸🌸',
      question: 'બગીચામાં કેટલા ફૂલો 🌸 છે?',
      options: ['૪', '૫', '૬'],
      correct: '૫',
    },
    {
      sceneEmoji: '🌊 🐟🐟🐟🐟🐟🐟🐟',
      question: 'તળાવમાં કેટલી માછલીઓ 🐟 છે?',
      options: ['૬', '૭', '૮'],
      correct: '૭',
    },
  ];

  const handleSceneSelect = (opt) => {
    if (opt === sceneRounds[sceneRound].correct) {
      setTotalStars((prev) => prev + 5);
      if (sceneRound < sceneRounds.length - 1) {
        setSceneRound((prev) => prev + 1);
      } else {
        setCurrentStage(12); // Number Line
      }
    } else {
      alert('ચિત્રમાં ધ્યાનથી ગણો!');
    }
  };

  /* -------------------------------------------------------------
     STAGE 12: ACTIVITY 9 - INTERACTIVE NUMBER LINE (સંખ્યા રેખા)
  ------------------------------------------------------------- */
  const [rabbitPos, setRabbitPos] = useState(1);
  const [targetNumLine, setTargetNumLine] = useState(6);

  const handleNumLineTap = (num) => {
    setRabbitPos(num);
    if (num === targetNumLine) {
      if (targetNumLine === 6) {
        setTargetNumLine(9);
      } else {
        setTimeout(() => {
          setCurrentStage(13); // Practice Round
        }, 1200);
      }
    }
  };

  /* -------------------------------------------------------------
     STAGE 13: PRACTICE ROUND (10 QUESTIONS WITH 3-TIER HINTS)
  ------------------------------------------------------------- */
  const [practiceQIdx, setPracticeQIdx] = useState(0);
  const [practiceAns, setPracticeAns] = useState(null);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const practiceQuestions = [
    { q: '૫ શોધો.', options: ['૨', '૫', '૭'], correct: '૫', h1: 'સંખ્યાઓ ધ્યાનથી જુઓ.', h2: 'તે ૪ પછી આવે છે.', h3: 'સાચો ઉત્તર ૫ છે.' },
    { q: '🍎 🍎 🍎 🍎 🍎 🍎 🍎 (ગણો)', options: ['૬', '૭', '૮'], correct: '૭', h1: 'એક-એક કરીને ગણો.', h2: '૬ થી ૧ વધુ છે.', h3: '૭ સફરજન છે.' },
    { q: '૪ સાથે ૪ ફૂલો પસંદ કરો:', options: ['🌸🌸', '🌸🌸🌸🌸', '🌸🌸🌸🌸🌸'], correct: '🌸🌸🌸🌸', h1: 'ફૂલો ગણો.', h2: '૪ ફૂલો વાળો સમૂહ જુઓ.', h3: 'વચ્ચેનો સમૂહ સાચો છે.' },
    { q: '૧ → ૨ → __ → ૪', options: ['૩', '૫', '૬'], correct: '૩', h1: 'ક્રમ યાદ કરો.', h2: '૨ પછી શું આવે?', h3: '૩ આવે.' },
    { q: '૬ → ૭ → __ → ૯', options: ['૫', '૮', '૪'], correct: '૮', h1: '૭ પછીનો અંક.', h2: '૯ પહેલાનો અંક.', h3: '૮ સાચો જવાબ છે.' },
    { q: 'સૌથી નાની સંખ્યા કઈ છે?', options: ['૧', '૫', '૯'], correct: '૧', h1: 'શરૂઆતનો અંક.', h2: 'જે પહેલો આવે તે નાનો.', h3: '૧ સૌથી નાનો છે.' },
    { q: 'સૌથી મોટી સંખ્યા કઈ છે?', options: ['૩', '૭', '૯'], correct: '૯', h1: '૧ થી ૯ માં છેલ્લો અંક.', h2: 'જે સૌથી છેલ્લે આવે તે મોટો.', h3: '૯ સૌથી મોટો છે.' },
    { q: '⭐ ⭐ ⭐ ⭐ ⭐ (ગણો)', options: ['૪', '૫', '૬'], correct: '૫', h1: 'તારા ગણો.', h2: 'હાથની આંગળીઓ જેટલા છે.', h3: '૫ તારા છે.' },
    { q: '__ → ૮ → ૯', options: ['૭', '૫', '૬'], correct: '૭', h1: '૮ પહેલા શું આવે?', h2: '૬, ૭, ૮...', h3: '૭ સાચો જવાબ છે.' },
    { q: '૯ સાથે ૯ વસ્તુઓ:', options: ['🍓(9)', '🍓(7)', '🍓(5)'], correct: '🍓(9)', h1: '૯ ગણો.', h2: 'સૌથી વધુ સ્ટ્રોબેરી.', h3: '૯ સ્ટ્રોબેરી સાચી છે.' },
  ];

  const handlePracticeSubmit = () => {
    if (!practiceAns) return;
    setPracticeChecked(true);
    if (practiceAns === practiceQuestions[practiceQIdx].correct) {
      setPracticeScore((prev) => prev + 10);
    }
  };

  const handleNextPracticeQ = () => {
    if (practiceQIdx < practiceQuestions.length - 1) {
      setPracticeQIdx((prev) => prev + 1);
      setPracticeAns(null);
      setPracticeChecked(false);
      setHintLevel(0);
    } else {
      setCurrentStage(14); // Mini Check
    }
  };

  /* -------------------------------------------------------------
     STAGE 14: MINI CHECK (5 QUESTIONS)
  ------------------------------------------------------------- */
  const [miniQIdx, setMiniQIdx] = useState(0);
  const [miniScore, setMiniScore] = useState(0);
  const [selectedMiniOpt, setSelectedMiniOpt] = useState(null);

  const miniQuestions = [
    { q: '૧. ૫ શોધો:', options: ['૩', '૫', '૮'], correct: '૫' },
    { q: '૨. 🌸 🌸 🌸 🌸 🌸 🌸 🌸 (કેટલા ફૂલો?)', options: ['૬', '૭', '૮'], correct: '૭' },
    { q: '૩. ૮ સાથે ૮ વસ્તુઓ જોડો:', options: ['🎈(6)', '🎈(8)', '🎈(9)'], correct: '🎈(8)' },
    { q: '૪. ૪ → ૫ → __ → ૭', options: ['૬', '૩', '૮'], correct: '૬' },
    { q: '૫. ૧ થી ૯ સુધીમાં છેલ્લો અંક કયો?', options: ['૮', '૯', '૭'], correct: '૯' },
  ];

  const handleMiniCheckNext = () => {
    if (!selectedMiniOpt) return;
    const isCorrect = selectedMiniOpt === miniQuestions[miniQIdx].correct;
    if (isCorrect) setMiniScore((prev) => prev + 1);

    if (miniQIdx < miniQuestions.length - 1) {
      setMiniQIdx((prev) => prev + 1);
      setSelectedMiniOpt(null);
    } else {
      const finalMini = miniScore + (isCorrect ? 1 : 0);
      if (finalMini >= 3) {
        setMiniCheckPassed(true);
        setIsTestUnlocked(true);
        if (onTestReady) onTestReady();
        setCurrentStage(15); // Final Test
      } else {
        alert('મિની ચેકમાં ઓછા ગુણ મળ્યા. ફરીથી મહાવરો કરો!');
        setCurrentStage(13); // Back to practice
      }
    }
  };

  /* -------------------------------------------------------------
     STAGE 15: FINAL 10-QUESTION TEST
  ------------------------------------------------------------- */
  const [testQIdx, setTestQIdx] = useState(0);
  const [testSelectedOpt, setTestSelectedOpt] = useState(null);
  const [testScore, setTestScore] = useState(0);
  const [testAnswersRecord, setTestAnswersRecord] = useState({});

  const finalTestQuestions = [
    { q: 'પ્રશ્ન ૧: ૩, ૮, ૫, ૧ માંથી ૮ પસંદ કરો:', options: ['૩', '૮', '૫', '૧'], correct: '૮', topic: 'ઓળખ (Recognition)' },
    { q: 'પ્રશ્ન ૨: ૨, ૬, ૯ માંથી ૬ શોધો:', options: ['૨', '૬', '૯'], correct: '૬', topic: 'ઓળખ (Recognition)' },
    { q: 'પ્રશ્ન ૩: 🍎 🍎 🍎 🍎 🍎 🍎 🍎 (કેટલા સફરજન છે?)', options: ['૬', '૭', '૮'], correct: '૭', topic: 'ગણતરી (Counting)' },
    { q: 'પ્રશ્ન ૪: ૯ સાથે ૯ વસ્તુઓવાળો સમૂહ પસંદ કરો:', options: ['⭐(7)', '⭐(9)', '⭐(8)'], correct: '⭐(9)', topic: 'સમૂહ (Quantity)' },
    { q: 'પ્રશ્ન ૫: ૧ → ૨ → ૩ → __ → ૫', options: ['૪', '૬', '૭'], correct: '૪', topic: 'ક્રમ (Sequence)' },
    { q: 'પ્રશ્ન ૬: ૫ → ૬ → __ → ૮ → ૯', options: ['૭', '૪', '૨'], correct: '૭', topic: 'ખૂટતો અંક (Missing Number)' },
    { q: 'પ્રશ્ન ૭: __ → ૨ → ૩ → ૪', options: ['૧', '૫', '૬'], correct: '૧', topic: 'પહેલાનો અંક (Preceding Number)' },
    { q: 'પ્રશ્ન ૮: ૧ થી ૯ નો સાચો ક્રમ કયો છે?', options: ['૧, ૨, ૩, ૪, ૫, ૬, ૭, ૮, ૯', '૯, ૮, ૭, ૬, ૫, ૪, ૩, ૨, ૧', '૧, ૩, ૨, ૪, ૫, ૬, ૭, ૮, ૯'], correct: '૧, ૨, ૩, ૪, ૫, ૬, ૭, ૮, ૯', topic: 'ગોઠવણી (Ordering)' },
    { q: 'પ્રશ્ન ૯: 🌳 🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 (બગીચામાં કેટલા ફૂલો છે?)', options: ['૭', '૮', '૯'], correct: '૮', topic: 'ચિત્ર ગણતરી (Visual Counting)' },
    { q: 'પ્રશ્ન ૧૦: ૭ સાથે ૭ વસ્તુઓવાળો સમૂહ પસંદ કરો:', options: ['🍎(5)', '🍎(7)', '🍎(9)'], correct: '🍎(7)', topic: 'જોડકાં (Matching)' },
  ];

  const handleFinalTestNext = () => {
    if (!testSelectedOpt) return;
    const currentQ = finalTestQuestions[testQIdx];
    const isCorrect = testSelectedOpt === currentQ.correct;

    setTestAnswersRecord((prev) => ({
      ...prev,
      [testQIdx]: { selected: testSelectedOpt, correct: isCorrect, topic: currentQ.topic }
    }));

    if (isCorrect) setTestScore((prev) => prev + 1);

    if (testQIdx < finalTestQuestions.length - 1) {
      setTestQIdx((prev) => prev + 1);
      setTestSelectedOpt(null);
    } else {
      finishFinalTest(testScore + (isCorrect ? 1 : 0));
    }
  };

  const finishFinalTest = async (finalScore) => {
    setCurrentStage(16); // Result Screen
    const percentage = Math.round((finalScore / 10) * 100);
    const status = percentage >= 80 ? 'mastered' : (percentage >= 31 ? 'developing' : 'emerging');

    try {
      await api.post('/assessments/submit', {
        competencyCode: 'M-04',
        score: finalScore,
        totalQuestions: 10,
        percentage,
        status,
      });
      saveActivityProgress({
        assessmentUnlocked: true,
        assessmentCompleted: true,
        assessmentScore: percentage,
        status: status === 'mastered' ? 'Mastered' : 'In Progress',
      });
    } catch (err) {
      console.warn('[Numbers 1 to 9] Submit test error:', err);
    }
  };

  return (
    <div className="space-y-6 font-gujarati pb-12">
      {/* Stepper Navigation Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-1 overflow-x-auto select-none">
        <button
          onClick={() => setCurrentStage(2)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
            currentStage === 2 ? 'bg-emerald-600 text-white font-black' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>૧. વિડીયો</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        <button
          onClick={() => setCurrentStage(3)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
            currentStage === 3 ? 'bg-emerald-600 text-white font-black' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>૨. સંખ્યા ૧-૯</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        <button
          onClick={() => setCurrentStage(4)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
            currentStage >= 4 && currentStage <= 12 ? 'bg-emerald-600 text-white font-black' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>૩. પ્રવૃત્તિઓ</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        <button
          onClick={() => setCurrentStage(13)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
            currentStage === 13 ? 'bg-emerald-600 text-white font-black' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>૪. મહાવરો</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        <button
          onClick={() => setCurrentStage(15)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
            currentStage === 15 ? 'bg-emerald-600 text-white font-black' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>૫. કસોટી</span>
        </button>
      </div>

      {/* ========================================================
          STAGE 1 & 2: INTRO & YOUTUBE VIDEO SECTION
      ======================================================== */}
      {(currentStage === 1 || currentStage === 2) && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black uppercase tracking-wider">
              ગણિત • M-04 • ૧ થી ૯ સુધીનું સંખ્યાજ્ઞાન
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              ચાલો ૧ થી ૯ સુધીની સંખ્યાઓ શીખીએ! 🔢
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              વિડિયો ધ્યાનથી જુઓ અને પછી રમતો રમો! 🎮
            </p>
          </div>

          {/* YouTube Video Player */}
          <div className="aspect-video w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/GUp5gpDZqMk?autoplay=0&rel=0&modestbranding=1"
              title="૧ થી ૯ સુધીનું સંખ્યાજ્ઞાન વિડીયો"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <GujaratiVoiceButton
              text="ચાલો ૧ થી ૯ સુધીની સંખ્યાઓ શીખીએ અને રમતો રમીએ!"
              label="પાઠ સાંભળો (Voice)"
              size="lg"
            />
            <button
              onClick={handleVideoCompleted}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <span>વિડીયો જોયો ➔ સંખ્યા ઓળખો</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 3: MULTI-MODAL NUMBER EXPLORATION & LEARNING
      ======================================================== */}
      {currentStage === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              સંપૂર્ણ અંક શિક્ષણ (Explore Numbers ૧ to ૯)
            </h2>
            <p className="text-xs text-slate-600">
              અંક પસંદ કરો, આંગળીઓથી ગણતરી જુઓ અને વસ્તુઓ પર ટૅપ કરીને જાતે ગણો!
            </p>
          </div>

          {/* Large Interactive Active Number Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Numeral & Visual Quantity Box */}
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl text-center space-y-3 shadow-sm">
              <div className="text-6xl sm:text-7xl font-black text-emerald-700 font-gujarati">
                {NUMBERS_DATA[activeExploreIdx].num}
              </div>
              <div className="text-2xl font-black text-slate-800">
                “{NUMBERS_DATA[activeExploreIdx].word}”
              </div>

              {/* Visual Object Quantity Display */}
              <div className="flex flex-wrap items-center justify-center gap-2 py-2 min-h-[70px]">
                {Array.from({ length: NUMBERS_DATA[activeExploreIdx].english }).map((_, i) => (
                  <span key={i} className="text-4xl animate-bounce-soft">
                    {NUMBERS_DATA[activeExploreIdx].emoji}
                  </span>
                ))}
              </div>
              <div className="text-xs font-bold text-emerald-900">
                {NUMBERS_DATA[activeExploreIdx].english} {NUMBERS_DATA[activeExploreIdx].name}
              </div>

              <div className="pt-2">
                <GujaratiVoiceButton
                  text={`${NUMBERS_DATA[activeExploreIdx].word}, ${NUMBERS_DATA[activeExploreIdx].english} ${NUMBERS_DATA[activeExploreIdx].name}`}
                  label="🔊 ઉચ્ચારણ સાંભળો"
                  size="md"
                  className="w-full justify-center shadow-xs"
                />
              </div>
            </div>

            {/* Visual Finger Counting & Hands-on Touch Sandbox */}
            <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-3xl text-center space-y-3 shadow-sm flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-800 px-2 py-0.5 bg-amber-200 rounded-full">
                  આંગળીઓ દ્વારા ગણતરી
                </span>
                <h3 className="text-base font-black text-amber-950">
                  🖐️ હાથની આંગળીઓ ({NUMBERS_DATA[activeExploreIdx].word})
                </h3>
              </div>

              {/* Finger Emojis */}
              <div className="py-2 text-4xl flex items-center justify-center gap-2 min-h-[60px]">
                {activeExploreIdx === 0 && '☝️ (૧ આંગળી)'}
                {activeExploreIdx === 1 && '✌️ (૨ આંગળીઓ)'}
                {activeExploreIdx === 2 && '🤟 (૩ આંગળીઓ)'}
                {activeExploreIdx === 3 && '🖖 (૪ આંગળીઓ)'}
                {activeExploreIdx === 4 && '🖐️ (૫ આંગળીઓ - ૧ આખો હાથ)'}
                {activeExploreIdx === 5 && '🖐️ + ☝️ (૬ આંગળીઓ)'}
                {activeExploreIdx === 6 && '🖐️ + ✌️ (૭ આંગળીઓ)'}
                {activeExploreIdx === 7 && '🖐️ + 🤟 (૮ આંગળીઓ)'}
                {activeExploreIdx === 8 && '🖐️ + 🖖 (૯ આંગળીઓ)'}
              </div>

              <div className="p-3 bg-white/80 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900 leading-relaxed">
                👉 {NUMBERS_DATA[activeExploreIdx].num} એટલે {activeExploreIdx === 0 ? 'શરૂઆતનો પ્રથમ અંક' : `${NUMBERS_DATA[activeExploreIdx - 1].num} કરતાં ૧ વધુ`}!
              </div>

              <div className="text-[11px] text-amber-800 font-semibold">
                બાળકો પોતાના હાથની આંગળીઓ ઊંચી કરીને ગણી શકે છે.
              </div>
            </div>
          </div>

          {/* 1 to 9 Selector Buttons Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-700 uppercase text-center">
              બીજો અંક શીખવા માટે ક્લિક કરો:
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {NUMBERS_DATA.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveExploreIdx(idx)}
                  className={`py-3 rounded-2xl text-2xl font-black transition-all ${
                    activeExploreIdx === idx
                      ? 'bg-emerald-600 text-white shadow-lg scale-105 ring-2 ring-emerald-400'
                      : 'bg-slate-100 hover:bg-emerald-100 text-slate-800'
                  }`}
                >
                  {item.num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStage(4)}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <span>ઇન્ટરેક્ટિવ પ્રવૃત્તિઓ શરૂ કરો ➔</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 4: ACTIVITY 1 - FIND THE NUMBER 🔎
      ======================================================== */}
      {currentStage === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">પ્રવૃત્તિ ૧/૯</span>
              <h2 className="text-xl font-black text-slate-900">નંબર શોધો 🔎</h2>
            </div>
            <div className="text-xs font-mono font-bold text-slate-500">
              રાઉન્ડ {findRound + 1} / {findRounds.length}
            </div>
          </div>

          <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-3xl text-center space-y-3">
            <h3 className="text-2xl font-black text-amber-950">
              “{findRounds[findRound].target} શોધો.”
            </h3>
            <p className="text-xs text-amber-800">નીચે આપેલા અંકોમાંથી સાચો અંક પસંદ કરો:</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              {findRounds[findRound].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFindSelect(opt)}
                  className="py-6 rounded-2xl text-4xl font-black bg-white hover:bg-emerald-100 text-slate-900 border-2 border-slate-200 shadow-md active:scale-95 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {findFeedback && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                findFeedback.correct ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
              }`}
            >
              {findFeedback.msg}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          STAGE 5: ACTIVITY 2 - COUNT OBJECTS ⭐
      ======================================================== */}
      {currentStage === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">પ્રવૃત્તિ ૨/૯</span>
              <h2 className="text-xl font-black text-slate-900">વસ્તુઓ ગણો ⭐</h2>
            </div>
            <div className="text-xs font-mono font-bold text-slate-500">
              રાઉન્ડ {countRound + 1} / {countRounds.length}
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl text-center space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              “{countRounds[countRound].name} ગણો.” (એક-એક વસ્તુ પર ટૅપ કરો)
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-3 py-4">
              {Array.from({ length: countRounds[countRound].count }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleObjectTap(idx)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all ${
                    tappedObjects.includes(idx)
                      ? 'bg-emerald-200 border-2 border-emerald-500 scale-105'
                      : 'bg-white border border-slate-200 hover:scale-102'
                  }`}
                >
                  {countRounds[countRound].emoji}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-emerald-700">
              ગણેલી વસ્તુઓ: {tappedObjects.length} / {countRounds[countRound].count}
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-black text-slate-800 mb-2">
                કેટલા {countRounds[countRound].name} છે?
              </h4>
              <div className="flex justify-center gap-4">
                {countRounds[countRound].options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleCountAnswer(opt)}
                    className="px-6 py-3 bg-white hover:bg-emerald-100 text-slate-900 font-black text-xl rounded-2xl border-2 border-slate-200 shadow-md active:scale-95 transition-all"
                  >
                    [{opt}]
                  </button>
                ))}
              </div>
            </div>
          </div>

          {countFeedback && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                countFeedback.correct ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
              }`}
            >
              {countFeedback.msg}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          STAGE 6: ACTIVITY 3 - NUMBER TO QUANTITY
      ======================================================== */}
      {currentStage === 6 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">પ્રવૃત્તિ ૩/૯</span>
              <h2 className="text-xl font-black text-slate-900">સાચો સમૂહ પસંદ કરો</h2>
            </div>
            <div className="text-xs font-mono font-bold text-slate-500">
              રાઉન્ડ {groupRound + 1} / {groupRounds.length}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl text-center space-y-4">
            <div className="text-5xl font-black text-emerald-700 font-gujarati">
              {groupRounds[groupRound].targetNum}
            </div>
            <h3 className="text-lg font-black text-slate-900">
              “{groupRounds[groupRound].targetNum} વસ્તુઓવાળો સમૂહ પસંદ કરો.”
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              {groupRounds[groupRound].groups.map((count, gIdx) => (
                <button
                  key={gIdx}
                  onClick={() => handleGroupSelect(gIdx)}
                  className="p-5 bg-white hover:bg-emerald-100 border-2 border-slate-200 rounded-2xl shadow-md active:scale-95 transition-all text-center space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-[60px]">
                    {Array.from({ length: count }).map((_, i) => (
                      <span key={i} className="text-2xl">
                        {groupRounds[groupRound].emoji}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    સમૂહ {gIdx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {groupFeedback && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                groupFeedback.correct ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
              }`}
            >
              {groupFeedback.msg}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          STAGE 7: ACTIVITY 4 - MATCHING (જોડકાં જોડો)
      ======================================================== */}
      {currentStage === 7 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">પ્રવૃત્તિ ૪/૯</span>
              <h2 className="text-xl font-black text-slate-900">જોડકાં જોડો (Matching)</h2>
            </div>
            <div className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full">
              રાઉન્ડ {matchRound} / 3
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-600">
            ડાબી બાજુથી અંક પસંદ કરો અને જમણી બાજુથી તેના જેટલી વસ્તુઓવાળો સમૂહ પસંદ કરો.
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
            {/* Left Column: Numbers */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase">અંકો:</h4>
              {matchDataByRound[matchRound].map((item, idx) => (
                <button
                  key={idx}
                  disabled={matchedPairs.includes(item.count)}
                  onClick={() => handleNumClick(item)}
                  className={`w-full py-4 rounded-2xl text-3xl font-black transition-all ${
                    matchedPairs.includes(item.count)
                      ? 'bg-emerald-100 text-emerald-700 opacity-40 border border-emerald-300'
                      : selectedNum?.num === item.num
                      ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-300'
                      : 'bg-white border-2 border-slate-200 hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  {item.num}
                </button>
              ))}
            </div>

            {/* Right Column: Object Groups */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase">વસ્તુ સમૂહ:</h4>
              {matchDataByRound[matchRound].map((item, idx) => (
                <button
                  key={idx}
                  disabled={matchedPairs.includes(item.count)}
                  onClick={() => handleGroupClick(item.count)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-1.5 min-h-[72px] ${
                    matchedPairs.includes(item.count)
                      ? 'bg-emerald-100 opacity-40 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                  }`}
                >
                  {Array.from({ length: item.count }).map((_, i) => (
                    <span key={i} className="text-2xl">
                      {item.emoji}
                    </span>
                  ))}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 8: ACTIVITY 5 - MISSING NUMBER (ખૂટતો અંક)
      ======================================================== */}
      {currentStage === 8 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">પ્રવૃત્તિ ૫/૯</span>
              <h2 className="text-xl font-black text-slate-900">ખૂટતો અંક શોધો</h2>
            </div>
            <div className="text-xs font-mono font-bold text-slate-500">
              રાઉન્ડ {missingRound + 1} / {missingRounds.length}
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-200 text-center space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase">સંખ્યા ક્રમ પૂરો કરો:</h3>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-2xl sm:text-4xl font-black text-slate-900">
              {missingRounds[missingRound].sequence.map((item, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-2 rounded-xl ${
                    item === '__' ? 'bg-amber-200 text-amber-950 border-2 border-amber-400' : 'bg-white shadow-xs'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-black text-slate-800 mb-3">સાચો અંક કયો છે?</h4>
              <div className="flex justify-center gap-4">
                {missingRounds[missingRound].options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleMissingAnswer(opt)}
                    className="px-6 py-3 bg-white hover:bg-emerald-100 text-slate-900 font-black text-2xl rounded-2xl border-2 border-slate-200 shadow-md active:scale-95 transition-all"
                  >
                    [{opt}]
                  </button>
                ))}
              </div>
            </div>
          </div>

          {missingFeedback && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                missingFeedback.correct ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
              }`}
            >
              {missingFeedback.msg}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          STAGE 9: ACTIVITY 6 - NUMBER ORDER (૧ થી ૯ ગોઠવો)
      ======================================================== */}
      {currentStage === 9 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">પ્રવૃત્તિ ૬/૯</span>
              <h2 className="text-xl font-black text-slate-900">૧ થી ૯ યોગ્ય ક્રમમાં ગોઠવો</h2>
            </div>
            <div className="text-xs font-bold text-emerald-800">
              ગોઠવાયેલ: {orderedItems.length} / 9
            </div>
          </div>

          {/* Drop Slot Sequence */}
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex flex-wrap items-center justify-center gap-2 min-h-[80px]">
            {orderedItems.length === 0 ? (
              <span className="text-xs font-bold text-emerald-700">
                નીચેથી ૧ થી શરૂ કરીને ક્રમશઃ અંક પર ટૅપ કરો.
              </span>
            ) : (
              orderedItems.map((num, idx) => (
                <span
                  key={idx}
                  className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl font-black shadow-md"
                >
                  {num}
                </span>
              ))
            )}
          </div>

          {/* Available Numbers Pool */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-700 uppercase text-center">
              અંકો પસંદ કરો:
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {availableNumbers.map((num, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOrderPick(num)}
                  className="w-12 h-12 rounded-2xl bg-white hover:bg-emerald-100 text-slate-900 font-black text-2xl border-2 border-slate-200 shadow-md active:scale-95 transition-all"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 10: ACTIVITY 7 - NUMBER HUNT 🎯
      ======================================================== */}
      {currentStage === 10 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">પ્રવૃત્તિ ૭/૯</span>
              <h2 className="text-xl font-black text-slate-900">નંબર પકડો! 🎯</h2>
            </div>
            <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{totalStars} સ્ટાર્સ</span>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl text-center space-y-4">
            <h3 className="text-xl font-black text-amber-950">
              લક્ષ્યાંક: <span className="text-4xl text-amber-800">{huntRounds[huntRound].target}</span> ને પકડો!
            </h3>

            <div className="grid grid-cols-3 gap-4 pt-3 max-w-sm mx-auto">
              {huntRounds[huntRound].pool.map((n, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHuntTap(n)}
                  className="py-5 rounded-2xl text-3xl font-black bg-white hover:bg-amber-100 border-2 border-amber-200 shadow-md active:scale-95 transition-all"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 11: ACTIVITY 8 - VISUAL SCENE COUNTING
      ======================================================== */}
      {currentStage === 11 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">પ્રવૃત્તિ ૮/૯</span>
              <h2 className="text-xl font-black text-slate-900">ચિત્ર ગણતરી (Scene Counting)</h2>
            </div>
            <div className="text-xs font-mono font-bold text-slate-500">
              રાઉન્ડ {sceneRound + 1} / 2
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-200 text-center space-y-4">
            <div className="text-5xl py-4 bg-white rounded-2xl border border-slate-200 shadow-inner">
              {sceneRounds[sceneRound].sceneEmoji}
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {sceneRounds[sceneRound].question}
            </h3>

            <div className="flex justify-center gap-4 pt-2">
              {sceneRounds[sceneRound].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSceneSelect(opt)}
                  className="px-6 py-3 bg-white hover:bg-emerald-100 text-slate-900 font-black text-2xl rounded-2xl border-2 border-slate-200 shadow-md active:scale-95 transition-all"
                >
                  [{opt}]
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 12: ACTIVITY 9 - NUMBER LINE 🐰
      ======================================================== */}
      {currentStage === 12 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">પ્રવૃત્તિ ૯/૯</span>
              <h2 className="text-xl font-black text-slate-900">સંખ્યા રેખા (Number Line)</h2>
            </div>
          </div>

          <div className="p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-300 text-center space-y-4">
            <h3 className="text-lg font-black text-emerald-950">
              “{targetNumLine} પર જાઓ.”
            </h3>

            {/* Rabbit Character Jump Display */}
            <div className="flex items-center justify-between overflow-x-auto py-6 border-b-2 border-emerald-400">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const gujNum = num.toString().replace(/\d/g, (d) => '૦૧૨૩૪૫૬૭૮૯'[d]);
                return (
                  <button
                    key={num}
                    onClick={() => handleNumLineTap(num)}
                    className="flex flex-col items-center gap-1 group shrink-0 px-2"
                  >
                    <span className="text-2xl h-8">
                      {rabbitPos === num ? '🐰' : ''}
                    </span>
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black shadow-xs ${
                        rabbitPos === num
                          ? 'bg-emerald-600 text-white scale-110'
                          : 'bg-white text-slate-800 border border-slate-200'
                      }`}
                    >
                      {gujNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 13: PRACTICE ROUND (10 QUESTIONS WITH 3 HINTS)
      ======================================================== */}
      {currentStage === 13 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                મહાવરો {practiceQIdx + 1} / {practiceQuestions.length}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                ઇન્ટરેક્ટિવ મહાવરો (Practice Round)
              </h2>
            </div>
            <div className="text-xs font-black text-amber-700 flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{practiceScore} પોઇન્ટ્સ</span>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              {practiceQuestions[practiceQIdx].q}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {practiceQuestions[practiceQIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={practiceChecked}
                  onClick={() => setPracticeAns(opt)}
                  className={`p-4 rounded-2xl border-2 text-center font-black text-lg transition-all ${
                    practiceAns === opt
                      ? 'border-emerald-600 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-400'
                      : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Hint Section */}
          <div className="space-y-2">
            <button
              onClick={() => setHintLevel((prev) => Math.min(prev + 1, 3))}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-black flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>મદદ / સંકેત જુઓ (Hint {hintLevel}/3)</span>
            </button>

            {hintLevel >= 1 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold">
                💡 {practiceQuestions[practiceQIdx].h1}
              </div>
            )}
            {hintLevel >= 2 && (
              <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-950 font-bold">
                💡 {practiceQuestions[practiceQIdx].h2}
              </div>
            )}
            {hintLevel >= 3 && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-black">
                💡 {practiceQuestions[practiceQIdx].h3}
              </div>
            )}
          </div>

          {practiceChecked && (
            <div
              className={`p-4 rounded-2xl text-center font-black text-sm ${
                practiceAns === practiceQuestions[practiceQIdx].correct
                  ? 'bg-emerald-100 text-emerald-950'
                  : 'bg-rose-100 text-rose-950'
              }`}
            >
              {practiceAns === practiceQuestions[practiceQIdx].correct
                ? '🎉 ખૂબ સરસ! સાચો જવાબ છે! ⭐'
                : 'ફરીથી ધ્યાનથી ગણો.'}
            </div>
          )}

          <div>
            {!practiceChecked ? (
              <button
                onClick={handlePracticeSubmit}
                disabled={!practiceAns}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm"
              >
                જવાબ ચકાસો
              </button>
            ) : (
              <button
                onClick={handleNextPracticeQ}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>
                  {practiceQIdx < practiceQuestions.length - 1
                    ? 'આગળનો પ્રશ્ન ▶'
                    : 'મિની ચેક શરૂ કરો 🚀'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 14: MINI CHECK (5 QUESTIONS)
      ======================================================== */}
      {currentStage === 14 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">મિની ચેક (Mini Check)</span>
              <h2 className="text-xl font-black text-slate-900">
                પ્રશ્ન {miniQIdx + 1} / {miniQuestions.length}
              </h2>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              {miniQuestions[miniQIdx].q}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {miniQuestions[miniQIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMiniOpt(opt)}
                  className={`p-4 rounded-2xl border-2 text-center font-black text-lg transition-all ${
                    selectedMiniOpt === opt
                      ? 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-md ring-2 ring-emerald-400'
                      : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleMiniCheckNext}
            disabled={!selectedMiniOpt}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm"
          >
            {miniQIdx < miniQuestions.length - 1 ? 'આગળનો પ્રશ્ન ▶' : 'કસોટી અનલૉક કરો 🔓'}
          </button>
        </div>
      )}

      {/* ========================================================
          STAGE 15: FINAL 10-QUESTION TEST
      ======================================================== */}
      {currentStage === 15 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase text-emerald-800">
                અંતિમ મૂલ્યાંકન કસોટી
              </span>
              <h2 className="text-xl font-black text-slate-900">
                પ્રશ્ન {testQIdx + 1} / 10
              </h2>
            </div>
            <div className="text-xs font-mono font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full">
              ગુણ: {testScore}
            </div>
          </div>

          {/* Test Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((testQIdx + 1) / 10) * 100}%` }}
            />
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              {finalTestQuestions[testQIdx].q}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {finalTestQuestions[testQIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestSelectedOpt(opt)}
                  className={`p-4 rounded-2xl border-2 text-center font-black text-base transition-all ${
                    testSelectedOpt === opt
                      ? 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-md ring-2 ring-emerald-400'
                      : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFinalTestNext}
            disabled={!testSelectedOpt}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-base"
          >
            {testQIdx < 9 ? 'આગળનો પ્રશ્ન (Next Question) ▶' : 'કસોટી પૂર્ણ કરો 🏆'}
          </button>
        </div>
      )}

      {/* ========================================================
          STAGE 16: RESULT & MASTERY DIAGNOSIS SCREEN
      ======================================================== */}
      {currentStage === 16 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-2xl space-y-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-500 text-white flex items-center justify-center text-4xl shadow-xl">
            {(testScore / 10) >= 0.8 ? '🏆' : '🌱'}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {(testScore / 10) >= 0.8 ? '🎉 અભિનંદન!' : 'સારો પ્રયાસ!'}
            </h2>
            <p className="text-sm font-bold text-slate-700">
              {(testScore / 10) >= 0.8
                ? 'તમે ૧ થી ૯ સુધીનું સંખ્યાજ્ઞાન શીખી લીધું.'
                : 'વધુ મહાવરો કરીને ફરીથી કસોટી આપો.'}
            </p>
          </div>

          {/* Score Card */}
          <div className="max-w-xs mx-auto p-5 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-1">
            <div className="text-xs font-bold text-emerald-800 uppercase">મેળવેલ ગુણ</div>
            <div className="text-4xl font-black text-emerald-700 font-mono">{testScore} / 10</div>
            <div className="text-xs font-bold text-emerald-600">
              ટકાવારી: {Math.round((testScore / 10) * 100)}% (લક્ષ્યાંક: ૮૦%)
            </div>
          </div>

          {/* Diagnosis Breakdown */}
          <div className="text-left bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>વિષયવાર નિદાન (Diagnosis Breakdown):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">સંખ્યા ઓળખ (Recognition):</span>{' '}
                <span className="text-emerald-700 font-bold">ઉત્તમ</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">જથ્થા ગણતરી (Counting):</span>{' '}
                <span className="text-emerald-700 font-bold">નિપુણ</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">સંખ્યા ક્રમ (Sequence):</span>{' '}
                <span className="text-emerald-700 font-bold">સંતોષકારક</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">સ્થિતિ (Status):</span>{' '}
                <span className="text-emerald-700 font-black">
                  {(testScore / 10) >= 0.8 ? '🟢 MASTERED' : '🟡 RELEARN'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentStage(2);
                setTestQIdx(0);
                setTestSelectedOpt(null);
                setTestScore(0);
              }}
              className="px-6 py-3 border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-all active:scale-95 text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ફરીથી પાઠ જુઓ</span>
            </button>

            <button
              onClick={() => navigate('/student/learning-path')}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <span>આગળનો પાઠ શીખો (Next Lesson 🔓)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
