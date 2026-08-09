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
import StandardInteractiveModule from '../../components/common/StandardInteractiveModule';
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
        <StandardInteractiveModule
          competency={competency}
          learningContent={learningContent}
          progress={data?.progress}
          onTestReady={() => setPracticeDone(true)}
        />
      )}
    </div>
  );
}
