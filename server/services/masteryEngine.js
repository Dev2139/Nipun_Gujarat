const Competency = require('../models/Competency');
const StudentProgress = require('../models/StudentProgress');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const Achievement = require('../models/Achievement');
const Student = require('../models/Student');

/**
 * Process an assessment submission through the Nipun Gujarat sequential mastery engine.
 */
exports.processAssessmentSubmission = async ({
  studentId,
  studentUid,
  competencyCode,
  assessmentId,
  score,
  percentage,
  answers,
  totalQuestions,
  correctAnswersCount,
  weakAreas = [],
}) => {
  const cleanCode = (competencyCode || '').toUpperCase().trim();
  const competency = await Competency.findOne({ code: cleanCode });
  if (!competency) {
    throw new Error(`Competency with code ${cleanCode} not found`);
  }

  // Find existing student progress or auto-initialize
  let progress = await StudentProgress.findOne({
    studentId,
    competencyCode: cleanCode,
  });

  if (!progress) {
    progress = await StudentProgress.create({
      studentId,
      studentUid: studentUid || 'STUDENT',
      subject: competency.subject,
      competencyCode: cleanCode,
      competencyId: competency._id,
      sequence: competency.sequence,
      status: 'AVAILABLE',
    });
  }

  // If first step or available for learning, unlock if marked locked
  if (progress.status === 'LOCKED' && competency.sequence === 1) {
    progress.status = 'AVAILABLE';
  }

  const attemptNumber = (progress.attempts || 0) + 1;
  const isMastered = percentage >= 80;
  
  let performanceBand = 'EMERGING';
  if (percentage >= 80) {
    performanceBand = 'MASTERED'; // 80-100% નિપુણ
  } else if (percentage >= 31) {
    performanceBand = 'DEVELOPING'; // 31-79% પ્રગતિશીલ
  } else {
    performanceBand = 'EMERGING'; // 0-30% ઉદયમાન
  }

  // Store assessment attempt
  const attempt = await AssessmentAttempt.create({
    studentId,
    studentUid: studentUid || progress.studentUid || 'STUDENT',
    competencyCode: cleanCode,
    competencyId: competency._id,
    assessmentId,
    attemptNumber,
    totalQuestions,
    correctAnswersCount,
    score,
    percentage,
    passed: isMastered,
    performanceBand,
    answers,
    completedAt: new Date(),
  });

  // Update progress record
  progress.attempts = attemptNumber;
  progress.latestScore = percentage;
  progress.lastAttemptAt = new Date();
  if (!progress.firstAttemptAt) {
    progress.firstAttemptAt = new Date();
  }

  if (percentage > progress.highestScore) {
    progress.highestScore = percentage;
  }

  if (isMastered) {
    // Cleared weaknesses upon mastery
    progress.weakAreas = [];
  } else if (weakAreas && weakAreas.length > 0) {
    progress.weakAreas = weakAreas;
  }

  let nextUnlockedCompetency = null;
  const newlyUnlockedAchievements = [];

  if (isMastered) {
    // Passed (>= 80%) -> Mark as MASTERED
    progress.status = 'MASTERED';
    progress.progressPercentage = 100;
    progress.masteredAt = new Date();
    progress.consecutiveFailures = 0;
    progress.needsIntervention = false;

    // Award Stars to Student
    await Student.findByIdAndUpdate(studentId, {
      $inc: { totalStars: 10 },
    });

    // Check & unlock next sequential competency in the same subject
    const nextCompetency = await Competency.findOne({
      subject: competency.subject,
      sequence: competency.sequence + 1,
      active: true,
    });

    if (nextCompetency) {
      let nextProgress = await StudentProgress.findOne({
        studentId,
        competencyCode: nextCompetency.code,
      });

      if (!nextProgress) {
        nextProgress = await StudentProgress.create({
          studentId,
          studentUid,
          subject: nextCompetency.subject,
          competencyCode: nextCompetency.code,
          competencyId: nextCompetency._id,
          sequence: nextCompetency.sequence,
          status: 'AVAILABLE',
        });
      } else if (nextProgress.status === 'LOCKED') {
        nextProgress.status = 'AVAILABLE';
        await nextProgress.save();
      }

      nextUnlockedCompetency = {
        code: nextCompetency.code,
        titleGujarati: nextCompetency.titleGujarati,
        titleEnglish: nextCompetency.titleEnglish,
      };
    }

    // Gamification: Check for badges
    const totalMastered = await StudentProgress.countDocuments({
      studentId,
      status: 'MASTERED',
    });

    if (totalMastered === 1) {
      const existing = await Achievement.findOne({ studentId, badgeKey: 'first_skill_mastered' });
      if (!existing) {
        const ach = await Achievement.create({
          studentId,
          badgeKey: 'first_skill_mastered',
          titleGujarati: 'પ્રથમ સિદ્ધિ ⭐',
          titleEnglish: 'First Skill Mastered',
          descriptionGujarati: 'તમે તમારી પ્રથમ ક્ષમતામાં ૮૦% કે તેથી વધુ ગુણ મેળવી નિપુણ બન્યા!',
          iconEmoji: '⭐',
        });
        newlyUnlockedAchievements.push(ach);
      }
    }

    const gujaratiMastered = await StudentProgress.countDocuments({
      studentId,
      subject: 'gujarati',
      status: 'MASTERED',
    });
    if (gujaratiMastered >= 3) {
      const existing = await Achievement.findOne({ studentId, badgeKey: 'gujarati_explorer' });
      if (!existing) {
        const ach = await Achievement.create({
          studentId,
          badgeKey: 'gujarati_explorer',
          titleGujarati: 'ગુજરાતી ભાષા વિજેતા 📖',
          titleEnglish: 'Gujarati Explorer',
          descriptionGujarati: 'ગુજરાતી વિષયમાં ૩ ક્ષમતાઓ પૂર્ણ કરી!',
          iconEmoji: '📖',
        });
        newlyUnlockedAchievements.push(ach);
      }
    }

    const mathMastered = await StudentProgress.countDocuments({
      studentId,
      subject: 'mathematics',
      status: 'MASTERED',
    });
    if (mathMastered >= 3) {
      const existing = await Achievement.findOne({ studentId, badgeKey: 'math_explorer' });
      if (!existing) {
        const ach = await Achievement.create({
          studentId,
          badgeKey: 'math_explorer',
          titleGujarati: 'ગણિત ગણીતજ્ઞ 🔢',
          titleEnglish: 'Math Explorer',
          descriptionGujarati: 'ગણિત વિષયમાં ૩ ક્ષમતાઓ પૂર્ણ કરી!',
          iconEmoji: '🔢',
        });
        newlyUnlockedAchievements.push(ach);
      }
    }
  } else {
    // Score < 80% -> RELEARN
    progress.status = 'RELEARN';
    progress.progressPercentage = percentage;
    progress.consecutiveFailures = (progress.consecutiveFailures || 0) + 1;

    // If student fails 2 or more times sequentially, trigger Teacher Intervention
    if (progress.consecutiveFailures >= 2) {
      progress.needsIntervention = true;
      progress.interventionReviewed = false;
    }
  }

  await progress.save();

  return {
    attempt,
    progress,
    isMastered,
    performanceBand,
    percentage,
    nextUnlockedCompetency,
    newlyUnlockedAchievements,
  };
};

/**
 * Initialize all competency progress records for a new student.
 */
exports.initializeStudentProgress = async (studentId, studentUid, startingPoint = 'FOUNDATIONAL') => {
  const allCompetencies = await Competency.find({ active: true }).sort({ subject: 1, sequence: 1 });

  const progressRecords = [];
  for (const comp of allCompetencies) {
    const isFirst = comp.sequence === 1;
    progressRecords.push({
      studentId,
      studentUid,
      subject: comp.subject,
      competencyCode: comp.code,
      competencyId: comp._id,
      sequence: comp.sequence,
      status: isFirst ? 'AVAILABLE' : 'LOCKED',
    });
  }

  await StudentProgress.insertMany(progressRecords);
};
