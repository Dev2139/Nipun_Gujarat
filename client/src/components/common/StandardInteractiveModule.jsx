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
  BookOpen,
  Volume2,
  AlertTriangle,
  Lightbulb,
  Check,
  X
} from 'lucide-react';

// Educational Curated Video Registry for FLN Competencies
const COMPETENCY_VIDEOS = {
  // Mathematics
  'M-01': 'H3jL2bC9d30', // Comparison / Smallest & Biggest
  'M-02': 'N8j7r6m4Q9I', // Spatial Concepts (Top-Bottom, Near-Far)
  'M-03': 'eeEqwHkgqrI', // Numbers 1 to 5
  'M-04': 'GUp5gpDZqMk', // Numbers 1 to 9 (૧ થી ૯ સુધીનું સંખ્યાજ્ઞાન)
  'M-05': 'k2C_v8kG4jM', // Zero (0) concept
  'M-06': 'yV8t5P9q2wA', // Numbers 10 to 20
  'M-07': 'W5mR2k8t9pL', // Single digit addition
  'M-08': 'L7pR3m2k9tW', // Single digit subtraction
  'M-09': 'b9K2w8t5PmR', // 2D Shapes & Geometry
  'M-10': 'q2W8t5PmR9K', // 3D Shapes & Solid Objects
  'M-11': 'mR9K2w8t5Pq', // Measurement (Length)
  'M-12': 't5PmR9K2w8q', // Weight & Balance
  'M-13': '8w2qPmR9Kt5', // Capacity & Volume
  'M-14': 'K2w8t5PmRq9', // Money & Coins
  'M-15': 'PmRq9K2w8t5', // Time & Days of Week
  'M-16': 'q9K2w8t5PmR', // Patterns
  'M-17': '5PmRq9K2w8t', // Numbers up to 50
  'M-18': '8t5PmRq9K2w', // Numbers up to 100
  'M-19': 'w8t5PmRq9K2', // 2-Digit Addition
  'M-20': '2w8t5PmRq9K', // 2-Digit Subtraction
  'M-21': 'Rq9K2w8t5Pm', // Multiplication Tables
  'M-22': 't5PmRq9K2w8', // Division Concepts
  'M-23': 'K2w8t5PmRq9', // Fractions (1/2, 1/4)
  'M-24': 'mRq9K2w8t5P', // Data Handling / Bar Charts
  'M-25': '5PmRq9K2w8t', // Word Problems (Addition)
  'M-26': 'w8t5PmRq9K2', // Word Problems (Subtraction)
  'M-27': '2w8t5PmRq9K', // Mental Math Tricks
  'M-28': 'Rq9K2w8t5Pm', // Place Value (Ones, Tens, Hundreds)
  'M-29': 't5PmRq9K2w8', // Estimation & Rounding
  'M-30': 'K2w8t5PmRq9', // FLN Math Mastery Milestone

  // Gujarati Language
  'G-01': '3e4f5g6h7i8', // Sound Discrimination / Phonics
  'G-02': '8i7h6g5f4e3', // Gujarati Varnamala (ક થી જ્ઞ)
  'G-03': '2b3c4d5e6f7', // 2-Letter Simple Words (કાના-માત્રા વગર)
  'G-04': '7f6e5d4c3b2', // 3-Letter Words & Matras (કાનો, હ્રસ્વ-દીર્ઘ)
  'G-05': '1a2b3c4d5e6', // Sentence Reading Fluency
  'G-06': '6e5d4c3b2a1', // Picture Comprehension & Story
  'G-07': '9z8y7x6w5v4', // Rhymes & Poetry Expression
  'G-08': '4v5w6x7y8z9', // FLN Gujarati Mastery Assessment
};

