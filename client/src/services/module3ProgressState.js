import api from './api';

/**
 * Module 3 Progress & Number Sense 1-5 State Manager (M-03)
 * Handles sub-skill concept tracking, local storage persistence, and backend API sync.
 */

const STORAGE_KEY = 'nipun_math_module_03_progress_v2';

export const INITIAL_MODULE_3_STATE = {
  moduleId: 'M-03',
  competencyCode: 'M-03',
  competency: '૧ થી ૫ સુધીની સંખ્યાઓ અને સરળ સરવાળા-બાદબાકી',
  currentStage: 'video', // 'video' | 'explore' | 'activities' | 'addition' | 'subtraction' | 'mixed' | 'practice' | 'minicheck' | 'test' | 'completed' | 'relearn'

  // Video Tracking
  videoStarted: false,
  videoCompleted: false,
  videoWatchedPercentage: 0,

  // Sub-Skill Performance Metrics
  concepts: {
    numberRecognition: { score: 0, attempts: 0, label: 'અંક ઓળખ (૧-૫)' },
    counting: { score: 0, attempts: 0, label: 'ગણતરી (Counting)' },
    sequence: { score: 0, attempts: 0, label: 'સંખ્યા ક્રમ (Sequence)' },
    addition: { score: 0, attempts: 0, label: 'સરવાળો (Addition <= 5)' },
    subtraction: { score: 0, attempts: 0, label: 'બાદબાકી (Subtraction >= 0)' },
  },

  // Guided Activities Completed
  guidedActivitiesDone: [], // [1, 2, ..., 10]
  guidedCompleted: false,

  // Practice Stage (12 Questions)
  practiceCompleted: false,
  practiceScore: 0,
  practiceAccuracy: 0,
  hintsUsed: 0,

  // Mini-Check Diagnostic (6 Questions)
  miniCheckCompleted: false,
  miniCheckScore: 0,
  weakConcepts: [], // e.g. ['addition', 'sequence']

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

  // Unlocking Next Module (M-04)
  nextModuleUnlocked: false,
  nextModuleCode: 'M-04',
  completedAt: null,
};

export const getSavedModule3Progress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...INITIAL_MODULE_3_STATE, ...parsed };
    }
  } catch (e) {
    console.warn('[Module 3 State] Error reading local state:', e);
  }
  return { ...INITIAL_MODULE_3_STATE };
};

export const saveModule3Progress = (patch) => {
  try {
    const current = getSavedModule3Progress();
    const updated = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (updated.passed) {
      updated.status = 'COMPLETED';
      updated.nextModuleUnlocked = true;
      localStorage.setItem('nipun_math_M-04_unlocked', 'true');
    } else if (updated.testCompleted) {
      updated.status = updated.passed ? 'PASSED' : 'RELEARN';
    } else if (updated.practiceCompleted) {
      updated.status = 'TEST_AVAILABLE';
      updated.testUnlocked = true;
    } else if (updated.guidedCompleted) {
      updated.status = 'PRACTICE';
    } else {
      updated.status = 'LEARNING';
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Background sync with API
    syncModule3ProgressWithBackend(updated);

    return updated;
  } catch (e) {
    console.warn('[Module 3 State] Error saving state:', e);
    return getSavedModule3Progress();
  }
};

export const syncModule3ProgressWithBackend = async (state) => {
  try {
    await api.post('/progress/activity-update', {
      competencyCode: 'M-03',
      videoWatched: state.videoCompleted,
      videoWatchedPercentage: state.videoWatchedPercentage || 100,
      activitiesCompleted: state.guidedActivitiesDone.length + (state.practiceCompleted ? 12 : 0),
      practiceScore: state.practiceAccuracy || state.practiceScore,
      unlockAssessment: state.practiceCompleted,
      testPassed: state.passed,
      testScore: state.testScore,
      isMastered: state.passed,
      hintsUsed: state.hintsUsed || 0,
      weakAreas: state.weakConcepts || [],
      activityDetails: {
        guidedCompleted: state.guidedCompleted,
        guidedActivities: state.guidedActivitiesDone,
        practiceCompleted: state.practiceCompleted,
        practiceAccuracy: state.practiceAccuracy,
        miniCheckScore: state.miniCheckScore,
        conceptsBreakdown: state.concepts,
        testPassed: state.passed,
        testScore: state.testScore,
        nextModuleUnlocked: state.nextModuleUnlocked,
      }
    });
  } catch (err) {
    console.debug('[Module 3 State] Backend sync deferred (offline mode active)');
  }
};

export const resetModule3Progress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return { ...INITIAL_MODULE_3_STATE };
};
