const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const StudentProgress = require('../models/StudentProgress');
const { processAssessmentSubmission } = require('../services/masteryEngine');

// @desc    Get assessment quiz for a competency
// @route   GET /api/assessments/competency/:code
exports.getAssessmentForCompetency = async (req, res, next) => {
  try {
    const { code } = req.params;
    const competencyCode = code.toUpperCase();

    // Verify student has unlocked this competency
    if (req.user.role === 'Student') {
      const progress = await StudentProgress.findOne({
        studentId: req.user._id,
        competencyCode,
      });

      if (!progress || progress.status === 'LOCKED') {
        return res.status(403).json({
          success: false,
          message: 'This assessment is locked. Please complete earlier competencies first.'
        });
      }
    }

    const assessment = await Assessment.findOne({ competencyCode })
      .populate({
        path: 'questions',
        select: '-correctAnswerId' // Don't send correct answers to frontend
      });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found for this competency' });
    }

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit student assessment answers & process mastery
// @route   POST /api/assessments/submit
exports.submitAssessment = async (req, res, next) => {
  try {
    const { competencyCode, answers, timeSpentSeconds } = req.body;
    // answers format: [{ questionId: '...', selectedOptionId: '...' }]

    if (!competencyCode || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Competency code and answers array are required' });
    }

    const studentId = req.user._id;
    const studentUid = req.user.uid;

    const assessment = await Assessment.findOne({ competencyCode: competencyCode.toUpperCase() })
      .populate('questions');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Verify and score answers on server side
    const questionMap = new Map();
    assessment.questions.forEach(q => questionMap.set(q._id.toString(), q));

    let correctCount = 0;
    const scoredAnswers = [];
    const missedCategories = new Set();

    for (const ans of answers) {
      const question = questionMap.get(ans.questionId) || assessment.questions.find(q => q.questionId === ans.questionId);
      if (question) {
        const isCorrect = (ans.selectedOptionId === question.correctAnswerId);
        if (isCorrect) {
          correctCount += 1;
        } else {
          // Classify weakness based on competency and question context
          const qText = (question.promptGujarati || '').toLowerCase();
          const compCode = (competencyCode || '').toUpperCase();

          if (compCode === 'M-02' || qText.includes('નજીક') || qText.includes('દૂર') || qText.includes('ઉપર') || qText.includes('નીચે')) {
            if (qText.includes('નજીક') || qText.includes('દૂર')) {
              missedCategories.add('નજીક અને દૂર (Near & Far)');
            } else if (qText.includes('ઉપરથી નીચે') || qText.includes('નીચેથી ઉપર') || qText.includes('ક્રમ')) {
              missedCategories.add('ઉપરથી નીચે / નીચેથી ઉપર (Vertical Ordering)');
            } else if (qText.includes('ની ઉપર') || qText.includes('ની નીચે')) {
              missedCategories.add('ની ઉપર અને ની નીચે (Relative Position: Above & Below)');
            } else if (qText.includes('ઉપર') || qText.includes('નીચે')) {
              missedCategories.add('ઉપર અને નીચે (Basic Up & Down)');
            } else {
              missedCategories.add('સ્થાનિક સંકલ્પના (Spatial Concepts)');
            }
          } else if (question.questionType === 'image_choice' || qText.includes('સમૂહ') || qText.includes('જૂથ') || qText.includes('વસ્તુ')) {
            missedCategories.add('વસ્તુ સમૂહ સરખામણી (Visual Groups)');
          } else if (qText.includes('ક્રમમાં') || qText.includes('ગોઠવો')) {
            missedCategories.add('સંખ્યા ક્રમ (Number Ordering)');
          } else if (qText.includes('બંને') || (qText.includes('નાનો') && qText.includes('મોટો'))) {
            missedCategories.add('નાની અને મોટી બંને સંખ્યા (Smallest & Biggest Both)');
          } else if (qText.includes('નાનો') || qText.includes('ઓછો')) {
            missedCategories.add('સૌથી નાનો નંબર (Smallest Number)');
          } else if (qText.includes('મોટો') || qText.includes('વધુ')) {
            missedCategories.add('સૌથી મોટો નંબર (Biggest Number)');
          } else {
            missedCategories.add('સંખ્યા સરખામણી (Number Comparison)');
          }
        }

        scoredAnswers.push({
          questionId: question.questionId,
          selectedOptionId: ans.selectedOptionId,
          isCorrect,
        });
      }
    }

    const totalQuestions = assessment.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const diagnosedWeakAreas = Array.from(missedCategories);

    // Process through Mastery Engine
    const result = await processAssessmentSubmission({
      studentId,
      studentUid,
      competencyCode: competencyCode.toUpperCase(),
      assessmentId: assessment._id,
      score: correctCount,
      percentage,
      answers: scoredAnswers,
      totalQuestions,
      correctAnswersCount: correctCount,
      weakAreas: diagnosedWeakAreas,
    });

    res.status(200).json({
      success: true,
      data: {
        score: correctCount,
        totalQuestions,
        percentage,
        isMastered: result.isMastered,
        performanceBand: result.performanceBand,
        progressStatus: result.progress.status,
        nextUnlockedCompetency: result.nextUnlockedCompetency,
        newlyUnlockedAchievements: result.newlyUnlockedAchievements,
        weakAreas: result.weakAreas || diagnosedWeakAreas,
        relearningAdvice: diagnosedWeakAreas.length > 0
          ? `ધ્યાન આપવાની જરૂર: ${diagnosedWeakAreas.join(', ')}`
          : null,
        feedbackGujarati: result.isMastered
          ? 'અભિનંદન! તમે આ ક્ષમતામાં નિપુણતા મેળવી છે 🎉 આગળનું પગલું અનલૉક થઈ ગયું છે.'
          : (percentage >= 31
            ? 'તમે થોડું વધુ શીખવાની જરૂર છે 👍 ચાલો નબળા મુદ્દાઓ પર ધ્યાન કેન્દ્રિત કરીએ.'
            : 'ચાલો ફરીથી શીખીએ! ચિત્ર અને રમતો દ્વારા ફરી મહાવરો કરો ✨'),
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment attempts history for a student
// @route   GET /api/assessments/attempts/:competencyCode
exports.getAttemptHistory = async (req, res, next) => {
  try {
    const { competencyCode } = req.params;
    const studentId = req.query.studentId || req.user._id;

    const attempts = await AssessmentAttempt.find({
      studentId,
      competencyCode: competencyCode.toUpperCase(),
    }).sort({ attemptNumber: 1 });

    res.status(200).json({ success: true, count: attempts.length, data: attempts });
  } catch (error) {
    next(error);
  }
};
