import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock, BookOpen } from 'lucide-react';
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
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold uppercase tracking-wider">
            {course.level}
          </span>
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
          <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">{completedDays}/{totalDays} Jours</span>
          <span className="text-white font-bold text-sm mt-1">complété</span>
        </div>
      </div>

      <div className="pt-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          Programme du cours - {totalDays} jours
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {daysForCourse.map((day, idx) => {
            const isDayCompleted = progress.completedDays.includes(day.id);
            const isDayLocked = !unlockedDays.includes(day.id);
            
            return (
              <motion.button
                key={day.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectDay(day.id)}
                className={`relative p-5 rounded-2xl border text-left transition-all overflow-hidden group cursor-pointer ${
                  isDayCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50 hover:shadow-md'
                    : isDayLocked
                    ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-75'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                    isDayCompleted
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-300'
                      : isDayLocked
                      ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
                  }`}>
                    J-{idx + 1}
                  </span>
                  
                  {isDayCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : isDayLocked ? (
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
                  ) : null}
                </div>
                
                <h3 className={`font-bold text-base mb-2 line-clamp-1 ${
                  isDayCompleted ? 'text-emerald-950 dark:text-emerald-100' : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {day.title}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {day.description}
                </p>
                
                {!isDayLocked && !isDayCompleted && (
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 dark:group-hover:border-indigo-400/20 rounded-2xl transition-colors pointer-events-none"></div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
