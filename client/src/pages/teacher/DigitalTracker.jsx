import React, { useState, useEffect } from 'react';
import { teacherService } from '../../services';
import HeatmapGrid from '../../components/HeatmapGrid';
import TeacherNoteModal from '../../components/TeacherNoteModal';
import { Grid3X3, BookOpen, Calculator, Download, RefreshCw } from 'lucide-react';

export default function DigitalTracker() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Note modal on cell click
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentForNote, setSelectedStudentForNote] = useState(null);
  const [selectedCompetencyCode, setSelectedCompetencyCode] = useState(null);

  const fetchClassesAndHeatmap = async () => {
    try {
      setLoading(true);
      const classesRes = await teacherService.getClasses();
      if (classesRes.success && classesRes.data.length > 0) {
        setClasses(classesRes.data);
        const defaultClassId = selectedClassId || classesRes.data[0]._id;
        setSelectedClassId(defaultClassId);
        await loadHeatmap(defaultClassId, selectedSubject);
      }
    } catch (err) {
      console.error('Error loading heatmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHeatmap = async (classId, subject) => {
    if (!classId) return;
    try {
      setLoading(true);
      const res = await teacherService.getClassHeatmap(classId, subject);
      if (res.success) {
        setHeatmapData(res.data);
      }
    } catch (err) {
      console.error('Error fetching class heatmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndHeatmap();
  }, []);

  const handleClassChange = (classId) => {
    setSelectedClassId(classId);
    loadHeatmap(classId, selectedSubject);
  };

  const handleSubjectChange = (subj) => {
    setSelectedSubject(subj);
    loadHeatmap(selectedClassId, subj);
  };

  const handleCellClick = (student, cell) => {
    setSelectedStudentForNote(student);
    setSelectedCompetencyCode(cell.competencyCode);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-gujarati">
              ડિજિટલ પ્રગતિ ટ્રેકર (Live Digital Tracker)
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-gujarati mt-1">
            કાગળના ફિઝિકલ ટ્રેકરનું ડિજિટલ સ્વરૂપ • આપોઆપ અપડેટ થતી વિદ્યાર્થી સ્થિતિ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Class Select */}
          <select
            value={selectedClassId}
            onChange={(e) => handleClassChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 font-gujarati text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.grade})
              </option>
            ))}
          </select>

          {/* Subject Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold font-gujarati">
            <button
              onClick={() => handleSubjectChange('')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSubject === '' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              બંને વિષય
            </button>
            <button
              onClick={() => handleSubjectChange('gujarati')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSubject === 'gujarati' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              📖 ગુજરાતી
            </button>
            <button
              onClick={() => handleSubjectChange('mathematics')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSubject === 'mathematics' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              🔢 ગણિત
            </button>
          </div>

          <button
            onClick={() => loadHeatmap(selectedClassId, selectedSubject)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refresh Heatmap"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Live Heatmap Table */}
      {heatmapData && (
        <HeatmapGrid
          competencies={heatmapData.competencies}
          matrix={heatmapData.matrix}
          onSelectCell={handleCellClick}
        />
      )}

      {/* Note Modal */}
      <TeacherNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudentForNote}
        competencyCode={selectedCompetencyCode}
        onSaved={() => loadHeatmap(selectedClassId, selectedSubject)}
      />
    </div>
  );
}
