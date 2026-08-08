# Walkthrough: Fixed 'navigate is not defined' in Assessment Quiz

We have resolved the `navigate is not defined` runtime error that occurred when submitting the assessment.

---

## 🔍 Root Cause & Fix

1. **Root Cause**:
   - In `client/src/pages/student/AssessmentQuiz.jsx`, the `const navigate = useNavigate();` declaration was accidentally displaced when adding the confirmation modal state.
   - When the submission completed, calling `navigate('/student/result', ...)` threw a runtime `ReferenceError: navigate is not defined`.

2. **Resolution**:
   - Restored `const navigate = useNavigate();` inside `AssessmentQuiz.jsx`.
   - Verified that all other components calling `navigate()` across the codebase properly declare `useNavigate()`.
   - Built the production client bundle (`npm run build`) with 0 errors.

---

## 🧪 Verification

- Verified `AssessmentQuiz.jsx` imports `useNavigate` and defines `const navigate = useNavigate();`.
- Verified `npm run build` succeeds cleanly.
