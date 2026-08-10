import api from './api';

/**
 * Module 2 Progress & Spatial Concepts State Manager (M-02)
 * Handles sub-skill concept tracking, local storage persistence, and backend API sync.
 */

const STORAGE_KEY = 'nipun_math_module_02_progress_v2';

export const INITIAL_MODULE_2_STATE = {
  moduleId: 'M-02',
  competencyCode: 'M-02',
  competency: 'ઉપર-નીચે, ની ઉપર, ની નીચે, ઊંચે, નજીક-દૂરની સંકલ્પના સમજે છે',
  currentStage: 'intro', // 'intro' | 'guided' | 'practice' | 'minicheck' | 'test' | 'completed' | 'relearn'

  // Sub-Skill Performance Metrics
  concepts: {
    aboveBelow: { score: 0, attempts: 0, label: 'ઉપર / નીચે' },
    relativeAboveBelow: { score: 0, attempts: 0, label: 'ની ઉપર / ની નીચે' },
    highLow: { score: 0, attempts: 0, label: 'ઊંચે / નીચે' },
    nearFar: { score: 0, attempts: 0, label: 'નજીક / દૂર' },
  },

  // Guided Learning (10 Activities)
  guidedCompleted: false,
  currentGuidedActivity: 1,
  guidedActivitiesDone: [], // [1, 2, ..., 10]
  totalGuidedActivities: 10,

  // Practice Stage (10 Activities)
  practiceCompleted: false,
  practiceScore: 0,
  practiceAccuracy: 0,
  practiceAttempts: 0,
  hintsUsed: 0,

  // Mini-Check Diagnostic (5 Questions)
  miniCheckCompleted: false,
  miniCheckScore: 0,
  weakConcepts: [], // e.g. ['nearFar', 'relativeAboveBelow']

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

  // Unlocking Next Module (M-03)
  nextModuleUnlocked: false,
  nextModuleCode: 'M-03',
  completedAt: null,
};

export const getSavedModule2Progress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...INITIAL_MODULE_2_STATE, ...parsed };
    }
  } catch (e) {
    console.warn('[Module 2 State] Error reading local state:', e);
  }
  return { ...INITIAL_MODULE_2_STATE };
};

export const saveModule2Progress = (patch) => {
  try {
    const current = getSavedModule2Progress();
    const updated = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (updated.passed) {
      updated.status = 'COMPLETED';
      updated.nextModuleUnlocked = true;
      localStorage.setItem('nipun_math_M-03_unlocked', 'true');
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
    syncModule2ProgressWithBackend(updated);

    return updated;
  } catch (e) {
    console.warn('[Module 2 State] Error saving state:', e);
    return getSavedModule2Progress();
  }
};

export const syncModule2ProgressWithBackend = async (state) => {
  try {
    await api.post('/progress/activity-update', {
      competencyCode: 'M-02',
      videoWatched: true,
      videoWatchedPercentage: 100,
      activitiesCompleted: state.guidedActivitiesDone.length + (state.practiceCompleted ? 10 : 0),
      practiceScore: state.practiceAccuracy || state.practiceScore,
      unlockAssessment: state.practiceCompleted,
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
    console.debug('[Module 2 State] Backend sync deferred (offline mode active)');
  }
};

export const resetModule2Progress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return { ...INITIAL_MODULE_2_STATE };
};
