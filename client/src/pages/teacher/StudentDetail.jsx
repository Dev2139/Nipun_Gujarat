import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentService, teacherService, assessmentService } from '../../services';
import TeacherNoteModal from '../../components/TeacherNoteModal';
import {
  User,
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Award,
  Clock,
  MessageSquare,
  Plus
} from 'lucide-react';

export default function StudentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedCompCode, setSelectedCompCode] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [stRes, notesRes] = await Promise.all([
        studentService.getStudentById(id),
        teacherService.getStudentNotes(id),
      ]);

      if (stRes.success) {
        setData(stRes.data);
      }
      if (notesRes.success) {
        setNotes(notesRes.data);
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompetency = async (compCode) => {
    setSelectedCompCode(compCode);
    try {
      const res = await assessmentService.getAttempts(compCode, id);
      if (res.success) {
        setAttemptHistory(res.data);
      }
    } catch (err) {
      console.error('Error fetching attempts:', err);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  if (loading || !data) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  const { student, overallProgress, gujaratiProgress, mathProgress, progress, achievements } = data;

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/teacher/classes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs font-gujarati"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>વર્ગ સૂચિ પર પાછા જાઓ</span>
        </Link>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md font-gujarati active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>શિક્ષક નોંધ ઉમેરો (Add Note)</span>
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl font-black shadow-md">
              {student.gender === 'Girl' ? '👧' : '👦'}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-gujarati">
                {student.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-gujarati">
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  UID: {student.uid}
                </span>
                <span>•</span>
                <span>{student.grade} ({student.section})</span>
                <span>•</span>
                <span>શાળા: {student.schoolName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center text-xs font-bold text-amber-900 font-mono">
              <div>⭐ {student.totalStars || 0}</div>
              <div className="text-[10px] text-amber-700 font-gujarati font-normal">તારા</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-center text-xs font-bold text-orange-900 font-mono">
              <div>🔥 {student.streakDays || 1}d</div>
              <div className="text-[10px] text-orange-700 font-gujarati font-normal">સ્ટ્રીક</div>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <div className="flex justify-between text-xs font-bold text-emerald-950 font-gujarati">
              <span>📖 ગુજરાતી પ્રગતિ</span>
              <span className="font-mono">{gujaratiProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-emerald-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${gujaratiProgress}%` }}></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
            <div className="flex justify-between text-xs font-bold text-blue-950 font-gujarati">
              <span>🔢 ગણિત પ્રગતિ</span>
              <span className="font-mono">{mathProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-blue-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${mathProgress}%` }}></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
            <div className="flex justify-between text-xs font-bold text-teal-950 font-gujarati">
              <span>🎯 સમગ્ર સિદ્ધિ (Overall)</span>
              <span className="font-mono">{overallProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-teal-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Competencies Progression Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 font-gujarati">
            ક્ષમતા વાઈઝ અધ્યયન ક્રમ (Competency Timeline)
          </h2>
          <p className="text-xs text-slate-500 font-gujarati">
            કોઈપણ ક્ષમતા પર ક્લિક કરીને તેનો પ્રયત્ન ઈતિહાસ અને સ્કોર જુઓ
          </p>

          <div className="space-y-2.5 divide-y divide-slate-100">
            {progress.map((p) => {
              const comp = p.competencyId;
              const isSelected = selectedCompCode === p.competencyCode;
              return (
                <div
                  key={p._id}
                  onClick={() => handleSelectCompetency(p.competencyCode)}
                  className={`pt-2.5 p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-emerald-50 border border-emerald-300 shadow-xs' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {p.status === 'MASTERED' ? (
                      <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">✓</span>
                    ) : p.status === 'RELEARN' ? (
                      <span className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-xs animate-pulse">🔄</span>
                    ) : p.status === 'LOCKED' ? (
                      <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-xs">🔒</span>
                    ) : (
                      <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center text-xs font-bold">●</span>
                    )}

                    <div>
                      <div className="font-bold text-sm text-slate-900 font-gujarati flex items-center gap-2">
                        <span className="font-mono text-emerald-800 text-xs">{p.competencyCode}:</span>
                        <span>{comp ? comp.titleGujarati : p.competencyCode}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 font-gujarati">
                        <span>{p.subject === 'gujarati' ? '📖 ગુજરાતી' : '🔢 ગણિત'}</span>
                        <span>•</span>
                        <span>પ્રયત્નો: {p.attempts || 0}</span>
                        <span>•</span>
                        <span className={p.videoWatched ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                          🎬 વિડિયો: {p.videoWatched ? '✓' : 'બાકી'}
                        </span>
                        <span>•</span>
                        <span className={p.activitiesCompleted >= 4 ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                          🎮 રમત: {p.activitiesCompleted || 0}/4
                        </span>
                        <span>•</span>
                        <span>🧩 મહાવરો: {p.practiceScore || 0}%</span>
                        {p.hintsUsed > 0 && <span>• 💡 સંકેત: {p.hintsUsed}</span>}
                      </div>

                      {p.competencyCode === 'M-02' && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-gujarati">
                          <span className="font-bold text-slate-700">સ્થાનિક ક્ષમતાઓ:</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            p.weakAreas?.some(w => w.includes('ઉપર અને નીચે')) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            ઉપર / નીચે {p.weakAreas?.some(w => w.includes('ઉપર અને નીચે')) ? '⚠️' : '✓'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            p.weakAreas?.some(w => w.includes('ની ઉપર')) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            ની ઉપર / ની નીચે {p.weakAreas?.some(w => w.includes('ની ઉપર')) ? '⚠️' : '✓'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            p.weakAreas?.some(w => w.includes('ક્રમ')) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            ક્રમ (ઉપર-નીચે) {p.weakAreas?.some(w => w.includes('ક્રમ')) ? '⚠️' : '✓'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            p.weakAreas?.some(w => w.includes('નજીક')) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            નજીક / દૂર {p.weakAreas?.some(w => w.includes('નજીક')) ? '✕' : '✓'}
                          </span>
                        </div>
                      )}

                      {p.competencyCode === 'M-03' && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-gujarati">
                          <span className="font-bold text-slate-700">૧ થી ૫ કૌશલ્યો:</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            p.weakAreas?.some(w => w.includes('ઓળખ')) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            નંબર ઓળખ {p.weakAreas?.some(w => w.includes('ઓળખ')) ? '⚠️' : '✓'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            p.weakAreas?.some(w => w.includes('ગણતરી')) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            વસ્તુ ગણતરી {p.weakAreas?.some(w => w.includes('ગણતરી')) ? '⚠️' : '✓'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            p.weakAreas?.some(w => w.includes('જથ્થો')) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            સંખ્યા-જથ્થો {p.weakAreas?.some(w => w.includes('જથ્થો')) ? '⚠️' : '✓'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            p.weakAreas?.some(w => w.includes('ક્રમ')) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            સંખ્યા ક્રમ {p.weakAreas?.some(w => w.includes('ક્રમ')) ? '⚠️' : '✓'}
                          </span>
                        </div>
                      )}

                      {p.weakAreas && p.weakAreas.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px] font-gujarati">
                          <span className="font-black text-rose-700">નબળો મુદ્દો:</span>
                          {p.weakAreas.map((wa, wIdx) => (
                            <span key={wIdx} className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 rounded text-rose-800 font-bold">
                              {wa}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-xs">
                      {p.status === 'MASTERED' ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">૧૦૦% (નિપુણ ⭐)</span>
                      ) : p.status === 'RELEARN' ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">{p.latestScore}% (પુનરાવર્તન ↻)</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{p.status}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Attempt History Drilldown & Teacher Notes */}
        <div className="space-y-6">
          {/* Attempt History Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 font-gujarati flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>પ્રયત્ન ઈતિહાસ (Attempt Log)</span>
            </h3>

            {selectedCompCode ? (
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl">
                  ક્ષમતા: {selectedCompCode}
                </div>
                {attemptHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 font-gujarati py-4 text-center">
                    આ ક્ષમતા માટે હજુ સુધી કોઈ કસોટી અપાઈ નથી.
                  </p>
                ) : (
                  <div className="space-y-2 font-gujarati text-xs">
                    {attemptHistory.map((att) => (
                      <div key={att._id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div>
                          <span className="font-bold">પ્રયત્ન {att.attemptNumber}</span>
                          <div className="text-[10px] text-slate-400">
                            {new Date(att.completedAt).toLocaleDateString('gu-IN')}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                            att.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {att.percentage}% {att.passed ? '✅' : '❌'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-gujarati py-4 text-center">
                ડાબી બાજુની ક્ષમતા પર ક્લિક કરો
              </p>
            )}
          </div>

          {/* Teacher Notes History */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 font-gujarati flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>શિક્ષક નોંધ ઇતિહાસ (Teacher Notes)</span>
            </h3>

            {notes.length === 0 ? (
              <p className="text-xs text-slate-400 font-gujarati py-4 text-center">
                હજુ સુધી કોઈ નોંધ દાખલ કરવામાં આવી નથી.
              </p>
            ) : (
              <div className="space-y-2.5 font-gujarati text-xs">
                {notes.map((n) => (
                  <div key={n._id} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-amber-900">
                      <span>{n.actionTaken}</span>
                      <span className="font-mono text-slate-400 font-normal">{new Date(n.createdAt).toLocaleDateString('gu-IN')}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{n.noteText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Modal */}
      <TeacherNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={student}
        competencyCode={selectedCompCode}
        onSaved={fetchStudentData}
      />
    </div>
  );
}
