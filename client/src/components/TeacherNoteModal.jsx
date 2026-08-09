import React, { useState } from 'react';
import { teacherService } from '../services';
import { X, MessageSquare, CheckCircle, Save } from 'lucide-react';

export default function TeacherNoteModal({ isOpen, onClose, student, competencyCode = null, onSaved }) {
  const [noteText, setNoteText] = useState('');
  const [actionTaken, setActionTaken] = useState('REMEDIATION');
  const [markReviewed, setMarkReviewed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !student) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      setError('કૃપા કરીને શિક્ષકની નોંધ દાખલ કરો (Note text is required)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await teacherService.addTeacherNote(student.studentId || student._id, {
        competencyCode,
        noteText,
        actionTaken,
        markReviewed,
      });

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'નોંધ સાચવવામાં ભૂલ થઈ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span className="font-gujarati">શિક્ષક નોંધ / હસ્તક્ષેપ સમીક્ષા</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600 font-gujarati">
            <div><span className="font-bold">વિદ્યાર્થી:</span> {student.name || student.studentName} ({student.uid || student.studentUid})</div>
            {competencyCode && <div><span className="font-bold">ક્ષમતા કોડ:</span> <span className="font-mono font-bold text-emerald-700">{competencyCode}</span></div>}
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl">{error}</div>}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-gujarati">
              શિક્ષકની માર્ગદર્શક નોંધ (Teacher's Note) *
            </label>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="દા.ત. વિદ્યાર્થીને મૂળાક્ષરના ધ્વનિ ઓળખમાં મુશ્કેલી છે. ફ્લેશકાર્ડ્સ અને મૌખિક મહાવરો કરાવવો..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-gujarati"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-gujarati">
              સહાયક પગલું (Action Planned)
            </label>
            <select
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-gujarati bg-white"
            >
              <option value="REMEDIATION">વ્યક્તિગત ઉપચારાત્મક શિક્ષણ (Individual Remediation)</option>
              <option value="EXTRA_PRACTICE">વધારાનો મહાવરો / વર્કશીટ (Extra Practice)</option>
              <option value="PARENT_CONTACT">વાલી સાથે પરામર્શ (Parent Contact)</option>
              <option value="OBSERVATION">વર્ગખંડ નિરીક્ષણ (Classroom Observation)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="markReviewed"
              checked={markReviewed}
              onChange={(e) => setMarkReviewed(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <label htmlFor="markReviewed" className="text-xs font-semibold text-slate-700 font-gujarati">
              આ ક્ષમતાને સમીક્ષિત (Reviewed) તરીકે ચિહ્નિત કરો
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'સાચવી રહ્યા છીએ...' : 'નોંધ સાચવો'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
