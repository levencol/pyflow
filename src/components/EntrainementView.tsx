import { useState, useEffect } from 'react';
import { Flame, Brain, Check, X as XIcon, ArrowRight, Trophy, Zap, Activity, RotateCcw } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'q1',
    question: "Que fait la fonction len() en Python ?",
    options: [
      "Elle convertit un nombre en chaîne de caractères.",
      "Elle renvoie le nombre d'éléments d'un objet (ex: liste, chaîne).",
      "Elle affiche un message dans la console.",
      "Elle boucle sur une liste."
    ],
    correctAnswer: 1
  },
  {
    id: 'q2',
    question: "Quel est le résultat de l'expression 3 ** 2 ?",
    options: [
      "6",
      "9",
      "5",
      "Une erreur"
    ],
    correctAnswer: 1
  },
  {
    id: 'q3',
    question: "Comment définit-on une fonction en Python ?",
    options: [
      "function ma_fonction():",
      "def ma_fonction():",
      "create ma_fonction():",
      "fun ma_fonction():"
    ],
    correctAnswer: 1
  },
  {
    id: 'q4',
    question: "Quel type de données est strictement immuable en Python ?",
    options: [
      "La liste (List)",
      "Le dictionnaire (Dictionary)",
      "L'ensemble (Set)",
      "Le tuple (Tuple)"
    ],
    correctAnswer: 3
  },
  {
    id: 'q5',
    question: "Quelle méthode permet d'ajouter un élément à la fin d'une liste ?",
    options: [
      ".add()",
      ".insert()",
      ".append()",
      ".push()"
    ],
    correctAnswer: 2
  }
];

export default function EntrainementView() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = QUESTIONS[currentIdx];
  const progressPercent = ((currentIdx) / QUESTIONS.length) * 100;

  const handleSelect = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(idx);
  };

  const handleCheck = () => {
    if (selectedAnswer === null || isAnswerChecked) return;
    
    setIsAnswerChecked(true);
    if (selectedAnswer === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col items-center justify-center animate-fade-in p-6">
        <div className="apple-glass rounded-3xl p-12 flex flex-col items-center text-center max-w-lg relative overflow-hidden border border-white/20 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-8 border-4 border-white dark:border-slate-800">
            <Trophy className="h-10 w-10 text-white fill-emerald-100/50" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display mb-2">Entraînement Terminé !</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Vous avez obtenu un score de <span className="font-bold text-emerald-500 text-xl">{score}/{QUESTIONS.length}</span>. Votre streak quotidien est maintenu !
          </p>
          
          <div className="flex gap-4 w-full">
            <button 
              onClick={handleRestart}
              className="flex-1 py-3 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-5 w-5" /> Refaire
            </button>
            <button 
              className="flex-1 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowRight className="h-5 w-5" /> Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in relative">
      
      {/* 1. Header & Progress */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-rose-400 to-rose-600 rounded-2xl shadow-lg shadow-rose-500/30">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display">Entraînement Quotidien</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Session rapide d'agilité mentale</p>
            </div>
          </div>
          
          {/* Streak indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full font-bold">
            <Flame className="h-5 w-5 fill-rose-500/20" />
            <span>7 Jours</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-rose-400 to-indigo-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span>Question {currentIdx + 1} / {QUESTIONS.length}</span>
          <span>Score : {score}</span>
        </div>
      </div>

      {/* 2. Flashcard de la question */}
      <div className="apple-glass rounded-[2rem] p-8 sm:p-12 border border-white/20 shadow-2xl relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        {/* Question */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-500 mb-6 shadow-inner border border-slate-200 dark:border-slate-700">
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight font-display">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === question.correctAnswer;
            
            let buttonClasses = "w-full text-left p-5 rounded-2xl border-2 font-medium transition-all duration-300 flex items-center justify-between cursor-pointer ";
            let icon = null;

            if (!isAnswerChecked) {
              buttonClasses += isSelected 
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-md" 
                : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300";
            } else {
              if (isCorrect) {
                buttonClasses += "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-lg shadow-emerald-500/20";
                icon = <Check className="h-6 w-6 text-emerald-500" />;
              } else if (isSelected) {
                buttonClasses += "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 shadow-lg shadow-rose-500/20";
                icon = <XIcon className="h-6 w-6 text-rose-500" />;
              } else {
                buttonClasses += "border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-900/30 text-slate-400 opacity-50";
              }
            }

            return (
              <button 
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswerChecked}
                className={buttonClasses}
              >
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Actions de validation / Suivant */}
        <div className="mt-10 flex justify-end">
          {!isAnswerChecked ? (
            <button
              onClick={handleCheck}
              disabled={selectedAnswer === null}
              className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Vérifier <Activity className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center gap-2 cursor-pointer"
            >
              {currentIdx < QUESTIONS.length - 1 ? 'Question Suivante' : 'Terminer'} <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}
