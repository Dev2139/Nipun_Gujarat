# 🎯 Nipun Gujarat (નિપુણ ગુજરાત)

> **Production-ready MERN Stack Web Application for Foundational Literacy and Numeracy (FLN) Learning, Practice, Assessment, and Digital Progress Tracking for Balvatika, Grade 1, and Grade 2.**

Built strictly adhering to the official **Nipun Gujarat / FLN Action Plan** Gujarati and Mathematics curriculum trackers published by GCERT and Samagra Shiksha Gandhinagar.

---

## 🌟 Key Highlights & Capabilities

### 1. 📖 Curriculum Source of Truth (Gujarati & Mathematics)
- Authentic database-driven curriculum architecture supporting versioning (`2026-27`).
- **Gujarati Phonics & Literacy Pathway**: મૌખિક ભાષા વિકાસ, ગ-મ-ન-જ, વ-ર-સ-દ, ક-બ-અ-છ, પ-ડ-ત-ણ, લ-ટ-ચ-ખ, જોડાક્ષરો, રકાર જોડાક્ષરો, અને વાચન અર્થગ્રહણ.
- **Mathematics Numeracy Pathway**: તુલના/સરખામણી, ૧-૫, ૧-૯, ૧-૫૦, ૫૧-૧૦૦ સંખ્યાજ્ઞાન, ૧ અંક/૨ અંકના સરવાળા, બાદબાકી, ઘડિયા, સમય અને નાણું.
- Fully preserves Gujarati Unicode typography with **Noto Sans Gujarati**.

### 2. ⚡ Sequential Mastery Engine & State Machine
- Strict sequential locking: Students must master prerequisites before unlocking subsequent competencies.
- **8-Stage State Machine**: `LOCKED`, `AVAILABLE`, `LEARNING`, `PRACTICE`, `TEST_AVAILABLE`, `PASSED`, `RELEARN`, `MASTERED`.
- **Nipun Performance Bands**:
  - **80% - 100% (નિપુણ / Mastered)**: Unlocks the next sequential competency with celebratory feedback and stars.
  - **31% - 79% (પ્રગતિશીલ / Developing)**: Status set to `RELEARN`, guides child to relearn and retake.
  - **0% - 30% (ઉદયમાન / Needs Significant Support)**: Status set to `RELEARN`, flags student for teacher intervention after 2 consecutive failures.

### 3. 👨‍🏫 Teacher Command Center & Digital Tracker Heatmap
- **3-Second Instant UX Metrics**: Immediate answers to:
  1. How many students are there?
  2. How many are progressing well / Mastered?
  3. Who needs my attention?
- **Live Class Heatmap Grid**: Complete digital replacement for the physical paper tracker sheet (`🟢 Mastered`, `🟡 In Progress`, `🔴 Needs Relearning`, `🔒 Locked`).
- **Smart Intervention Center**: Real-time alerts for students failing 2+ times with one-click pedagogical review notes.
- **Class & Student Management**: Manual UID registration, bulk CSV import, individual student profiles with attempt histories.
- **Reporting**: 1-click UTF-8 CSV download for Excel and printable summary sheets.

### 4. 🧒 Child-Friendly Gujarati Learning Portal
- **Zero-Password Single UID Login** (`NG-2026-001`).
- Gujarati Text-to-Speech audio support for phonics, letters, and question prompts.
- Interactive touch-friendly exercises (Sound matching, Object counting, MCQ, Fill-in-the-blank).
- Gentle gamification: Daily streak flames (🔥), Stars (⭐), and achievement badges (🏆).

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, React Router 7, Axios, TanStack React Query, Recharts, Lucide React, Canvas Confetti, jsPDF.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Helmet, CORS, Express Rate Limit, Morgan.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 18
- MongoDB Server running locally on `mongodb://127.0.0.1:27017`

### 2. Backend Setup & Seeding
```bash
cd server
npm install
npm run seed     # Populates curriculum, teacher account, classes, students, and progress
npm start        # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 🔑 Demo Login Credentials

### 👨‍🏫 Teacher Portal:
- **URL**: `http://localhost:5173/login/teacher`
- **Email**: `teacher@nipun.gujarat.gov.in`
- **Password**: `Password@123`

### 🧒 Student Portal:
- **URL**: `http://localhost:5173/login/student`
- **Demo UIDs**:
  - `NG-2026-001` (રવિ પટેલ - Grade 1)
  - `NG-2026-002` (કૃષા શાહ - Grade 1)
  - `NG-2026-003` (આરવ પટેલ - Grade 1 • Needs Intervention Demo)
  - `NG-2026-005` (યશ ચૌહાણ - Balvatika)

---

## 📡 REST API Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/teacher/login` | Teacher JWT Login |
| `POST` | `/api/auth/student/login` | Student Single UID Login |
| `GET` | `/api/teachers/dashboard` | 3-second instant overview metrics |
| `GET` | `/api/teachers/classes/:id/heatmap` | Live class digital tracker heatmap |
| `GET` | `/api/teachers/interventions` | Students failing >= 2 times |
| `POST` | `/api/teachers/students/:id/notes` | Create teacher remediation note |
| `GET` | `/api/classes` | Get assigned teacher classes |
| `POST` | `/api/students/import` | Bulk CSV student registration |
| `GET` | `/api/progress/my` | Current student learning pathway & scores |
| `POST` | `/api/progress/step` | Update learning/practice step status |
| `GET` | `/api/assessments/competency/:code` | Get assessment quiz questions |
| `POST` | `/api/assessments/submit` | Evaluate score, enforce >=80% mastery, unlock next skill |
| `GET` | `/api/reports/class/:id/csv` | Export official class tracker CSV |
