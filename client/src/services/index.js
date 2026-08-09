import api from './api';

export const teacherService = {
  getDashboardOverview: async (classId) => {
    const res = await api.get('/teachers/dashboard', { params: { classId } });
    return res.data;
  },

  getClassHeatmap: async (classId, subject) => {
    const res = await api.get(`/teachers/classes/${classId}/heatmap`, { params: { subject } });
    return res.data;
  },

  getInterventions: async (classId) => {
    const res = await api.get('/teachers/interventions', { params: { classId } });
    return res.data;
  },

  addTeacherNote: async (studentId, noteData) => {
    const res = await api.post(`/teachers/students/${studentId}/notes`, noteData);
    return res.data;
  },

  getStudentNotes: async (studentId) => {
    const res = await api.get(`/teachers/students/${studentId}/notes`);
    return res.data;
  },

  getClasses: async () => {
    const res = await api.get('/classes');
    return res.data;
  },

  createClass: async (data) => {
    const res = await api.post('/classes', data);
    return res.data;
  },

  getClassById: async (id) => {
    const res = await api.get(`/classes/${id}`);
    return res.data;
  },

  deleteClass: async (id) => {
    const res = await api.delete(`/classes/${id}`);
    return res.data;
  },
};

export const studentService = {
  addStudent: async (data) => {
    const res = await api.post('/students', data);
    return res.data;
  },

  bulkImport: async (data) => {
    const res = await api.post('/students/import', data);
    return res.data;
  },

  getStudentById: async (id) => {
    const res = await api.get(`/students/${id}`);
    return res.data;
  },
};

export const curriculumService = {
  getSubjects: async () => {
    const res = await api.get('/curriculum/subjects');
    return res.data;
  },

  getGrades: async () => {
    const res = await api.get('/curriculum/grades');
    return res.data;
  },

  getCompetencies: async (subject, grade) => {
    const res = await api.get(`/curriculum/competencies/${subject}`, { params: { grade } });
    return res.data;
  },

  getCompetencyDetails: async (code) => {
    const res = await api.get(`/curriculum/competency/${code}`);
    return res.data;
  },
};

export const progressService = {
  getMyProgress: async () => {
    const res = await api.get('/progress/my');
    return res.data;
  },

  markStep: async (data) => {
    const res = await api.post('/progress/step', data);
    return res.data;
  },
};

export const assessmentService = {
  getAssessment: async (code) => {
    const res = await api.get(`/assessments/competency/${code}`);
    return res.data;
  },

  submitAssessment: async (data) => {
    const res = await api.post('/assessments/submit', data);
    return res.data;
  },

  getAttempts: async (code, studentId) => {
    const res = await api.get(`/assessments/attempts/${code}`, { params: { studentId } });
    return res.data;
  },
};

export const analyticsService = {
  trackVisit: async (data = {}) => {
    const res = await api.post('/analytics/visit', data);
    return res.data;
  },

  trackInstall: async (data = {}) => {
    const res = await api.post('/analytics/install', data);
    return res.data;
  },

  getInstallStats: async () => {
    const res = await api.get('/analytics/installs');
    return res.data;
  },

  getRealSiteStats: async () => {
    const res = await api.get('/analytics/real-stats');
    return res.data;
  },

  getInstalledUsers: async () => {
    const res = await api.get('/analytics/installed-users');
    return res.data;
  },

  getOverview: async (classId) => {
    const res = await api.get('/analytics/overview', { params: { classId } });
    return res.data;
  },
};

