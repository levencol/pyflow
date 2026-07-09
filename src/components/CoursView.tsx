import { useState } from 'react';
import { BookOpen, CheckCircle2, Lock, ArrowLeft, Clock, TrendingUp, Star, Play, ChevronRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseDay, UserProgress, PhaseType } from '../types';
import { courseDays } from '../data/curriculum';

interface CoursViewProps {
  progress: UserProgress;
  onSelectDay: (dayId: number) => void;
  unlockedDays: number[];
}

interface CourseDefinition {
  id: PhaseType;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  levelColor: string;
  gradient: string;
  accentColor: string;
  accentBg: string;
  image: string;
  tags: string[];
  days: CourseDay[];
}

export default function CoursView({ progress, onSelectDay, unlockedDays = [] }: CoursViewProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseDefinition | null>(null);

  const courseDefinitions: CourseDefinition[] = [
    {
      id: 'Débutant',
      title: 'Introduction à Python',
      subtitle: 'Les fondamentaux du langage',
      description: 'Partez de zéro et découvrez Python, le langage le plus populaire au monde. Apprenez les bases : variables, conditions, boucles, fonctions et collections de données. À la fin de ce cours, vous serez capable d\'écrire vos premiers programmes Python.',
      level: 'Débutant',
      levelColor: 'text-emerald-700 dark:text-emerald-300',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
      tags: ['Variables', 'Conditions', 'Boucles', 'Fonctions', 'Listes', 'Dictionnaires'],
      days: courseDays.filter(d => d.phase === 'Débutant'),
    },
    {
      id: 'Intermédiaire',
      title: 'Python Intermédiaire',
      subtitle: 'Données, fichiers et APIs',
      description: 'Franchissez un palier supérieur avec Python. Apprenez à manipuler des fichiers, interagir avec des APIs web, gérer les exceptions et structurer votre code en modules réutilisables. Idéal pour consolider vos acquis.',
      level: 'Intermédiaire',
      levelColor: 'text-blue-700 dark:text-blue-300',
      gradient: 'from-blue-500 via-indigo-500 to-violet-600',
      accentColor: 'text-blue-600 dark:text-blue-400',
      accentBg: 'bg-blue-50 dark:bg-blue-950/30',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
      tags: ['Fichiers', 'APIs REST', 'Exceptions', 'Modules', 'JSON', 'Regex'],
      days: courseDays.filter(d => d.phase === 'Intermédiaire'),
    },
    {
      id: 'Expert',
      title: 'Python Avancé',
      subtitle: 'POO, SQL & Machine Learning',
      description: 'Maîtrisez les concepts avancés de Python : programmation orientée objet, bases de données SQL, et introduction au Machine Learning avec les bibliothèques les plus utilisées dans l\'industrie.',
      level: 'Avancé',
      levelColor: 'text-purple-700 dark:text-purple-300',
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-600',
      accentColor: 'text-purple-600 dark:text-purple-400',
      accentBg: 'bg-purple-50 dark:bg-purple-950/30',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      tags: ['POO', 'SQL', 'NumPy', 'Pandas', 'Machine Learning', 'Sklearn'],
      days: courseDays.filter(d => d.phase === 'Expert'),
    },
  ];

  // Identify next recommended day globally
  const getNextRecommendedDay = (): CourseDay => {
    const sortedDays = [...courseDays].sort((a, b) => a.id - b.id);
    for (const d of sortedDays) {
      if (!progress.completedDays.includes(d.id)) return d;
    }
    return sortedDays[sortedDays.length - 1];
  };
  const nextDay = getNextRecommendedDay();

  // ──────────────────────────────────────────────
  // COURSE DETAIL VIEW
  // ──────────────────────────────────────────────
  if (selectedCourse) {
    const { days, gradient, accentColor, accentBg } = selectedCourse;
    const completed = days.filter(d => progress.completedDays.includes(d.id)).length;
    const total = days.length;
    const percent = Math.round((completed / total) * 100);

    return (
      <motion.div
        key="detail"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="space-y-6"
      >
        {/* Back button */}
        <button
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour aux cours
        </button>

        {/* Course header banner */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-8 text-white shadow-xl`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-xl" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3">
              <img src={selectedCourse.image} alt={selectedCourse.title} className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover shadow-2xl border-2 border-white/20" />
              <div>
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 backdrop-blur-sm">
                  {selectedCourse.level}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black leading-tight">{selectedCourse.title}</h1>
                <p className="text-white/80 text-sm mt-1">{selectedCourse.subtitle}</p>
              </div>
            </div>
            <div className="shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 min-w-36 text-center border border-white/20">
              <div className="text-3xl font-black">{percent}%</div>
              <div className="text-xs text-white/70 mt-0.5">complété</div>
              <div className="mt-2 bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="text-xs text-white/60 mt-1.5">{completed}/{total} jours</div>
            </div>
          </div>
        </div>

        {/* Days grid */}
        <div className="apple-glass dark:apple-glass-dark rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base">
              Programme du cours — {total} jours
            </h2>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${accentBg} ${accentColor}`}>
              {completed} terminé{completed > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
            {days.map((day) => {
              const isCompleted = progress.completedDays.includes(day.id);
              const isCurrent = day.id === nextDay.id;
              const isLocked = !unlockedDays.includes(day.id);

              if (isLocked) {
                return (
                  <button
                    key={day.id}
                    onClick={() => onSelectDay(day.id)}
                    className="relative flex flex-col justify-between items-start text-left p-4 rounded-2xl border border-slate-100 dark:border-slate-800 h-32 cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 opacity-60"
                    title="Verrouillé par l'administration"
                  >
                    <div className="flex w-full items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-slate-200/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        J-{day.id}
                      </span>
                      <Lock className="h-4 w-4 text-slate-400 dark:text-slate-600 shrink-0" />
                    </div>
                    <div className="space-y-1 w-full">
                      <h4 className="font-bold text-slate-500 dark:text-slate-500 text-xs leading-tight line-clamp-2">
                        {day.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 capitalize">Bloqué</p>
                    </div>
                  </button>
                );
              }

              return (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  key={day.id}
                  onClick={() => onSelectDay(day.id)}
                  className={`relative flex flex-col justify-between items-start text-left p-4 rounded-2xl border transition-all h-32 cursor-pointer group ${
                    isCompleted
                      ? 'bg-emerald-50/40 dark:bg-emerald-900/10 border-emerald-200/60 dark:border-emerald-800 hover:border-emerald-300 shadow-2xs'
                      : isCurrent
                      ? 'bg-indigo-50/40 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-800'
                      : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
                  }`}
                >
                  <div className="flex w-full items-center justify-between mb-1">
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg transition-colors ${
                      isCompleted
                        ? 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400'
                        : isCurrent
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30'
                    }`}>
                      J-{day.id}
                    </span>
                    {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                    {isCurrent && <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {day.title}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate w-full">
                      {day.topics.length} concepts
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────
  // CATALOG VIEW — 3 cours séparés
  // ──────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="catalog"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display">Mes Cours Python</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              3 cours disponibles
            </p>
          </div>
        </div>

        {/* Global progress summary 
        <div className="grid grid-cols-3 gap-4">
          {courseDefinitions.map((course) => {
            const done = course.days.filter(d => progress.completedDays.includes(d.id)).length;
            const total = course.days.length;
            return (
              <div key={course.id} className="apple-glass dark:apple-glass-dark rounded-2xl p-4 text-center space-y-1">
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono">{done}/{total}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{course.level}</div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${course.gradient} transition-all duration-700`}
                    style={{ width: `${Math.round((done / total) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>*/}

        {/* Course cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {courseDefinitions.map((course, idx) => {
            const done = course.days.filter(d => progress.completedDays.includes(d.id)).length;
            const total = course.days.length;
            const percent = Math.round((done / total) * 100);
            const isStarted = done > 0;
            const isComplete = done === total;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4, ease: 'easeOut' }}
                className="group cursor-pointer"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  {/* Thumbnail gradient area */}
                  <div className={`relative h-44 bg-gradient-to-br ${course.gradient} flex items-center justify-center overflow-hidden`}>
                    <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
                    
                    {/* Level badge */}
                    <span className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                      {course.level}
                    </span>

                    {/* Complete badge */}
                    {isComplete && (
                      <div className="absolute top-4 right-4 z-10 bg-white text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="h-3 w-3" />
                        Terminé
                      </div>
                    )}
                  </div>

                  {/* Course content */}
                  <div className="flex flex-col flex-1 p-5 space-y-4">
                    <div className="space-y-1.5">
                      <h2 className="font-display font-black text-slate-900 dark:text-white text-lg leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </h2>
                      <p className={`text-xs font-semibold ${course.accentColor}`}>{course.subtitle}</p>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {course.tags.slice(0, 4).map(tag => (
                        <span
                          key={tag}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${course.accentBg} ${course.accentColor}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 4 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          +{course.tags.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {total} jours
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {course.level}
                      </span>
                      {/*<span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        4.9
                      </span>*/}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {isStarted ? `${done}/${total} leçons complétées` : 'Pas encore commencé'}
                        </span>
                        <span className={`text-[11px] font-bold ${course.accentColor}`}>{percent}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${course.gradient} transition-all duration-700`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 bg-gradient-to-r ${course.gradient} text-white shadow-sm hover:shadow-md hover:brightness-105`}
                      onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); }}
                    >
                      {isComplete ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Revoir le cours
                        </>
                      ) : isStarted ? (
                        <>
                          <Play className="h-4 w-4 fill-white" />
                          Continuer
                          <ChevronRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-white" />
                          Commencer
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom info strip */}
        <div className="apple-glass dark:apple-glass-dark rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <Users className="h-5 w-5 text-indigo-400 shrink-0" />
          <p>
            Suivez les cours dans l'ordre recommandé pour une progression optimale : commencez par <strong className="text-slate-700 dark:text-slate-300">Introduction à Python</strong>, puis <strong className="text-slate-700 dark:text-slate-300">Python Intermédiaire</strong>, et enfin <strong className="text-slate-700 dark:text-slate-300">Python Avancé</strong>.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
