import { useState, useEffect, useMemo, useRef } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle2, Terminal, Play, RotateCcw, Copy, Flame, Lock, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CourseDay, UserProgress } from '../types';
import { courseDays } from '../data/curriculum';
import { PythonHighlighter } from '../utils/pythonHighlighter';
import { runPythonCode } from '../utils/pythonRunner';
import { generateDayQuizzes } from '../data/exercises';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

interface CourseViewProps {
  dayId: number;
  progress: UserProgress;
  onToggleCompleteDay: (dayId: number) => void;
  onSelectDay: (dayId: number) => void;
  onGoToExercises: () => void;
  unlockedDays: number[];
  isAdminAuthenticated: boolean;
}

export default function CourseView({ dayId, progress, onToggleCompleteDay, onSelectDay, onGoToExercises, unlockedDays, isAdminAuthenticated }: CourseViewProps) {
  const currentDay = courseDays.find(d => d.id === dayId) || courseDays[0];
  const isCompleted = progress.completedDays.includes(currentDay.id);
  const isLocked = !unlockedDays.includes(currentDay.id);

  // Live code execution simulator states
  const [code, setCode] = useState(currentDay.codeExample);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Detect mobile to disable code editor
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  }, []);

  // Compute quiz completion for this day (15 required to validate)
  const dayQuizzes = useMemo(() => generateDayQuizzes(currentDay.id), [currentDay.id]);
  const completedDayQuizzesCount = dayQuizzes.filter(q => progress.completedQuizzes[q.id]).length;
  const totalDayQuizzes = dayQuizzes.length;
  const quizGatePassed = completedDayQuizzesCount >= 15;

  // Reset code when changing day
  useEffect(() => {
    setCode(currentDay.codeExample);
    setOutput('');
  }, [currentDay]);

  if (isLocked) {
    return (
      <div className="max-w-xl mx-auto my-12 animate-fade-in text-slate-700 dark:text-slate-300">
        <div className="apple-glass dark:apple-glass-dark rounded-3xl p-8 text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 flex items-center justify-center border border-amber-100 dark:border-amber-800">
            <Lock className="h-8 w-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-slate-100 tracking-tight">
              Cours du Jour {currentDay.id} : Verrouillé par l'Admin
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans px-4">
              Ce cours n'a pas encore été ouvert d'accès pour votre session d'apprentissage. Par défaut, tous les cours, exercices et projets sont bloqués.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-105 dark:border-slate-700 rounded-xl text-left space-y-2">
            <h4 className="font-bold text-slate-805 dark:text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wide text-indigo-900 dark:text-indigo-400">
              <span>💡</span> Comment débloquer ce module ?
            </h4>
            <ul className="text-[11px] text-slate-500 dark:text-slate-400 font-sans space-y-1.5 pl-1.5 leading-relaxed">
              <li className="flex items-start gap-1">
                <span>•</span>
                <span>Contactez votre enseignant pour qu'il ouvre l'accès à ce cours quotidien.</span>
              </li>
              <li className="flex items-start gap-1">
                <span>•</span>
                <span>Si vous êtes l’administrateur ou pour vos tests d'évaluation, rendez-vous dans l'onglet <strong className="text-slate-800 dark:text-slate-200">Administration</strong> de la barre latérale pour activer le Jour {currentDay.id}.</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => {
                // Find first unlocked day
                const firstUnlocked = courseDays.find(d => unlockedDays.includes(d.id));
                if (firstUnlocked) {
                  onSelectDay(firstUnlocked.id);
                } else {
                  onSelectDay(1);
                }
              }}
              className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-slate-900"
            >
              Aller au premier jour débloqué
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Initialisation de l\'interpréteur Python v3.11...\n');
    try {
      const result = await runPythonCode(code);
      if (result.success) {
        setOutput(`Exécution réussie.\n--------------------------\n${result.stdout || '(Le script n\'a rien imprimé en sortie)'}`);
      } else {
        setOutput(`Erreur d'exécution.\n--------------------------\n${result.error || 'Erreur inconnue.'}`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setOutput(`Erreur système de l'interpréteur :\n${error.message || String(err)}`);
    }
    setIsRunning(false);
  };

  const handleResetCode = () => {
    setCode(currentDay.codeExample);
    setOutput('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Define custom elements for react-markdown to match polished layout, coding guidelines and user formatting
  const markdownComponents = {
    // Override pre so it doesn't wrap our styled divs with standard pre formatting
    pre: ({ children }: any) => <>{children}</>,
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className;
      if (isInline) {
        const codeText = String(children);
        // Highlight inline code if it contains common Python elements/keywords
        const hasKeyword = /\b(if|elif|else|and|or|not|True|False|None|print|while|for|range)\b/.test(codeText);
        return (
          <code className="px-1.5 py-0.5 bg-slate-100 font-mono text-slate-800 text-xs rounded-md font-semibold border border-slate-200/50" {...props}>
            {hasKeyword ? <PythonHighlighter code={codeText} isDark={false} /> : children}
          </code>
        );
      }
      const lang = match ? match[1] : 'python';
      return (
        <div className="my-4 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800/60 select-none">
            <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider">
              {lang}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
              }}
              className="px-2 py-1 text-[10px] text-slate-400 hover:text-white font-semibold font-mono flex items-center gap-1 transition-colors rounded hover:bg-slate-800"
            >
              <Copy className="h-2.5 w-2.5" /> Copier
            </button>
          </div>
          <pre className="p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 max-h-96 custom-scrollbar">
            <code className={className} {...props}>
              {lang === 'python' || !match ? (
                <PythonHighlighter code={String(children).replace(/\n$/, '')} />
              ) : (
                children
              )}
            </code>
          </pre>
        </div>
      );
    },
    h1: ({ children }: any) => <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white mt-8 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">{children}</h1>,
    h2: ({ children }: any) => <h2 className="font-display text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-display text-lg font-bold text-indigo-700 dark:text-indigo-400 mt-6 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="font-display text-base font-semibold text-slate-700 dark:text-slate-300 mt-5 mb-2">{children}</h4>,
    p: ({ children }: any) => <p className="text-slate-700 dark:text-slate-300 leading-loose text-base mb-5 font-sans">{children}</p>,
    strong: ({ children }: any) => <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-slate-600 dark:text-slate-400">{children}</em>,
    ul: ({ children }: any) => <ul className="list-disc pl-6 mb-5 space-y-2 text-slate-700 dark:text-slate-300 text-base">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-slate-700 dark:text-slate-300 text-base">{children}</ol>,
    li: ({ children }: any) => <li className="leading-relaxed font-sans">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="relative border-l-4 border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 p-5 my-6 rounded-r-2xl text-indigo-900 dark:text-indigo-200 font-sans shadow-sm">
        <div className="absolute top-5 left-[-2.5rem] bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm border border-slate-100 dark:border-slate-800">
          <AlertTriangle className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="text-base italic leading-relaxed">
          {children}
        </div>
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-6 border border-slate-200/80 dark:border-slate-700/80 rounded-xl shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs text-left text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{children}</tbody>,
    tr: ({ children }: any) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">{children}</tr>,
    th: ({ children }: any) => <th className="px-4 py-3 font-semibold">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 leading-relaxed">{children}</td>,
    a: ({ href, children, ...props }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline underline-offset-4 transition-colors font-medium"
        {...props}
      >
        {children}
      </a>
    ),
  };

  const hasPrev = currentDay.id > 1;
  const hasNext = currentDay.id < 28;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative">
      {/* Left Pane: Detailed Course Lesson (7 columns) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="xl:col-span-7 space-y-8"
      >
        
        {/* Beautiful Glassmorphism Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                Phase {currentDay.phase}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Complété
                </span>
              )}
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-sm">
              <span className="text-indigo-300">Jour {currentDay.id} :</span> {currentDay.title}
            </h1>
            
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              {currentDay.description}
            </p>
          </div>
        </div>

        {/* Topics outline box */}
        <div className="bg-linear-to-r from-indigo-50/50 dark:from-indigo-900/20 to-indigo-100/10 dark:to-indigo-800/10 border border-indigo-100/50 dark:border-indigo-800/50 rounded-2xl p-5 space-y-3">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-750 dark:text-indigo-400 flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Au programme aujourd’hui :
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {currentDay.topics.map((topic, i) => (
              <li key={i} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="text-indigo-500 dark:text-indigo-400 font-bold mt-0.5">•</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin/Teacher Guide */}
        {isAdminAuthenticated && currentDay.adminGuide && (
          <div className="bg-amber-50/50 border-2 border-amber-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-bl-full -z-10"></div>
            <h3 className="text-amber-800 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-amber-600" /> Guide de l'Instructeur
            </h3>
            <div className="prose prose-sm prose-amber max-w-none text-amber-900/90 leading-relaxed font-sans">
              <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{currentDay.adminGuide}</Markdown>
            </div>
          </div>
        )}

        {/* Core Lesson Text */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{currentDay.contentMarkdown}</Markdown>
        </div>

        {/* Validation Completion Action in footer of lesson */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
          {/* Quiz progress gate */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                Quiz du jour complétés
              </span>
              <span className={`font-mono font-bold ${
                quizGatePassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {completedDayQuizzesCount}/{Math.min(totalDayQuizzes, 15)}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quizGatePassed ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-indigo-500 dark:bg-indigo-400'
                }`}
                style={{ width: `${Math.min((completedDayQuizzesCount / 15) * 100, 100)}%` }}
              />
            </div>
            {!quizGatePassed && (
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">
                  Complétez les 15 quiz du jour dans l&apos;onglet <strong className="text-slate-700 dark:text-slate-300">Exercices</strong> pour débloquer la validation.
                </p>
                <button
                  onClick={onGoToExercises}
                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-semibold rounded-lg text-xs w-max hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer"
                >
                  Aller aux exercices
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Prêt pour l&apos;étape d&apos;après ?</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">Validez cette leçon pour mettre à jour votre score général de progression.</p>
            </div>
            {quizGatePassed ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleCompleteDay(currentDay.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 border border-emerald-400/50'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Marqué comme Lu (Annuler)
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Valider le Jour {currentDay.id}
                  </>
                )}
              </motion.button>
            ) : (
              <button
                disabled
                title="Complétez les 15 quiz pour débloquer"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {completedDayQuizzesCount}/15 quiz requis
              </button>
            )}
          </div>
        </div>

        {/* Previous / Next Chapter Navigation */}
        <div className="pt-8 pb-12 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          {hasPrev ? (
            <button
              onClick={() => onSelectDay(currentDay.id - 1)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 transition-all cursor-pointer group"
            >
              <ChevronLeft className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Précédent</span>
                <span className="text-sm font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Jour {currentDay.id - 1}</span>
              </div>
            </button>
          ) : <div></div>}

          {hasNext ? (
            <button
              onClick={() => onSelectDay(currentDay.id + 1)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Suivant</span>
                <span className="text-sm font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Jour {currentDay.id + 1}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>
          ) : <div></div>}
        </div>
      </motion.div>

      {/* Right Pane: Live Python Simulator Playground (5 columns) */}
      <div className="xl:col-span-5 sticky top-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="border border-slate-700 dark:border-slate-800 rounded-2xl bg-[#0f172a] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
          {/* Editor Header (Mac OS Style) */}
          <div className="bg-[#1e293b] px-4 py-3 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <Terminal className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-slate-300 tracking-wide">
                playground.py
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Copier le code"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleResetCode}
                className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Réinitialiser"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Code Area */}
          <div className="border-b border-slate-800/80 overflow-hidden">
            {isMobile ? (
              <div className="h-[224px] bg-slate-900 flex flex-col items-center justify-center gap-3 text-center p-6">
                <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Terminal className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  L&apos;éditeur de code est disponible uniquement sur ordinateur.
                </p>
                <div className="font-mono text-[10px] text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg">
                  Mode lecture seule — Mobile
                </div>
              </div>
            ) : (
              <CodeMirror
                value={code}
                height="224px"
                extensions={[python()]}
                onChange={(val) => setCode(val)}
                theme="dark"
                className="text-xs font-mono"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  highlightActiveLine: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                }}
              />
            )}
          </div>

          {/* Code run trigger bar */}
          <div className="p-4 bg-[#0f172a] border-t border-slate-800">
            <button
              onClick={handleRunCode}
              disabled={isRunning || isMobile}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                isRunning || isMobile
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-indigo-500/25 border border-indigo-400/30 hover:scale-[1.02]'
              }`}
            >
              {isRunning ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Exécution...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  Exécuter le code
                </>
              )}
            </button>
          </div>

          {/* Editor Terminal Output */}
          <div className="bg-[#0b1120] border-t border-slate-800/80 min-h-[160px] p-4 font-mono text-xs overflow-auto flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Sortie Terminal</span>
            </div>
            {output ? (
              <pre className={`whitespace-pre-wrap leading-relaxed flex-1 font-semibold ${
                output.includes('Erreur') ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {output}
              </pre>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-2">
                <Terminal className="h-6 w-6 opacity-50" />
                <span className="opacity-50">Appuyez sur "Exécuter" pour voir le résultat</span>
              </div>
            )}
            
            <div className="mt-4 flex items-center text-[10px] text-slate-500 justify-between">
              <span>Python 3.11.2 (PyFlow Engine)</span>
              <div>
                <span className="h-1.5 w-1.5 inline-block rounded-full bg-emerald-500 mr-1.5"></span>
                <span>Interpréteur Prêt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Help card */}
        <div className="bg-linear-to-b from-white dark:from-slate-800/80 to-slate-50 dark:to-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" /> Astuce d’exécution
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
            Vous pouvez surcharger le code directement au sein de la fenêtre de saisie ! Changez les valeurs de variables arithmétiques, et observez de façon concrète la mise à jour des calculs.
          </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
