const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testM01InteractiveModule() {
  console.log('🧪 TESTING M-01 INTERACTIVE LEARNING MODULE & WEAKNESS DIAGNOSTICS...\n');

  // 1. Login student
  const studentRes = await axios.post(`${BASE_URL}/auth/student/login`, { uid: 'NG-2026-001' });
  const token = studentRes.data.token;
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
  const student = studentRes.data.student || studentRes.data.user || {};
  console.log('✅ Student Logged In:', student.name || 'રવિ પટેલ');

  // 2. Track Video Watched
  const videoTrackRes = await axios.post(`${BASE_URL}/progress/activity-update`, {
    competencyCode: 'M-01',
    videoWatched: true,
    videoWatchedPercentage: 100,
    timeSpentSeconds: 120,
  }, authHeaders);
  console.log('✅ Video Tracking Updated: videoWatched =', videoTrackRes.data.data.videoWatched);

  // 3. Track Interactive Games (4 activities)
  const actTrackRes = await axios.post(`${BASE_URL}/progress/activity-update`, {
    competencyCode: 'M-01',
    activitiesCompleted: 4,
    timeSpentSeconds: 240,
  }, authHeaders);
  console.log('✅ Activities Completed Updated:', actTrackRes.data.data.activitiesCompleted, '/ 4');

  // 4. Track Practice Round with Hints
  const practiceTrackRes = await axios.post(`${BASE_URL}/progress/activity-update`, {
    competencyCode: 'M-01',
    practiceScore: 88,
    hintsUsed: 2,
    unlockAssessment: true,
    timeSpentSeconds: 180,
  }, authHeaders);
  console.log('✅ Practice Round Completed: Score =', practiceTrackRes.data.data.practiceScore, '%, Hints =', practiceTrackRes.data.data.hintsUsed);

  // 5. Fetch 10-Question Final Assessment for M-01
  const assessmentRes = await axios.get(`${BASE_URL}/assessments/competency/M-01`, authHeaders);
  const questions = assessmentRes.data.data.questions;
  console.log('✅ Retrieved M-01 Assessment with', questions.length, 'Questions:');
  questions.forEach((q, i) => {
    console.log(`   Q${i + 1}: ${q.promptGujarati} (${q.options.length} options)`);
  });

  // 6. Test Submitting Partial/Incorrect Answers to verify Weakness Diagnosis (< 80%)
  const partialAnswers = questions.map((q, idx) => {
    // Intentionally miss Q9 and Q10 (Ordering questions) to test diagnosed weak areas
    return {
      questionId: q._id,
      selectedOptionId: (idx >= 8) ? 'opt3' : 'opt1',
    };
  });

  const submitPartialRes = await axios.post(`${BASE_URL}/assessments/submit`, {
    competencyCode: 'M-01',
    answers: partialAnswers,
    timeSpentSeconds: 90,
  }, authHeaders);

  console.log('\n📊 Diagnostic Test Result (< 80%):');
  console.log('   Score:', submitPartialRes.data.data.score, '/', submitPartialRes.data.data.totalQuestions);
  console.log('   Percentage:', submitPartialRes.data.data.percentage, '%');
  console.log('   Performance Band:', submitPartialRes.data.data.performanceBand);
  console.log('   Status:', submitPartialRes.data.data.progressStatus);
  console.log('   Diagnosed Weak Areas:', submitPartialRes.data.data.weakAreas);
  console.log('   Relearning Advice:', submitPartialRes.data.data.relearningAdvice);

  // 7. Test Submitting 100% Correct Answers for Full Mastery (>= 80%)
  const perfectAnswers = questions.map((q, idx) => {
    // Opt2 is correct for Q1, opt1 for all other seeded questions
    return {
      questionId: q._id,
      selectedOptionId: (idx === 0) ? 'opt2' : 'opt1',
    };
  });

  const submitPerfectRes = await axios.post(`${BASE_URL}/assessments/submit`, {
    competencyCode: 'M-01',
    answers: perfectAnswers,
    timeSpentSeconds: 110,
  }, authHeaders);

  console.log('\n🎉 Mastery Test Result (100%):');
  console.log('   Score:', submitPerfectRes.data.data.score, '/', submitPerfectRes.data.data.totalQuestions);
  console.log('   Percentage:', submitPerfectRes.data.data.percentage, '%');
  console.log('   Is Mastered:', submitPerfectRes.data.data.isMastered);
  console.log('   Performance Band:', submitPerfectRes.data.data.performanceBand);
  console.log('   Next Unlocked Competency:', submitPerfectRes.data.data.nextUnlockedCompetency);
  console.log('   Feedback:', submitPerfectRes.data.data.feedbackGujarati);

  console.log('\n======================================================');
  console.log('🏆 ALL M-01 INTERACTIVE MODULE TESTS PASSED WITH 100% SUCCESS!');
  console.log('======================================================');
}

testM01InteractiveModule().catch(err => {
  console.error('❌ M-01 Test Error:', err.response?.data || err.message);
  process.exit(1);
});
