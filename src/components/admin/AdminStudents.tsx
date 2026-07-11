import { useState } from 'react';
import { Users, User, Search, Filter, Shield, Lock, Unlock, Trash2, Trophy, CheckSquare, Square, RefreshCw, X, AlertCircle, BookOpen, Flame, Target, Medal, Award } from 'lucide-react';
import { Student, StudentProgress } from '../../services/api';
import { courseDays } from '../../data/curriculum';
import { projects } from '../../data/projects';
import { generateDayQuizzes, generateDayChallenges } from '../../data/exercises';

interface AdminStudentsProps {
  students: Student[];
  studentsLoading: boolean;
  studentsError: string;
  onRefresh: () => void;
  onDelete: (id: string, name: string) => void;
  selectedStudentId: string | null;
  onSelectStudent: (id: string | null) => void;
  selectedStudentProgress: StudentProgress | null;
  studentProgressLoading: boolean;

  // Access state
  localDays: number[];
  localProjects: string[];
  onToggleDay: (id: number) => void;
  onToggleProject: (id: string) => void;
  onUnlockAll: () => void;
  onLockAll: () => void;
  onSaveAccess: () => void;
  saving: boolean;
  saveMsg: string;
}

const phases = [
  { name: 'Débutant (J1–7)', type: 'Débutant', days: courseDays.filter(d => d.phase === 'Débutant') },
  { name: 'Intermédiaire (J8–14)', type: 'Intermédiaire', days: courseDays.filter(d => d.phase === 'Intermédiaire') },
  { name: 'Expert (J15–28)', type: 'Expert', days: courseDays.filter(d => d.phase === 'Expert') },
];

