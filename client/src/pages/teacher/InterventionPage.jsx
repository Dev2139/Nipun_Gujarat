import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherService } from '../../services';
import TeacherNoteModal from '../../components/TeacherNoteModal';
import { AlertTriangle, CheckCircle2, MessageSquare, RefreshCw, ChevronRight } from 'lucide-react';

export default function InterventionPage() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const res = await teacherService.getInterventions();
      if (res.success) {
        setInterventions(res.data);
      }
    } catch (err) {
      console.error('Error fetching interventions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  const handleOpenNote = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
            ⚠
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-gujarati">
              શિક્ષક હસ્તક્ષેપ કેન્દ્ર (Teacher Intervention Center)
            </h1>
            <p className="text-xs text-slate-500 font-gujarati mt-0.5">
              જે વિદ્યાર્થીઓ સતત ૨ કે તેથી વધુ પ્રયત્નોમાં નિપુણતા મેળવી શક્યા નથી તેમની સૂચિ
            </p>
          </div>
        </div>

        <button
          onClick={fetchInterventions}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 self-start"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Interventions List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        {interventions.length === 0 ? (
          <div className="text-center py-12 space-y-3 font-gujarati">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h3 className="text-lg font-bold text-slate-900">કોઈ હસ્તક્ષેપ બાકી નથી!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              બધા વિદ્યાર્થીઓ સંતોષકારક રીતે પ્રગતિ કરી રહ્યા છે અથવા સમીક્ષા થઈ ચૂકી છે.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-gujarati">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-3">વિદ્યાર્થી</th>
                  <th className="p-3">વર્ગ</th>
                  <th className="p-3">વિષય</th>
                  <th className="p-3">મુશ્કેલીજનક ક્ષમતા</th>
                  <th className="p-3">નિષ્ફળ પ્રયત્નો</th>
                  <th className="p-3">છેલ્લો સ્કોર</th>
                  <th className="p-3 text-right">ક્રિયા</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interventions.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      <Link to={`/teacher/students/${item.studentId}`} className="hover:text-emerald-700">
                        {item.studentName} <span className="font-mono text-slate-400 font-normal">({item.studentUid})</span>
                      </Link>
                    </td>
                    <td className="p-3 text-slate-600">{item.className}</td>
                    <td className="p-3 font-semibold">
                      {item.subject === 'gujarati' ? '📖 ગુજરાતી' : '🔢 ગણિત'}
                    </td>
                    <td className="p-3 text-slate-800">
                      <span className="font-mono font-bold text-emerald-800 mr-1">{item.competencyCode}:</span>
                      {item.competencyTitleGujarati}
                    </td>
                    <td className="p-3 font-mono font-bold text-rose-600">
                      {item.consecutiveFailures} વખત
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        {item.latestScore}%
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenNote(item)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs active:scale-95 inline-flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>સમીક્ષા / નોંધ</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Note Modal */}
      <TeacherNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedItem}
        competencyCode={selectedItem?.competencyCode}
        onSaved={fetchInterventions}
      />
    </div>
  );
}
