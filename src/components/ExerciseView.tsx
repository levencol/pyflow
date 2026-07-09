import { useState, useEffect, useMemo } from 'react';
import { Award, CheckCircle2, AlertCircle, Play, RotateCcw, HelpCircle, Check, Terminal, BookOpen, ShieldAlert, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuizQuestion, CodingChallenge, UserProgress } from '../types';
import { quizQuestions, codingChallenges } from '../data/exercises';
import { courseDays } from '../data/curriculum';
import { runPythonCode } from '../utils/pythonRunner';
import { evaluateCodeWithGemini, GeminiEvaluationResult } from '../utils/geminiEvaluator';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import ReactMarkdown from 'react-markdown';

interface ExerciseViewProps {
  dayId: number;
  progress: UserProgress;
  onPassQuiz: (quizId: string) => void;
  onPassChallenge: (challengeId: string, submittedCode: string) => void;
  onSelectDay: (dayId: number) => void;
  unlockedDays: number[];
}

export default function ExerciseView({ dayId, progress, onPassQuiz, onPassChallenge, onSelectDay, unlockedDays = [] }: ExerciseViewProps) {
  const currentDay = courseDays.find(d => d.id === dayId) || courseDays[0];

  // Active sub-tab: 'quiz' | 'coding'
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'coding'>('quiz');

  // Directory filter: 'current' | 'all'
  const [directoryFilter, setDirectoryFilter] = useState<'current' | 'all'>('current');

  // Shuffled quizzes state to persist randomized order across renders
  const [shuffledQuizzes, setShuffledQuizzes] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const rawQuizzes = directoryFilter === 'current' 
      ? quizQuestions.filter(q => q.dayId === dayId) 
      : quizQuestions;
    
    // Generate a deterministic shuffle key per student+day
    const storageKey = `pyflow_quiz_order_${directoryFilter}_${dayId}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const storedOrder: string[] = JSON.parse(stored);
        // Reorder rawQuizzes to match stored order, appending any new ones
        const idMap = new Map(rawQuizzes.map(q => [q.id, q]));
        const ordered = storedOrder
          .map(id => idMap.get(id))
          .filter(Boolean) as QuizQuestion[];
        // Add any not in stored order
        const storedSet = new Set(storedOrder);
        rawQuizzes.forEach(q => { if (!storedSet.has(q.id)) ordered.push(q); });
        setShuffledQuizzes(ordered);
      } catch {
        setShuffledQuizzes(rawQuizzes);
      }
    } else {
      // Shuffle using Fisher-Yates algorithm
      const shuffled = [...rawQuizzes];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // Persist this order
      localStorage.setItem(storageKey, JSON.stringify(shuffled.map(q => q.id)));
      setShuffledQuizzes(shuffled);
    }
    setSelectedQuizIdx(0); // Reset index on day/filter change
  }, [dayId, directoryFilter]);

  const matchQuizzes = shuffledQuizzes;

  const matchChallenges = directoryFilter === 'current'
    ? codingChallenges.filter(c => c.dayId === dayId)
    : codingChallenges;

  // Real-time access checks implementing "On accède à l'exercice suivant si et seulement si on réussit l'exercice précédente"
  const isQuizLocked = (idx: number) => {
    const quiz = matchQuizzes[idx];
    if (!quiz) return true;
    
    // Check if the day is unlocked by the administrator
    if (!unlockedDays.includes(quiz.dayId)) return true;

    // Sequence check: first element of the visible list is unlocked, subsequent require previous quiz to be completed
    if (idx === 0) return false;
    const prevQuiz = matchQuizzes[idx - 1];
    return !progress.completedQuizzes[prevQuiz.id];
  };

  const isChallengeLocked = (idx: number) => {
    const challenge = matchChallenges[idx];
    if (!challenge) return true;

    // Check if the day is unlocked by the administrator
    if (!unlockedDays.includes(challenge.dayId)) return true;

    // Sequence check: first element of visible challenges is unlocked, next require previous challenge to be completed
    if (idx === 0) return false;
    const prevChallenge = matchChallenges[idx - 1];
    return !progress.completedChallenges[prevChallenge.id];
  };

  // Active Items
  const [selectedQuizIdx, setSelectedQuizIdx] = useState(0);
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);

  const activeQuiz: QuizQuestion | undefined = matchQuizzes[selectedQuizIdx];
  const activeChallenge: CodingChallenge | undefined = matchChallenges[selectedChallengeIdx];

  // Quiz States
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ isCorrect: boolean } | null>(null);

  // Challenge States
  const [userCode, setUserCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [testsLoading, setTestsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{ success: boolean; score: number; details: string[] } | null>(null);
  const [aiFeedback, setAiFeedback] = useState<GeminiEvaluationResult | null>(null);
  const [codeRunning, setCodeRunning] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  // Detect mobile to disable code editor
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  }, []);



  const handleSelectQuiz = (idx: number) => {
    if (isQuizLocked(idx)) return;
    setSelectedQuizIdx(idx);
  };

  const handleSelectChallenge = (idx: number) => {
    if (isChallengeLocked(idx)) return;
    setSelectedChallengeIdx(idx);
  };

  // Clear states when day or index shifts
  useEffect(() => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizResult(null);
  }, [dayId, selectedQuizIdx, directoryFilter]);

  useEffect(() => {
    if (activeChallenge) {
      setUserCode(activeChallenge.initialCode);
      setTerminalOutput('');
      setTestResults(null);
      setAiFeedback(null);
      setShowCorrection(false);
    }
  }, [dayId, selectedChallengeIdx, directoryFilter]);

  const handleQuizOptionClick = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (!activeQuiz || selectedOption === null) return;
    setQuizSubmitted(true);
    const correct = selectedOption === activeQuiz.answerIndex;
    setQuizResult({ isCorrect: correct });
    if (correct) {
      onPassQuiz(activeQuiz.id);
    }
  };

  const handleRunCode = async () => {
    if (!activeChallenge) return;
    setCodeRunning(true);
    setTerminalOutput('Initialisation de l\'interpréteur Python v3.11...\n');
    try {
      const result = await runPythonCode(userCode);
      if (result.success) {
        setTerminalOutput(`Exécution réussie.\n--------------------------\n${result.stdout || '(Le script n\'a rien imprimé en sortie)'}`);
      } else {
        setTerminalOutput(`Erreur d'exécution.\n--------------------------\n${result.error || 'Erreur inconnue.'}`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setTerminalOutput(`Erreur système de l'interpréteur :\n${error.message || String(err)}`);
    }
    setCodeRunning(false);
  };

  const handleTestChallenge = async () => {
    if (!activeChallenge) return;
    setTestsLoading(true);
    setTerminalOutput('Lancement des tests d’exécution et des validations logiques...\n');
    setAiFeedback(null);
    setShowCorrection(false);

    const details: string[] = [];
    let checksPassed = 0;
    const totalChecks = 2; // Syntax check + Sandbox execution outcome

    // 1. Keyword syntax check
    const missingKeywords: string[] = [];
    for (const kw of activeChallenge.validationKeywords) {
      if (!userCode.includes(kw)) {
        missingKeywords.push(kw);
      }
    }

    if (missingKeywords.length === 0) {
      checksPassed += 1;
      details.push(`✔ Structure du script : Présence des expressions obligatoires (${activeChallenge.validationKeywords.join(', ')})`);
    } else {
      details.push(`✘ Structure du script : Mots-clés requis manquants : ${missingKeywords.join(', ')}`);
    }

    try {
      // 2. Real browser sandbox execution & value verification
      const result = await runPythonCode(userCode);
      const expectedOut = activeChallenge.testCases[0].expectedOutput;
      
      let executionSuccess = false;
      let finalStdout = result.stdout;

      if (result.success) {
        const cleanedStdout = result.stdout.trim().toLowerCase().replace(/\s/g, '');
        const cleanedExpected = expectedOut.trim().toLowerCase().replace(/\s/g, '');
        
        // Match stdout exactly or look for return value in declared variables
        const stdoutMatches = cleanedStdout.includes(cleanedExpected) || cleanedStdout === cleanedExpected;
        
        // Check if any of the final global variables contains or equals the expected output value
        const variablesMatch = Object.values(result.variables).some(val => {
          const valStr = String(val).trim().toLowerCase().replace(/\s/g, '');
          return valStr === cleanedExpected || valStr.includes(cleanedExpected);
        });

        // Some challenges expect functions or logic without specific print statement, or allow general outputs
        const hasKeywordMatchForComplex = userCode.includes('def ') && (userCode.includes('return ') || cleanedStdout !== '');

        if (stdoutMatches || variablesMatch || expectedOut === '' || (expectedOut === 'Success' && hasKeywordMatchForComplex)) {
          checksPassed += 1;
          executionSuccess = true;
          details.push(`✔ Évaluation fonctionnelle : Le script calcule le résultat attendu (${expectedOut})`);
        } else {
          details.push(`✘ Évaluation fonctionnelle : Le script s'exécute sans erreur, mais le résultat attendu ("${expectedOut}") est introuvable dans la sortie ou les variables calculées.`);
        }
      } else {
        details.push(`✘ Panne d'exécution : L'interpréteur a levé une exception lors du calcul de votre code.`);
      }

      let overallSuccess = checksPassed === totalChecks;

      // --- AI-assisted validation and review ---
      setTerminalOutput(prev => prev + 'Génération de l\'évaluation par le tuteur IA...\n');
      const geminiResult = await evaluateCodeWithGemini(activeChallenge, userCode, result);

      if (geminiResult !== null) {
        overallSuccess = geminiResult.isCorrect;
        setAiFeedback(geminiResult);

        if (overallSuccess) {
          // Adjust checks passed to match success
          checksPassed = totalChecks;
          const filteredDetails = details.map(d => d.startsWith('✘') ? d.replace('✘', '✔ (validé par IA)') : d);
          setTestResults({
            success: true,
            score: 100,
            details: filteredDetails,
          });
          setTerminalOutput(`SUCCÈS : Défi validé par le Tuteur IA !\n\n[ANALYSE DU TUTEUR IA]\n${geminiResult.explanation}\n\n[SORTIE STANDARD]\n${finalStdout || '(Aucune impression)'}`);
          onPassChallenge(activeChallenge.id, userCode);
        } else {
          setTestResults({
            success: false,
            score: Math.round((checksPassed / totalChecks) * 100),
            details,
          });
          if (!result.success && result.error) {
            setTerminalOutput(`ÉCHEC : Erreur détectée dans l'algorithme.\n\n[TRACEBACK PYTHON]\n${result.error}\n\n[ANALYSE DU TUTEUR IA]\n${geminiResult.explanation}`);
          } else {
            setTerminalOutput(`ÉCHEC : Les tests de validation ne sont pas entièrement au vert.\n\n[ANALYSE DU TUTEUR IA]\n${geminiResult.explanation}`);
          }
        }
      } else {
        // Fallback: rule-based feedback
        setTestResults({
          success: overallSuccess,
          score: Math.round((checksPassed / totalChecks) * 100),
          details,
        });

        let explanation = '';
        if (!overallSuccess) {
          if (missingKeywords.length > 0) {
            explanation += `• Il manque des mots-clés obligatoires dans votre code : ${missingKeywords.join(', ')}.\n`;
            explanation += `Assurez-vous de bien respecter la syntaxe requise (ex: utiliser l'expression '${missingKeywords[0]}').\n\n`;
          }
          if (result.success && !executionSuccess) {
            explanation += `• Votre code s'est exécuté sans erreur, mais n'a pas produit le résultat attendu.\n`;
            explanation += `Valeur attendue : "${expectedOut}".\n`;
            explanation += `Valeur obtenue : "${result.stdout || 'vide'}".\n\n`;
          }
          if (!result.success && result.error) {
            explanation += `• Une erreur d'exécution s'est produite (voir le traceback ci-dessous).\n`;
          }
          setAiFeedback({
            isCorrect: false,
            explanation: explanation || "Revoyez l'énoncé de l'exercice et assurez-vous d'avoir respecté toutes les consignes de variables et de calcul.",
          });
        }

        if (overallSuccess) {
          setTerminalOutput(`SUCCÈS : Défi relevé avec brio !\n\n[SORTIE STANDARD]\n${finalStdout || '(Aucune impression)'}\n\n[VALIDATEUR] OK : Vos variables et fonctions correspondent aux spécifications.`);
          onPassChallenge(activeChallenge.id, userCode);
        } else {
          if (!result.success && result.error) {
            setTerminalOutput(`ÉCHEC : Erreur détectée dans l'algorithme.\n\n[TRACEBACK PYTHON]\n${result.error}\n\nCorrigez la ligne indiquée pour pouvoir valider l'exercice.`);
          } else {
            setTerminalOutput(`ÉCHEC : Les tests de validation ne sont pas entièrement au vert.\n\n[SORTIE OBTENUE]\n${finalStdout || '(Vide)'}\n\nRevoyez l'énoncé de l'exercice pour corriger le tir.`);
          }
        }
      }
    } catch (err: any) {
      details.push(`✘ Erreur système : ${err.message || err}`);
      setTestResults({
        success: false,
        score: Math.round((checksPassed / totalChecks) * 100),
        details,
      });
      setTerminalOutput(`ÉCHEC : Une erreur système est survenue lors de l'exécution.`);
    } finally {
      setTestsLoading(false);
    }
  };

  const handleResetChallenge = () => {
    if (!activeChallenge) return;
    setUserCode(activeChallenge.initialCode);
    setTerminalOutput('');
    setTestResults(null);
    setAiFeedback(null);
    setShowCorrection(false);
  };

  const isDayLocked = !unlockedDays.includes(dayId);

  if (isDayLocked && directoryFilter === 'current') {
    return (
      <div className="max-w-xl mx-auto my-12 animate-fade-in text-slate-700 dark:text-slate-300">
        <div className="apple-glass dark:apple-glass-dark rounded-3xl p-8 text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 flex items-center justify-center border border-amber-100 dark:border-amber-800">
            <Lock className="h-8 w-8 animate-pulse" />
          </div>
          
          <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-slate-100 tracking-tight">
              Exercices du Jour {dayId} : Bloqués
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans px-4">
              La leçon théorique associée à cette journée de formation (Jour {dayId}) est actuellement verrouillée par l'administration.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setDirectoryFilter('all')}
                className="px-3.5 py-2 apple-btn-primary font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Parcourir la Bibliothèque Globale d'Exercices
              </button>
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-left space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide text-indigo-900 dark:text-indigo-400">
              💡 Comment débloquer ?
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-sans text-[11px]">
              Activez le Jour {dayId} depuis l’onglet <strong className="text-slate-800 dark:text-slate-200">Administration</strong>. Notez également qu'un exercice ne devient accessible que si vous réussissez l'exercice précédent.
            </p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => {
                const firstUnlocked = courseDays.find(d => unlockedDays.includes(d.id));
                if (firstUnlocked) onSelectDay(firstUnlocked.id);
                else onSelectDay(1);
              }}
              className="px-4 py-2 apple-btn dark:apple-btn-dark rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
            >
              Aller au premier jour débloqué
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Day and Directory Filters Tab bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-105 dark:border-slate-800 pb-3">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Section Entraînement</span>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
            Exercices : Jour {currentDay.id} • {currentDay.title}
          </h1>
        </div>
        
        {/* Toggle between active day and library directory */}
        <div className="flex apple-glass dark:apple-glass-dark rounded-xl p-1 text-xs shrink-0 self-start">
          <button
            onClick={() => {
              setDirectoryFilter('current');
              setSelectedQuizIdx(0);
              setSelectedChallengeIdx(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
              directoryFilter === 'current'
                ? 'bg-white dark:bg-slate-800 font-semibold text-indigo-700 dark:text-indigo-400 shadow-3xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Syllabus Jour {currentDay.id} ({quizQuestions.filter(q => q.dayId === currentDay.id).length + codingChallenges.filter(c => c.dayId === currentDay.id).length})
          </button>
          <button
            onClick={() => {
              setDirectoryFilter('all');
              setSelectedQuizIdx(0);
              setSelectedChallengeIdx(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
              directoryFilter === 'all'
                ? 'bg-white dark:bg-slate-800 font-semibold text-indigo-700 dark:text-indigo-400 shadow-3xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Bibliothèque Globale ({quizQuestions.length + codingChallenges.length})
          </button>
        </div>
      </div>

      {/* Course Navigation Hub */}
      <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`pb-2.5 text-sm font-semibold relative cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'text-indigo-650 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-500'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Quiz Théorique ({matchQuizzes.length})
        </button>
        <button
          onClick={() => setActiveSubTab('coding')}
          className={`pb-2.5 text-sm font-semibold relative cursor-pointer ${
            activeSubTab === 'coding'
              ? 'text-indigo-650 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-500'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Pratique & Code ({matchChallenges.length})
        </button>
      </div>

      {/* SUB-TAB 1: QUIZ WORKSPACE */}
      {activeSubTab === 'quiz' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* List panel for quizzes */}
          <div className="md:col-span-4 apple-glass dark:apple-glass-dark rounded-xl p-4 space-y-3 max-h-120 overflow-auto">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Sélection Quizzes</h3>
            {matchQuizzes.length === 0 ? (
              <div className="text-xs text-slate-400 dark:text-slate-500 italic p-4 text-center">Aucun quiz enregistré pour cette étape.</div>
            ) : (
              <div className="space-y-1.5">
                {matchQuizzes.map((quiz, idx) => {
                  const isPassed = progress.completedQuizzes[quiz.id];
                  const isActive = idx === selectedQuizIdx;
                  const isLocked = isQuizLocked(idx);

                  return (
                    <button
                      key={quiz.id}
                      disabled={isLocked}
                      onClick={() => handleSelectQuiz(idx)}
                      className={`w-full flex items-center justify-between text-left p-3 rounded-lg border text-xs transition-colors ${
                        isActive
                          ? 'bg-indigo-50/50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-400 font-semibold'
                          : isLocked
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                          : 'bg-white dark:bg-slate-900/20 border-slate-50 dark:border-slate-800/50 hover:border-slate-150 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer'
                      }`}
                      title={isLocked ? "Réussissez l'exercice précédent pour débloquer" : ""}
                    >
                      <div className="truncate space-y-0.5 w-[80%]">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase block">
                          Quiz • Jour {quiz.dayId} {isLocked && '🔒'}
                        </span>
                        <div className="truncate text-slate-800 dark:text-slate-200 font-sans">{quiz.question}</div>
                      </div>
                      {isPassed ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      ) : isLocked ? (
                        <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-200 dark:border-slate-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active quiz main page workspace */}
          <div className="md:col-span-8 apple-glass dark:apple-glass-dark rounded-xl p-6 space-y-6">
            {activeQuiz ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md">
                    Questionnaire du Jour {activeQuiz.dayId}
                  </span>
                  {progress.completedQuizzes[activeQuiz.id] && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                      <Check className="h-4 w-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-full p-0.5" /> Déjà Réussi
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed font-sans select-none">
                    {activeQuiz.question}
                  </h2>
                  
                  {/* Option Choices */}
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {activeQuiz.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      let optionBgStyle = 'bg-white/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-500 cursor-pointer text-slate-700 dark:text-slate-300';

                      if (quizSubmitted) {
                        if (idx === activeQuiz.answerIndex) {
                          optionBgStyle = 'bg-emerald-50/70 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-300';
                        } else if (isSelected) {
                          optionBgStyle = 'bg-rose-50 dark:bg-rose-900/20 border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-300';
                        } else {
                          optionBgStyle = 'bg-white/30 dark:bg-slate-800/10 border-slate-100 dark:border-slate-800 opacity-60 text-slate-700 dark:text-slate-400';
                        }
                      } else if (isSelected) {
                        optionBgStyle = 'bg-indigo-50/30 dark:bg-indigo-900/20 border-indigo-500 dark:border-indigo-400 text-indigo-900 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-900/50';
                      }

                      return (
                        <div
                          key={idx}
                          onClick={() => handleQuizOptionClick(idx)}
                          className={`flex items-start gap-3 p-4 border rounded-xl text-xs transition-all ${optionBgStyle}`}
                        >
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isSelected ? 'border-indigo-600 dark:border-indigo-400 text-indigo-650 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-900/40' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="font-sans font-medium">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm Panel & Feedback */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {!quizSubmitted ? (
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleQuizSubmit}
                        disabled={selectedOption === null}
                        className="px-5 py-2.5 apple-btn-primary disabled:opacity-40 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Soumettre la réponse
                      </motion.button>
                    </div>
                  ) : (
                    <div className={`rounded-xl p-5 border text-xs leading-relaxed space-y-3 ${
                      quizResult?.isCorrect 
                        ? 'bg-emerald-50/40 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 text-emerald-850 dark:text-emerald-300'
                        : 'bg-rose-50/40 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800 text-rose-850 dark:text-rose-300'
                    }`}>
                      <div className="flex items-center gap-2 font-bold mb-1">
                        {quizResult?.isCorrect ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" /> Félicitations ! Votre réponse est correcte.
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-5 w-5 text-rose-500 dark:text-rose-400" /> Dommage ! Ce n'est pas la bonne option.
                          </>
                        )}
                      </div>
                      <p className="font-sans leading-relaxed text-slate-750 dark:text-slate-300">
                        <strong className="text-slate-850 dark:text-slate-200">Explication didactique :</strong> {activeQuiz.explanation}
                      </p>
                      
                      {/* Next quiz block / selection trigger */}
                      {selectedQuizIdx < matchQuizzes.length - 1 && !isQuizLocked(selectedQuizIdx + 1) && (
                        <div className="pt-2">
                          <button
                            onClick={() => setSelectedQuizIdx(prev => prev + 1)}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-650 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          >
                            Quiz Suivant &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
                <HelpCircle className="h-10 w-10 text-slate-350 dark:text-slate-600" />
                <p className="text-xs">Aucun quiz à traiter pour ce jour de formation.</p>
                <button 
                  onClick={() => setDirectoryFilter('all')}
                  className="px-3.5 py-1.5 apple-btn dark:apple-btn-dark font-semibold text-xs rounded-lg transition-colors"
                >
                  Découvrir tous les quizz de la bibliothèque
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CODING CHALLENGE WORKSPACE */}
      {activeSubTab === 'coding' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* List panel for challenges */}
          <div className="md:col-span-3 apple-glass dark:apple-glass-dark rounded-xl p-4 space-y-3 max-h-120 overflow-auto">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Sélection Défis</h3>
            {matchChallenges.length === 0 ? (
              <div className="text-xs text-slate-400 dark:text-slate-500 italic p-4 text-center">Aucun défi programmé pour aujourd'hui.</div>
            ) : (
              <div className="space-y-1.5">
                {matchChallenges.map((challenge, idx) => {
                  const isPassed = !!progress.completedChallenges[challenge.id];
                  const isActive = idx === selectedChallengeIdx;
                  const isLocked = isChallengeLocked(idx);

                  return (
                    <button
                      key={challenge.id}
                      disabled={isLocked}
                      onClick={() => handleSelectChallenge(idx)}
                      className={`w-full flex items-center justify-between text-left p-3 rounded-lg border text-xs transition-colors ${
                        isActive
                          ? 'bg-indigo-50/50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-400 font-semibold'
                          : isLocked
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                          : 'bg-white dark:bg-slate-900/20 border-slate-50 dark:border-slate-800/50 hover:border-slate-150 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer'
                      }`}
                      title={isLocked ? "Réussissez l'exercice précédent pour débloquer" : ""}
                    >
                      <div className="truncate space-y-0.5 w-[80%]">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase block">
                          Défi • J-{challenge.dayId} {isLocked && '🔒'}
                        </span>
                        <div className="truncate text-slate-800 dark:text-slate-200 font-sans">{challenge.title}</div>
                      </div>
                      {isPassed ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      ) : isLocked ? (
                        <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-200 dark:border-slate-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active challenge main code workspace */}
          {activeChallenge ? (
            <div className="md:col-span-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Instructions Panel left (5 cols) */}
              <div className="lg:col-span-5 apple-glass dark:apple-glass-dark rounded-xl p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md uppercase">
                    Défi du jour {activeChallenge.dayId}
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-display">
                    {activeChallenge.title}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-1">
                    {activeChallenge.description}
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-150 dark:border-slate-700/50 pt-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" /> Instructions :
                  </h4>
                  <ol className="list-decimal ml-4 text-[11px] text-slate-650 dark:text-slate-400 space-y-1.5 font-sans leading-relaxed">
                    {activeChallenge.instructions.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ol>
                </div>

                {/* Validation markers */}
                <div className="space-y-1.5 border-t border-slate-150 dark:border-slate-700/50 pt-3">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Mots-clés requis (sécurité syntaxe):
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {activeChallenge.validationKeywords.map((kw, i) => (
                      <code key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded border border-slate-205 dark:border-slate-700">
                        {kw}
                      </code>
                    ))}
                  </div>
                </div>

                {/* Status tracking */}
                {progress.completedChallenges[activeChallenge.id] && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex gap-2 items-start font-sans">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Défi Déjà Réussi !</strong>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Votre code solution précédent a été enregistré.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* IDE Code execution workspace (7 cols) */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-900 shadow-sm overflow-hidden flex flex-col">
                  {/* Title Header */}
                  <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800 text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1.5"><Terminal className="h-4 w-4 text-emerald-500" /> exercice.py</span>
                    <button
                      onClick={handleResetChallenge}
                      className="p-1 text-slate-450 hover:text-white rounded flex items-center gap-0.5 transition-colors"
                      title="Réinitialiser"
                    >
                      <RotateCcw className="h-3 w-3" /> <span className="text-[10px]">Reset</span>
                    </button>
                  </div>

                  {/* Editor block Input with Python Highlighting */}
                  <div className="border-b border-slate-800/80 overflow-hidden">
                    {isMobile ? (
                      <div className="h-[288px] bg-slate-900 flex flex-col items-center justify-center gap-3 text-center p-6">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center">
                          <Terminal className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          L&apos;éditeur de code est disponible uniquement sur ordinateur.
                          Consultez votre cours sur desktop pour soumettre du code.
                        </p>
                        <div className="font-mono text-[10px] text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg">
                          Mode lecture seule — Mobile
                        </div>
                      </div>
                    ) : (
                      <CodeMirror
                        value={userCode}
                        height="288px"
                        extensions={[python()]}
                        onChange={(val) => setUserCode(val)}
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

                  {/* Compile triggers and Status outputs */}
                  <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-[10px] text-slate-500 font-mono">Simulateur d'assertions</span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleRunCode}
                        disabled={codeRunning || testsLoading}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-slate-750"
                      >
                        <Play className="h-3 w-3 text-slate-400 fill-current" /> {codeRunning ? 'Calcul...' : 'Lancer le code'}
                      </button>
                      <button
                        onClick={handleTestChallenge}
                        disabled={codeRunning || testsLoading}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> {testsLoading ? 'Vérification...' : 'Soumettre le code'}
                      </button>
                    </div>
                  </div>

                  {/* Outputs shell terminal */}
                  <div className="border-t border-slate-800 bg-black min-h-28 p-4 text-xs font-mono text-slate-300 flex flex-col justify-between">
                    <div className="space-y-1.5 overflow-auto max-h-36 custom-scrollbar whitespace-pre-wrap">
                      {terminalOutput ? (
                        <span>{terminalOutput}</span>
                      ) : (
                        <span className="text-slate-500 italic">
                          Le résultat d’évaluation de vos tests unitaires apparaîtra ici après soumission...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Test Results list detailed */}
                {testResults && (
                  <div className={`p-4 border rounded-xl text-xs space-y-2 font-sans ${
                    testResults.success 
                      ? 'bg-emerald-50/40 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' 
                      : 'bg-rose-50/40 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800 text-rose-900 dark:text-rose-300'
                  }`}>
                    <div className="font-bold flex items-center gap-1">
                      {testResults.success ? <Check className="h-4 w-4 bg-emerald-500 dark:bg-emerald-600 rounded-full text-white p-0.5" /> : <AlertCircle className="h-4 w-4 text-rose-500 dark:text-rose-400" />} Score de conformité : {testResults.score}%
                    </div>
                    <ul className="space-y-1 text-slate-650 dark:text-slate-300 text-[11px] list-disc ml-4">
                      {testResults.details.map((det, i) => (
                        <li key={i}>{det}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI-powered feedback review */}
                {aiFeedback && (
                  <div className="p-4 border border-indigo-100/50 dark:border-indigo-900/50 rounded-xl text-xs bg-indigo-50/10 dark:bg-indigo-900/10 text-slate-800 dark:text-slate-200 space-y-3 font-sans shadow-2xs">
                    <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold">
                      <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                      <span>Analyse et conseils du Tuteur IA</span>
                    </div>
                    <div className="markdown-content text-slate-650 dark:text-slate-300 text-[11.5px] leading-relaxed space-y-2 select-text">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2">{children}</p>,
                          code: ({ children }) => <code className="bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-mono text-[10.5px] font-medium">{children}</code>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1.5 my-2.5">{children}</ol>,
                          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 my-2.5">{children}</ul>,
                          li: ({ children }) => <li className="marker:text-slate-400 dark:marker:text-slate-500">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold text-slate-800 dark:text-slate-200">{children}</strong>
                        }}
                      >
                        {aiFeedback.explanation}
                      </ReactMarkdown>
                    </div>
                    {aiFeedback.suggestedCode && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-indigo-100/30 dark:border-indigo-800/30">
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => setShowCorrection(!showCorrection)}
                            className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100/80 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-400 font-semibold text-[10px] rounded-md transition-colors cursor-pointer"
                          >
                            {showCorrection ? "Masquer la correction" : "Afficher la correction suggérée"}
                          </button>
                          
                          {showCorrection && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(aiFeedback.suggestedCode || '');
                              }}
                              className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-colors cursor-pointer"
                            >
                              Copier le code
                            </button>
                          )}
                        </div>

                        {showCorrection && (
                          <div className="mt-2 space-y-1 animate-fade-in">
                            <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg overflow-x-auto text-[10px] font-mono whitespace-pre select-text border border-slate-800">
                              {aiFeedback.suggestedCode}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="col-span-12 flex flex-col items-center justify-center p-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
              <Terminal className="h-10 w-10 text-slate-350 dark:text-slate-600" />
              <p className="text-xs">Aucun défi interactif de code n'est configuré pour ce jour.</p>
              <button 
                onClick={() => setDirectoryFilter('all')}
                className="px-3.5 py-1.5 apple-btn dark:apple-btn-dark font-semibold text-xs rounded-lg transition-colors"
              >
                Découvrir tous les défis programmatiques
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
