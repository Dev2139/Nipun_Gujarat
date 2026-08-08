import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { PWAProvider } from './context/PWAContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';

// Direct App Login Page
import UnifiedLoginPage from './pages/UnifiedLoginPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import ClassManagement from './pages/teacher/ClassManagement';
import DigitalTracker from './pages/teacher/DigitalTracker';
import StudentDetail from './pages/teacher/StudentDetail';
import InterventionPage from './pages/teacher/InterventionPage';
import Analytics from './pages/teacher/Analytics';
import Reports from './pages/teacher/Reports';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubjectSelect from './pages/student/SubjectSelect';
import LearningPath from './pages/student/LearningPath';
import LearnLesson from './pages/student/LearnLesson';
import AssessmentQuiz from './pages/student/AssessmentQuiz';
import ResultScreen from './pages/student/ResultScreen';
import Achievements from './pages/student/Achievements';

export default function App() {
  return (
    <PWAProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Direct App Login at Root */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<UnifiedLoginPage />} />
                <Route path="/login" element={<UnifiedLoginPage />} />
                <Route path="/login/student" element={<UnifiedLoginPage />} />
                <Route path="/login/teacher" element={<UnifiedLoginPage />} />
              </Route>

              {/* Teacher Protected Routes */}
              <Route path="/teacher" element={<TeacherLayout />}>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="classes" element={<ClassManagement />} />
                <Route path="tracker" element={<DigitalTracker />} />
                <Route path="students/:id" element={<StudentDetail />} />
                <Route path="interventions" element={<InterventionPage />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reports" element={<Reports />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Student Protected Routes */}
              <Route path="/student" element={<StudentLayout />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="subjects" element={<SubjectSelect />} />
                <Route path="path/:subject" element={<LearningPath />} />
                <Route path="learn/:code" element={<LearnLesson />} />
                <Route path="test/:code" element={<AssessmentQuiz />} />
                <Route path="result" element={<ResultScreen />} />
                <Route path="achievements" element={<Achievements />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Catch All redirects directly to App Login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </PWAProvider>
  );
}
