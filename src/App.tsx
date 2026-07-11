import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchStudentAccess, getStoredStudentCode, setStoredStudentCode, fetchStudentProgress, saveStudentProgress, StudentProgress } from './services/api';
import AuthRouter from './components/AuthRouter';
import { usePointsToast } from './components/PointsToast';

function dbToLocalProgress(db: StudentProgress): UserProgress {
  return {
    completedDays: db.completed_days || [],
    completedQuizzes: db.completed_quizzes || {},
    completedChallenges: db.completed_challenges || {},
    completedProjects: db.completed_projects || [],
    streak: db.streak || 0,
    lastActiveDate: db.last_active_date || null,
  };
}

function localToDbProgress(local: UserProgress): StudentProgress {
  return {
    completed_days: local.completedDays || [],
    completed_quizzes: local.completedQuizzes || {},
    completed_challenges: local.completedChallenges || {},
    completed_projects: local.completedProjects || [],
    streak: local.streak || 0,
    last_active_date: local.lastActiveDate || null,
  };
}
import { 
  BookOpen, 
  Terminal, 
  Sparkles, 
  Award, 
  Flame, 
  Menu, 
  X, 
  CheckSquare, 
  ExternalLink, 
  GraduationCap, 
  BookMarked,
  LayoutDashboard,
  Trophy,
  Code,
  Shield,
  LogOut,
  User,
  Moon,
  Sun
} from 'lucide-react';

import { useTheme } from './components/ThemeProvider';
import { UserProgress } from './types';
import { courseDays } from './data/curriculum';
import Dashboard from './components/Dashboard';
import CourseView from './components/CourseView';
import ExerciseView from './components/ExerciseView';
import ProjectView from './components/ProjectView';
import TerminalView from './components/TerminalView';
import ClassementView from './components/ClassementView';
import CoursView from './components/CoursView';
import AdminView from './components/AdminView';
import ChatWidget from './components/ChatWidget';
import PlaceholderView from './components/PlaceholderView';
import AccueilView from './components/AccueilView';
import ProfilView from './components/ProfilView';
import DocumentView from './components/DocumentView';
import CertificatsView from './components/CertificatsView';
import BadgesView from './components/BadgesView';
import PratiqueView from './components/PratiqueView';
import EntrainementView from './components/EntrainementView';

const STORAGE_KEY = 'pyflow_progress';

const initialProgress: UserProgress = {
  completedDays: [],
  completedQuizzes: {},
  completedChallenges: {},
  completedProjects: [],
  streak: 1,
  lastActiveDate: null
};

const VALID_TABS = ['accueil', 'dashboard', 'profil', 'document', 'cours', 'lecon', 'certificats', 'badges', 'exercices', 'pratique', 'entrainement', 'projets', 'admin', 'classement'];

// Navigation sync with URL hash
const getValidTabFromHash = () => {
  const hash = window.location.hash.replace('#', '');
  return VALID_TABS.includes(hash) ? (hash as any) : 'accueil';
};

