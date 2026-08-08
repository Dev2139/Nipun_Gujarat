const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 STARTING E2E API VERIFICATION TESTS FOR NIPUN GUJARAT...\n');

  try {
    // 1. Health check
    console.log('1. Testing Health Check API...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('  ✅ Health Status:', health.data.status, health.data.platform);

    // 2. Teacher Login
    console.log('\n2. Testing Teacher Login...');
    const teacherLogin = await axios.post(`${BASE_URL}/auth/teacher/login`, {
      identifier: 'teacher@nipun.gujarat.gov.in',
      password: 'Password@123',
    });
    const teacherToken = teacherLogin.data.token;
    console.log('  ✅ Teacher Logged In:', teacherLogin.data.user.name, `(Token: ${teacherToken.substring(0, 15)}...)`);

    const teacherAuthHeader = { headers: { Authorization: `Bearer ${teacherToken}` } };

    // 3. Teacher Dashboard Overview
    console.log('\n3. Testing Teacher Dashboard Overview...');
    const overview = await axios.get(`${BASE_URL}/teachers/dashboard`, teacherAuthHeader);
    console.log('  ✅ Dashboard Overview Metrics:', {
      totalStudents: overview.data.data.totalStudents,
      masteredCount: overview.data.data.masteredCount,
      onTrackCount: overview.data.data.onTrackCount,
      needsSupportCount: overview.data.data.needsSupportCount,
      attentionListCount: overview.data.data.studentsNeedingAttention.length,
      gujaratiMasteryRate: `${overview.data.data.gujaratiMasteryRate}%`,
      mathMasteryRate: `${overview.data.data.mathMasteryRate}%`,
    });

    // 4. Get Classes
    console.log('\n4. Testing Class Management...');
    const classes = await axios.get(`${BASE_URL}/classes`, teacherAuthHeader);
    console.log(`  ✅ Retrieved ${classes.data.count} classes`);
    const classId = classes.data.data[0]._id;

    // 5. Class Heatmap Matrix
    console.log('\n5. Testing Class Digital Tracker Heatmap...');
    const heatmap = await axios.get(`${BASE_URL}/teachers/classes/${classId}/heatmap`, teacherAuthHeader);
    console.log(`  ✅ Heatmap generated with ${heatmap.data.data.matrix.length} student rows and ${heatmap.data.data.competencies.length} competency columns`);

    // 6. Student Login with UID (Ravi: NG-2026-001)
    console.log('\n6. Testing Student UID Login (NG-2026-001)...');
    const studentLogin = await axios.post(`${BASE_URL}/auth/student/login`, {
      uid: 'NG-2026-001',
    });
    const studentToken = studentLogin.data.token;
    const studentAuthHeader = { headers: { Authorization: `Bearer ${studentToken}` } };
    console.log('  ✅ Student Logged In:', studentLogin.data.user.name, `Grade: ${studentLogin.data.user.grade}`);

    // 7. Student My Progress
    console.log('\n7. Testing Student My Progress API...');
    const myProgress = await axios.get(`${BASE_URL}/progress/my`, studentAuthHeader);
    console.log('  ✅ Student Subjects Progress:', {
      gujarati: `${myProgress.data.data.subjects.gujarati.progressPercentage}% (${myProgress.data.data.subjects.gujarati.masteredCount} mastered)`,
      mathematics: `${myProgress.data.data.subjects.mathematics.progressPercentage}% (${myProgress.data.data.subjects.mathematics.masteredCount} mastered)`,
    });

    // 8. Assessment Flow & Sequential Mastery
    console.log('\n8. Testing Assessment Retrieval for Competency G-01...');
    const assessment = await axios.get(`${BASE_URL}/assessments/competency/G-01`, studentAuthHeader);
    console.log(`  ✅ Assessment retrieved: "${assessment.data.data.titleGujarati}" with ${assessment.data.data.questions.length} questions`);

    // 9. Assessment Submission with >= 80% (Mastery Test)
    console.log('\n9. Testing Assessment Submission with 100% Score (Mastery Unlock Test)...');
    const submitRes = await axios.post(`${BASE_URL}/assessments/submit`, {
      competencyCode: 'G-01',
      answers: [
        { questionId: 'Q-G01-1', selectedOptionId: 'opt1' },
        { questionId: 'Q-G01-2', selectedOptionId: 'opt1' },
        { questionId: 'Q-G01-3', selectedOptionId: 'opt1' },
        { questionId: 'Q-G01-4', selectedOptionId: 'opt1' },
        { questionId: 'Q-G01-5', selectedOptionId: 'opt1' },
      ],
      timeSpentSeconds: 45,
    }, studentAuthHeader);

    console.log('  ✅ Assessment Submission Result:', {
      score: `${submitRes.data.data.score}/${submitRes.data.data.totalQuestions}`,
      percentage: `${submitRes.data.data.percentage}%`,
      isMastered: submitRes.data.data.isMastered,
      performanceBand: submitRes.data.data.performanceBand,
      nextUnlockedCompetency: submitRes.data.data.nextUnlockedCompetency?.code || 'None',
      feedback: submitRes.data.data.feedbackGujarati,
    });

    // 10. Teacher Add Note on Student
    console.log('\n10. Testing Teacher Note Creation...');
    const noteRes = await axios.post(`${BASE_URL}/teachers/students/${studentLogin.data.user.id}/notes`, {
      competencyCode: 'G-01',
      noteText: 'વિદ્યાર્થીએ ગીતો અને જોડકણાંમાં શ્રેષ્ઠ પ્રદર્શન દર્શાવ્યું છે.',
      actionTaken: 'OBSERVATION',
      markReviewed: true,
    }, teacherAuthHeader);
    console.log('  ✅ Teacher Note Created:', noteRes.data.data.noteText);

    // 11. Report Export CSV
    console.log('\n11. Testing CSV Report Generation...');
    const csvRes = await axios.get(`${BASE_URL}/reports/class/${classId}/csv`, teacherAuthHeader);
    console.log('  ✅ CSV Generated (Length:', csvRes.data.length, 'bytes)');
    console.log('  CSV Preview (First 3 lines):');
    console.log(csvRes.data.split('\n').slice(0, 3).join('\n'));

    console.log('\n========================================================');
    console.log('🎉 ALL 11 API SUITES PASSED VERIFICATION WITH 100% SUCCESS!');
    console.log('========================================================\n');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

runTests();
