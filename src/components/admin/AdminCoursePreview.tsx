import { ArrowLeft, BookOpen, Clock, Users, PlayCircle, Lock, Tag } from 'lucide-react';
import { Course } from '../../types';

interface AdminCoursePreviewProps {
  course: Course;
  onBack: () => void;
}

export default function AdminCoursePreview({ course, onBack }: AdminCoursePreviewProps) {
  // Calculer le nombre total de leçons actives
  const totalLessons = course.chapters.reduce((total, chapter) => {
    return total + (chapter.isActive !== false ? chapter.lessons.filter(l => l.isActive !== false).length : 0);
  }, 0);

  // Filtrer les chapitres actifs
  const activeChapters = course.chapters.filter(c => c.isActive !== false);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Admin - Sticky */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 rounded-b-2xl shadow-sm mb-6 -mt-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Mode Aperçu (Étudiant)</h2>
            <p className="text-xs text-slate-500">Voici comment les étudiants voient ce cours.</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-500/30 flex items-center gap-2">
          <EyeIcon className="h-3 w-3" /> Aperçu
        </div>
      </div>

      {/* Hero Banner (Inspiré de CourseDetailView) */}
      <div className="bg-indigo-600 dark:bg-indigo-700 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-lg relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 space-y-4 max-w-2xl text-white">
          <div className="flex flex-wrap gap-2">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold uppercase tracking-wider">
              {course.status}
            </span>
            {course.technologies.map(tech => (
              <span key={tech} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/50 backdrop-blur-md rounded-full text-xs font-bold border border-indigo-400/30">
                <Tag className="h-3 w-3" /> {tech}
              </span>
            ))}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-tight drop-shadow-sm">
            {course.title}
          </h1>
          <p className="text-indigo-50 text-lg leading-relaxed max-w-xl">
            {course.description || "Aucune description fournie."}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl min-w-[200px]">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-3">
              <BookOpen className="h-6 w-6 text-indigo-200" />
              <span className="text-2xl font-black text-white">{totalLessons}</span>
            </div>
            <span className="text-indigo-100 font-semibold text-sm uppercase tracking-wider block">Leçons au total</span>
            <hr className="border-indigo-400/30 w-full" />
            <div className="flex justify-center items-center gap-2 text-indigo-100">
              <Users className="h-4 w-4" />
              <span className="text-sm font-bold">{course.studentCount} inscrits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Programme (Liste des chapitres) */}
      <div className="pt-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <LayoutGridIcon className="h-5 w-5 text-indigo-500" />
          Programme détaillé
        </h2>

        {activeChapters.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
            <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Ce cours est actuellement vide. Aucun chapitre actif.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeChapters.map((chapter, chapIndex) => {
              const activeLessons = chapter.lessons.filter(l => l.isActive !== false);
              
              return (
                <div key={chapter.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Chapitre {chapIndex + 1}</p>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">{chapter.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <PlayCircle className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{activeLessons.length} leçons</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {activeLessons.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-500">
                        Ce chapitre ne contient aucune leçon active.
                      </div>
                    ) : (
                      activeLessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="p-4 sm:p-6 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{lessonIndex + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{lesson.title}</h4>
                            {lesson.description && (
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{lesson.description}</p>
                            )}
                          </div>
                          <div className="shrink-0 flex items-center">
                            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                              Commencer
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Composants SVG inline pour éviter les soucis d'import
function EyeIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LayoutGridIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
