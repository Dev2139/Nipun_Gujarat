import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherService, studentService } from '../../services';
import BulkUploadModal from '../../components/BulkUploadModal';
import {
  Plus,
  Users,
  Search,
  UploadCloud,
  GraduationCap,
  ChevronRight,
  UserPlus,
  FolderPlus
} from 'lucide-react';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Create class modal state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Grade 1');
  const [newClassSection, setNewClassSection] = useState('A');

  // Add single student modal state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentUid, setStudentUid] = useState('');
  const [studentGender, setStudentGender] = useState('Boy');

  // Bulk upload modal state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await teacherService.getClasses();
      if (res.success) {
        setClasses(res.data);
        if (res.data.length > 0 && !selectedClass) {
          loadClassDetails(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClassDetails = async (classId) => {
    try {
      const res = await teacherService.getClassById(classId);
      if (res.success) {
        setSelectedClass(res.data.classInfo);
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error('Error fetching class details:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const res = await teacherService.createClass({
        name: newClassName,
        grade: newClassGrade,
        section: newClassSection,
      });
      if (res.success) {
        setIsClassModalOpen(false);
        setNewClassName('');
        fetchClasses();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'વર્ગ બનાવવામાં ભૂલ થઈ');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;

    try {
      const res = await studentService.addStudent({
        name: studentName,
        uid: studentUid,
        gender: studentGender,
        classId: selectedClass._id,
        grade: selectedClass.grade,
        section: selectedClass.section,
      });

      if (res.success) {
        setIsStudentModalOpen(false);
        setStudentName('');
        setStudentUid('');
        loadClassDetails(selectedClass._id);
        fetchClasses();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'વિદ્યાર્થી ઉમેરવામાં ભૂલ થઈ');
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.uid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-gujarati">
            વર્ગ વ્યવસ્થાપન (Class Management)
          </h1>
          <p className="text-xs text-slate-500 font-gujarati mt-1">
            નવા વર્ગો બનાવો અને વિદ્યાર્થીઓની નોંધણી કરો
          </p>
        </div>

        <button
          onClick={() => setIsClassModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 font-gujarati self-start"
        >
          <FolderPlus className="w-4 h-4" />
          <span>નવો વર્ગ ઉમેરો (Add Class)</span>
        </button>
      </div>

      {/* Classes Carousel / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const isSelected = selectedClass?._id === cls._id;
          return (
            <div
              key={cls._id}
              onClick={() => loadClassDetails(cls._id)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-4 ring-emerald-100'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                  {cls.grade}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  સેક્શન: {cls.section}
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-gujarati">
                {cls.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-gujarati">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{cls.studentCount || 0} વિદ્યાર્થીઓ</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Class Roster & Actions */}
      {selectedClass && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 font-gujarati">
                  {selectedClass.name}
                </h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {students.length} વિદ્યાર્થીઓ
                </span>
              </div>
              <p className="text-xs text-slate-500 font-gujarati">
                વિદ્યાર્થીઓની સૂચિ અને અધ્યયન સ્થિતિ
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsStudentModalOpen(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 font-gujarati"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>વિદ્યાર્થી ઉમેરો</span>
              </button>

              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 font-gujarati"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>CSV આયાત (Bulk)</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="નામ અથવા UID દ્વારા શોધો..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-gujarati"
            />
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-gujarati">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-3">UID</th>
                  <th className="p-3">વિદ્યાર્થી નામ (Name)</th>
                  <th className="p-3">જાતિ (Gender)</th>
                  <th className="p-3">ધોરણ</th>
                  <th className="p-3">સ્ટ્રીક / તારા</th>
                  <th className="p-3 text-right">વિગતવાર પ્રોફાઇલ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-700">{st.uid}</td>
                    <td className="p-3 font-bold text-slate-900">{st.name}</td>
                    <td className="p-3 text-slate-600">{st.gender}</td>
                    <td className="p-3 text-slate-600">{st.grade} ({st.section})</td>
                    <td className="p-3 font-mono">
                      ⭐ {st.totalStars || 0} • 🔥 {st.streakDays || 1}d
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/teacher/students/${st._id}`}
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
                      >
                        <span>જુઓ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 font-gujarati space-y-4">
            <h3 className="text-lg font-black text-slate-900">નવો વર્ગ ઉમેરો</h3>
            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">વર્ગનું નામ (Class Name) *</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="દા.ત. ધોરણ ૧ - બાલવાટિકા"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ધોરણ (Grade)</label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Balvatika">બાલવાટિકા (Balvatika)</option>
                  <option value="Grade 1">ધોરણ ૧ (Grade 1)</option>
                  <option value="Grade 2">ધોરણ ૨ (Grade 2)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">વિભાગ (Section)</label>
                <input
                  type="text"
                  value={newClassSection}
                  onChange={(e) => setNewClassSection(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
                >
                  વર્ગ બનાવો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Single Student Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 font-gujarati space-y-4">
            <h3 className="text-lg font-black text-slate-900">નવો વિદ્યાર્થી ઉમેરો</h3>
            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">વિદ્યાર્થીનું પૂરું નામ *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="દા.ત. રવિ કુમાર પટેલ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">UID નંબર (ખાલી રાખતાં ઑટો-જનરેટ થશે)</label>
                <input
                  type="text"
                  value={studentUid}
                  onChange={(e) => setStudentUid(e.target.value.toUpperCase())}
                  placeholder="દા.ત. NG-2026-009"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">જાતિ (Gender)</label>
                <select
                  value={studentGender}
                  onChange={(e) => setStudentGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Boy">કુમાર (Boy)</option>
                  <option value="Girl">કન્યા (Girl)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
                >
                  ઉમેરો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload CSV Modal */}
      {selectedClass && (
        <BulkUploadModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          classId={selectedClass._id}
          className={selectedClass.name}
          onImportSuccess={() => {
            loadClassDetails(selectedClass._id);
            fetchClasses();
          }}
        />
      )}
    </div>
  );
}
