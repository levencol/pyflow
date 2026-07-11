import React, { useState } from 'react';
import { Course, Chapter, Lesson, QuizQuestion, CodingChallenge } from '../../types';
import { quizQuestions as initialQuizzes, codingChallenges as initialChallenges } from '../../data/exercises';
import AdminQuizForm from './AdminQuizForm';
import AdminChallengeForm from './AdminChallengeForm';
import { PlusCircle, Edit3, Trash2, Folder, FileText, ChevronDown, ChevronRight, HelpCircle, Code2 } from 'lucide-react';

interface AdminExercisesViewProps {
  course: Course;
}

export default function AdminExercisesView({ course }: AdminExercisesViewProps) {
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(initialQuizzes);
  const [challenges, setChallenges] = useState<CodingChallenge[]>(initialChallenges);

  // Expanded nodes in the tree
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  
  // Selection
  const [selectedNode, setSelectedNode] = useState<{type: 'chapter' | 'lesson', id: string, name: string} | null>(null);

  // Forms
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);
  
  const [isChallengeFormOpen, setIsChallengeFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<CodingChallenge | null>(null);

  const toggleChapter = (chapterId: string) => {
    if (expandedChapters.includes(chapterId)) {
      setExpandedChapters(expandedChapters.filter(id => id !== chapterId));
    } else {
      setExpandedChapters([...expandedChapters, chapterId]);
    }
  };

  const handleSaveQuiz = (quiz: QuizQuestion) => {
    if (editingQuiz) {
      setQuizzes(quizzes.map(q => q.id === quiz.id ? quiz : q));
    } else {
      setQuizzes([...quizzes, quiz]);
    }
    setIsQuizFormOpen(false);
    setEditingQuiz(null);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm("Supprimer ce quiz ?")) {
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    }
  };

  const handleSaveChallenge = (challenge: CodingChallenge) => {
    if (editingChallenge) {
      setChallenges(challenges.map(c => c.id === challenge.id ? challenge : c));
    } else {
      setChallenges([...challenges, challenge]);
    }
    setIsChallengeFormOpen(false);
    setEditingChallenge(null);
  };

  const handleDeleteChallenge = (challengeId: string) => {
    if (confirm("Supprimer ce défi de code ?")) {
      setChallenges(challenges.filter(c => c.id !== challengeId));
    }
  };

  const renderQuizList = (lessonId: string | number) => {
    const lessonQuizzes = quizzes.filter(q => q.lessonId === lessonId);
    
    return (
      <div className="space-y-2 mt-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-indigo-500" /> Quiz associés ({lessonQuizzes.length})
        </h4>
        {lessonQuizzes.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Aucun quiz pour cette leçon.</p>
        ) : (
          <div className="space-y-2">
            {lessonQuizzes.map(q => (
              <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex justify-between items-center group">
                <div className="truncate pr-4 flex-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{q.question}</p>
                  <p className="text-[10px] text-slate-500">{q.options.length} options</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingQuiz(q); setIsQuizFormOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteQuiz(q.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button 
          onClick={() => { setEditingQuiz(null); setIsQuizFormOpen(true); }}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-2"
        >
          <PlusCircle className="h-3 w-3" /> Ajouter un Quiz
        </button>
      </div>
    );
  };

  const renderChallengeList = (chapterId: string) => {
    const chapChallenges = challenges.filter(c => c.chapterId === chapterId);
    
    return (
      <div className="space-y-2 mt-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
          <Code2 className="h-4 w-4 text-emerald-500" /> Défis associés ({chapChallenges.length})
        </h4>
        {chapChallenges.length === 0 ? (
          <p className="text-xs text-slate-500 italic">Aucun défi pour ce chapitre.</p>
        ) : (
          <div className="space-y-2">
            {chapChallenges.map(c => (
              <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex justify-between items-center group">
                <div className="truncate pr-4 flex-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{c.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{c.description}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingChallenge(c); setIsChallengeFormOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteChallenge(c.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button 
          onClick={() => { setEditingChallenge(null); setIsChallengeFormOpen(true); }}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-2"
        >
          <PlusCircle className="h-3 w-3" /> Ajouter un Défi
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in h-[600px]">
      
      {/* Sidebar: Hierarchy */}
      <div className="w-full lg:w-1/3 apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-4 overflow-y-auto">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Arborescence</h3>
        <div className="space-y-1">
          {course.chapters.map(chapter => (
            <div key={chapter.id} className="space-y-1">
              {/* Chapter Node */}
              <div 
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${selectedNode?.id === chapter.id ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                onClick={() => setSelectedNode({ type: 'chapter', id: chapter.id, name: chapter.title })}
              >
                <button onClick={(e) => { e.stopPropagation(); toggleChapter(chapter.id); }} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                  {expandedChapters.includes(chapter.id) ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
                <Folder className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-bold truncate">{chapter.title}</span>
              </div>

              {/* Lesson Nodes */}
              {expandedChapters.includes(chapter.id) && (
                <div className="ml-6 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                  {chapter.lessons.map(lesson => (
                    <div 
                      key={lesson.id} 
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${selectedNode?.id === lesson.id.toString() ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      onClick={() => setSelectedNode({ type: 'lesson', id: lesson.id.toString(), name: lesson.title })}
                    >
                      <FileText className="h-4 w-4 text-indigo-500" />
                      <span className="text-xs font-medium truncate">{lesson.title}</span>
                    </div>
                  ))}
                  {chapter.lessons.length === 0 && (
                    <p className="text-[10px] text-slate-400 italic p-2">Aucune leçon</p>
                  )}
                </div>
              )}
            </div>
          ))}
          {course.chapters.length === 0 && (
            <p className="text-xs text-slate-500 italic p-2">Aucun chapitre dans ce cours.</p>
          )}
        </div>
      </div>

      {/* Main Panel: Editor */}
      <div className="flex-1 apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 overflow-y-auto">
        {!selectedNode ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <HelpCircle className="h-12 w-12 mb-4 opacity-20" />
            <p>Sélectionnez un Chapitre ou une Leçon</p>
            <p className="text-xs mt-2 text-center max-w-sm">Les Défis de code se gèrent au niveau du Chapitre. Les Quiz se gèrent au niveau de la Leçon.</p>
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              {selectedNode.type === 'chapter' ? 'Chapitre : ' : 'Leçon : '} {selectedNode.name}
            </h3>
            
            {/* Forms */}
            {isQuizFormOpen && selectedNode.type === 'lesson' && (
              <AdminQuizForm 
                initialData={editingQuiz} 
                lessonId={selectedNode.id} 
                onSave={handleSaveQuiz} 
                onCancel={() => { setIsQuizFormOpen(false); setEditingQuiz(null); }} 
              />
            )}
            
            {isChallengeFormOpen && selectedNode.type === 'chapter' && (
              <AdminChallengeForm 
                initialData={editingChallenge} 
                chapterId={selectedNode.id} 
                onSave={handleSaveChallenge} 
                onCancel={() => { setIsChallengeFormOpen(false); setEditingChallenge(null); }} 
              />
            )}

            {/* Lists */}
            {!isQuizFormOpen && !isChallengeFormOpen && (
              <>
                {selectedNode.type === 'lesson' && renderQuizList(selectedNode.id)}
                {selectedNode.type === 'chapter' && renderChallengeList(selectedNode.id)}
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
