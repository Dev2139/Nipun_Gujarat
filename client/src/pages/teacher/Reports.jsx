import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services';
import { FileSpreadsheet, Download, CheckCircle2, FileText } from 'lucide-react';

export default function Reports() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await teacherService.getClasses();
      if (res.success && res.data.length > 0) {
        setClasses(res.data);
        setSelectedClassId(res.data[0]._id);
      }
    };
    fetchClasses();
  }, []);

  const handleDownloadCsv = async () => {
    if (!selectedClassId) return;
    try {
      setDownloading(true);
      window.open(`/api/reports/class/${selectedClassId}/csv`, '_blank');
    } catch (err) {
      console.error('Error downloading CSV:', err);
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-gujarati">
              અહેવાલ અને નિકાસ (Reports & Export)
            </h1>
            <p className="text-xs text-slate-500 font-gujarati mt-0.5">
              સત્તાવાર નિપુણ ગુજરાત માપદંડો મુજબ વર્ગ અને વિદ્યાર્થીવાર ડેટા નિકાસ કરો
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 font-gujarati">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
            📊
          </div>
          <h3 className="text-lg font-black text-slate-900">
            વર્ગ પ્રગતિ ટ્રેકર CSV નિકાસ (Class CSV Tracker)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            દરેક વિદ્યાર્થીનો UID, નામ, વિષય, ક્ષમતાવાર સ્કોર, સ્થિતિ અને પ્રયત્નોનો સંપૂર્ણ ડેટા Excel સુસંગત CSV માં ડાઉનલોડ કરો.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              વર્ગ પસંદ કરો:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-gujarati text-xs font-bold bg-white"
            >
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} ({cls.grade} - {cls.section})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownloadCsv}
            disabled={downloading || !selectedClassId}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'ડાઉનલોડ થઈ રહ્યું છે...' : 'CSV ડાઉનલોડ કરો'}</span>
          </button>
        </div>

        {/* PDF Summary Report Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 font-gujarati">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-xs">
            📄
          </div>
          <h3 className="text-lg font-black text-slate-900">
            પ્રિન્ટેબલ FLN સારાંશ પત્રક (Print Summary)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            શાળા નિરીક્ષણ અથવા વાલી બેઠક માટે વર્ગના એકંદર પરિણામોનું મુદ્રણક્ષમ સારાંશ પત્રક.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1 text-slate-600">
            <div>✓ ગુજરાતી અને ગણિતની સરેરાશ સિદ્ધિ</div>
            <div>✓ ૮૦%+ નિપુણ બાળકોની ટકાવારી</div>
            <div>✓ વિશેષ મદદ જરૂરી બાળકોની યાદી</div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>સારાંશ પત્રક પ્રિન્ટ / PDF સેવ કરો</span>
          </button>
        </div>
      </div>
    </div>
  );
}
