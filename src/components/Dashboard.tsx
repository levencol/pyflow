import { useState, useEffect } from 'react';
import { BookOpen, Award, Zap, CheckCircle2, Play, Flame, Trophy, Calendar, Sparkles, Lock, RefreshCw, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { CourseDay, UserProgress, PhaseType } from '../types';
import { courseDays } from '../data/curriculum';
import { fetchLeaderboard, LeaderboardEntry } from '../services/api';
import { MOCK_COURSES } from './CoursView';
import CertificateView from './CertificateView';

interface DashboardProps {
  progress: UserProgress;
  onSelectDay: (dayId: number) => void;
  onNavigateTab: (tab: 'cours' | 'exercices' | 'projets' | 'classement') => void;
  onSelectProject: (projectId: string) => void;
  unlockedDays: number[];
  unlockedProjects: string[];
}

export default function Dashboard({ progress, onSelectDay, onNavigateTab, onSelectProject, unlockedDays = [], unlockedProjects = [] }: DashboardProps) {
  const [activeSideTab, setActiveSideTab] = useState<'tip' | 'leaderboard'>('tip');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState('');
  
  const [activeTab, setActiveTab] = useState('Terminés');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertificateCourse, setSelectedCertificateCourse] = useState<typeof MOCK_COURSES[0] | null>(null);

  useEffect(() => {
    if (activeSideTab === 'leaderboard') {
      setLeaderboardLoading(true);
      setLeaderboardError('');
      fetchLeaderboard()
        .then(data => setLeaderboard(data))
        .catch(err => setLeaderboardError(err.message || 'Erreur chargement classement'))
        .finally(() => setLeaderboardLoading(false));
    }
  }, [activeSideTab]);

  // Compute real stats from MOCK_COURSES and progress
  const completedCoursesCount = MOCK_COURSES.filter(c => c.isCompleted).length;
  const inProgressCoursesCount = MOCK_COURSES.length - completedCoursesCount;
  
  const stats = [
    { value: completedCoursesCount.toString(), label: 'Cours terminés' },
    { value: '0', label: 'Cursus terminés' },
    { value: progress.completedProjects.length.toString(), label: 'Projets complétés' },
    { value: completedCoursesCount.toString(), label: 'Certifications' }
  ];

  const totalDays = 28;
  const completedCount = progress.completedDays.length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  // Group days by phase
  const phases: { name: PhaseType; days: CourseDay[]; desc: string; badgeColor: string; bgClass: string; borderClass: string }[] = [
    {
      name: 'Débutant',
      days: courseDays.filter(d => d.phase === 'Débutant'),
      desc: 'Fondations et bases solides algorithmiques',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      bgClass: 'bg-emerald-50/50 dark:bg-emerald-950/10',
      borderClass: 'border-emerald-100 dark:border-emerald-900/40'
    },
    {
      name: 'Intermédiaire',
      days: courseDays.filter(d => d.phase === 'Intermédiaire'),
      desc: 'Gestion des données, fichiers et APIs web',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      bgClass: 'bg-blue-50/50 dark:bg-blue-950/10',
      borderClass: 'border-blue-100 dark:border-blue-900/40'
    },
    {
      name: 'Expert',
      days: courseDays.filter(d => d.phase === 'Expert'),
      desc: 'Orienté Objet, Base de données SQL et Machine Learning',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
      bgClass: 'bg-purple-50/50 dark:bg-purple-950/10',
      borderClass: 'border-purple-100 dark:border-purple-900/40'
    }
  ];

  const allResults = MOCK_COURSES.map(c => ({
    id: c.id,
    type: 'COURS',
    title: c.title,
    status: c.isCompleted ? 'Terminé' : 'En cours',
    course: c
  }));

  const results = allResults.filter(r => {
    if (activeTab === 'Terminés' && r.status !== 'Terminé') return false;
    if (activeTab === 'En cours' && r.status !== 'En cours') return false;
    if (activeTab === 'Passé') return false; // No past
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Identify first incomplete day
  const getNextRecommendedDay = (): CourseDay => {
    const sortedDays = [...courseDays].sort((a, b) => a.id - b.id);
    for (const d of sortedDays) {
      if (!progress.completedDays.includes(d.id)) {
        return d;
      }
    }
    return sortedDays[sortedDays.length - 1]; // return last if all complete
  };

  const nextDay = getNextRecommendedDay();

  if (selectedCertificateCourse) {
    return <CertificateView course={selectedCertificateCourse} onClose={() => setSelectedCertificateCourse(null)} />;
  }

  // Custom Python advice based on current completed status
  const getDailyTip = () => {
    if (completedCount === 0) {
      return "Conseil du jour : Prenez le temps de bien installer VS Code et d'écrire votre premier print() aujourd'hui !";
    } else if (completedCount <= 7) {
      return "Conseil du jour : L'indentation est cruciale en Python (4 espaces). Ne mélangez pas les tabulations et les espaces !";
    } else if (completedCount <= 14) {
      return "Conseil du jour : Lorsque vous ouvrez un fichier, préférez toujours l'instruction 'with open()' pour éviter les verrous mémoire.";
    } else {
      return "Conseil du jour : Surchargez les opérateurs via les 'dunder methods' (ex. __str__) pour rendre l'import de vos classes d'objets élégant !";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto space-y-8 font-sans pb-12 pt-4 px-4 sm:px-6 relative"
    >
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-blue-300 uppercase">
              <Sparkles className="h-3 w-3 animate-pulse" /> Curriculum Accéléré 28 Jours
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl text-white drop-shadow-sm">
              Prêt à accélérer sur Python ?
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              D’étudiant à expert opérationnel. Suivez les chapitres quotidiens, testez vos compétences par des quiz interactifs et concevez des mini-projets de synthèse.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 items-center text-xs text-slate-400">
              <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-orange-500" /> Série : <strong className="text-white font-medium">{progress.streak} jour{progress.streak > 1 ? 's' : ''}</strong></span>
              <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-blue-400" /> Progression : <strong className="text-white font-medium">{completedCount}/{totalDays} Cours</strong></span>
            </div>
          </div>
          
          <div className="shrink-0 apple-glass dark:apple-glass-dark rounded-2xl p-5 flex flex-col items-center justify-center text-center glow">
            <span className="text-xs text-slate-300 uppercase font-bold tracking-wider mb-2 drop-shadow-sm">État global</span>
            <div className="relative flex items-center justify-center">
              {/* Simple inline SVG radial progress */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="transparent" />
                <circle cx="48" cy="48" r="40" stroke="#818cf8" strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-md" />
              </svg>
              <div className="absolute text-center drop-shadow-sm">
                <span className="text-2xl font-bold font-display">{progressPercent}%</span>
              </div>
            </div>
            <button
              onClick={() => onSelectDay(nextDay.id)}
              className="mt-4 px-4 py-2 apple-btn-primary rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" /> Continuer (Jour {nextDay.id})
            </button>
          </div>
        </div>
      </div>

      {/* 2. Recommended Item & Tip of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="lg:col-span-2 apple-glass dark:apple-glass-dark rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-500 drop-shadow-sm" /> Recommandation Actuelle
          </h2>
          <div className="flex flex-col sm:flex-row shadow-2xs border border-slate-100 dark:border-slate-800 rounded-xl p-4 gap-4 items-start hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold font-display text-lg">
              {nextDay.id}
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 uppercase border border-indigo-100 dark:border-indigo-500/20">
                  Jour {nextDay.id} • {nextDay.phase}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Recommandé</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{nextDay.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{nextDay.description}</p>
              <div className="pt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    onSelectDay(nextDay.id);
                    onNavigateTab('exercices');
                  }}
                  className="px-3.5 py-1.5 apple-btn-primary text-xs font-medium rounded-lg transition-colors"
                >
                  Continuer la leçon
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PyFlow Quote / Tip / Leaderboard Widget */}
        <div className="apple-glass dark:apple-glass-dark rounded-2xl flex flex-col justify-between overflow-hidden">
          {/* Card Header Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <button
              onClick={() => setActiveSideTab('tip')}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${activeSideTab === 'tip'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              💡 Conseils
            </button>
            <button
              onClick={() => {
                setActiveSideTab('leaderboard');
                onNavigateTab('classement');
              }}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${activeSideTab === 'leaderboard'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              🏆 Classement
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
            {activeSideTab === 'tip' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                    💡
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Le Conseil du Coach</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {getDailyTip()}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 italic font-mono mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  "La régularité bat l’intensité de 100%."
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                    🏆 Top Étudiants PyFlow
                  </h3>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5 font-sans">Classement général</p>
                </div>
                {leaderboardLoading ? (
                  <div className="flex-1 flex items-center justify-center py-6">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-sans">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                      Mise à jour...
                    </span>
                  </div>
                ) : leaderboardError ? (
                  <div className="text-[11px] text-rose-500 dark:text-rose-400 py-4 text-center font-sans">{leaderboardError}</div>
                ) : (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 mt-2 custom-scrollbar">
                    {leaderboard.slice(0, 5).map((entry, idx) => {
                      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                      return (
                        <div key={entry.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 shadow-3xs hover:bg-white dark:hover:bg-slate-800 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-slate-500 dark:text-slate-400 min-w-5 shrink-0 text-center">{medal}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{entry.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-md font-bold font-mono">
                              {entry.score} pts
                            </span>
                            {entry.streak > 0 && (
                              <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold shrink-0">
                                🔥 {entry.streak}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {leaderboard.length === 0 && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-4 font-sans">Aucun étudiant dans le classement.</p>
                    )}
                  </div>
                )}
                <div className="text-[9px] text-slate-400 dark:text-slate-500 text-center mt-2 border-t border-slate-100 dark:border-slate-800 pt-2 font-mono">
                  Score = Jours × 100 + Quiz × 10 + Défis × 50
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Vos Projets Pratiques */}
      <div className="apple-glass dark:apple-glass-dark rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100 font-display flex items-center gap-2">
            <Trophy className="h-5.5 w-5.5 text-orange-500" /> Vos Projets Pratiques
          </h2>
          <button
            onClick={() => onNavigateTab('projets')}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 text-xs font-semibold cursor-pointer"
          >
            Tous les projets &rarr;
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ y: -4 }} className="border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-800 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">Débutant</span>
              <span className="text-[10px] text-slate-400 font-medium">~1.5h</span>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-tight">Calculatrice Interactive Console</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">Associez inputs, boucles conditionnelles et fonctions.</p>
            <button
              onClick={() => {
                onSelectProject('proj_debutant_1');
                onNavigateTab('projets');
              }}
              className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors mt-2 cursor-pointer ${unlockedProjects.includes('proj_debutant_1')
                  ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'
                  : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100/50 dark:border-amber-800/50 hover:bg-amber-100/30 text-amber-800 dark:text-amber-500 flex items-center justify-center gap-1'
                }`}
            >
              {unlockedProjects.includes('proj_debutant_1') ? 'Lancer le Projet' : <>🔒 Bloqué Admin</>}
            </button>
          </motion.div>
          
          <motion.div whileHover={{ y: -4 }} className="border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-800 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md">Intermédiaire</span>
              <span className="text-[10px] text-slate-400 font-medium">~2h</span>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-tight">Analyseur de Ventes CSV/JSON</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">Parsez des fichiers textes, calculez des moyennes de ventes clients.</p>
            <button
              onClick={() => {
                onSelectProject('proj_intermediaire_1');
                onNavigateTab('projets');
              }}
              className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors mt-2 cursor-pointer ${unlockedProjects.includes('proj_intermediaire_1')
                  ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'
                  : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100/50 dark:border-amber-800/50 hover:bg-amber-100/30 text-amber-800 dark:text-amber-500 flex items-center justify-center gap-1'
                }`}
            >
              {unlockedProjects.includes('proj_intermediaire_1') ? 'Lancer le Projet' : <>🔒 Bloqué Admin</>}
            </button>
          </motion.div>
          
          <motion.div whileHover={{ y: -4 }} className="border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-800 shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-md">Expert</span>
              <span className="text-[10px] text-slate-400 font-medium">~3h</span>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-tight">Micro-API RESTful en Flask</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">Configurez un serveur et éditez des endpoints HTTP complets.</p>
            <button
              onClick={() => {
                onSelectProject('proj_expert_1');
                onNavigateTab('projets');
              }}
              className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors mt-2 cursor-pointer ${unlockedProjects.includes('proj_expert_1')
                  ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'
                  : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100/50 dark:border-amber-800/50 hover:bg-amber-100/30 text-amber-800 dark:text-amber-500 flex items-center justify-center gap-1'
                }`}
            >
              {unlockedProjects.includes('proj_expert_1') ? 'Lancer le Projet' : <>🔒 Bloqué Admin</>}
            </button>
          </motion.div>
        </div>
      </div>

      {/* 4. Mon Activité Section */}
      <div className="pt-8 space-y-8">
        {/* Header Mon activité */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] dark:text-white font-display">Mon activité</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Tout ce sur quoi vous travaillez et que vous avez terminé
          </p>
        </div>

        {/* Stats Cards */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-sm">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex-1 text-center flex flex-col items-center justify-center w-full relative py-4 sm:py-0">
               <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</span>
               <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
               
               {/* Divider for desktop */}
               {idx < stats.length - 1 && (
                 <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-slate-200 dark:bg-slate-800"></div>
               )}
               {/* Divider for mobile */}
               {idx < stats.length - 1 && (
                 <div className="block sm:hidden absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-24 bg-slate-200 dark:bg-slate-800"></div>
               )}
            </div>
          ))}
        </div>

        {/* Filters & Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
           <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full sm:w-auto overflow-x-auto shrink-0">
              <button 
                onClick={() => setActiveTab('En cours')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'En cours' ? 'bg-[#0f172a] text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
              >
                En cours <span className={`px-1.5 py-0.5 rounded-sm text-[10px] ${activeTab === 'En cours' ? 'bg-slate-700 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{inProgressCoursesCount}</span>
              </button>
              <button 
                onClick={() => setActiveTab('Terminés')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'Terminés' ? 'bg-[#0f172a] text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Terminés <span className={`px-1.5 py-0.5 rounded-sm text-[10px] ${activeTab === 'Terminés' ? 'bg-slate-700 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{completedCoursesCount}</span>
              </button>
              <button 
                onClick={() => setActiveTab('Passé')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'Passé' ? 'bg-[#0f172a] text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Passé <span className={`px-1.5 py-0.5 rounded-sm text-[10px] ${activeTab === 'Passé' ? 'bg-slate-700 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>0</span>
              </button>
           </div>

           <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-slate-400"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                Cours <ChevronDown className="h-4 w-4" />
              </button>
           </div>
        </div>

        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-8 mb-2">
          12 résultats
        </div>

        {/* List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
           {results.map((item, idx) => (
             <div 
               key={item.id} 
               className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${idx !== results.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
             >
               <div className="flex items-center gap-4">
                  {/* Diamond shape thumbnail */}
                  <div className="h-12 w-12 shrink-0 bg-gradient-to-br from-[#0f172a] to-slate-800 rounded-xl shadow-md flex items-center justify-center p-2 relative overflow-hidden">
                     {/* The diamond SVG mask over background */}
                     <div className="absolute inset-0.5 bg-[#1e293b] rounded-lg z-10 flex items-center justify-center border border-slate-700/50 overflow-hidden">
                        {/* the small diamond shape itself inside */}
                        <div className="w-6 h-6 rotate-45 border-2 border-white/20 bg-gradient-to-br from-[#facc15] to-[#ca8a04]"></div>
                        {/* bottom corner accent */}
                        <div className="absolute inset-0 bg-[#fbbf24] bottom-0 right-0 w-[55%] h-[55%]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
                     </div>
                  </div>

                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{item.type}</span>
                     <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                  </div>
               </div>
               
               <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-6 sm:gap-8">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                     <CheckCircle2 className="h-4 w-4" />
                     {item.status}
                  </div>
                  {item.status === 'Terminé' && item.course ? (
                    <button 
                      onClick={() => setSelectedCertificateCourse(item.course)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer"
                      title="Voir le certificat"
                    >
                      <Trophy className="h-5 w-5" />
                    </button>
                  ) : (
                    <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer">
                      <ChevronDown className="h-5 w-5 -rotate-90" />
                    </button>
                  )}
               </div>
             </div>
           ))}
        </div>
      </div>

      {/* Floating AI Button (from screenshot) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-[0_4px_20px_rgba(59,130,246,0.5)] flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border-2 border-white dark:border-slate-900">
          <Sparkles className="h-6 w-6" fill="currentColor" />
        </button>
      </div>

    </motion.div>
  );
}