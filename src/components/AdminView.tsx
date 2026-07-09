import { useState, useEffect, useCallback } from 'react';
import {
  Shield, Key, LogOut, Eye, EyeOff, RefreshCw, AlertCircle,
  LayoutDashboard, Users, BookOpen, Settings
} from 'lucide-react';
import {
  adminLogin, adminLogout,
  fetchStudents, createStudent, deleteStudent, updateStudentAccess,
  fetchAdmins,
  getStoredAdminToken, setStoredAdminToken, clearStoredAdminToken,
  fetchStudentProgress,
  Student, AdminAccount, StudentProgress
} from '../services/api';
import { courseDays } from '../data/curriculum';
import { projects } from '../data/projects';

// Import subcomponents
import AdminDashboard from './admin/AdminDashboard';
import AdminStudents from './admin/AdminStudents';
import AdminContent from './admin/AdminContent';
import AdminSettings from './admin/AdminSettings';

interface AdminViewProps {
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
}

export default function AdminView({ isAdminAuthenticated, setIsAdminAuthenticated }: AdminViewProps) {
  // Login State
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Admin session
  const [adminName, setAdminName] = useState<string>('');
  
  // Navigation
  const [activeSection, setActiveSection] = useState<'dashboard' | 'students' | 'content' | 'settings'>('dashboard');

  // Global Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');
  
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

  // Student Detail State (Lifted up so it persists when switching tabs)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentProgress, setSelectedStudentProgress] = useState<StudentProgress | null>(null);
  const [studentProgressLoading, setStudentProgressLoading] = useState(false);
  const [localDays, setLocalDays] = useState<number[]>([]);
  const [localProjects, setLocalProjects] = useState<string[]>([]);
  const [savingAccess, setSavingAccess] = useState(false);
  const [saveAccessMsg, setSaveAccessMsg] = useState('');

  // Check token on mount
  useEffect(() => {
    const token = getStoredAdminToken();
    if (token) {
      setIsAdminAuthenticated(true);
      const storedName = localStorage.getItem('pyflow_admin_name') || '';
      setAdminName(storedName);
    }
  }, [setIsAdminAuthenticated]);

  // Data Fetchers
  const loadStudents = useCallback(async () => {
    setStudentsLoading(true); setStudentsError('');
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (e: unknown) {
      const err = e as Error;
      if (err.message.includes('401')) {
        clearStoredAdminToken();
        localStorage.removeItem('pyflow_admin_name');
        setIsAdminAuthenticated(false);
      }
      setStudentsError(err.message);
    } finally {
      setStudentsLoading(false);
    }
  }, [setIsAdminAuthenticated]);

  const loadAdmins = useCallback(async () => {
    setAdminsLoading(true);
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch { /* silent */ }
    finally { setAdminsLoading(false); }
  }, []);

  // Fetch initial data when authenticated
  useEffect(() => {
    if (isAdminAuthenticated) {
      loadStudents();
      loadAdmins();
    }
  }, [isAdminAuthenticated, loadStudents, loadAdmins]);

  // Handle student selection & progress loading
  useEffect(() => {
    if (!selectedStudentId) {
      setSelectedStudentProgress(null);
      return;
    }
    const s = students.find(st => st.id === selectedStudentId);
    if (!s) return;
    setLocalDays(s.pyflow_unlocked_days.map(d => d.day_id));
    setLocalProjects(s.pyflow_unlocked_projects.map(p => p.project_id));
    setSaveAccessMsg('');

    const loadProgress = async () => {
      setStudentProgressLoading(true);
      try {
        const prog = await fetchStudentProgress(s.student_code);
        setSelectedStudentProgress(prog);
      } catch (err) {
        console.error("Erreur stats:", err);
        setSelectedStudentProgress(null);
      } finally {
        setStudentProgressLoading(false);
      }
    };
    loadProgress();
  }, [selectedStudentId, students]);

  // --- Handlers ---
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginLoading(true); setLoginError('');
    try {
      const { token, admin_name } = await adminLogin(password);
      setStoredAdminToken(token);
      localStorage.setItem('pyflow_admin_name', admin_name);
      setAdminName(admin_name);
      setIsAdminAuthenticated(true);
    } catch (err: unknown) {
      setLoginError((err as Error).message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    localStorage.removeItem('pyflow_admin_name');
    setAdminName('');
    setIsAdminAuthenticated(false);
    setStudents([]);
    setSelectedStudentId(null);
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Supprimer l'étudiant "${name}" ? Cette action est irréversible.`)) return;
    try {
      await deleteStudent(id);
      if (selectedStudentId === id) setSelectedStudentId(null);
      await loadStudents();
    } catch (err: unknown) { alert((err as Error).message); }
  };

  const handleSaveAccess = async () => {
    if (!selectedStudentId) return;
    setSavingAccess(true); setSaveAccessMsg('');
    try {
      await updateStudentAccess(selectedStudentId, localDays, localProjects);
      setSaveAccessMsg('✅ Accès mis à jour avec succès.');
      await loadStudents();
    } catch (err: unknown) {
      setSaveAccessMsg(`❌ ${(err as Error).message}`);
    } finally {
      setSavingAccess(false);
    }
  };

  const handleToggleDay = (dayId: number) => {
    setLocalDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId].sort((a, b) => a - b));
  };
  const handleToggleProject = (projectId: string) => {
    setLocalProjects(prev => prev.includes(projectId) ? prev.filter(p => p !== projectId) : [...prev, projectId]);
  };
  const handleUnlockAll = () => {
    setLocalDays(courseDays.map(d => d.id));
    setLocalProjects(projects.map(p => p.id));
  };
  const handleLockAll = () => { setLocalDays([]); setLocalProjects([]); };

  // --- Render Login ---
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 animate-fade-in relative z-10">
        <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <div className="space-y-1 mb-8">
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white">Portail Administrateur</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Accès sécurisé réservé à l'équipe pédagogique.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mot de passe d'accès</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl text-sm font-mono focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none pr-10 transition-colors"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {loginError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" /> {loginError}
              </p>
            )}
            <button type="submit" disabled={loginLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer transition-all flex items-center justify-center gap-2">
              {loginLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
              {loginLoading ? 'Authentification…' : 'Connexion'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Render Admin Layout ---
  const navItems = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'students', label: 'Étudiants & Accès', icon: Users },
    { id: 'content', label: 'Contenu & Projets', icon: BookOpen },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ] as const;

  return (
    <div className="flex flex-col lg:flex-row h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white -m-6 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg leading-tight">PyFlow Admin</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">Console</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeSection === item.id 
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`h-4 w-4 ${activeSection === item.id ? 'text-indigo-500' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="text-xs">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Connecté(e)</p>
              <p className="font-bold">{adminName}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {activeSection === 'dashboard' && <AdminDashboard students={students} />}
        {activeSection === 'students' && (
          <AdminStudents 
            students={students}
            studentsLoading={studentsLoading}
            studentsError={studentsError}
            onRefresh={loadStudents}
            onDelete={handleDeleteStudent}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
            selectedStudentProgress={selectedStudentProgress}
            studentProgressLoading={studentProgressLoading}
            localDays={localDays}
            localProjects={localProjects}
            onToggleDay={handleToggleDay}
            onToggleProject={handleToggleProject}
            onUnlockAll={handleUnlockAll}
            onLockAll={handleLockAll}
            onSaveAccess={handleSaveAccess}
            saving={savingAccess}
            saveMsg={saveAccessMsg}
          />
        )}
        {activeSection === 'content' && <AdminContent />}
        {activeSection === 'settings' && <AdminSettings admins={admins} adminsLoading={adminsLoading} onRefreshAdmins={loadAdmins} />}
      </main>
    </div>
  );
}