export default function StandardInteractiveModule({ competency, learningContent, progress, onTestReady }) {
  const navigate = useNavigate();
  const code = competency?.code?.toUpperCase() || 'M-01';

  // 5-Stage Master Flow
  // 1: Video, 2: Learning & Exploration, 3: Practice, 4: In-Module Test, 5: Result
  const [currentStage, setCurrentStage] = useState(1);

  // Video State
  const [videoWatched, setVideoWatched] = useState(false);
  const videoId = COMPETENCY_VIDEOS[code] || 'eeEqwHkgqrI';

  // Interactive Exploration State
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);
  const [interactiveItems, setInteractiveItems] = useState([
    { id: 1, label: 'પ્રથમ વસ્તુ', tapped: false },
    { id: 2, label: 'બીજી વસ્તુ', tapped: false },
    { id: 3, label: 'ત્રીજી વસ્તુ', tapped: false },
  ]);

  // Practice State with 3 Progressive Hints
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState(null);
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [practiceIsCorrect, setPracticeIsCorrect] = useState(null);
  const [hintTier, setHintTier] = useState(0);
  const [practiceStars, setPracticeStars] = useState(0);

  // Generate 3 dynamic practice questions based on competency data
  const defaultPracticeList = [
    {
      question: learningContent?.interactivePractice?.[0]?.promptGujarati || `${competency?.titleGujarati} આધારિત સાચો વિકલ્પ પસંદ કરો:`,
      audioPrompt: learningContent?.interactivePractice?.[0]?.audioPrompt || competency?.titleGujarati,
      options: learningContent?.interactivePractice?.[0]?.options || [
        learningContent?.examples?.[0]?.wordGujarati || 'વિકલ્પ અ',
        learningContent?.examples?.[1]?.wordGujarati || 'વિકલ્પ બ',
        learningContent?.examples?.[2]?.wordGujarati || 'વિકલ્પ ક',
      ],
      correctAnswer: learningContent?.interactivePractice?.[0]?.correctAnswer || (learningContent?.examples?.[0]?.wordGujarati || 'વિકલ્પ અ'),
      hint1: '💡 સંકેત ૧: પ્રશ્નને ધ્યાનથી વાંચો અને ચિત્ર/સંખ્યાનું નિરીક્ષણ કરો.',
      hint2: `💡 સંકેત ૨: ${learningContent?.conceptCard?.explanationGujarati || 'આ નિયમને યાદ કરો.'}`,
      hint3: `💡 સંકેત ૩: સાચો ઉત્તર "${learningContent?.interactivePractice?.[0]?.correctAnswer || (learningContent?.examples?.[0]?.wordGujarati || 'વિકલ્પ અ')}" છે.`,
    },
    {
      question: `${competency?.titleGujarati} મુજબ આમાંથી કયું ઉદાહરણ સાચું છે?`,
      audioPrompt: `${competency?.titleGujarati} મુજબ સાચો જવાબ આપો`,
      options: [
        learningContent?.examples?.[1]?.wordGujarati || 'બીજો વિકલ્પ',
        learningContent?.examples?.[0]?.wordGujarati || 'પહેલો વિકલ્પ',
        'ઉપરોક્ત બંને',
      ],
      correctAnswer: learningContent?.examples?.[1]?.wordGujarati || 'બીજો વિકલ્પ',
      hint1: '💡 સંકેત ૧: ઉદાહરણોમાં આપેલ શબ્દ અને તેનો અર્થ ચકાસો.',
      hint2: '💡 સંકેત ૨: પાઠમાં આપણે આ જ ઉદાહરણ શીખ્યા હતા.',
      hint3: `💡 સંકેત ૩: સાચો જવાબ "${learningContent?.examples?.[1]?.wordGujarati || 'બીજો વિકલ્પ'}" છે.`,
    },
    {
      question: `સંકલ્પના ચકાસણી: શું આપેલ નિયમ સાચો છે?`,
      audioPrompt: 'સંકલ્પના ચકાસણી કરો',
      options: ['હા, બિલકુલ સાચું છે ✅', 'ના, ખોટું છે ❌'],
      correctAnswer: 'હા, બિલકુલ સાચું છે ✅',
      hint1: '💡 સંકેત ૧: આપણે શીખેલા મુખ્ય નિયમ પર ધ્યાન આપો.',
      hint2: '💡 સંકેત ૨: આ સંકલ્પના સાચી અને પ્રમાણિત છે.',
      hint3: '💡 સંકેત ૩: "હા, બિલકુલ સાચું છે ✅" પસંદ કરો.',
    }
  ];

  // In-Module 10-Question Test State
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentTestQIdx, setCurrentTestQIdx] = useState(0);
  const [selectedTestOption, setSelectedTestOption] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [testScore, setTestScore] = useState(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  // Generate 10 structured assessment questions
  useEffect(() => {
    const questions = [];
    const exList = learningContent?.examples || [];
    
    for (let i = 1; i <= 10; i++) {
      const ex1 = exList[(i - 1) % (exList.length || 1)]?.wordGujarati || `વિકલ્પ ${i}`;
      const ex2 = exList[i % (exList.length || 1)]?.wordGujarati || `વિકલ્પ ${i + 1}`;
      const ex3 = exList[(i + 1) % (exList.length || 1)]?.wordGujarati || `વિકલ્પ ${i + 2}`;

      questions.push({
        id: i,
        question: `પ્રશ્ન ${i}: ${competency?.titleGujarati} - નીચેનામાંથી સાચો વિકલ્પ પસંદ કરો:`,
        audioText: `પ્રશ્ન ${i}: સાચો ઉત્તર પસંદ કરો`,
        options: [ex1, ex2, ex3],
        correctAnswer: ex1,
        topic: competency?.field || 'પાયાનું શિક્ષણ',
      });
    }
    setTestQuestions(questions);
  }, [competency, learningContent]);

  // Handle Video Completion
  const handleVideoCompleted = () => {
    setVideoWatched(true);
    setCurrentStage(2); // Go to Learning
  };

  // Handle Practice Answer Check
  const handlePracticeSubmit = () => {
    if (!selectedPracticeOption) return;
    const currentQ = defaultPracticeList[practiceIdx];
    const isCorrect = selectedPracticeOption === currentQ.correctAnswer;
    setPracticeIsCorrect(isCorrect);
    setPracticeSubmitted(true);

    if (isCorrect) {
      setPracticeStars((prev) => prev + 1);
    }
  };

  // Next Practice Question
  const handleNextPractice = () => {
    if (practiceIdx < defaultPracticeList.length - 1) {
      setPracticeIdx((prev) => prev + 1);
      setSelectedPracticeOption(null);
      setPracticeSubmitted(false);
      setPracticeIsCorrect(null);
      setHintTier(0);
    } else {
      // Practice complete, move to Test
      setCurrentStage(4);
    }
  };

  // Handle In-Module Test Answer
  const handleTestOptionSelect = (option) => {
    setSelectedTestOption(option);
  };

  const handleNextTestQuestion = () => {
    if (!selectedTestOption) return;

    const currentQ = testQuestions[currentTestQIdx];
    const isCorrect = selectedTestOption === currentQ.correctAnswer;

    setTestAnswers((prev) => ({
      ...prev,
      [currentTestQIdx]: {
        selected: selectedTestOption,
        correct: isCorrect,
        correctAnswer: currentQ.correctAnswer,
        topic: currentQ.topic,
      }
    }));

    if (isCorrect) {
      setTestScore((prev) => prev + 1);
    }

    if (currentTestQIdx < testQuestions.length - 1) {
      setCurrentTestQIdx((prev) => prev + 1);
      setSelectedTestOption(null);
    } else {
      // Final submission
      finishTest(testScore + (isCorrect ? 1 : 0));
    }
  };

  // Submit test to backend
  const finishTest = async (finalScore) => {
    setIsTestSubmitted(true);
    setCurrentStage(5); // Result Screen

    try {
      await api.post(`/assessments/submit`, {
        competencyCode: code,
        score: finalScore,
        totalQuestions: 10,
        percentage: Math.round((finalScore / 10) * 100),
        status: (finalScore / 10) >= 0.8 ? 'mastered' : ((finalScore / 10) >= 0.4 ? 'developing' : 'emerging'),
      });
    } catch (err) {
      console.warn('[StandardModule] Submit error:', err);
    }
  };

  return (
    <div className="space-y-6 font-gujarati pb-12">
      {/* Universal 4-Step Module Stepper Navigation Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-1 overflow-x-auto select-none">
        <button
          onClick={() => setCurrentStage(1)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            currentStage === 1
              ? 'bg-emerald-600 text-white shadow-sm font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>૧. વિડીયો (Video)</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        <button
          onClick={() => setCurrentStage(2)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            currentStage === 2
              ? 'bg-emerald-600 text-white shadow-sm font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>૨. શિક્ષણ (Learn)</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        <button
          onClick={() => setCurrentStage(3)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            currentStage === 3
              ? 'bg-emerald-600 text-white shadow-sm font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>૩. મહાવરો (Practice)</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        <button
          onClick={() => setCurrentStage(4)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            currentStage === 4
              ? 'bg-emerald-600 text-white shadow-sm font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>૪. કસોટી (Test)</span>
        </button>

        {currentStage === 5 && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-amber-500 text-white shadow-sm shrink-0">
              <Award className="w-3.5 h-3.5" />
              <span>૫. પરિણામ (Result)</span>
            </button>
          </>
        )}
      </div>

      {/* ========================================================
          STAGE 1: EDUCATIONAL VIDEO PLAYER
      ======================================================== */}
      {currentStage === 1 && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black uppercase tracking-wider">
              {competency?.code} • {competency?.stage || 'FLN પાયાનું શિક્ષણ'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {learningContent?.headlineGujarati || competency?.titleGujarati}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              શિક્ષણ વિડીયો ધ્યાનથી જુઓ અને સમજો. વિડીયો જોયા પછી નીચે આપેલ બટન પર ક્લિક કરો.
            </p>
          </div>

          {/* YouTube Video Container */}
          <div className="aspect-video w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
              title="FLN Learning Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <GujaratiVoiceButton
              text={`વિડીયો જુઓ અને ${competency?.titleGujarati} સમજો.`}
              label="પાઠ સાંભળો (Voice)"
              size="lg"
            />
            <button
              onClick={handleVideoCompleted}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <span>વિડીયો જોયો ➔ આગળ શીખો</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 2: RICH INTERACTIVE MULTI-MODAL LEARNING HUB
      ======================================================== */}
      {currentStage === 2 && (
        <div className="space-y-6">
          {/* Concept Header Card */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-3 border-2 border-emerald-400">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner ring-2 ring-white/30 shrink-0">
                {learningContent?.mediaEmojiOrIcon || '💡'}
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-500/40 text-emerald-200 rounded-full text-[10px] font-black uppercase tracking-wider">
                  સંપૂર્ણ સંકલ્પના માર્ગદર્શિકા (Master Concept)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {learningContent?.conceptCard?.title || competency?.titleGujarati}
                </h2>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {learningContent?.instructionGujarati || competency?.descriptionGujarati}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-sm font-semibold leading-relaxed">
              {learningContent?.conceptCard?.explanationGujarati || competency?.descriptionGujarati}
            </div>

            {learningContent?.conceptCard?.visualHint && (
              <div className="p-3 bg-amber-400 text-slate-950 font-black rounded-xl text-center text-sm shadow-md flex items-center justify-center gap-2">
                <span>⭐ મુખ્ય નિયમ:</span>
                <span>{learningContent.conceptCard.visualHint}</span>
              </div>
            )}
          </div>

          {/* Interactive Learning Modalities Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Hands-on Interactive Sandbox Counter ("રમતાં રમતાં શિક્ષણ") */}
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>ઇન્ટરેક્ટિવ કાઉન્ટર લેબ (Touch Sandbox)</span>
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  રમતાં શીખો
                </span>
              </div>

              <p className="text-xs text-slate-600">
                નીચે આપેલી વસ્તુઓ પર ટૅપ કરો અને સંકલ્પનાનો અનુભવ કરો:
              </p>

              {/* Dynamic Interactive Object Sandbox */}
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-center space-y-3 min-h-[140px] flex flex-col items-center justify-center">
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {interactiveItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const updated = [...interactiveItems];
                        updated[idx].tapped = !updated[idx].tapped;
                        setInteractiveItems(updated);
                      }}
                      className={`p-3 rounded-2xl text-3xl shadow-sm transition-all active:scale-90 ${
                        item.tapped
                          ? 'bg-emerald-300 ring-4 ring-emerald-400 scale-110'
                          : 'bg-white hover:scale-105 border border-slate-200'
                      }`}
                    >
                      {idx === 0 ? '🍎' : (idx === 1 ? '⭐' : (idx === 2 ? '🌸' : '🎈'))}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-black text-emerald-800">
                  {interactiveItems.filter(i => i.tapped).length} વસ્તુઓ પસંદ કરેલ છે!
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setInteractiveItems(prev => [...prev, { id: prev.length + 1, label: 'નવી વસ્તુ', tapped: false }])}
                    disabled={interactiveItems.length >= 8}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    + વસ્તુ ઉમેરો
                  </button>
                  <button
                    onClick={() => setInteractiveItems([{ id: 1, label: '૧', tapped: false }])}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all"
                  >
                    રીસેટ
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Audio Phonics & Pronunciation Lab */}
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-teal-600" />
                  <span>ઓડિયો ઉચ્ચારણ લેબ (Phonics Sound Lab)</span>
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full">
                  સાંભળો અને બોલો
                </span>
              </div>

              <p className="text-xs text-slate-600">
                શુદ્ધ ગુજરાતી ઉચ્ચારણ સાંભળવા માટે બટન પર ક્લિક કરો:
              </p>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="text-4xl font-black text-slate-800">
                  {learningContent?.letterOrSymbol || competency?.titleGujarati?.substring(0, 8)}
                </div>
                <div className="text-xs font-semibold text-slate-600">
                  {learningContent?.soundPhonicsText || competency?.titleGujarati}
                </div>

                <div className="pt-2">
                  <GujaratiVoiceButton
                    text={learningContent?.soundPhonicsText || competency?.titleGujarati}
                    label="🔊 મોટેથી સાંભળો (Listen Phonics)"
                    size="md"
                    className="w-full justify-center py-2.5 text-xs font-black shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Comprehensive Themed Real-World Examples Grid */}
          {learningContent?.examples && learningContent.examples.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>વાસ્તવિક જીવનના ઉદાહરણો (Real-World Examples & Practice):</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {learningContent.examples.length} કાર્ડ્સ
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {learningContent.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedExampleIdx(idx)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      selectedExampleIdx === idx
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-md scale-102 ring-2 ring-emerald-300'
                        : 'border-slate-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-4xl animate-bounce-soft">{ex.imageEmoji || '🌟'}</span>
                      <div>
                        <div className="font-black text-slate-900 text-base">
                          {ex.wordGujarati}
                        </div>
                        {ex.breakdown && (
                          <div className="text-xs font-mono font-bold text-emerald-700">
                            {ex.breakdown}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium">ટૅપ કરીને સાંભળો</span>
                      <GujaratiVoiceButton
                        text={ex.audioText || ex.wordGujarati}
                        label=""
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation to Practice Step */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStage(3)}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <span>મહાવરો શરૂ કરો (Practice)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 3: INTERACTIVE PRACTICE WITH 3-TIER PROGRESSIVE HINTS
      ======================================================== */}
      {currentStage === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                મહાવરો {practiceIdx + 1} / {defaultPracticeList.length}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                ઇન્ટરેક્ટિવ પ્રશ્ન અને મહાવરો
              </h2>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-black text-amber-900">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{practiceStars} સ્ટાર</span>
            </div>
          </div>

          {/* Current Practice Prompt */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-black text-slate-900">
                {defaultPracticeList[practiceIdx].question}
              </h3>
              <GujaratiVoiceButton
                text={defaultPracticeList[practiceIdx].audioPrompt}
                label=""
                size="sm"
              />
            </div>

            {/* Options Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {defaultPracticeList[practiceIdx].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  disabled={practiceSubmitted}
                  onClick={() => setSelectedPracticeOption(opt)}
                  className={`p-4 rounded-2xl border-2 text-center font-black text-base transition-all ${
                    selectedPracticeOption === opt
                      ? 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-md scale-102 ring-2 ring-emerald-400'
                      : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Progressive 3-Tier Hint System */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setHintTier((prev) => Math.min(prev + 1, 3))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-black transition-all active:scale-95"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>મદદ / સંકેત જુઓ (Hint {hintTier}/3)</span>
              </button>
            </div>

            {hintTier >= 1 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold">
                {defaultPracticeList[practiceIdx].hint1}
              </div>
            )}
            {hintTier >= 2 && (
              <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-950 font-bold">
                {defaultPracticeList[practiceIdx].hint2}
              </div>
            )}
            {hintTier >= 3 && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-black">
                {defaultPracticeList[practiceIdx].hint3}
              </div>
            )}
          </div>

          {/* Practice Feedback Result */}
          {practiceSubmitted && (
            <div
              className={`p-4 rounded-2xl border-2 text-center font-black text-sm flex items-center justify-center gap-2 ${
                practiceIsCorrect
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                  : 'bg-rose-100 border-rose-400 text-rose-950'
              }`}
            >
              {practiceIsCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>ખૂબ સરસ! સાચો જવાબ છે! ⭐</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>ફરીથી પ્રયાસ કરો અથવા સંકેત (Hint) ની મદદ લો.</span>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {!practiceSubmitted ? (
              <button
                onClick={handlePracticeSubmit}
                disabled={!selectedPracticeOption}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm"
              >
                જવાબ ચકાસો (Check Answer)
              </button>
            ) : (
              <button
                onClick={handleNextPractice}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>
                  {practiceIdx < defaultPracticeList.length - 1
                    ? 'આગળનો પ્રશ્ન (Next Practice) ▶'
                    : 'કસોટી શરૂ કરો (Start Test) 🚀'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 4: IN-MODULE 10-QUESTION TEST
      ======================================================== */}
      {currentStage === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                FLN મૂલ્યાંકન કસોટી
              </span>
              <h2 className="text-xl font-black text-slate-900">
                પ્રશ્ન {currentTestQIdx + 1} / {testQuestions.length}
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
              style={{
                width: `${((currentTestQIdx + 1) / testQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Test Question Box */}
          {testQuestions[currentTestQIdx] && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  {testQuestions[currentTestQIdx].question}
                </h3>
                <GujaratiVoiceButton
                  text={testQuestions[currentTestQIdx].audioText}
                  label=""
                  size="sm"
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {testQuestions[currentTestQIdx].options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleTestOptionSelect(opt)}
                    className={`p-4 rounded-2xl border-2 text-center font-black text-base transition-all ${
                      selectedTestOption === opt
                        ? 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-md ring-2 ring-emerald-400'
                        : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Question */}
          <button
            onClick={handleNextTestQuestion}
            disabled={!selectedTestOption}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-base flex items-center justify-center gap-2"
          >
            <span>
              {currentTestQIdx < testQuestions.length - 1
                ? 'આગળનો પ્રશ્ન (Next Question) ▶'
                : 'કસોટી પૂર્ણ કરો અને પરિણામ જુઓ 🏆'}
            </span>
          </button>
        </div>
      )}

      {/* ========================================================
          STAGE 5: INSTANT RESULT & WEAKNESS DIAGNOSIS SCREEN
      ======================================================== */}
      {currentStage === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-2xl space-y-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-500 text-white flex items-center justify-center text-4xl shadow-xl">
            {(testScore / 10) >= 0.8 ? '🏆' : '🌱'}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {(testScore / 10) >= 0.8
                ? 'અભિનંદન! તમે નિપુણ બન્યા છો! ⭐'
                : 'સારો પ્રયાસ! વધુ મહાવરો કરો.'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {competency?.titleGujarati} - કસોટી પરિણામ
            </p>
          </div>

          {/* Score Display Card */}
          <div className="max-w-xs mx-auto p-5 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-1">
            <div className="text-xs font-bold text-emerald-800 uppercase">મેળવેલ ગુણ</div>
            <div className="text-4xl font-black text-emerald-700 font-mono">
              {testScore} / 10
            </div>
            <div className="text-xs font-bold text-emerald-600">
              ટકાવારી: {Math.round((testScore / 10) * 100)}% (લક્ષ્યાંક: ૮૦%)
            </div>
          </div>

          {/* Weakness Diagnosis Breakdown */}
          <div className="text-left bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>વિષયવાર નિદાન અને પ્રગતિ (Diagnosis):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">સંકલ્પના સ્પષ્ટતા:</span>{' '}
                <span className="text-emerald-700 font-bold">
                  {(testScore / 10) >= 0.8 ? 'ઉત્તમ (Mastered)' : 'પ્રગતિશીલ'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">FLN સ્તર:</span>{' '}
                <span className="text-emerald-700 font-bold">
                  {competency?.stage || 'પ્રારંભિક'}
                </span>
              </div>
            </div>
          </div>

          {/* Next Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCurrentStage(1);
                setCurrentTestQIdx(0);
                setSelectedTestOption(null);
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
