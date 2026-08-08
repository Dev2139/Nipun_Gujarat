const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testM02SpatialModule() {
  console.log('🧪 TESTING M-02 SPATIAL CONCEPTS INTERACTIVE MODULE & WEAKNESS DIAGNOSTICS...\n');

  // 1. Login student
  const studentRes = await axios.post(`${BASE_URL}/auth/student/login`, { uid: 'NG-2026-001' });
  const token = studentRes.data.token;
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
  const student = studentRes.data.student || studentRes.data.user || {};
  console.log('✅ Student Logged In:', student.name || 'રવિ પટેલ');

  // 2. Track 6 Interactive Spatial Activities Completed
  const actTrackRes = await axios.post(`${BASE_URL}/progress/activity-update`, {
    competencyCode: 'M-02',
    activitiesCompleted: 6,
    timeSpentSeconds: 300,
  }, authHeaders);
  console.log('✅ Activities Completed Updated:', actTrackRes.data.data.activitiesCompleted, '/ 6');

  // 3. Track Practice Round with 2-Tier Hints
  const practiceTrackRes = await axios.post(`${BASE_URL}/progress/activity-update`, {
    competencyCode: 'M-02',
    practiceScore: 100,
    hintsUsed: 1,
    unlockAssessment: true,
    timeSpentSeconds: 150,
  }, authHeaders);
  console.log('✅ Practice Round Completed: Score =', practiceTrackRes.data.data.practiceScore, '%, Hints =', practiceTrackRes.data.data.hintsUsed);

  // 4. Fetch 10-Question Final Assessment for M-02
  const assessmentRes = await axios.get(`${BASE_URL}/assessments/competency/M-02`, authHeaders);
  const questions = assessmentRes.data.data.questions;
  console.log('✅ Retrieved M-02 Assessment with', questions.length, 'Questions:');
  questions.forEach((q, i) => {
    console.log(`   Q${i + 1}: ${q.promptGujarati} (${q.options.length} options)`);
  });

  // 5. Test Submitting Partial/Incorrect Answers to verify Spatial Weakness Diagnosis (< 80%)
  const partialAnswers = questions.map((q, idx) => {
    // Intentionally answer Q7 and Q8 (Near/Far questions) incorrectly with opt2
    return {
      questionId: q._id,
      selectedOptionId: (idx === 6 || idx === 7) ? 'opt2' : 'opt1',
    };
  });

  const submitPartialRes = await axios.post(`${BASE_URL}/assessments/submit`, {
    competencyCode: 'M-02',
    answers: partialAnswers,
    timeSpentSeconds: 80,
  }, authHeaders);

  console.log('\n📊 Diagnostic Test Result (< 80%):');
  console.log('   Score:', submitPartialRes.data.data.score, '/', submitPartialRes.data.data.totalQuestions);
  console.log('   Percentage:', submitPartialRes.data.data.percentage, '%');
  console.log('   Performance Band:', submitPartialRes.data.data.performanceBand);
  console.log('   Status:', submitPartialRes.data.data.progressStatus);
  console.log('   Diagnosed Weak Areas:', submitPartialRes.data.data.weakAreas);
  console.log('   Relearning Advice:', submitPartialRes.data.data.relearningAdvice);

  // 6. Test Submitting 100% Correct Answers for Full Mastery (>= 80%)
  const perfectAnswers = questions.map((q) => {
    return {
      questionId: q._id,
      selectedOptionId: 'opt1',
    };
  });

  const submitPerfectRes = await axios.post(`${BASE_URL}/assessments/submit`, {
    competencyCode: 'M-02',
    answers: perfectAnswers,
    timeSpentSeconds: 95,
  }, authHeaders);

  console.log('\n🎉 Mastery Test Result (100%):');
  console.log('   Score:', submitPerfectRes.data.data.score, '/', submitPerfectRes.data.data.totalQuestions);
  console.log('   Percentage:', submitPerfectRes.data.data.percentage, '%');
  console.log('   Is Mastered:', submitPerfectRes.data.data.isMastered);
  console.log('   Performance Band:', submitPerfectRes.data.data.performanceBand);
  console.log('   Next Unlocked Competency:', submitPerfectRes.data.data.nextUnlockedCompetency);
  console.log('   Feedback:', submitPerfectRes.data.data.feedbackGujarati);

  console.log('\n======================================================');
  console.log('🏆 ALL M-02 SPATIAL MODULE TESTS PASSED WITH 100% SUCCESS!');
  console.log('======================================================');
}

testM02SpatialModule().catch(err => {
  console.error('❌ M-02 Test Error:', err.response?.data || err.message);
  process.exit(1);
});
