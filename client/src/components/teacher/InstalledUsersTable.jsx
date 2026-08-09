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
  UserCheck,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function InstalledUsersTable() {
  const [data, setData] = useState({
    totalInstalls: 0,
    totalRegisteredStudents: 0,
    installedStudentsCount: 0,
    users: [],
    studentStatusList: [],
    summary: {
      students: 0,
      teachers: 0,
      guests: 0,
      android: 0,
      ios: 0,
      desktop: 0,
    }
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedOS, setSelectedOS] = useState('All');
  const [activeViewTab, setActiveViewTab] = useState('devices'); // 'devices' | 'students'

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

  // Filtered student list
  const filteredStudents = (data.studentStatusList || []).filter((st) => {
    return (
      (st.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.uid || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.grade || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Export to CSV
  const exportToCSV = () => {
    if (activeViewTab === 'students') {
      const headers = ['Student Name', 'UID', 'Grade', 'Section', 'School', 'App Installed Status', 'Device OS', 'Browser', 'Install Date'];
      const rows = filteredStudents.map((s) => [
        `"${s.name || ''}"`,
        `"${s.uid || ''}"`,
        `"${s.grade || ''}"`,
        `"${s.section || ''}"`,
        `"${s.schoolName || ''}"`,
        `"${s.isInstalled ? 'Installed (ઇન્સ્ટોલ કરેલ)' : 'Pending (ઇન્સ્ટોલ બાકી)'}"`,
        `"${s.os || '-'}"`,
        `"${s.browser || '-'}"`,
        `"${s.installedAt ? new Date(s.installedAt).toLocaleString('gu-IN') : '-'}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Students_App_Status_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['User Name', 'Role', 'UID / Identifier', 'Grade', 'Section', 'School', 'Device', 'OS', 'Browser', 'Installed Date', 'Device ID'];
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
      link.setAttribute('download', `Installed_Devices_List_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border-2 border-emerald-200 shadow-md space-y-6 font-gujarati">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0 ring-4 ring-emerald-100">
            📱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                કોણે એપ ઇન્સ્ટોલ કરી છે? (Who Installed the App)
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-xs font-mono font-black">
                {data.totalInstalls || 0} ડિવાઇસ
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              જાડીયાણા પ્રાથમિક શાળાના વિદ્યાર્થીઓ અને શિક્ષકો દ્વારા પોતાના ફોનમાં એપ ડાઉનલોડની વિગતવાર યાદી
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold shadow-xs"
            title="રીફ્રેશ કરો"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>રીફ્રેશ</span>
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

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>કુલ નોંધાયેલ વિદ્યાર્થીઓ</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono">
            {data.totalRegisteredStudents || 9}
          </div>
          <div className="text-[10px] text-emerald-700">શાળાના સક્રિય બાળકો</div>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
            <span>ફોનમાં એપ ઇન્સ્ટોલ થયેલ</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono">
            {data.summary?.students || data.installedStudentsCount || 0}
          </div>
          <div className="text-[10px] text-blue-700">વિદ્યાર્થીઓના ડિવાઇસ</div>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>🤖 Android ફોન</span>
            <Smartphone className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 font-mono">
            {data.summary?.android || 0}
          </div>
          <div className="text-[10px] text-amber-700">Chrome & Android PWA</div>
        </div>

        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-1">
          <div className="flex items-center justify-between text-indigo-800 text-xs font-bold">
            <span>🍏 Apple / iOS</span>
            <Smartphone className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-950 font-mono">
            {data.summary?.ios || 0}
          </div>
          <div className="text-[10px] text-indigo-700">Safari Add to Home</div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveViewTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === 'students'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>૧. વિદ્યાર્થીવાર એપ ઇન્સ્ટોલેશન સ્ટેટસ (Student App Status)</span>
          </button>

          <button
            onClick={() => setActiveViewTab('devices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === 'devices'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>૨. તમામ ઇન્સ્ટોલ કરેલ ઉપકરણો (All Installed Devices)</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          {activeViewTab === 'students' ? `${filteredStudents.length} વિદ્યાર્થીઓ` : `${filteredUsers.length} ડિવાઇસ`}
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="વિદ્યાર્થીનું નામ, UID અથવા રોલ નંબર શોધો..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>

        {activeViewTab === 'devices' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">બધી ભૂમિકાઓ</option>
              <option value="Student">વિદ્યાર્થી</option>
              <option value="Teacher">શિક્ષક</option>
              <option value="Guest">મુલાકાતી</option>
            </select>

            <select
              value={selectedOS}
              onChange={(e) => setSelectedOS(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">બધા OS</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="Windows">Windows</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: STUDENT-BY-STUDENT INSTALLATION STATUS */}
      {activeViewTab === 'students' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-extrabold border-b border-slate-200 text-[11px] uppercase">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">વિદ્યાર્થીનું પૂરું નામ (Student Name)</th>
                <th className="py-3.5 px-4">UID નંબર</th>
                <th className="py-3.5 px-4">ધોરણ / વર્ગ</th>
                <th className="py-3.5 px-4">એપ ઇન્સ્ટોલેશન સ્ટેટસ</th>
                <th className="py-3.5 px-4">ઉપકરણ (Device / OS)</th>
                <th className="py-3.5 px-4">બ્રાઉઝર</th>
                <th className="py-3.5 px-4 text-right">ઇન્સ્ટોલ તારીખ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>વિદ્યાર્થીઓનો ડેટા લોડ થઈ રહ્યો છે...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    કોઈ વિદ્યાર્થી મળ્યો નથી.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => (
                  <tr key={st._id || idx} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shrink-0">
                          {st.name?.charAt(0) || '👨‍🎓'}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">{st.name}</div>
                          <div className="text-[10px] text-slate-500">{st.schoolName}</div>
                        </div>
                      </div>
                    </td>

                    {/* UID */}
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-800 text-xs">
                      {st.uid}
                    </td>

                    {/* Grade / Section */}
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {st.grade} ({st.section})
                    </td>

                    {/* App Install Status Badge */}
                    <td className="py-3.5 px-4">
                      {st.isInstalled ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full text-[11px] font-black shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ઇન્સ્ટોલ કરેલ (Installed) 📲</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-[11px] font-bold">
                          <span>બાકી (Not Installed)</span>
                        </span>
                      )}
                    </td>

                    {/* Device OS */}
                    <td className="py-3.5 px-4">
                      {st.isInstalled ? (
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <span>{st.os?.toLowerCase().includes('android') ? '🤖' : (st.os?.toLowerCase().includes('ios') ? '🍏' : '💻')}</span>
                          <span>{st.os}</span>
                          <span className="text-[10px] text-slate-500 font-normal">({st.deviceType})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">-</span>
                      )}
                    </td>

                    {/* Browser */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {st.isInstalled ? st.browser : '-'}
                    </td>

                    {/* Installed Date */}
                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {st.installedAt ? (
                        new Date(st.installedAt).toLocaleString('gu-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: ALL INSTALLED DEVICES & SESSIONS REGISTRY */}
      {activeViewTab === 'devices' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-extrabold border-b border-slate-200 text-[11px] uppercase">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">વપરાશકર્તા (User Name)</th>
                <th className="py-3.5 px-4">ભૂમિકા (Role)</th>
                <th className="py-3.5 px-4">UID / ઓળખ</th>
                <th className="py-3.5 px-4">શાળા</th>
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
                        {user.userRole === 'Student' ? 'વિદ્યાર્થી' : (user.userRole === 'Teacher' ? 'શિક્ષક' : 'મુલાકાતી')}
                      </span>
                    </td>

                    {/* UID */}
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {user.displayIdentifier}
                    </td>

                    {/* School */}
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
      )}
    </div>
  );
}
