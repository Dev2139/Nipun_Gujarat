import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { curriculumService, progressService } from '../../services';
import GujaratiVoiceButton from '../../components/GujaratiVoiceButton';
import InteractiveExercise from '../../components/InteractiveExercise';
import InteractiveObjectCounter from '../../components/math/InteractiveObjectCounter';
import InteractiveComparisonScale from '../../components/math/InteractiveComparisonScale';
import InteractiveNumberLine from '../../components/math/InteractiveNumberLine';
import InteractiveCurrencyShop from '../../components/math/InteractiveCurrencyShop';
import InteractiveClockDayNight from '../../components/math/InteractiveClockDayNight';
import SmallestBiggestModule from '../../components/math/SmallestBiggestModule';
import SpatialConceptsModule from '../../components/math/SpatialConceptsModule';
import Numbers1to5Module from '../../components/math/Numbers1to5Module';
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export default function LearnLesson() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [practiceDone, setPracticeDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await curriculumService.getCompetencyDetails(code);
        if (res.success) {
          setData(res.data);
          // Mark learning step as started in backend
          await progressService.markStep({
            competencyCode: code,
            stepType: 'learning',
            timeSpentSeconds: 15,
          });
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [code]);

  if (loading || !data) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  const { competency, learningContent } = data;
  const isMath = competency.subject === 'mathematics';
  const seq = competency.sequence;

  const handlePracticeComplete = async () => {
    setPracticeDone(true);
    try {
      await progressService.markStep({
        competencyCode: code,
        stepType: 'practice',
        timeSpentSeconds: 30,
      });
    } catch (e) {}
  };

  // Render appropriate interactive manipulative for math competency
  const renderMathManipulative = () => {
    if (!isMath) return null;

    if (seq === 1 || seq === 5 || seq === 8 || seq === 23 || seq === 27 || seq === 28) {
      // Comparison / Balance Scale
      return (
        <InteractiveComparisonScale
          mode={seq === 27 ? 'weight' : (seq === 5 || seq === 8 ? 'numbers' : 'size')}
          items={
            seq === 27
              ? [
                  { name: 'ઈંટ (Brick) 🧱', emoji: '🧱', weight: 100, label: 'ભારે' },
                  { name: 'દડો (Ball) ⚽', emoji: '⚽', weight: 20, label: 'મધ્યમ' },
                  { name: 'પીંછું (Feather) 🪶', emoji: '🪶', weight: 1, label: 'હલકું' },
                ]
              : seq === 5
              ? [
                  { name: 'સંખ્યા ૯', emoji: '9️⃣', weight: 9, label: 'સૌથી મોટી' },
                  { name: 'સંખ્યા ૫', emoji: '5️⃣', weight: 5, label: 'વચ્ચેની' },
                  { name: 'સંખ્યા ૨', emoji: '2️⃣', weight: 2, label: 'સૌથી નાની' },
                ]
              : [
                  { name: 'હાથી 🐘', emoji: '🐘', weight: 100, label: 'સૌથી મોટો' },
                  { name: 'બિલાડી 🐈', emoji: '🐈', weight: 20, label: 'મધ્યમ' },
                  { name: 'ઉંદર 🐁', emoji: '🐁', weight: 2, label: 'સૌથી નાનો' },
                ]
          }
        />
      );
    }

    if (seq === 3 || seq === 4 || seq === 12 || seq === 18) {
      // Object Counter
      return (
        <InteractiveObjectCounter
          maxCount={seq === 3 ? 5 : (seq === 4 ? 9 : 6)}
          itemEmoji={seq === 3 ? '🍎' : (seq === 4 ? '⭐' : '⚽')}
        />
      );
    }

    if (seq === 9 || seq === 11 || seq === 14 || seq === 19) {
      // Number Line Frog Jump
      return (
        <InteractiveNumberLine
          startNumber={seq === 14 ? 4 : (seq === 19 ? 8 : 5)}
          maxRange={15}
        />
      );
    }

    if (seq === 25 || seq === 26) {
      // Currency Shop
      return <InteractiveCurrencyShop />;
    }

    if (seq === 29 || seq === 30) {
      // Time Cycle / Clock
      return <InteractiveClockDayNight />;
    }

    // Default object counter fallback for counting
    return (
      <InteractiveObjectCounter
        maxCount={5}
        itemEmoji="🍎"
      />
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/student/path/${competency.subject}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs font-gujarati"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>પાછળ જાઓ (Back)</span>
        </Link>

        <span className="font-mono font-bold text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
          {competency.code} (પગલું {competency.sequence})
        </span>
      </div>

      {/* Dedicated Interactive Modules for M-01, M-02 & M-03 */}
      {code?.toUpperCase() === 'M-01' ? (
        <SmallestBiggestModule
          competency={competency}
          progress={data?.progress}
          onTestReady={() => setPracticeDone(true)}
        />
      ) : code?.toUpperCase() === 'M-02' ? (
        <SpatialConceptsModule
          competency={competency}
          progress={data?.progress}
          onTestReady={() => setPracticeDone(true)}
        />
      ) : code?.toUpperCase() === 'M-03' ? (
        <Numbers1to5Module
          competency={competency}
          progress={data?.progress}
          onTestReady={() => setPracticeDone(true)}
        />
      ) : (
        <>
          {/* Lesson Hero Banner */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-lg text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-4xl shadow-md">
          {learningContent?.mediaEmojiOrIcon || '📖'}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-gujarati">
            {competency.stage}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
            {learningContent?.headlineGujarati || competency.titleGujarati}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-gujarati max-w-lg mx-auto">
            {learningContent?.instructionGujarati || competency.descriptionGujarati}
          </p>
        </div>

        {learningContent?.soundPhonicsText && (
          <div className="pt-2">
            <GujaratiVoiceButton
              text={learningContent.soundPhonicsText}
              label="પાઠ સાંભળો (Listen Phonics)"
              size="lg"
              className="px-6 py-3 text-base"
            />
          </div>
        )}
      </div>

      {/* Interactive Hands-on Math Manipulative Suite ("રમતાં રમતાં શિક્ષણ") */}
      {isMath && (
        <div className="pt-1">
          {renderMathManipulative()}
        </div>
      )}

      {/* Concept Visual Card */}
      {learningContent?.conceptCard && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-lg text-slate-900 font-gujarati">
              {learningContent.conceptCard.title || 'નિયમ અને સમજ'}
            </h2>
          </div>

          <p className="text-sm font-semibold text-slate-700 font-gujarati leading-relaxed">
            {learningContent.conceptCard.explanationGujarati}
          </p>

          {learningContent.conceptCard.visualHint && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 font-black text-base md:text-lg font-gujarati text-center">
              {learningContent.conceptCard.visualHint}
            </div>
          )}
        </div>
      )}

      {/* Examples Grid */}
      {learningContent?.examples && learningContent.examples.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-extrabold text-base text-slate-900 font-gujarati">
            ઉદાહરણો (Examples):
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {learningContent.examples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{ex.imageEmoji || '✨'}</span>
                  <div>
                    <div className="font-extrabold text-base md:text-lg text-slate-900 font-gujarati">
                      {ex.wordGujarati}
                    </div>
                    {ex.breakdown && (
                      <div className="text-[11px] font-mono text-emerald-700 font-bold">
                        {ex.breakdown}
                      </div>
                    )}
                  </div>
                </div>

                <GujaratiVoiceButton
                  text={ex.audioText || ex.wordGujarati}
                  label=""
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Practice Step */}
      {learningContent?.interactivePractice && learningContent.interactivePractice.length > 0 && (
        <div className="pt-2">
          <InteractiveExercise
            practice={learningContent.interactivePractice[0]}
            onComplete={handlePracticeComplete}
          />
        </div>
      )}

      {/* "Take Test" Action Bar */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl text-white shadow-xl shadow-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-gujarati">
        <div className="space-y-1">
          <h3 className="text-xl font-black">
            {practiceDone ? 'સરસ! હવે કસોટી આપવા માટે તૈયાર છો? 🎯' : 'પાઠ પૂર્ણ કર્યા પછી કસોટી આપો!'}
          </h3>
          <p className="text-xs text-emerald-100">
            ૮૦% કે તેથી વધુ ગુણ મેળવવાથી આગળનું પગલું અનલૉક થશે.
          </p>
        </div>

        <button
          onClick={() => navigate(`/student/test/${competency.code}`)}
          className="px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm font-gujarati flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <span>કસોટી આપો (Take Test) 🚀</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      </>
      )}
    </div>
  );
}
