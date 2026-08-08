import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { assessmentService } from '../../services';
import GujaratiVoiceButton from '../../components/GujaratiVoiceButton';
import { ArrowLeft, CheckCircle2, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

export default function AssessmentQuiz() {
  const { code } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const navigate = useNavigate();

  const confirmAndSubmit = () => {
    setShowConfirmSubmit(true);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await assessmentService.getAssessment(code);
        if (res.success) {
          setAssessment(res.data);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'કસોટી લોડ કરવામાં ભૂલ થઈ.');
        navigate(`/student/learn/${code}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [code]);

  if (loading || !assessment) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentAnswer = selectedAnswers[currentQ?._id || currentQ?.questionId];

  const handleSelectOption = (optionId) => {
    if (!currentQ) return;
    const key1 = currentQ._id ? currentQ._id.toString() : null;
    const key2 = currentQ.questionId;
    setSelectedAnswers((prev) => ({
      ...prev,
      ...(key1 ? { [key1]: optionId } : {}),
      ...(key2 ? { [key2]: optionId } : {}),
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const answersArray = questions.map((q) => {
      const key1 = q._id ? q._id.toString() : null;
      const key2 = q.questionId;
      const selected = (key1 && selectedAnswers[key1]) || (key2 && selectedAnswers[key2]) || '';
      return {
        questionId: key1 || key2,
        selectedOptionId: selected,
      };
    });

    try {
      setSubmitting(true);
      const cleanCode = (code || '').toUpperCase();
      const res = await assessmentService.submitAssessment({
        competencyCode: cleanCode,
        answers: answersArray,
        timeSpentSeconds: 60,
      });

      if (res.success) {
        navigate('/student/result', {
          state: {
            result: res.data,
            competencyCode: cleanCode,
            titleGujarati: assessment.titleGujarati,
          }
        });
      }
    } catch (err) {
      console.error('[AssessmentQuiz] Submission error:', err);
      const msg = err.response?.data?.message || err.message || 'કસોટી સબમિટ કરવામાં ભૂલ થઈ.';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isAllAnswered = questions.every((q) => {
    const key1 = q._id ? q._id.toString() : null;
    const key2 = q.questionId;
    return (key1 && selectedAnswers[key1]) || (key2 && selectedAnswers[key2]);
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/student/learn/${code}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs font-gujarati"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>પાઠ પર પાછા જાઓ</span>
        </Link>

        <span className="font-mono font-bold text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
          પ્રશ્ન {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2">
        {questions.map((q, idx) => {
          const isAnswered = selectedAnswers[q._id || q.questionId] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-4 h-4 rounded-full transition-all ${
                isCurrent
                  ? 'bg-emerald-600 ring-4 ring-emerald-200 scale-110'
                  : isAnswered
                  ? 'bg-emerald-400'
                  : 'bg-slate-200'
              }`}
            />
          );
        })}
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-gujarati">
                પ્રશ્ન ક્રમાંક #{currentIndex + 1}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 font-gujarati leading-snug">
                {currentQ.promptGujarati}
              </h2>
            </div>

            <GujaratiVoiceButton
              text={currentQ.promptGujarati}
              label="સાંભળો"
              size="sm"
            />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = currentAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-5 rounded-2xl border-2 text-left font-gujarati transition-all flex items-center gap-3.5 shadow-sm active:scale-95 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 ring-4 ring-emerald-100 font-bold text-slate-900'
                      : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-700'
                  }`}
                >
                  <span className="text-3xl">{opt.emoji || '🔸'}</span>
                  <div className="text-base md:text-lg font-bold">{opt.textGujarati}</div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 font-gujarati">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 disabled:opacity-30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>પાછળ</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95"
              >
                <span>આગળનો પ્રશ્ન</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={confirmAndSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>કસોટી જમા કરો (Submit) 🎯</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-gujarati">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-emerald-400 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl shadow-sm">
              📝
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                શું તમે ટેસ્ટ પૂર્ણ કરવા તૈયાર છો?
              </h3>
              <p className="text-xs text-slate-500">
                તમે બધા {totalQuestions} પ્રશ્નોના જવાબો આપ્યા છે.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
              >
                ચકાસવું છે
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleSubmit();
                }}
                disabled={submitting}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'જમા થઈ રહ્યું છે...' : 'હા, જમા કરો ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
