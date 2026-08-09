import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RefreshCw, Lock, Sparkles, User } from 'lucide-react';

export default function HeatmapGrid({ competencies = [], matrix = [], onSelectCell = null }) {
  if (!matrix || matrix.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-slate-500 font-medium">આ વર્ગમાં કોઈ વિદ્યાર્થીઓ મળ્યા નથી.</p>
      </div>
    );
  }

  const renderStatusBadge = (cell) => {
    switch (cell.status) {
      case 'MASTERED':
        return (
          <div
            className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
            title={`${cell.competencyCode}: નિપુણ (Score: ${cell.score}%, Attempts: ${cell.attempts})`}
          >
            ✓
          </div>
        );
      case 'RELEARN':
        return (
          <div
            className="w-8 h-8 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer animate-pulse"
            title={`${cell.competencyCode}: પુનરાવર્તન જરૂરી (Score: ${cell.score}%, Attempts: ${cell.attempts})`}
          >
            🔄
          </div>
        );
      case 'AVAILABLE':
      case 'LEARNING':
      case 'PRACTICE':
      case 'TEST_AVAILABLE':
        return (
          <div
            className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs transition-transform hover:scale-110 cursor-pointer"
            title={`${cell.competencyCode}: પ્રગતિમાં (Status: ${cell.status})`}
          >
            ●
          </div>
        );
      case 'LOCKED':
      default:
        return (
          <div
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center text-xs"
            title={`${cell.competencyCode}: લૉક થયેલ`}
          >
            <Lock className="w-3 h-3" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Legend Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ટ્રેકર સંકેતો (Legend):</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 inline-block"></span>
            <span>નિપુણ / Mastered (≥ 80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-400 inline-block"></span>
            <span>પ્રગતિમાં / In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-500 inline-block"></span>
            <span>પુનરાવર્તન / Relearn (&lt; 80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-200 inline-block"></span>
            <span>લૉક / Locked</span>
          </div>
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="md:hidden px-4 py-1.5 bg-emerald-50 border-b border-emerald-100 text-[11px] font-bold text-emerald-800 font-gujarati flex items-center justify-between">
        <span>👉 બધી ક્ષમતાઓ જોવા માટે આડી સ્ક્રોલ કરો (Swipe horizontally)</span>
        <span className="text-emerald-600 font-mono">⇄</span>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-xs font-bold text-slate-700">
              <th className="p-2.5 sm:p-3.5 sticky left-0 bg-slate-100 z-10 min-w-[140px] sm:min-w-[200px] border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                વિદ્યાર્થી (Student)
              </th>
              <th className="p-2 sm:p-3.5 text-center min-w-[75px] sm:min-w-[100px] border-r border-slate-200">
                સિદ્ધિ %
              </th>
              {competencies.map((comp) => (
                <th
                  key={comp.code}
                  className="p-2 sm:p-3 text-center min-w-[56px] sm:min-w-[64px] border-r border-slate-200 hover:bg-slate-200/50 transition-colors"
                  title={`${comp.code}: ${comp.titleGujarati}`}
                >
                  <div className="text-[11px] font-black text-slate-900">{comp.code}</div>
                  <div className="text-[9px] text-slate-500 truncate max-w-[50px]">{comp.subject === 'gujarati' ? 'ગુજ' : 'ગણિત'}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {matrix.map((row) => (
              <tr key={row.studentId} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-2.5 sm:p-3.5 sticky left-0 bg-white hover:bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                  <Link
                    to={`/teacher/students/${row.studentId}`}
                    className="group block"
                  >
                    <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 flex items-center gap-1.5 font-gujarati truncate max-w-[130px] sm:max-w-[180px]">
                      <span>{row.name}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-mono flex items-center gap-1 sm:gap-2 mt-0.5">
                      <span>{row.uid}</span>
                      <span>•</span>
                      <span>{row.grade.replace('Grade ', 'Gr ')}</span>
                    </div>
                  </Link>
                </td>
                <td className="p-2 sm:p-3.5 text-center border-r border-slate-200 font-mono font-bold text-xs">
                  <span
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs ${
                      row.progressPercent >= 70
                        ? 'bg-emerald-100 text-emerald-800'
                        : row.progressPercent >= 40
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {row.progressPercent}%
                  </span>
                </td>
                {row.cells.map((cell) => (
                  <td
                    key={cell.competencyCode}
                    className="p-1.5 sm:p-2 text-center border-r border-slate-100"
                    onClick={() => onSelectCell && onSelectCell(row, cell)}
                  >
                    <div className="flex justify-center">
                      {renderStatusBadge(cell)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
