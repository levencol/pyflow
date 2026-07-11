import { useState } from 'react';
import { BookOpen, Trophy, Edit3, Eye, EyeOff, FileText, ChevronRight, ChevronUp, ChevronDown, PlusCircle, ArrowLeft, Users, Calendar, Settings, LayoutGrid, Trash2 } from 'lucide-react';
import { Course, Chapter, Lesson } from '../../types';
import { projects } from '../../data/projects';
import { courseDays } from '../../data/curriculum';
import AdminCourseRootForm from './AdminCourseRootForm';
import AdminChapterForm from './AdminChapterForm';
import AdminLessonForm from './AdminLessonForm';
import AdminCoursePreview from './AdminCoursePreview';
import AdminLessonDetailView from './AdminLessonDetailView';
import AdminLessonEditView from './AdminLessonEditView';
import AdminExercisesView from './AdminExercisesView';
import { HelpCircle } from 'lucide-react';

// Mock Data pour les cours hiérarchiques
const initialMockCourses: Course[] = [
  {
    id: 'python-masterclass',
    title: 'Python Masterclass : Zéro à Héros',
    status: 'Publié',
    createdAt: '2025-01-15',
    updatedAt: '2026-06-20',
    description: 'Le parcours complet pour maîtriser Python 3. De l\'installation aux concepts avancés (POO, décorateurs, générateurs). Idéal pour les débutants et la reconversion.',
    studentCount: 1245,
    duration: 15,
    technologies: ['Python', 'VS Code', 'Git'],
    chapters: [
      {
        id: 'ch-1',
        title: 'Phase 1 : Les Fondamentaux',
        lessons: courseDays.slice(0, 3) as Lesson[]
      },
      {
        id: 'ch-2',
        title: 'Phase 2 : Structures de Données',
        lessons: courseDays.slice(3, 5) as Lesson[]
      }
    ]
  },
  {
    id: 'react-bootcamp',
    title: 'React Bootcamp Intensif',
    status: 'Brouillon',
    createdAt: '2026-03-10',
    updatedAt: '2026-07-05',
    description: 'Développement Frontend moderne avec React 19, TypeScript et TailwindCSS. Apprenez à créer des interfaces réactives et performantes.',
    studentCount: 0,
    duration: 20,
    technologies: ['React', 'TypeScript', 'Tailwind'],
    chapters: [
      {
        id: 'ch-react-1',
        title: 'Introduction à React',
        lessons: [
          { id: 101, title: 'Composants et JSX', description: 'Créer son premier composant.' },
          { id: 102, title: 'Les Props et l\'État (useState)', description: 'Rendre l\'interface dynamique.' }
        ] as Lesson[]
      }
    ]
  },
  {
    id: 'data-science',
    title: 'Data Science & Machine Learning',
    status: 'Archivé',
    createdAt: '2024-11-05',
    updatedAt: '2025-12-01',
    description: 'Analyse de données avec Pandas et Numpy, puis introduction aux modèles prédictifs avec Scikit-Learn.',
    studentCount: 890,
    duration: 35,
    technologies: ['Python', 'Pandas', 'Scikit-Learn'],
    chapters: []
  }
];

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'projects'>('lessons');
  const [courses, setCourses] = useState<Course[]>(initialMockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseTab, setCourseTab] = useState<'presentation' | 'chapters' | 'exercises'>('presentation');
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  
  // Formulaire Course
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourseRoot, setEditingCourseRoot] = useState<Course | null>(null);

  // Formulaire Chapitre
  const [isChapterFormOpen, setIsChapterFormOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // Formulaire Leçon
  const [lessonFormChapterId, setLessonFormChapterId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedLessonView, setSelectedLessonView] = useState<Lesson | null>(null);
  const [selectedLessonEdit, setSelectedLessonEdit] = useState<{chapterId: string, lesson: Lesson} | null>(null);

  // Aperçu
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleCreateCourse = () => {
    setEditingCourseRoot(null);
    setIsFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourseRoot(course);
    setIsFormOpen(true);
  };

  const handleSaveCourseRoot = (courseData: Course) => {
    if (editingCourseRoot) {
      setCourses(courses.map(c => c.id === courseData.id ? courseData : c));
      if (selectedCourse?.id === courseData.id) setSelectedCourse(courseData);
    } else {
      setCourses([...courses, courseData]);
    }
    setIsFormOpen(false);
    setEditingCourseRoot(null);
  };

  const handleCreateChapter = () => {
    setEditingChapter(null);
    setIsChapterFormOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setIsChapterFormOpen(true);
  };

  const handleSaveChapter = (chapterData: Chapter) => {
    if (!selectedCourse) return;

    let newChapters;
    if (editingChapter) {
      newChapters = selectedCourse.chapters.map(c => c.id === chapterData.id ? chapterData : c);
    } else {
      newChapters = [...selectedCourse.chapters, chapterData];
    }

    const updatedCourse = { ...selectedCourse, chapters: newChapters };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    setIsChapterFormOpen(false);
    setEditingChapter(null);
  };

  const handleToggleChapterStatus = (chapterId: string) => {
    if (!selectedCourse) return;
    const newChapters = selectedCourse.chapters.map(c => 
      c.id === chapterId ? { ...c, isActive: c.isActive === false ? true : false } : c
    );
    const updatedCourse = { ...selectedCourse, chapters: newChapters };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (!selectedCourse) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chapitre et toutes ses leçons ?')) return;

    const newChapters = selectedCourse.chapters.filter(c => c.id !== chapterId);
    const updatedCourse = { ...selectedCourse, chapters: newChapters };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleCreateLesson = (chapterId: string) => {
    setEditingLesson(null);
    setLessonFormChapterId(chapterId);
  };

  const handleEditLesson = (chapterId: string, lesson: Lesson) => {
    setSelectedLessonEdit({ chapterId, lesson });
  };

  const handleSaveLessonContent = (chapterId: string, lessonData: Lesson) => {
    if (!selectedCourse) return;

    const newChapters = selectedCourse.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        const newLessons = chapter.lessons.map(l => l.id === lessonData.id ? lessonData : l);
        return { ...chapter, lessons: newLessons };
      }
      return chapter;
    });

    const updatedCourse = { ...selectedCourse, chapters: newChapters };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    setSelectedLessonEdit(null);
  };

  const handleSaveLesson = (lessonData: Lesson) => {
    if (!selectedCourse || !lessonFormChapterId) return;

    const newChapters = selectedCourse.chapters.map(chapter => {
      if (chapter.id === lessonFormChapterId) {
        let newLessons;
        if (editingLesson) {
          newLessons = chapter.lessons.map(l => l.id === lessonData.id ? lessonData : l);
        } else {
          newLessons = [...chapter.lessons, lessonData];
        }
        return { ...chapter, lessons: newLessons };
      }
      return chapter;
    });

    const updatedCourse = { ...selectedCourse, chapters: newChapters };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    setLessonFormChapterId(null);
    setEditingLesson(null);
  };

  const handleToggleLessonStatus = (chapterId: string, lessonId: string | number) => {
    if (!selectedCourse) return;
    const newChapters = selectedCourse.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          lessons: chapter.lessons.map(l => l.id === lessonId ? { ...l, isActive: l.isActive === false ? true : false } : l)
        };
      }
      return chapter;
    });
    const updatedCourse = { ...selectedCourse, chapters: newChapters };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string | number) => {
    if (!selectedCourse) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) return;

    const newChapters = selectedCourse.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          lessons: chapter.lessons.filter(l => l.id !== lessonId)
        };
      }
      return chapter;
    });
    const updatedCourse = { ...selectedCourse, chapters: newChapters };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleMoveLesson = (chapterId: string, lessonIndex: number, direction: 'up' | 'down') => {
    if (!selectedCourse) return;
    
    const newChapters = selectedCourse.chapters.map(chapter => {
      if (chapter.id === chapterId) {
        if (direction === 'up' && lessonIndex > 0) {
          const newLessons = [...chapter.lessons];
          [newLessons[lessonIndex - 1], newLessons[lessonIndex]] = [newLessons[lessonIndex], newLessons[lessonIndex - 1]];
          return { ...chapter, lessons: newLessons };
        } else if (direction === 'down' && lessonIndex < chapter.lessons.length - 1) {
          const newLessons = [...chapter.lessons];
          [newLessons[lessonIndex], newLessons[lessonIndex + 1]] = [newLessons[lessonIndex + 1], newLessons[lessonIndex]];
          return { ...chapter, lessons: newLessons };
        }
      }
      return chapter;
    });

    const updatedCourse = { ...selectedCourse, chapters: newChapters };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const toggleChapter = (chapterId: string) => {
    if (expandedChapters.includes(chapterId)) {
      setExpandedChapters(expandedChapters.filter(id => id !== chapterId));
    } else {
      setExpandedChapters([...expandedChapters, chapterId]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Publié':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Publié</span>;
      case 'Brouillon':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Brouillon</span>;
      case 'Archivé':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Archivé</span>;
      default:
        return null;
    }
  };

  // --- VUE DÉTAIL D'UN COURS ---
  if (selectedCourse) {
    if (isFormOpen) {
      return (
        <AdminCourseRootForm
          initialData={editingCourseRoot}
          onSave={handleSaveCourseRoot}
          onCancel={() => setIsFormOpen(false)}
        />
      );
    }

    if (isPreviewMode) {
      return (
        <AdminCoursePreview 
          course={selectedCourse} 
          onBack={() => setIsPreviewMode(false)} 
        />
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header Navigation */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedCourse(null)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">{selectedCourse.title}</h2>
              {getStatusBadge(selectedCourse.status)}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">ID: {selectedCourse.id}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button 
              onClick={() => setIsPreviewMode(true)} 
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Eye className="h-4 w-4" /> Aperçu
            </button>
            <button onClick={() => handleEditCourse(selectedCourse)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors">
              <Settings className="h-4 w-4" /> Paramètres
            </button>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <button 
            onClick={() => setCourseTab('presentation')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 ${
              courseTab === 'presentation' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="h-4 w-4" /> Présentation
          </button>
          <button 
            onClick={() => setCourseTab('chapters')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 ${
              courseTab === 'chapters' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
            }`}
          >
            <LayoutGrid className="h-4 w-4" /> Chapitres & Leçons
          </button>
          <button 
            onClick={() => setCourseTab('exercises')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 ${
              courseTab === 'exercises' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
            }`}
          >
            <HelpCircle className="h-4 w-4" /> Exercices
          </button>
        </div>

        {/* Tab Content: Présentation */}
        {courseTab === 'presentation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Description du Cours</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {selectedCourse.description}
                </p>
              </div>
              <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Technologies enseignées</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider text-slate-500">Métriques</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Étudiants Inscrits</p>
                      <p className="font-black text-slate-900 dark:text-white">{selectedCourse.studentCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Créé le</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedCourse.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Edit3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Dernière mise à jour</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedCourse.updatedAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Chapitres */}
        {courseTab === 'chapters' && (
          <div className="space-y-4 animate-fade-in">
            {selectedLessonEdit ? (
              <AdminLessonEditView
                lesson={selectedLessonEdit.lesson}
                onSave={(updated) => handleSaveLessonContent(selectedLessonEdit.chapterId, updated)}
                onCancel={() => setSelectedLessonEdit(null)}
              />
            ) : selectedLessonView ? (
              <AdminLessonDetailView 
                lesson={selectedLessonView} 
                onBack={() => setSelectedLessonView(null)} 
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Structure du programme</h3>
              {!isChapterFormOpen && (
                <button onClick={handleCreateChapter} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                  <PlusCircle className="h-4 w-4" /> Ajouter un chapitre
                </button>
              )}
            </div>

            {isChapterFormOpen && (
              <AdminChapterForm
                initialData={editingChapter}
                onSave={handleSaveChapter}
                onCancel={() => setIsChapterFormOpen(false)}
              />
            )}

            {selectedCourse.chapters.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
                <p className="text-slate-500 dark:text-slate-400">Ce cours ne contient aucun chapitre pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedCourse.chapters.map((chapter, index) => (
                  <div key={chapter.id} className={`apple-glass dark:apple-glass-dark border rounded-2xl overflow-hidden shadow-sm transition-opacity ${chapter.isActive === false ? 'opacity-60 border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800'}`}>
                    {/* Chapter Header */}
                    <div 
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      onClick={() => toggleChapter(chapter.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`transform transition-transform ${expandedChapters.includes(chapter.id) ? 'rotate-90' : ''}`}>
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        </div>
                        <h4 className={`font-bold ${chapter.isActive === false ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600' : 'text-slate-900 dark:text-white'}`}>Chapitre {index + 1} : {chapter.title}</h4>
                        {chapter.isActive === false && (
                          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">Désactivé</span>
                        )}
                        <span className="text-xs font-mono text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">{chapter.lessons.length} leçons</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className={`p-1.5 transition-colors cursor-pointer ${chapter.isActive === false ? 'text-emerald-500 hover:text-emerald-600' : 'text-amber-500 hover:text-amber-600'}`}
                          title={chapter.isActive === false ? 'Activer le chapitre' : 'Désactiver le chapitre'} 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleToggleChapterStatus(chapter.id);
                          }}
                        >
                          {chapter.isActive === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button 
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" 
                          title="Modifier le chapitre" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleEditChapter(chapter);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer" 
                          title="Supprimer le chapitre" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDeleteChapter(chapter.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons List (Expanded) */}
                    {expandedChapters.includes(chapter.id) && (
                      <div className="p-4 bg-white dark:bg-slate-900">
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                          <div className="col-span-1">ID</div>
                          <div className="col-span-8">Titre de la leçon</div>
                          <div className="col-span-3 text-right">Actions</div>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                          {chapter.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className={`grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group rounded-xl ${lesson.isActive === false ? 'opacity-60' : ''}`}>
                              <div className="col-span-1 font-mono text-xs font-bold text-slate-400">{lesson.id}</div>
                              <div className="col-span-8">
                                <p className={`font-bold text-sm ${lesson.isActive === false ? 'text-slate-500 line-through decoration-slate-300 dark:decoration-slate-600' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {lesson.title}
                                  {lesson.isActive === false && (
                                    <span className="ml-2 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[9px] uppercase font-bold text-slate-600 dark:text-slate-300">Désactivée</span>
                                  )}
                                </p>
                                {lesson.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{lesson.description}</p>}
                              </div>
                              <div className="col-span-3 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  className={`p-1.5 transition-colors cursor-pointer ${lessonIndex === 0 ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600'}`}
                                  onClick={() => handleMoveLesson(chapter.id, lessonIndex, 'up')}
                                  disabled={lessonIndex === 0}
                                  title="Déplacer vers le haut"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </button>
                                <button 
                                  className={`p-1.5 transition-colors cursor-pointer mr-1 ${lessonIndex === chapter.lessons.length - 1 ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600'}`}
                                  onClick={() => handleMoveLesson(chapter.id, lessonIndex, 'down')}
                                  disabled={lessonIndex === chapter.lessons.length - 1}
                                  title="Déplacer vers le bas"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </button>
                                
                                <button 
                                  className={`p-1.5 transition-colors cursor-pointer ${lesson.isActive === false ? 'text-emerald-500 hover:text-emerald-600' : 'text-amber-500 hover:text-amber-600'}`}
                                  title={lesson.isActive === false ? 'Activer' : 'Désactiver'}
                                  onClick={() => handleToggleLessonStatus(chapter.id, lesson.id)}
                                >
                                  {lesson.isActive === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </button>
                                <button 
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                  title="Voir les détails"
                                  onClick={() => setSelectedLessonView(lesson)}
                                >
                                  <FileText className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                  title="Modifier"
                                  onClick={() => handleEditLesson(chapter.id, lesson)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Supprimer"
                                  onClick={() => handleDeleteLesson(chapter.id, lesson.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {lessonFormChapterId === chapter.id && (
                          <AdminLessonForm
                            initialData={editingLesson}
                            onSave={handleSaveLesson}
                            onCancel={() => setLessonFormChapterId(null)}
                          />
                        )}
                        {lessonFormChapterId !== chapter.id && (
                          <div className="mt-3 px-4">
                            <button 
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                              onClick={() => handleCreateLesson(chapter.id)}
                            >
                              <PlusCircle className="h-3 w-3" /> Ajouter une leçon
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            </>
          )}
        </div>
        )}
        
        {/* Tab Content: Exercices */}
        {courseTab === 'exercises' && (
          <AdminExercisesView course={selectedCourse} />
        )}
      </div>
    );
  }

  // --- VUE LISTE PRINCIPALE ---
  if (isFormOpen) {
    return (
      <AdminCourseRootForm
        initialData={editingCourseRoot}
        onSave={handleSaveCourseRoot}
        onCancel={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Gestion du Contenu</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gérez l'ensemble de vos cours, chapitres et projets.</p>
        </div>
        {activeTab === 'lessons' && (
          <button onClick={handleCreateCourse} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20">
            <PlusCircle className="h-4 w-4" /> Créer un nouveau cours
          </button>
        )}
      </div>

      {/* Tabs Principaux */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button 
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'lessons' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Liste des Cours
        </button>
        <button 
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Trophy className="h-4 w-4" /> Projets Pratiques
        </button>
      </div>

      {/* TABLEAU DES COURS */}
      {activeTab === 'lessons' && (
        <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="col-span-2">ID</div>
            <div className="col-span-4">Titre du Cours</div>
            <div className="col-span-1">Durée</div>
            <div className="col-span-2">Statut</div>
            <div className="col-span-2">Création</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-[60vh] overflow-y-auto">
            {courses.map((course) => (
              <div 
                key={course.id} 
                onClick={() => setSelectedCourse(course)}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer"
              >
                <div className="col-span-2 font-mono text-xs font-bold text-slate-400">{course.id}</div>
                <div className="col-span-4">
                  <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate pr-4">{course.description}</p>
                </div>
                <div className="col-span-1 text-slate-500 text-sm font-semibold">
                  {course.duration ? `${course.duration} h` : '-'}
                </div>
                <div className="col-span-2">
                  {getStatusBadge(course.status)}
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-mono text-slate-500">{course.createdAt}</span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABLEAU DES PROJETS (Conservé de l'ancienne version) */}
      {activeTab === 'projects' && (
        <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="col-span-2">ID</div>
            <div className="col-span-5">Titre</div>
            <div className="col-span-2">Niveau</div>
            <div className="col-span-2">Statut</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-[60vh] overflow-y-auto">
            {projects.map((proj) => (
              <div key={proj.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                <div className="col-span-2 font-mono text-xs font-bold text-slate-400 truncate" title={proj.id}>{proj.id.split('_').pop()?.toUpperCase()}</div>
                <div className="col-span-5">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{proj.title}</p>
                </div>
                <div className="col-span-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400">{proj.level}</span>
                </div>
                <div className="col-span-2">
                  {getStatusBadge('Publié')}
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
