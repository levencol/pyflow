import { useState } from 'react';
import { Users, Search, Filter, Shield, Lock, Unlock, Trash2, Trophy, CheckSquare, Square, RefreshCw, X, AlertCircle, BookOpen } from 'lucide-react';
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
  const [studentDetailTab, setStudentDetailTab] = useState<'access' | 'progress'>('access');
  const [selectedDetailDayId, setSelectedDetailDayId] = useState<number>(1);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([0, 1, 2]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.student_code.toLowerCase().includes(search.toLowerCase())
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="space-y-6 animate-fade-in relative h-[calc(100vh-140px)] flex gap-6">
      
      {/* ── LEFT: STUDENT LIST ─────────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden transition-all duration-300 ${selectedStudent ? 'hidden lg:flex lg:flex-none lg:w-1/3' : 'w-full'}`}>
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

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
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

          {filteredStudents.map(s => {
            const isSelected = s.id === selectedStudentId;
            const daysCount = s.pyflow_unlocked_days.length;
            const projCount = s.pyflow_unlocked_projects.length;
            
            return (
              <div 
                key={s.id}
                onClick={() => onSelectStudent(s.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold truncate ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-900 dark:text-white'}`}>
                      {s.name}
                    </p>
                    <p className="text-xs font-mono text-indigo-500 font-semibold mt-0.5">{s.student_code}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {daysCount}/28</span>
                      <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {projCount} proj.</span>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); onDelete(s.id, s.name); }}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: DETAIL PANEL ────────────────────────────────────────────── */}
      <div className={`flex-1 flex-col apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden ${selectedStudent ? 'flex' : 'hidden lg:flex'}`}>
        {!selectedStudent ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Shield className="h-16 w-16 mb-4 text-slate-300 dark:text-slate-700" />
            <h3 className="text-lg font-bold text-slate-500 dark:text-slate-300">Sélectionnez un étudiant</h3>
            <p className="text-sm mt-2 max-w-sm">Cliquez sur un profil dans la liste pour gérer ses accès et suivre sa progression.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => onSelectStudent(null)} className="lg:hidden p-2 bg-slate-200 dark:bg-slate-800 rounded-xl">
                      <X className="h-4 w-4" />
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
                className={`flex-1 py-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  studentDetailTab === 'access' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                🔒 Accès & Contenus
              </button>
              <button
                onClick={() => setStudentDetailTab('progress')}
                className={`flex-1 py-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  studentDetailTab === 'progress' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                📈 Progression détaillée
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
                                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                                      isUnlocked
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
                            className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                              isUnlocked ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            }`}>
                            <div className="truncate pr-4">
                              <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-lg ${
                                isUnlocked ? 'bg-emerald-200 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
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
              ) : (
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
                    
                    return (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-4 text-center">
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Jours</p>
                            <p className="text-2xl font-black text-indigo-900 dark:text-indigo-100 mt-1">{prog.completed_days.length}</p>
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-4 text-center">
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Quiz</p>
                            <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-1">{quizzesCount}</p>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-500/10 rounded-2xl p-4 text-center">
                            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Défis</p>
                            <p className="text-2xl font-black text-orange-900 dark:text-orange-100 mt-1">{Object.keys(prog.completed_challenges || {}).length}</p>
                          </div>
                        </div>

                        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                          <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 font-bold text-sm text-slate-700 dark:text-slate-300">
                            Détail par jour
                          </div>
                          <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {prog.completed_days.map(dayId => (
                              <div key={dayId} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">Jour {dayId}</span>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">Complété</span>
                              </div>
                            ))}
                            {prog.completed_days.length === 0 && (
                              <div className="p-8 text-center text-sm text-slate-500">Aucun jour complété pour le moment.</div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
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