export default function AdminStudents({
  students, studentsLoading, studentsError, onRefresh, onDelete,
  selectedStudentId, onSelectStudent, selectedStudentProgress, studentProgressLoading,
  localDays, localProjects, onToggleDay, onToggleProject, onUnlockAll, onLockAll, onSaveAccess, saving, saveMsg
}: AdminStudentsProps) {
  const [search, setSearch] = useState('');
  const [studentDetailTab, setStudentDetailTab] = useState<'access' | 'progress' | 'badges'>('access');
  const [selectedDetailDayId, setSelectedDetailDayId] = useState<number>(1);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([0, 1, 2]);

  // Mock badge state for demonstration
  const [localBadges, setLocalBadges] = useState<string[]>(['1']);
  const handleToggleBadge = (badgeId: string) => {
    setLocalBadges(prev => prev.includes(badgeId) ? prev.filter(b => b !== badgeId) : [...prev, badgeId]);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_code.toLowerCase().includes(search.toLowerCase())
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="space-y-6 animate-fade-in relative h-[calc(100vh-140px)] flex gap-6">

      {/* ── LEFT: STUDENT LIST ─────────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden transition-all duration-300 ${selectedStudent ? 'hidden' : 'w-full'}`}>
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500" /> Étudiants ({students.length})
            </h2>
            <button onClick={onRefresh} title="Rafraîchir"
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors cursor-pointer">
              <RefreshCw className={`h-4 w-4 ${studentsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm text-slate-900 dark:text-white outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {studentsLoading && (
            <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <RefreshCw className="h-6 w-6 animate-spin" /> Chargement...
            </div>
          )}
          {studentsError && (
            <div className="p-4 text-sm text-rose-600 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" /> {studentsError}
            </div>
          )}
          {!studentsLoading && filteredStudents.length === 0 && !studentsError && (
            <div className="p-8 text-center text-slate-400 text-sm">
              Aucun étudiant trouvé.
            </div>
          )}

          {!studentsLoading && filteredStudents.length > 0 && !studentsError && (
            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold">Photo</th>
                  <th className="px-6 py-4 font-bold">Étudiant</th>
                  <th className="px-6 py-4 font-bold">Code</th>
                  <th className="px-6 py-4 font-bold">Inscription</th>
                  <th className="px-6 py-4 font-bold">Bio</th>
                  <th className="px-6 py-4 font-bold">Accès Débloqués</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                {filteredStudents.map(s => {
                  const isSelected = s.id === selectedStudentId;
                  const daysCount = s.pyflow_unlocked_days?.length || 0;
                  const projCount = s.pyflow_unlocked_projects?.length || 0;

                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectStudent(s.id)}
                      className={`cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30 ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}
                    >
                      <td className="px-6 py-4">
                        {s.profile_picture_url ? (
                          <img src={s.profile_picture_url} alt={s.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border border-slate-300 dark:border-slate-600">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{s.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg">
                          {s.student_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        {new Date(s.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400 max-w-[150px] truncate italic">
                          {s.bio ? `"${s.bio}"` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-indigo-400" /> {daysCount}/28 cours</span>
                          <span className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-emerald-400" /> {projCount} projets</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={e => { e.stopPropagation(); onDelete(s.id, s.name); }}
                          title="Supprimer l'étudiant"
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer inline-flex">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── RIGHT: DETAIL PANEL ────────────────────────────────────────────── */}
      <div className={`flex-1 flex-col apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden ${selectedStudent ? 'flex' : 'hidden'}`}>
        {selectedStudent && (
          <>
            {/* Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => onSelectStudent(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                      <X className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedStudent.name}</h2>
                  </div>
                  <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400 mt-1">{selectedStudent.student_code}</p>
                  {selectedStudent.email && <p className="text-xs text-slate-500 mt-1">{selectedStudent.email}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={onLockAll} className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer">
                    <Lock className="h-3 w-3" /> Bloquer
                  </button>
                  <button onClick={onUnlockAll} className="px-3 py-2 bg-indigo-100 dark:bg-indigo-500/20 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer">
                    <Unlock className="h-3 w-3" /> Débloquer
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setStudentDetailTab('access')}
                className={`flex-1 py-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${studentDetailTab === 'access' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
              >
                🔒 Accès & Contenus
              </button>
              <button
                onClick={() => setStudentDetailTab('progress')}
                className={`flex-1 py-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${studentDetailTab === 'progress' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
              >
                📈 Progression détaillée
              </button>
              <button
                onClick={() => setStudentDetailTab('badges')}
                className={`flex-1 py-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${studentDetailTab === 'badges' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
              >
                🏆 Badges
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {studentDetailTab === 'access' ? (
                <div className="space-y-8">
                  {/* Days */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                      Jours de formation ({localDays.length}/28)
                    </h3>
                    <div className="space-y-4">
                      {phases.map((phase, pIdx) => {
                        const phaseUnlocked = phase.days.filter(d => localDays.includes(d.id)).length;
                        return (
                          <div key={pIdx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{phase.name}</span>
                              <span className="text-xs font-mono text-slate-500">{phaseUnlocked}/{phase.days.length}</span>
                            </div>
                            <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                              {phase.days.map(day => {
                                const isUnlocked = localDays.includes(day.id);
                                return (
                                  <button key={day.id} onClick={() => onToggleDay(day.id)}
                                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${isUnlocked
                                        ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-300'
                                      }`}>
                                    J-{day.id}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                      Projets Pratiques ({localProjects.length}/{projects.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projects.map(proj => {
                        const isUnlocked = localProjects.includes(proj.id);
                        return (
                          <button key={proj.id} onClick={() => onToggleProject(proj.id)}
                            className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${isUnlocked ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                              }`}>
                            <div className="truncate pr-4">
                              <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-lg ${isUnlocked ? 'bg-emerald-200 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}>{proj.level}</span>
                              <div className={`font-bold text-sm truncate mt-2 ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{proj.title}</div>
                            </div>
                            {isUnlocked ? <CheckSquare className="h-5 w-5 text-emerald-500 shrink-0" /> : <Square className="h-5 w-5 text-slate-300 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : studentDetailTab === 'progress' ? (
                /* Progress Tab */
                <div className="space-y-6">
                  {studentProgressLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                      <RefreshCw className="h-8 w-8 animate-spin mb-4" />
                      <p>Chargement des statistiques...</p>
                    </div>
                  ) : (() => {
                    const prog = selectedStudentProgress || { streak: 0, completed_days: [], completed_quizzes: {}, completed_challenges: {} };
                    const quizzesCount = Object.keys(prog.completed_quizzes || {}).filter(k => prog.completed_quizzes?.[k]).length;
                    const challengesCount = Object.keys(prog.completed_challenges || {}).length;
                    const totalExercises = quizzesCount + challengesCount;
                    const completedDaysCount = prog.completed_days?.length || 0;
                    
                    const completedPhases = new Set(
                      courseDays.filter(d => (prog.completed_days || []).includes(d.id)).map(d => d.phase)
                    ).size;
                    
                    const rankIndex = students
                      .map(s => ({
                        id: s.id,
                        score: s.pyflow_progress && s.pyflow_progress[0] ? (s.pyflow_progress[0].completed_days?.length || 0) * 10 + s.pyflow_progress[0].streak : 0
                      }))
                      .sort((a, b) => b.score - a.score)
                      .findIndex(l => l.id === selectedStudent.id);
                    const currentRank = rankIndex >= 0 ? rankIndex + 1 : '-';
                    
                    const daysSinceJoin = Math.max(1, Math.floor((Date.now() - new Date(selectedStudent.created_at).getTime()) / (1000 * 60 * 60 * 24)));
                    const freqPercentage = Math.round((completedDaysCount / daysSinceJoin) * 100);
                    const trainingFrequency = freqPercentage > 50 ? "Intensive" : freqPercentage > 20 ? "Régulière" : "Occasionnelle";
                    
                    const unlockedBadgesCount = (completedDaysCount > 0 ? 1 : 0) + (prog.streak >= 7 ? 1 : 0) + (challengesCount >= 5 ? 1 : 0) + 1;

                    return (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <BookOpen className="h-5 w-5 text-indigo-500 mb-2" />
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider text-center">Chapitres (Phases)</p>
                            <p className="text-xl font-black text-indigo-900 dark:text-indigo-100 mt-1">{completedPhases}</p>
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <CheckSquare className="h-5 w-5 text-emerald-500 mb-2" />
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider text-center">Cours suivis</p>
                            <p className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-1">{completedDaysCount}</p>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <Target className="h-5 w-5 text-blue-500 mb-2" />
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider text-center">Exercices faits</p>
                            <p className="text-xl font-black text-blue-900 dark:text-blue-100 mt-1">{totalExercises}</p>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <Medal className="h-5 w-5 text-amber-500 mb-2" />
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider text-center">Rang actuel</p>
                            <p className="text-xl font-black text-amber-900 dark:text-amber-100 mt-1">#{currentRank}</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-500/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <Award className="h-5 w-5 text-purple-500 mb-2" />
                            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider text-center">Badges débloqués</p>
                            <p className="text-xl font-black text-purple-900 dark:text-purple-100 mt-1">{unlockedBadgesCount}</p>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-500/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <Flame className="h-5 w-5 text-orange-500 mb-2" />
                            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider text-center">Entraînement</p>
                            <p className="text-lg font-black text-orange-900 dark:text-orange-100 mt-1 text-center">{trainingFrequency}</p>
                          </div>
                        </div>

                        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mt-6">
                          <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            Détail des jours complétés
                            <span className="text-xs font-mono text-slate-500">{completedDaysCount} jours au total</span>
                          </div>
                          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                            {(prog.completed_days || []).map(dayId => (
                              <div key={dayId} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">Jour {dayId}</span>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">Complété</span>
                              </div>
                            ))}
                            {completedDaysCount === 0 && (
                              <div className="p-8 text-center text-sm text-slate-500">Aucun jour complété pour le moment.</div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : studentDetailTab === 'badges' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="h-4 w-4 text-indigo-500" /> Badges attribués ({localBadges.length})
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: '1', title: 'Premier Pas', icon: '⭐', desc: 'A terminé son premier chapitre.' },
                      { id: '2', title: 'Codeur Assidu', icon: '⚡', desc: 'A complété 10 exercices pratiques.' },
                      { id: '3', title: 'Maître Python', icon: '👑', desc: 'A fini tous les modules de base.' },
                    ].map(badge => {
                      const isUnlocked = localBadges.includes(badge.id);
                      return (
                        <div key={badge.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${isUnlocked ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${isUnlocked ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 opacity-50'}`}>
                              {badge.icon}
                            </div>
                            <div>
                              <div className={`font-bold text-sm ${isUnlocked ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'}`}>{badge.title}</div>
                              <div className="text-[10px] text-slate-500">{badge.desc}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleToggleBadge(badge.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${isUnlocked ? 'bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/20 dark:hover:bg-rose-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                          >
                            {isUnlocked ? 'Retirer' : 'Attribuer'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="p-4 mt-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex gap-3 text-amber-800 dark:text-amber-200 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>Cette section permet d'attribuer ou retirer manuellement des badges. Certains badges peuvent se débloquer automatiquement selon les critères définis dans la gestion globale des badges.</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer Actions */}
            {studentDetailTab === 'access' && (
              <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  {saveMsg && (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${saveMsg.includes('✅') ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'}`}>
                      {saveMsg}
                    </span>
                  )}
                </div>
                <button onClick={onSaveAccess} disabled={saving} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                  {saving && <RefreshCw className="h-4 w-4 animate-spin" />}
                  Sauvegarder les accès
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
