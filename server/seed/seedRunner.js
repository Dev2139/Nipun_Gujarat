require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Models
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const Competency = require('../models/Competency');
const LearningContent = require('../models/LearningContent');
const Question = require('../models/Question');
const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const StudentProgress = require('../models/StudentProgress');
const TeacherNote = require('../models/TeacherNote');
const Achievement = require('../models/Achievement');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nipun_gujarat';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('Clearing existing collections...');
    await Promise.all([
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Class.deleteMany({}),
      Subject.deleteMany({}),
      Grade.deleteMany({}),
      Competency.deleteMany({}),
      LearningContent.deleteMany({}),
      Question.deleteMany({}),
      Assessment.deleteMany({}),
      AssessmentAttempt.deleteMany({}),
      StudentProgress.deleteMany({}),
      TeacherNote.deleteMany({}),
      Achievement.deleteMany({}),
    ]);
    console.log('✅ Collections cleared');

    // 1. Seed Subjects
    console.log('Seeding Subjects...');
    const subjects = await Subject.insertMany([
      {
        key: 'gujarati',
        nameGujarati: 'ગુજરાતી (ભાષા)',
        nameEnglish: 'Gujarati Language',
        icon: 'BookOpen',
        color: '#10b981',
        descriptionGujarati: 'પાયાની સાક્ષરતા: મૌખિક ભાષા, મૂળાક્ષરો, કાના-માત્રા, જોડાક્ષરો અને વાચન અર્થગ્રહણ',
        descriptionEnglish: 'Foundational Literacy (FLN): Oral language, phonics, matras, and comprehension',
        totalCompetencies: 8,
        active: true,
      },
      {
        key: 'mathematics',
        nameGujarati: 'ગણિત (સંખ્યાજ્ઞાન)',
        nameEnglish: 'Mathematics',
        icon: 'Calculator',
        color: '#3b82f6',
        descriptionGujarati: 'પાયાનું સંખ્યાજ્ઞાન: તુલના, ૧-૧૦૦ સંખ્યાઓ, સરવાળા, બાદબાકી અને ઘડિયા',
        descriptionEnglish: 'Foundational Numeracy (FLN): Number sense, operations, and arithmetic',
        totalCompetencies: 7,
        active: true,
      }
    ]);
    console.log(`✅ Seeded ${subjects.length} subjects`);

    // 2. Seed Grades
    console.log('Seeding Grades...');
    const grades = await Grade.insertMany([
      {
        key: 'balvatika',
        nameGujarati: 'બાલવાટિકા',
        nameEnglish: 'Balvatika (Pre-primary)',
        levelOrder: 1,
        ageGroup: '૫ થી ૬ વર્ષ',
        active: true,
      },
      {
        key: 'grade_1',
        nameGujarati: 'ધોરણ ૧',
        nameEnglish: 'Grade 1',
        levelOrder: 2,
        ageGroup: '૬ થી ૭ વર્ષ',
        active: true,
      },
      {
        key: 'grade_2',
        nameGujarati: 'ધોરણ ૨',
        nameEnglish: 'Grade 2',
        levelOrder: 3,
        ageGroup: '૭ થી ૮ વર્ષ',
        active: true,
      }
    ]);
    console.log(`✅ Seeded ${grades.length} grades`);

    // 3. Load Curriculum & Assessment JSON
    const gujaratiData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/gujarati.json'), 'utf-8'));
    const mathData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/mathematics.json'), 'utf-8'));
    const allCompetencyData = [...gujaratiData, ...mathData];

    let mathAssessments = [];
    if (fs.existsSync(path.join(__dirname, 'data/assessments_math_30.json'))) {
      mathAssessments = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/assessments_math_30.json'), 'utf-8'));
    }
    const mathAssessmentMap = new Map();
    for (const a of mathAssessments) {
      mathAssessmentMap.set(a.competencyCode, a);
    }

    console.log('Seeding Competencies, Questions, and Assessments...');
    const competencyDocMap = new Map();

    for (const item of allCompetencyData) {
      const comp = await Competency.create({
        code: item.code,
        subject: item.subject,
        grade: item.stage || item.grade || 'Balvatika',
        stage: item.stage || 'Balvatika',
        trackerColumnNumber: item.sequence,
        sequence: item.sequence,
        titleGujarati: item.titleGujarati,
        titleEnglish: item.titleEnglish,
        descriptionGujarati: item.descriptionGujarati,
        descriptionEnglish: item.descriptionEnglish || '',
        prerequisiteCompetencyCode: item.sequence > 1 ? (item.subject === 'gujarati' ? `G-0${item.sequence-1}` : `M-${String(item.sequence-1).padStart(2, '0')}`) : null,
        version: '2026-27',
        active: true,
      });

      competencyDocMap.set(item.code, comp);

      // Create Learning Content
      if (item.learningContent) {
        await LearningContent.create({
          competencyCode: item.code,
          competencyId: comp._id,
          headlineGujarati: item.learningContent.headlineGujarati,
          instructionGujarati: item.learningContent.instructionGujarati,
          soundPhonicsText: item.learningContent.soundPhonicsText,
          letterOrSymbol: item.learningContent.letterOrSymbol,
          mediaEmojiOrIcon: item.learningContent.mediaEmojiOrIcon || '📖',
          examples: item.learningContent.examples || [],
          conceptCard: item.learningContent.conceptCard || {},
          interactivePractice: item.learningContent.interactivePractice || [],
          interactiveManipulativeConfig: item.learningContent.interactiveManipulativeConfig || {},
          relearningGuide: {
            focusPointsGujarati: [
              `ધ્યાનપૂર્વક '${comp.titleGujarati}' નો અભ્યાસ ફરીથી કરો.`,
              'ઉદાહરણો સાંભળો અને બોલવાની પ્રેક્ટિસ કરો.',
              'શિક્ષકની મદદ લઈને સવાલ-જવાબ પૂછો.'
            ],
            encouragementMessageGujarati: 'ચિંતા કરશો નહીં! ફરીથી શીખીને તમે જરૂર નિપુણ બનશો ⭐',
            relearnSteps: ['પાઠ ફરીથી જુઓ 📖', 'અવાજ સાંભળો 🔊', 'મહાવરો કરો ✏️', 'ફરી કસોટી આપો 🎯']
          }
        });
      }

      // Create Questions and Assessment
      const questionIds = [];
      const mathAss = mathAssessmentMap.get(item.code);

      if (mathAss && mathAss.questions && mathAss.questions.length > 0) {
        for (const q of mathAss.questions) {
          const qDoc = await Question.create({
            questionId: q.questionId,
            competencyCode: item.code,
            questionType: 'MCQ',
            promptGujarati: q.promptGujarati,
            options: q.options,
            correctAnswerId: q.correctOptionId,
            explanationGujarati: q.explanationGujarati,
          });
          questionIds.push(qDoc._id);
        }

        await Assessment.create({
          competencyCode: item.code,
          competencyId: comp._id,
          titleGujarati: mathAss.titleGujarati,
          titleEnglish: mathAss.titleEnglish,
          passingPercentage: 80,
          questions: questionIds,
          totalQuestions: questionIds.length,
        });
      } else if (item.questions && item.questions.length > 0) {
        for (const q of item.questions) {
          const qDoc = await Question.create({
            questionId: q.questionId,
            competencyCode: item.code,
            questionType: q.questionType,
            promptGujarati: q.promptGujarati,
            options: q.options,
            correctAnswerId: q.correctAnswerId,
            explanationGujarati: q.explanationGujarati,
          });
          questionIds.push(qDoc._id);
        }

        await Assessment.create({
          competencyCode: item.code,
          competencyId: comp._id,
          titleGujarati: `${item.titleGujarati} - મૂલ્યાંકન કસોટી`,
          titleEnglish: `${item.titleEnglish} - Assessment Quiz`,
          passingPercentage: 80,
          questions: questionIds,
          totalQuestions: questionIds.length,
        });
      }
    }

    // Link Prerequisite Competency IDs
    for (const [code, compDoc] of competencyDocMap.entries()) {
      if (compDoc.prerequisiteCompetencyCode && competencyDocMap.has(compDoc.prerequisiteCompetencyCode)) {
        compDoc.prerequisiteCompetencyId = competencyDocMap.get(compDoc.prerequisiteCompetencyCode)._id;
        await compDoc.save();
      }
    }
    console.log(`✅ Seeded ${competencyDocMap.size} competencies with interactive lessons and assessment questions`);

    // 4. Seed Initial Teacher, Classes and Students
    const initialData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/initial_users.json'), 'utf-8'));

    console.log('Seeding Teacher Account...');
    const teacherData = initialData.teachers[0];
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(teacherData.password, salt);

    const teacher = await Teacher.create({
      name: teacherData.name,
      email: teacherData.email,
      passwordHash,
      teacherId: teacherData.teacherId,
      schoolName: teacherData.schoolName,
      schoolCode: teacherData.schoolCode,
      taluka: teacherData.taluka,
      district: teacherData.district,
      role: 'Teacher',
    });
    console.log(`✅ Seeded Teacher: ${teacher.name} (${teacher.email})`);

    console.log('Seeding Classes...');
    const classDocs = [];
    for (const cls of initialData.classes) {
      const classDoc = await Class.create({
        name: cls.name,
        grade: cls.grade,
        section: cls.section,
        academicYear: '2026-27',
        teacherId: teacher._id,
        schoolName: teacher.schoolName,
        studentCount: 0,
      });
      classDocs.push(classDoc);
      teacher.assignedClasses.push(classDoc._id);
    }
    await teacher.save();
    console.log(`✅ Seeded ${classDocs.length} classes`);

    console.log('Seeding Students and Initial Learning Progressions...');
    const allCompetencies = await Competency.find({ active: true }).sort({ subject: 1, sequence: 1 });

    const studentDocs = [];
    for (let i = 0; i < initialData.students.length; i++) {
      const st = initialData.students[i];
      const targetClass = classDocs[st.classIndex] || classDocs[1];

      const student = await Student.create({
        uid: st.uid,
        name: st.name,
        gender: st.gender,
        grade: st.grade,
        section: st.section,
        schoolName: teacher.schoolName,
        classId: targetClass._id,
        teacherId: teacher._id,
        profileImage: `avatar-${(i % 6) + 1}`,
        active: true,
        startingPoint: 'FOUNDATIONAL',
        streakDays: (i % 4) + 1,
        totalStars: (i * 3) + 5,
      });

      targetClass.studentCount += 1;
      await targetClass.save();
      studentDocs.push(student);

      // Seed StudentProgress across all competencies with realistic state diversity for demonstration:
      // Ravi: High progression in Gujarati (Mastered G-01 to G-03, Relearn G-04), Math (Mastered M-01 to M-02, Learning M-03)
      // Krisha: Advanced (Mastered G-01 to G-05, Mastered M-01 to M-04)
      // Aarav: Needs Support (Mastered G-01, Relearning G-02 with multiple attempts, Mastered M-01, Relearning M-02)
      for (const comp of allCompetencies) {
        let status = 'LOCKED';
        let attempts = 0;
        let highestScore = 0;
        let latestScore = 0;
        let consecutiveFailures = 0;
        let learningCompleted = false;
        let practiceCompleted = false;
        let assessmentUnlocked = false;
        let needsIntervention = false;

        if (comp.sequence === 1) {
          status = 'AVAILABLE';
        }

        // Student-specific profile simulation
        if (student.uid === 'NG-2026-002') {
          // Krisha (High Master)
          if (comp.subject === 'gujarati' && comp.sequence <= 4) {
            status = 'MASTERED';
            attempts = 1;
            highestScore = 100;
            latestScore = 100;
            learningCompleted = true;
            practiceCompleted = true;
            assessmentUnlocked = true;
          } else if (comp.subject === 'gujarati' && comp.sequence === 5) {
            status = 'AVAILABLE';
          }

          if (comp.subject === 'mathematics' && comp.sequence <= 3) {
            status = 'MASTERED';
            attempts = 1;
            highestScore = 100;
            latestScore = 100;
            learningCompleted = true;
            practiceCompleted = true;
            assessmentUnlocked = true;
          } else if (comp.subject === 'mathematics' && comp.sequence === 4) {
            status = 'AVAILABLE';
          }
        } else if (student.uid === 'NG-2026-001') {
          // Ravi (NG-2026-001): All lessons open & unlocked for testing and review
          if (comp.sequence <= 2) {
            status = 'MASTERED';
            attempts = 1;
            highestScore = 100;
            latestScore = 100;
            learningCompleted = true;
            practiceCompleted = true;
            assessmentUnlocked = true;
          } else {
            status = 'AVAILABLE';
            attempts = 0;
            highestScore = 0;
            latestScore = 0;
            learningCompleted = true;
            practiceCompleted = true;
            assessmentUnlocked = true;
          }
        } else if (student.uid === 'NG-2026-003') {
          // Aarav (Needs Teacher Attention)
          if (comp.subject === 'gujarati') {
            if (comp.sequence === 1) {
              status = 'RELEARN';
              attempts = 3;
              highestScore = 40;
              latestScore = 20;
              consecutiveFailures = 3;
              needsIntervention = true;
              learningCompleted = true;
              practiceCompleted = true;
              assessmentUnlocked = true;
            }
          }
          if (comp.subject === 'mathematics') {
            if (comp.sequence === 1) {
              status = 'RELEARN';
              attempts = 2;
              highestScore = 60;
              latestScore = 40;
              consecutiveFailures = 2;
              needsIntervention = true;
              learningCompleted = true;
              practiceCompleted = true;
              assessmentUnlocked = true;
            }
          }
        } else {
          // Default baseline: Competency 1 AVAILABLE, rest LOCKED
          if (comp.sequence === 1) {
            status = 'AVAILABLE';
          }
        }

        await StudentProgress.create({
          studentId: student._id,
          studentUid: student.uid,
          subject: comp.subject,
          competencyCode: comp.code,
          competencyId: comp._id,
          sequence: comp.sequence,
          status,
          attempts,
          consecutiveFailures,
          highestScore,
          latestScore,
          learningCompleted,
          practiceCompleted,
          assessmentUnlocked,
          needsIntervention,
          progressPercentage: status === 'MASTERED' ? 100 : (status === 'RELEARN' ? latestScore : 0),
          masteredAt: status === 'MASTERED' ? new Date() : null,
        });

        // Add attempt record if attempts > 0
        if (attempts > 0) {
          for (let att = 1; att <= attempts; att++) {
            const score = att === attempts ? latestScore : 40;
            await AssessmentAttempt.create({
              studentId: student._id,
              studentUid: student.uid,
              competencyCode: comp.code,
              competencyId: comp._id,
              attemptNumber: att,
              totalQuestions: 5,
              correctAnswersCount: Math.round((score / 100) * 5),
              score,
              percentage: score,
              passed: score >= 80,
              performanceBand: score >= 80 ? 'MASTERED' : (score >= 31 ? 'DEVELOPING' : 'EMERGING'),
              answers: [
                { questionId: 'Q1', selectedOptionId: 'opt1', isCorrect: score >= 80 },
                { questionId: 'Q2', selectedOptionId: 'opt1', isCorrect: score >= 80 },
                { questionId: 'Q3', selectedOptionId: 'opt1', isCorrect: score >= 60 },
                { questionId: 'Q4', selectedOptionId: 'opt1', isCorrect: score >= 40 },
                { questionId: 'Q5', selectedOptionId: 'opt1', isCorrect: false }
              ],
            });
          }
        }
      }

      // Add sample Teacher Note for student needing attention
      if (student.uid === 'NG-2026-003') {
        await TeacherNote.create({
          teacherId: teacher._id,
          studentId: student._id,
          competencyCode: 'G-01',
          noteText: 'આરવને ગીત અને ધ્વનિ ઓળખમાં વ્યક્તિગત માર્ગદર્શનની જરૂર છે. ફ્લેશકાર્ડ વડે પુનરાવર્તન કરાવવું.',
          actionTaken: 'REMEDIATION',
          resolved: false,
        });
      }
    }
    console.log(`✅ Seeded ${studentDocs.length} students with complete competency progress matrices`);

    // 5. Seed Achievements
    const achievementTemplates = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/achievements.json'), 'utf-8'));
    for (const student of studentDocs) {
      await Achievement.create({
        studentId: student._id,
        badgeKey: achievementTemplates[0].badgeKey,
        titleGujarati: achievementTemplates[0].titleGujarati,
        titleEnglish: achievementTemplates[0].titleEnglish,
        descriptionGujarati: achievementTemplates[0].descriptionGujarati,
        iconEmoji: achievementTemplates[0].iconEmoji,
      });
    }
    console.log('✅ Seeded Achievements for students');

    console.log('\n======================================================');
    console.log('🎉 NIPUN GUJARAT DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Teacher Login Credentials:');
    console.log(`Email:    ${teacher.email}`);
    console.log(`Password: Password@123`);
    console.log('\nStudent UIDs for instant login:');
    studentDocs.forEach(s => console.log(`  - ${s.uid} (${s.name} - ${s.grade})`));
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
}

seedDatabase();
