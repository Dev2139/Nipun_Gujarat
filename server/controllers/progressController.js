const StudentProgress = require('../models/StudentProgress');
const Student = require('../models/Student');
const Competency = require('../models/Competency');
const AssessmentAttempt = require('../models/AssessmentAttempt');

// @desc    Get student progress across subjects
// @route   GET /api/progress/my
exports.getMyProgress = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const student = await Student.findById(studentId);

    const progressList = await StudentProgress.find({ studentId })
      .populate('competencyId')
      .sort({ subject: 1, sequence: 1 });

    const gujaratiList = progressList.filter(p => p.subject === 'gujarati');
    const mathList = progressList.filter(p => p.subject === 'mathematics');

    // Current active/available competency for student
    const currentGujarati = gujaratiList.find(p => p.status === 'AVAILABLE' || p.status === 'LEARNING' || p.status === 'PRACTICE' || p.status === 'RELEARN' || p.status === 'TEST_AVAILABLE') || gujaratiList[0];
    const currentMath = mathList.find(p => p.status === 'AVAILABLE' || p.status === 'LEARNING' || p.status === 'PRACTICE' || p.status === 'RELEARN' || p.status === 'TEST_AVAILABLE') || mathList[0];

    // Mastered percentages
    const gujMastered = gujaratiList.filter(p => p.status === 'MASTERED').length;
    const gujPercentage = gujaratiList.length > 0 ? Math.round((gujMastered / gujaratiList.length) * 100) : 0;

    const mathMastered = mathList.filter(p => p.status === 'MASTERED').length;
    const mathPercentage = mathList.length > 0 ? Math.round((mathMastered / mathList.length) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          uid: student.uid,
          name: student.name,
          grade: student.grade,
          streakDays: student.streakDays,
          totalStars: student.totalStars,
          profileImage: student.profileImage,
        },
        subjects: {
          gujarati: {
            progressPercentage: gujPercentage,
            masteredCount: gujMastered,
            totalCount: gujaratiList.length,
            currentCompetency: currentGujarati,
            competencies: gujaratiList,
          },
          mathematics: {
            progressPercentage: mathPercentage,
            masteredCount: mathMastered,
            totalCount: mathList.length,
            currentCompetency: currentMath,
            competencies: mathList,
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update learning/practice completion status
// @route   POST /api/progress/step
exports.markLearningStep = async (req, res, next) => {
  try {
    const { competencyCode, stepType, timeSpentSeconds } = req.body; // stepType: 'learning' | 'practice'

    if (!competencyCode || !stepType) {
      return res.status(400).json({ success: false, message: 'competencyCode and stepType are required' });
    }

    const studentId = req.user._id;

    const progress = await StudentProgress.findOne({
      studentId,
      competencyCode: competencyCode.toUpperCase(),
    });

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    if (progress.status === 'LOCKED') {
      return res.status(403).json({ success: false, message: 'Cannot update progress for a locked competency' });
    }

    if (stepType === 'learning') {
      progress.learningCompleted = true;
      if (progress.status === 'AVAILABLE') {
        progress.status = 'LEARNING';
      }
    } else if (stepType === 'practice') {
      progress.practiceCompleted = true;
      progress.assessmentUnlocked = true;
      if (progress.status !== 'MASTERED') {
        progress.status = 'TEST_AVAILABLE';
      }
    }

    if (timeSpentSeconds) {
      progress.timeSpentSeconds = (progress.timeSpentSeconds || 0) + Number(timeSpentSeconds);
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: `Step '${stepType}' marked as completed.`,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track granular learning activity (Video, Interactive Games, Practice, Hints)
// @route   POST /api/progress/activity-update
exports.trackLearningActivity = async (req, res, next) => {
  try {
    const {
      competencyCode,
      videoWatched,
      videoWatchedPercentage,
      activitiesCompleted,
      practiceScore,
      hintsUsed,
      weakAreas,
      activityDetails,
      timeSpentSeconds,
      unlockAssessment,
    } = req.body;

    if (!competencyCode) {
      return res.status(400).json({ success: false, message: 'competencyCode is required' });
    }

    const studentId = req.user._id;

    const progress = await StudentProgress.findOne({
      studentId,
      competencyCode: competencyCode.toUpperCase(),
    });

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    if (videoWatched !== undefined) {
      progress.videoWatched = Boolean(videoWatched);
    }
    if (videoWatchedPercentage !== undefined) {
      progress.videoWatchedPercentage = Math.max(progress.videoWatchedPercentage || 0, Number(videoWatchedPercentage));
    }
    if (activitiesCompleted !== undefined) {
      progress.activitiesCompleted = Math.max(progress.activitiesCompleted || 0, Number(activitiesCompleted));
      if (progress.activitiesCompleted >= 4) {
        progress.learningCompleted = true;
      }
    }
    if (practiceScore !== undefined) {
      progress.practiceScore = Number(practiceScore);
      progress.practiceCompleted = true;
      progress.practiceAttempts = (progress.practiceAttempts || 0) + 1;
    }
    if (hintsUsed !== undefined) {
      progress.hintsUsed = (progress.hintsUsed || 0) + Number(hintsUsed);
    }
    if (weakAreas && Array.isArray(weakAreas)) {
      progress.weakAreas = weakAreas;
    }
    if (activityDetails) {
      progress.activityDetails = { ...(progress.activityDetails || {}), ...activityDetails };
    }
    if (timeSpentSeconds) {
      progress.timeSpentSeconds = (progress.timeSpentSeconds || 0) + Number(timeSpentSeconds);
    }

    if (unlockAssessment || (progress.learningCompleted && progress.practiceCompleted)) {
      progress.assessmentUnlocked = true;
      if (progress.status === 'AVAILABLE' || progress.status === 'LEARNING' || progress.status === 'PRACTICE') {
        progress.status = 'TEST_AVAILABLE';
      }
    }

    // Process Test Completion & Competency Mastery
    const isTestPassed = req.body.testPassed === true ||
      activityDetails?.testPassed === true ||
      req.body.isMastered === true ||
      (req.body.testScore !== undefined && Number(req.body.testScore) >= 80);

    if (isTestPassed) {
      const finalScore = Number(req.body.testScore || activityDetails?.testScore || 100);
      progress.status = 'MASTERED';
      progress.progressPercentage = 100;
      progress.learningCompleted = true;
      progress.practiceCompleted = true;
      progress.assessmentUnlocked = true;
      progress.latestScore = finalScore;
      progress.highestScore = Math.max(progress.highestScore || 0, finalScore);
      progress.attempts = (progress.attempts || 0) + 1;
      progress.masteredAt = new Date();
      progress.needsIntervention = false;

      // Award stars to student
      try {
        await Student.findByIdAndUpdate(studentId, { $inc: { totalStars: 10 } });
      } catch (e) {}

      // Unlock next sequential competency in the same subject
      try {
        const nextComp = await Competency.findOne({
          subject: progress.subject,
          sequence: progress.sequence + 1,
          active: true,
        });

        if (nextComp) {
          let nextProg = await StudentProgress.findOne({
            studentId,
            competencyCode: nextComp.code,
          });

          if (!nextProg) {
            await StudentProgress.create({
              studentId,
              studentUid: progress.studentUid,
              subject: nextComp.subject,
              competencyCode: nextComp.code,
              competencyId: nextComp._id,
              sequence: nextComp.sequence,
              status: 'AVAILABLE',
            });
          } else if (nextProg.status === 'LOCKED') {
            nextProg.status = 'AVAILABLE';
            await nextProg.save();
          }
        }
      } catch (e) {
        console.warn('[ProgressController] Error unlocking next competency:', e);
      }
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Learning activity tracked successfully.',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
