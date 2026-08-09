import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services';
import {
  Smartphone,
  Users,
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  Filter,
  Monitor,
  Laptop,
  Calendar,
  ShieldCheck,
  GraduationCap,
  UserCheck
} from 'lucide-react';

export default function InstalledUsersTable() {
  const [data, setData] = useState({ totalInstalls: 0, users: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedOS, setSelectedOS] = useState('All');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getInstalledUsers();
      if (res?.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load installed users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered list based on search, role, and OS
  const filteredUsers = (data.users || []).filter((user) => {
    const matchesSearch =
      (user.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.displayIdentifier || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.schoolName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.deviceId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'All' || user.userRole === selectedRole;
    const matchesOS =
      selectedOS === 'All' || (user.os || '').toLowerCase().includes(selectedOS.toLowerCase());

    return matchesSearch && matchesRole && matchesOS;
  });

  // Export to CSV
  const exportToCSV = () => {
    if (!filteredUsers.length) return;
    const headers = ['Name', 'Role', 'UID / Identifier', 'Grade', 'Section', 'School', 'Device', 'OS', 'Browser', 'Installed Date', 'Device ID'];
    const rows = filteredUsers.map((u) => [
      `"${u.displayName || ''}"`,
      `"${u.userRole || ''}"`,
      `"${u.displayIdentifier || ''}"`,
      `"${u.grade || ''}"`,
      `"${u.section || ''}"`,
      `"${u.schoolName || ''}"`,
      `"${u.deviceType || ''}"`,
      `"${u.os || ''}"`,
      `"${u.browser || ''}"`,
      `"${new Date(u.installedAt).toLocaleString('gu-IN')}"`,
      `"${u.deviceId || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nipun_App_Installed_Users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border-2 border-emerald-200 shadow-md space-y-5 font-gujarati">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0 ring-4 ring-emerald-100">
            📱
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>એપ ઇન્સ્ટોલ કરનાર વપરાશકર્તાઓની વિગતવાર યાદી</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-xs font-mono font-black">
                {data.totalInstalls || 0} ડાઉનલોડ્સ
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              કોણે કયા ફોન/કમ્પ્યુટર પર એપ ડાઉનલોડ કરી છે તેની લાઇવ વિગતો
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-95 flex items-center gap-1 text-xs font-bold shadow-xs"
            title="રીફ્રેશ કરો"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">રીફ્રેશ</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold shadow-xs"
            title="Excel/CSV ડાઉનલોડ કરો"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel ડાઉનલોડ</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
          <div className="text-[11px] font-bold text-emerald-800">કુલ ઇન્સ્ટોલ</div>
          <div className="text-xl font-black text-emerald-900 font-mono">{data.totalInstalls || 0}</div>
        </div>

        <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center">
          <div className="text-[11px] font-bold text-blue-800">👨‍🎓 વિદ્યાર્થીઓ</div>
          <div className="text-xl font-black text-blue-900 font-mono">{data.summary?.students || 0}</div>
        </div>

        <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-center">
          <div className="text-[11px] font-bold text-purple-800">👨‍🏫 શિક્ષકો</div>
          <div className="text-xl font-black text-purple-900 font-mono">{data.summary?.teachers || 0}</div>
        </div>

        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
          <div className="text-[11px] font-bold text-amber-800">🤖 Android</div>
          <div className="text-xl font-black text-amber-900 font-mono">{data.summary?.android || 0}</div>
        </div>

        <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-center">
          <div className="text-[11px] font-bold text-indigo-800">🍏 iPhone/iPad</div>
          <div className="text-xl font-black text-indigo-900 font-mono">{data.summary?.ios || 0}</div>
        </div>

        <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-center">
          <div className="text-[11px] font-bold text-teal-800">💻 Desktop/PC</div>
          <div className="text-xl font-black text-teal-900 font-mono">{data.summary?.desktop || 0}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="નામ, UID, રોલ નં અથવા શાળા શોધો..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">બધી ભૂમિકાઓ (All Roles)</option>
            <option value="Student">વિદ્યાર્થી (Student)</option>
            <option value="Teacher">શિક્ષક (Teacher)</option>
            <option value="Guest">મુલાકાતી (Guest)</option>
          </select>

          <select
            value={selectedOS}
            onChange={(e) => setSelectedOS(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">બધા ઉપકરણો (All Devices)</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS (Apple)</option>
            <option value="Windows">Windows</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 font-extrabold border-b border-slate-200 text-[11px] uppercase">
              <th className="py-3.5 px-4">#</th>
              <th className="py-3.5 px-4">વપરાશકર્તાનું નામ (User)</th>
              <th className="py-3.5 px-4">ભૂમિકા (Role)</th>
              <th className="py-3.5 px-4">UID / ઓળખ</th>
              <th className="py-3.5 px-4">શાળા અને વર્ગ</th>
              <th className="py-3.5 px-4">ઉપકરણ & OS (Device)</th>
              <th className="py-3.5 px-4">બ્રાઉઝર</th>
              <th className="py-3.5 px-4 text-right">ઇન્સ્ટોલ તારીખ & સમય</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>ડેટા લોડ થઈ રહ્યો છે...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-500">
                  કોઈ ઇન્સ્ટોલેશન રેકોર્ડ મળ્યો નથી.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr key={user._id || idx} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                        {user.userRole === 'Teacher' ? '👨‍🏫' : (user.userRole === 'Student' ? '👨‍🎓' : '👤')}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{user.displayName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{user.deviceId.substring(0, 14)}...</div>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-block ${
                        user.userRole === 'Student'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : user.userRole === 'Teacher'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {user.userRole === 'Student' ? 'વિદ્યાર્થી' : (user.userRole === 'Teacher' ? 'શિક્ષક' : 'અતિથિ')}
                    </span>
                  </td>

                  {/* UID */}
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    {user.displayIdentifier}
                  </td>

                  {/* School & Grade */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 text-[11px]">{user.schoolName}</div>
                    {user.grade && user.grade !== '-' && (
                      <div className="text-[10px] text-slate-500">
                        ધોરણ: {user.grade} {user.section && user.section !== '-' ? `(${user.section})` : ''}
                      </div>
                    )}
                  </td>

                  {/* Device & OS */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span>{user.os?.toLowerCase().includes('android') ? '🤖' : (user.os?.toLowerCase().includes('ios') ? '🍏' : '💻')}</span>
                      <span>{user.os}</span>
                      <span className="text-[10px] font-normal text-slate-500">({user.deviceType})</span>
                    </div>
                  </td>

                  {/* Browser */}
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {user.browser}
                  </td>

                  {/* Installed Date */}
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {new Date(user.installedAt).toLocaleString('gu-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
