import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock, BookOpen, PlayCircle, Tag } from 'lucide-react';
import { UserProgress } from '../types';
import { courseDays } from '../data/curriculum';

interface CourseDetailViewProps {
  course: {
    id: string;
    title: string;
    level: string;
    desc: string;
    author: { name: string; role: string; img: string };
    time: string;
    isCompleted: boolean;
    tech: string;
    tags?: string[];
  };
  progress: UserProgress;
  onBack: () => void;
  onSelectDay: (dayId: number) => void;
  unlockedDays: number[];
}

export default function CourseDetailView({ course, progress, onBack, onSelectDay, unlockedDays }: CourseDetailViewProps) {
  // Map course level to phase
  let phaseName = course.level;
  if (course.level === 'Avancé') {
    phaseName = 'Expert';
  }

  const daysForCourse = courseDays.filter(d => d.phase === phaseName);
  const totalDays = daysForCourse.length;
  const completedDays = daysForCourse.filter(d => progress.completedDays.includes(d.id)).length;
  const progressPercent = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  // Group days into chunks to simulate chapters/modules
  const chunkSize = 5;
  const modules = [];
  for (let i = 0; i < daysForCourse.length; i += chunkSize) {
    modules.push(daysForCourse.slice(i, i + chunkSize));
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto space-y-6 pb-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer font-semibold text-sm w-fit"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux cours
      </button>

      {/* Hero Banner */}
      <div className="bg-emerald-600 dark:bg-emerald-700 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-lg relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 space-y-4 max-w-2xl text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold uppercase tracking-wider">
              {course.level}
            </span>
            {course.tags?.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-tight drop-shadow-sm">
            {course.title}
          </h1>
          <p className="text-emerald-50 text-lg leading-relaxed max-w-xl">
            {course.desc}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl min-w-[200px]">
          <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-white drop-shadow-md"
                strokeDasharray={`${progressPercent}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <span className="absolute text-xl font-bold text-white drop-shadow-sm">{progressPercent}%</span>
          </div>
          <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">{completedDays}/{totalDays} Leçons</span>
          <span className="text-white font-bold text-sm mt-1">complété</span>
        </div>
      </div>

      <div className="pt-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          Programme du cours
        </h2>

        <div className="space-y-6">
          {modules.map((chunk, moduleIndex) => {
            return (
              <div key={moduleIndex} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Chapitre {moduleIndex + 1}</p>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Titre du Chapitre</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <PlayCircle className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{chunk.length} Leçons</span>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {chunk.map((day, lessonIndex) => {
                    const isDayCompleted = progress.completedDays.includes(day.id);
                    const isDayLocked = !unlockedDays.includes(day.id);

                    return (
                      <div 
                        key={day.id} 
                        onClick={() => { if (!isDayLocked) onSelectDay(day.id); }}
                        className={`p-4 sm:p-6 flex items-center gap-4 transition-colors group ${
                          isDayLocked ? 'opacity-75 cursor-not-allowed bg-slate-50 dark:bg-slate-800/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isDayCompleted 
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' 
                            : isDayLocked
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        }`}>
                          {isDayCompleted ? <CheckCircle2 className="h-5 w-5" /> : isDayLocked ? <Lock className="h-4.5 w-4.5" /> : <span className="text-sm font-bold">{moduleIndex * chunkSize + lessonIndex + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-base transition-colors ${
                            isDayCompleted ? 'text-emerald-950 dark:text-emerald-100' : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}>
                            {day.title}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{day.description}</p>
                        </div>
                        <div className="shrink-0 flex items-center">
                          {!isDayLocked && (
                            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                              {isDayCompleted ? 'Revoir' : 'Commencer'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
