import api from './api';

/**
 * Module 1 Progress & Learning Journey State Manager
 * Handles local persistence, stage gating, unlocking rules, and backend API sync.
 */

const STORAGE_KEY = 'nipun_math_module_01_progress_v2';

export const INITIAL_MODULE_1_STATE = {
  moduleId: 'M-01',
  competencyCode: 'M-01',
  competency: 'સૌથી નાની અને સૌથી મોટી વસ્તુઓની સરખામણી કરે છે',
  currentStage: 'video', // 'video' | 'learning' | 'practice' | 'test' | 'completed'
  status: 'NOT_STARTED', // 'NOT_STARTED' | 'VIDEO_IN_PROGRESS' | 'LEARNING' | 'PRACTICE' | 'READY_FOR_TEST' | 'TEST_IN_PROGRESS' | 'PASSED' | 'COMPLETED'

  // Video Stage
  videoCompleted: false,
  videoWatchedPercentage: 0,

  // Learning Stage (7 Steps)
  learningCompleted: false,
  currentLearningStep: 1,
  learningStepsCompleted: [], // e.g. [1, 2, 3, 4, 5, 6, 7]
  totalLearningSteps: 7,

  // Practice Stage (10 Activities)
  practiceCompleted: false,
  practiceScore: 0,
  practiceAccuracy: 0,
  practiceAttempts: 0,
  activitiesCompleted: 0,
  totalPracticeActivities: 10,
  practiceHistory: [],

  // Test Stage (10 Questions)
  testUnlocked: false,
  testCompleted: false,
  testScore: 0,
  testTotal: 10,
  latestTestScore: 0,
  bestTestScore: 0,
  testAttempts: 0,
  passingScore: 80, // 80% passing criteria
  passed: false,

  // Unlocking
  nextModuleUnlocked: false,
  nextModuleCode: 'M-02',
  completedAt: null,
};

export const getSavedModule1Progress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...INITIAL_MODULE_1_STATE, ...parsed };
    }
  } catch (e) {
    console.warn('[Module 1 State] Error reading local state:', e);
  }
  return { ...INITIAL_MODULE_1_STATE };
};

export const saveModule1Progress = (patch) => {
  try {
    const current = getSavedModule1Progress();
    const updated = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    // Calculate stage transitions and status
    if (updated.passed) {
      updated.status = 'COMPLETED';
      updated.nextModuleUnlocked = true;
      updated.currentStage = 'completed';
    } else if (updated.testCompleted) {
      updated.status = updated.passed ? 'PASSED' : 'PRACTICE';
    } else if (updated.practiceCompleted) {
      updated.status = 'READY_FOR_TEST';
      updated.testUnlocked = true;
    } else if (updated.learningCompleted) {
      updated.status = 'PRACTICE';
    } else if (updated.videoCompleted) {
      updated.status = 'LEARNING';
    } else if (updated.videoWatchedPercentage > 0) {
      updated.status = 'VIDEO_IN_PROGRESS';
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also persist unlocked module flag in global storage for M-02
    if (updated.nextModuleUnlocked) {
      localStorage.setItem('nipun_math_M-02_unlocked', 'true');
    }

    // Background sync with API
    syncModule1ProgressWithBackend(updated);

    return updated;
  } catch (e) {
    console.warn('[Module 1 State] Error saving local state:', e);
    return getSavedModule1Progress();
  }
};

export const syncModule1ProgressWithBackend = async (state) => {
  try {
    await api.post('/progress/activity-update', {
      competencyCode: 'M-01',
      videoWatched: state.videoCompleted,
      videoWatchedPercentage: state.videoWatchedPercentage,
      activitiesCompleted: state.learningStepsCompleted.length + state.activitiesCompleted,
      practiceScore: state.practiceAccuracy || state.practiceScore,
      unlockAssessment: state.practiceCompleted,
      hintsUsed: 0,
      activityDetails: {
        learningCompleted: state.learningCompleted,
        learningSteps: state.learningStepsCompleted,
        practiceCompleted: state.practiceCompleted,
        practiceAccuracy: state.practiceAccuracy,
        testPassed: state.passed,
        testScore: state.testScore,
        nextModuleUnlocked: state.nextModuleUnlocked,
      }
    });
  } catch (err) {
    // Graceful offline fallback
    console.debug('[Module 1 State] Backend sync deferred (offline/local mode active)');
  }
};

export const resetModule1Progress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return { ...INITIAL_MODULE_1_STATE };
};
