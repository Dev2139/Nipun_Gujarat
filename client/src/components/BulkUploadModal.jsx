import React, { useState } from 'react';
import { studentService } from '../services';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BulkUploadModal({ isOpen, onClose, classId, className, onImportSuccess }) {
  const [csvText, setCsvText] = useState(
`UID,Name,Grade,Section,Gender
NG001,રવિ પટેલ,Grade 1,A,Boy
NG002,કૃષા શાહ,Grade 1,A,Girl
NG003,આરવ પટેલ,Grade 1,A,Boy`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const parseCsv = (text) => {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const students = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const studentObj = {};
        headers.forEach((h, idx) => {
          studentObj[h] = parts[idx] || '';
        });
        students.push(studentObj);
      }
    }
    return students;
  };

  const handleImport = async () => {
    const students = parseCsv(csvText);
    if (students.length === 0) {
      setError('કૃપા કરીને ઓછામાં ઓછો ૧ વિદ્યાર્થી ધરાવતો સાચો CSV ડેટા દાખલ કરો.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      const res = await studentService.bulkImport({
        classId,
        students,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          if (onImportSuccess) onImportSuccess();
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'વિદ્યાર્થીઓ ઉમેરવામાં ભૂલ થઈ.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <UploadCloud className="w-5 h-5 text-emerald-600" />
            <span className="font-gujarati">CSV વડે વિદ્યાર્થીઓની સામૂહિક નોંધણી</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs flex items-start gap-2 font-gujarati">
            <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">વર્ગ:</span> {className} • CSV ફોર્મેટ: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">UID,Name,Grade,Section,Gender</code>
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl">{error}</div>}
          {successMsg && <div className="p-3 bg-emerald-100 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" />{successMsg}</div>}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 font-gujarati">
                CSV ડેટા ટેક્સ્ટ અથવા અપલોડ ફાઇલ:
              </label>
              <label className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer">
                ફાઇલ પસંદ કરો (.csv)
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              રદ કરો
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'નોંધણી કરી રહ્યા છીએ...' : 'આયાત કરો (Import Students)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