export default function App() {
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTabState] = useState<'accueil' | 'dashboard' | 'profil' | 'document' | 'cours' | 'lecon' | 'certificats' | 'badges' | 'exercices' | 'pratique' | 'entrainement' | 'projets' | 'admin' | 'classement'>(getValidTabFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTabState(getValidTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setActiveTab = (tab: typeof activeTab) => {
    window.location.hash = tab;
  };
  const [selectedDayId, setSelectedDayId] = useState<number>(1);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Access control state loaded from local persistence
  const [unlockedDays, setUnlockedDays] = useState<number[]>([]);
  const [unlockedProjects, setUnlockedProjects] = useState<string[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return getStoredStudentCode() === 'PYFLOW-ADMIN-PY';
  });

  // Student identity & gate
  const [studentName, setStudentName] = useState<string | null>(null);
  const [isAccessReady, setIsAccessReady] = useState<boolean>(false);

  // Responsive menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Progressive training profile loaded from local persistence
  const [progress, setProgress] = useState<UserProgress>(initialProgress);

  // Track if Supabase access has been loaded
  const accessLoaded = useRef(false);

  useEffect(() => {
    if (accessLoaded.current) return;
    accessLoaded.current = true;

    const studentCode = getStoredStudentCode();
    if (studentCode) {
      if (studentCode === 'PYFLOW-ADMIN-PY') {
        setIsAdminAuthenticated(true);
      }
      fetchStudentAccess(studentCode)
        .then(({ student, unlocked_days, unlocked_projects }) => {
          let initialName = student.name;
          try {
            const savedProfile = localStorage.getItem('pyflow_profile');
            if (savedProfile) {
              const parsed = JSON.parse(savedProfile);
              if (parsed.name) {
                initialName = parsed.name;
              }
            }
          } catch (e) {
            console.error(e);
          }
          
          setStudentName(initialName);
          setUnlockedDays(unlocked_days);
          setUnlockedProjects(unlocked_projects);
          localStorage.setItem('pyflow_unlocked_days', JSON.stringify(unlocked_days));
          localStorage.setItem('pyflow_unlocked_projects', JSON.stringify(unlocked_projects));
          
          return fetchStudentProgress(studentCode);
        })
        .then((dbProgress) => {
          if (dbProgress) {
            const localProg = dbToLocalProgress(dbProgress);
            setProgress(localProg);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(localProg));
          }
        })
        .catch((err) => {
          console.error("Erreur lors du chargement des accès/progression :", err);
          // Code stored but network error: use cache and let through
          const savedDays = localStorage.getItem('pyflow_unlocked_days');
          const savedProjects = localStorage.getItem('pyflow_unlocked_projects');
          if (savedDays) { try { setUnlockedDays(JSON.parse(savedDays)); } catch { setUnlockedDays([]); } }
          if (savedProjects) { try { setUnlockedProjects(JSON.parse(savedProjects)); } catch { setUnlockedProjects([]); } }
          
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            try {
              setProgress(JSON.parse(raw));
            } catch {}
          }
        })
        .finally(() => setIsAccessReady(true));
    } else {
      // No stored code → show login screen
      setIsAccessReady(true);
    }
  }, []);

  const handleStudentLogin = (name: string, days: number[], projs: string[]) => {
    setStudentName(name);
    setUnlockedDays(days);
    setUnlockedProjects(projs);
    localStorage.setItem('pyflow_unlocked_days', JSON.stringify(days));
    localStorage.setItem('pyflow_unlocked_projects', JSON.stringify(projs));
    
    const studentCode = getStoredStudentCode();
    if (studentCode) {
      if (studentCode === 'PYFLOW-ADMIN-PY') {
        setIsAdminAuthenticated(true);
      }
      fetchStudentProgress(studentCode)
        .then((dbProgress) => {
          if (dbProgress) {
            const localProg = dbToLocalProgress(dbProgress);
            setProgress(localProg);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(localProg));
          }
        })
        .catch(err => console.error("Impossible de récupérer la progression lors de la connexion :", err));
    }
  };

  const handleStudentLogout = () => {
    setStoredStudentCode('');
    localStorage.removeItem('pyflow_student_code');
    localStorage.removeItem('pyflow_unlocked_days');
    localStorage.removeItem('pyflow_unlocked_projects');
    setStudentName(null);
    setUnlockedDays([]);
    setUnlockedProjects([]);
    setIsAdminAuthenticated(false);
  };

  const handleUpdateUnlockedDays = (days: number[]) => {
    setUnlockedDays(days);
    localStorage.setItem('pyflow_unlocked_days', JSON.stringify(days));
  };

  const handleUpdateUnlockedProjects = (projs: string[]) => {
    setUnlockedProjects(projs);
    localStorage.setItem('pyflow_unlocked_projects', JSON.stringify(projs));
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: UserProgress = JSON.parse(raw);
        
        // Dynamic streak verification on load — only keep streak if last active was yesterday or today
        if (parsed.lastActiveDate) {
          const lastActive = new Date(parsed.lastActiveDate);
          const today = new Date();
          // Normalize to midnight UTC for clean day comparison
          lastActive.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          const diffDays = Math.round((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays > 1) {
            // More than 1 day gap — reset streak to 0 (will be 1 on next completion)
            parsed.streak = 0;
          }
        }
        
        setProgress(parsed);
      } catch (err) {
        console.error("Impossible de parser la progression sauvegardée :", err);
      }
    }
  }, []);

  // Sync state changes with localStorage and Supabase
  const saveProgress = (updated: UserProgress) => {
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const studentCode = getStoredStudentCode();
    if (studentCode) {
      saveStudentProgress(studentCode, localToDbProgress(updated))
        .catch(err => console.error("Erreur de synchronisation de la progression sur le serveur :", err));
    }
  };

  const { showPoints, ToastContainer } = usePointsToast();

  // Toggle completion flag on course day reading
  const handleToggleCompleteDay = (dayId: number) => {
    const isCompleted = progress.completedDays.includes(dayId);
    let updatedCompletedDays = [...progress.completedDays];

    if (isCompleted) {
      updatedCompletedDays = updatedCompletedDays.filter(id => id !== dayId);
    } else {
      updatedCompletedDays.push(dayId);
      showPoints(100, `Cours du Jour ${dayId} validé !`);
    }

    // Streak logic: increment only if last active day was yesterday
    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = progress.streak;
    if (!isCompleted) {
      if (progress.lastActiveDate === null) {
        // First ever completion
        newStreak = 1;
      } else if (progress.lastActiveDate === todayStr) {
        // Already active today — keep streak unchanged
        newStreak = progress.streak;
      } else {
        const lastActive = new Date(progress.lastActiveDate);
        const today = new Date();
        lastActive.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          // Was active yesterday → increment streak
          newStreak = progress.streak + 1;
        } else {
          // Gap > 1 day → reset streak to 1
          newStreak = 1;
        }
      }
    }

    saveProgress({
      ...progress,
      completedDays: updatedCompletedDays,
      lastActiveDate: isCompleted ? progress.lastActiveDate : todayStr,
      streak: newStreak
    });
  };

  // Pass quiz item
  const handlePassQuiz = useCallback((quizId: string) => {
    showPoints(10, 'Quiz réussi !');
    saveProgress({
      ...progress,
      completedQuizzes: {
        ...progress.completedQuizzes,
        [quizId]: true
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // Pass coding challenge item
  const handlePassChallenge = useCallback((challengeId: string, submittedCode: string) => {
    showPoints(50, 'Défi de code validé !');
    saveProgress({
      ...progress,
      completedChallenges: {
        ...progress.completedChallenges,
        [challengeId]: submittedCode
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // Complete project milestone
  const handleCompleteProject = (projectId: string) => {
    const isCompleted = progress.completedProjects.includes(projectId);
    let updatedProjs = [...progress.completedProjects];

    if (isCompleted) {
      updatedProjs = updatedProjs.filter(id => id !== projectId);
    } else {
      updatedProjs.push(projectId);
    }

    saveProgress({
      ...progress,
      completedProjects: updatedProjs
    });
  };

  const handleSelectDay = (dayId: number) => {
    setSelectedDayId(dayId);
    setActiveTab('cours' as any); // Kept the variable in other components for now, but UI tab is handled
    setIsMenuOpen(false);
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveTab('projets');
    setIsMenuOpen(false);
  };

  const totalSteps = 28;
  const globalCompleted = progress.completedDays.length;
  const globalPercent = Math.round((globalCompleted / totalSteps) * 100);

  // Show login screen if not authenticated yet
  if (!isAccessReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" />
          Chargement de votre espace…
        </div>
      </div>
    );
  }

  if (!studentName) {
    return <AuthRouter onLoginSuccess={handleStudentLogin} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <ToastContainer />

      {/* Top Header with Hamburger Menu */}
      <header className="h-16 apple-glass dark:apple-glass-dark px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Ouvrir le menu"
          >
            <Menu className="h-5.5 w-5.5 text-slate-700 dark:text-slate-300" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold tracking-tight shadow-md select-none font-display text-sm">
              Py
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-black text-slate-900 dark:text-white text-sm tracking-tight leading-tight">PyFlow</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">


          {/* Direct streak flame tracker badge */}
          <div className="hidden sm:flex items-center gap-1 rounded-full bg-orange-50/50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 px-3.5 py-1.5 shadow-2xs">
            <Flame className="h-4.5 w-4.5 text-orange-500 fill-current animate-bounce" />
            <span className="text-xs font-mono font-bold text-orange-950 dark:text-orange-300">
              {progress.streak} Jour{progress.streak > 1 ? 's' : ''}
            </span>
          </div>

          {studentName && (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-3 py-1.5 rounded-full">
                <User className="h-3.5 w-3.5 text-indigo-500" />
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 max-w-28 truncate">{studentName}</span>
              </div>
              <button
                onClick={handleStudentLogout}
                title="Se déconnecter"
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* DROPDOWN MENU / OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-64 h-full shadow-2xl flex flex-col border-r border-slate-200 dark:border-slate-800 animate-slide-in-left">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold font-display text-slate-800 dark:text-slate-200">Menu de Formation</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {[
                { id: 'accueil', label: 'Accueil', icon: Sparkles },
                { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
                { id: 'profil', label: 'Profil', icon: User },
                { id: 'document', label: 'Document', icon: BookOpen },
                { id: 'cours', label: 'Cours', icon: BookOpen },
                { id: 'certificats', label: 'Certificats', icon: Award },
                { id: 'badges', label: 'Badges', icon: Shield },
                { id: 'exercices', label: 'Exercices', icon: Code },
                { id: 'pratique', label: 'Pratique', icon: CheckSquare },
                { id: 'entrainement', label: 'Entrainement', icon: Flame },
                { id: 'projets', label: 'Projets', icon: Trophy },
                { id: 'classement', label: 'Classement', icon: Award }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setIsMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeTab === item.id
                      ? 'apple-btn-primary shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              {isAdminAuthenticated && (
                <>
                  <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>
                  <button
                    onClick={() => { setActiveTab('admin'); setIsMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      activeTab === 'admin'
                        ? 'apple-btn-primary shadow-xs'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Shield className="h-4.5 w-4.5 text-indigo-400" />
                    <span>Administration</span>
                  </button>
                </>
              )}
            </nav>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono text-center">
              PyFlow v1.2 (Liquid Glass)
            </div>
          </div>
        </div>
      )}

      {/* SCREEN SCROLLABLE CONTENT BODY */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
        {activeTab === 'accueil' && (
          <AccueilView 
            studentName={studentName} 
            progress={progress} 
            onNavigateTab={setActiveTab as any} 
          />
        )}
        {activeTab === 'profil' && (
          <ProfilView 
            studentName={studentName} 
            progress={progress} 
            theme={theme}
            setTheme={setTheme}
            onLogout={handleStudentLogout}
            onNameChange={setStudentName}
          />
        )}
        {activeTab === 'document' && <DocumentView />}
        {activeTab === 'certificats' && <CertificatsView studentName={studentName} />}
        {activeTab === 'badges' && <BadgesView />}
        {activeTab === 'pratique' && <PratiqueView />}
        {activeTab === 'entrainement' && <EntrainementView />}
        {activeTab === 'classement' && <ClassementView studentName={studentName} progress={progress} />}
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            progress={progress}
            onSelectDay={handleSelectDay}
            onNavigateTab={setActiveTab as any}
            onSelectProject={handleSelectProject}
            unlockedDays={unlockedDays}
            unlockedProjects={unlockedProjects}
          />
        )}

        {activeTab === 'cours' && (
          <CoursView 
            progress={progress}
            onSelectDay={(dayId) => {
              setSelectedDayId(dayId);
              setActiveTab('lecon' as any);
            }}
            unlockedDays={unlockedDays}
          />
        )}

        {activeTab === 'lecon' && (
          <CourseView
            dayId={selectedDayId}
            progress={progress}
            onToggleCompleteDay={handleToggleCompleteDay}
            onSelectDay={(dayId) => {
              setSelectedDayId(dayId);
              setActiveTab('lecon' as any);
            }}
            onGoToExercises={() => setActiveTab('exercices' as any)}
            unlockedDays={unlockedDays}
            isAdminAuthenticated={isAdminAuthenticated}
          />
        )}

        {activeTab === 'exercices' && (
          <ExerciseView
            dayId={selectedDayId}
            progress={progress}
            onPassQuiz={handlePassQuiz}
            onPassChallenge={handlePassChallenge}
            onSelectDay={setSelectedDayId}
            unlockedDays={unlockedDays}
          />
        )}

        {activeTab === 'projets' && (
          <ProjectView
            progress={progress}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onCompleteProject={handleCompleteProject}
            unlockedProjects={unlockedProjects}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            unlockedDays={unlockedDays}
            unlockedProjects={unlockedProjects}
            onUpdateUnlockedDays={handleUpdateUnlockedDays}
            onUpdateUnlockedProjects={handleUpdateUnlockedProjects}
            isAdminAuthenticated={isAdminAuthenticated}
            setIsAdminAuthenticated={setIsAdminAuthenticated}
          />
        )}
      </main>

      {/* Floating AI Coach Widget */}
      <ChatWidget 
        contextText={`L'étudiant est actuellement sur l'onglet: ${activeTab}.` + ((activeTab === 'cours' || activeTab === 'exercices') ? ` Le jour sélectionné est le jour ${selectedDayId}.` : '')} 
      />
    </div>
  );
}

// Sub-component OutilsView encapsulating Recommendations from PDF page 4
function OutilsView() {
  const practiceTips = [
    { title: "Fréquence Ciblée", desc: "Consacrez 4 à 6 heures par jour de codage rigoureux. C'est l'immersion totale qui crée le déclic algorithmique." },
    { title: "Découpage Logique", desc: "Divisez vos programmes complexes en de petites parties testables uniques. N'accumulez pas les bugs !" },
    { title: "Rôle du Débogueur", desc: "Utilisez un débogueur pas à pas officiel ou visualisez vos variables au lieu d'utiliser uniquement des instructions print()." },
    { title: "Documentation Amie", desc: "Formez-vous le réflexe de lire régulièrement la documentation de référence standard du site docs.python.org." }
  ];

  const tools = [
    { title: "VS Code + Extensions", desc: "Visual Studio Code avec l’extension officielle Microsoft Python & Pylance pour l’analyse statique ultra performante." },
    { title: "Jupyter Notebooks", desc: "Excellent pour explorer instantanément de petits calculs matriciels en science de données Numpy et Pandas." },
    { title: "Git et GitHub", desc: "Le réflexe indispensable pour versionner vos scripts de projets au quotidien et documenter vos accomplissements." },
    { title: "Systèmes d’Environnements", desc: "Utilisez en priorité venv (intégré) ou conda pour compartimenter l'installation d'outils tiers." }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-700">
      {/* Top Banner layout */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-md">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-350 tracking-wider text-indigo-300 uppercase">
            <Award className="h-3.5 w-3.5" /> Plan de Vol de Votre Succès
          </div>
          <h1 className="font-display text-2xl font-black leading-tight">Recommandations &amp; Outils Majeurs de l’Expert</h1>
          <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
            Pour réussir ce programme intensif de 28 jours, nous avons compilé ici les meilleures directives méthodologiques, de configuration d'environnements d'exécution locaux et de lectures recommandées issues de notre guide officiel PDF.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane details: Practice guidelines & Tool setup */}
        <div className="lg:col-span-8 space-y-6">
          {/* Practice section */}
          <div className="border border-slate-100/80 rounded-2xl p-6 bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 font-display uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              📝 Conseils de Pratique Quotidienne
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {practiceTips.map((tip, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-orange-50/20 border border-orange-100/30 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-orange-500"></span> {tip.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Local environment setup suggestions */}
          <div className="border border-slate-100/80 rounded-2xl p-6 bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 font-display uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              ⚙ Configuration &amp; Outils Locaux Indispensables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tools.map((devTool, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-indigo-50/10 border border-indigo-100/30 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600"></span> {devTool.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{devTool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right pane sidebar: External reference books and educational portals */}
        <div className="lg:col-span-4 space-y-6">
          {/* Books selection */}
          <div className="border border-slate-102 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-405 uppercase tracking-widest pl-0.5">Lectures d'excellence</h3>
            
            <div className="space-y-3.5">
              <div className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="h-8 w-8 text-xl font-bold">📗</div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">Fluent Python</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Luciano Ramalho — Pour se perfectionner</span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-sans">Guide haut de gamme explorant les subtilités avancées et les meilleures idiotismes du langage.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="h-8 w-8 text-xl font-bold">📘</div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">Clean Code in Python</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Mariano Anaya — Architectures saines</span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-sans">Parfait pour adopter les modèles, linters PEP8 et architectures de tests professionnels.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Portals links click-list */}
          <div className="border border-slate-102 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-405 uppercase tracking-widest pl-0.5">Portails d'Apprentissage</h3>
            
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <a 
                href="https://docs.python.org/3/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-150 rounded-xl hover:bg-slate-50/50 group transition-all"
              >
                <div className="space-y-0.5">
                  <strong className="font-semibold text-slate-800">docs.python.org</strong>
                  <span className="block text-[10px] text-slate-400 font-sans">Référence d’API officielle</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-350 group-hover:text-indigo-600 transition-colors" />
              </a>

              <a 
                href="https://realpython.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-150 rounded-xl hover:bg-slate-50/50 group transition-all"
              >
                <div className="space-y-0.5">
                  <strong className="font-semibold text-slate-800">Real Python</strong>
                  <span className="block text-[10px] text-slate-400 font-sans">Tutoriels experts et articles de blog</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-350 group-hover:text-indigo-600 transition-colors" />
              </a>

              <a 
                href="https://stackoverflow.com/questions/tagged/python" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-150 rounded-xl hover:bg-slate-50/50 group transition-all"
              >
                <div className="space-y-0.5">
                  <strong className="font-semibold text-slate-800">Stack Overflow</strong>
                  <span className="block text-[10px] text-slate-400 font-sans">Résolutions de bugs de la communauté</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-350 group-hover:text-indigo-600 transition-colors" />
              </a>

              <a 
                href="https://www.datacamp.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-slate-50 hover:border-slate-150 rounded-xl hover:bg-slate-50/50 group transition-all"
              >
                <div className="space-y-0.5">
                  <strong className="font-semibold text-slate-800">DataCamp</strong>
                  <span className="block text-[10px] text-slate-400 font-sans">Syllabus de cours interactifs data</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-350 group-hover:text-indigo-600 transition-colors" />
              </a>
            </div>
            </div>
          </div>
        </div>
      </div>
  );
}
