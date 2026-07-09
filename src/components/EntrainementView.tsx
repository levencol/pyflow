import { useState } from 'react';
import { Flame, Brain, Check, X as XIcon, ArrowRight, Trophy, Zap, Activity, RotateCcw, Search, ChevronDown, ArrowLeft, Database, BookOpen, Play } from 'lucide-react';

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

const MOCK_TRAININGS = [
  { id: 't1', title: 'Structures de données et algorithmes en Python', technology: 'Python' },
  { id: 't2', title: "Principes d'ingénierie logicielle en Python", technology: 'Python' },
  { id: 't3', title: 'Écrire du code Python efficace', technology: 'Python' },
  { id: 't4', title: 'Introduction à la programmation orientée objet en Python', technology: 'Python' },
  { id: 't5', title: 'Écrire des fonctions en Python', technology: 'Python' },
  { id: 't6', title: 'Types de données en Python', technology: 'Python' },
  { id: 't7', title: "Requêtes SQL avancées pour l'analyse", technology: 'SQL' },
  { id: 't8', title: 'Nettoyage de données avec pandas', technology: 'Python' },
  { id: 't9', title: 'Visualisation de données avec ggplot2', technology: 'R' },
  { id: 't10', title: 'Fondamentaux cloud pour développeurs', technology: 'AWS' },
];

const TECHNOLOGIES = ["Tout", "Python", "SQL", "R", "Power BI", "Tableau", "Excel", "AWS", "Azure", "Snowflake", "Java", "Claude", "ChatGPT"];

const renderTechIcon = (tech: string) => {
  if (tech === 'Python') return <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white font-mono shrink-0">Py</div>;
  if (tech === 'SQL') return <Database className="h-4 w-4 text-emerald-600" />;
  if (tech === 'R') return <div className="h-5 w-5 bg-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white font-mono shrink-0">R</div>;
  if (tech === 'AWS') return <div className="h-5 w-5 bg-orange-500 rounded flex items-center justify-center text-[8px] font-bold text-white font-mono shrink-0">AWS</div>;
  return <BookOpen className="h-4 w-4 text-slate-500" />;
};

export default function EntrainementView() {
  const [activeTraining, setActiveTraining] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('Tout');
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

  const handleQuitTraining = () => {
    setActiveTraining(null);
    handleRestart();
  };

  const filteredTrainings = MOCK_TRAININGS.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTech = selectedTech === 'Tout' || t.technology === selectedTech;
    return matchSearch && matchTech;
  });

  if (activeTraining === null) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in relative">
        {/* Banner (Hero) */}
        <div className="w-full bg-[#0B1528] rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="flex-1 space-y-6 z-10">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight font-display">Entraînement</h1>
              <div className="px-3 py-1.5 bg-[#f59e0b] text-[#78350f] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <RotateCcw className="h-3 w-3" /> Renforcez ce que vous apprenez
              </div>
            </div>
            <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              Entretenez vos compétences grâce à des défis quotidiens rapides sur ordinateur ou sur mobile. Vous gagnez des XP pour chaque série d'entraînements.
            </p>
          </div>
          {/* Decorative graphic right side */}
          <div className="hidden md:flex relative w-64 h-64 shrink-0 z-10 items-center justify-center">
            {/* Outer dotted circle (mocked with a border) */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-700 animate-spin-slow"></div>
            {/* Center icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-400 font-black tracking-widest text-sm uppercase">
              S'entraîner
            </div>
            {/* Decorative dots/icons */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <Activity className="h-4 w-4 text-slate-400" />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-slate-400" />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {TECHNOLOGIES.map(tech => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  selectedTech === tech
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {filteredTrainings.length} sessions d'entraînement
            </div>
            <div className="flex w-full sm:w-auto gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher des cours"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-slate-900 dark:text-white"
                />
              </div>
              <div className="relative">
                <select className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-900 dark:text-white">
                  <option>Sujet</option>
                  <option>Nouveautés</option>
                  <option>Popularité</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map(training => (
            <div
              key={training.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 flex flex-col h-full cursor-pointer"
              onClick={() => setActiveTraining(training.id)}
            >
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-3">
                  Entraînement
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight font-display mb-auto group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {training.title}
                </h3>
                <div className="mt-8">
                  <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded">
                    Prêt pour l'entraînement
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {renderTechIcon(training.technology)}
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {training.technology}
                  </span>
                </div>
                <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                  Commencer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
      <button 
        onClick={handleQuitTraining}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Retour au catalogue
      </button>
      
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
