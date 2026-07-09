import { useState } from 'react';
import { Trophy, Clock, CheckCircle2, ChevronRight, HelpCircle, Eye, EyeOff, Terminal, Sparkles, BookOpen, Lock, ArrowLeft, Search, ChevronDown, Activity, Zap, Database, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { LearnProject, UserProgress } from '../types';
import { projects } from '../data/projects';
import { PythonHighlighter } from '../utils/pythonHighlighter';

const compactMarkdownComponents = {
  p: ({ children }: any) => <span className="inline-block font-sans">{children}</span>,
  code: ({ children }: any) => {
    const codeText = String(children);
    const hasKeyword = /\b(if|elif|else|and|or|not|True|False|None|print|while|for|range)\b/.test(codeText);
    return (
      <code className="px-1 py-0.5 bg-slate-100 font-mono text-slate-800 text-[11px] rounded border border-slate-200">
        {hasKeyword ? <PythonHighlighter code={codeText} isDark={false} /> : children}
      </code>
    );
  },
  strong: ({ children }: any) => <strong className="font-bold text-slate-800">{children}</strong>,
  em: ({ children }: any) => <em className="italic text-slate-500">{children}</em>,
};

interface ProjectViewProps {
  progress: UserProgress;
  activeProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  onCompleteProject: (projectId: string) => void;
  unlockedProjects: string[];
}

export default function ProjectView({ progress, activeProjectId, onSelectProject, onCompleteProject, unlockedProjects = [] }: ProjectViewProps) {
  // Set first project as active if none provided
  const listProjects = projects;
  const currentProjId = activeProjectId || listProjects[0].id;
  const currentProject = listProjects.find(p => p.id === currentProjId) || listProjects[0];

  const hasCompleted = progress.completedProjects.includes(currentProject.id);
  const isLocked = !unlockedProjects.includes(currentProject.id);

  // Accordion active step index
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Show code solutions helper
  const [showSolution, setShowSolution] = useState(false);

  // Active step hint toggler
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});

  // Catalog state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('Tout');

  const TECHNOLOGIES = ["Tout", "Python", "SQL", "R", "Power BI", "Tableau", "Excel", "ChatGPT", "Azure", "Databricks", "Alteryx", "dbt", "Theory", "KNIME", "OpenAI", "PyTorch", "Snowflake", "Spark", "BigQuery", "Redshift"];

  const toggleHint = (stepId: number) => {
    setShowHint(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleQuitProject = () => {
    onSelectProject(null as unknown as string); // Need to allow null upstream or just cast, wait, onSelectProject takes string. I'll just change the upstream type if needed, but in App.tsx it's `useState<string | null>(null)` so it accepts null. Wait, the prop type is `(projectId: string) => void`. Let me change the prop type to `(projectId: string | null) => void`.
  };

  if (activeProjectId === null) {
    const filteredProjects = listProjects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTech = selectedTech === 'Tout' || p.technologies.includes(selectedTech);
      return matchSearch && matchTech;
    });

    return (
      <div className="w-full max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in relative">
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
              {filteredProjects.length} projets
            </div>
            <div className="flex w-full sm:w-auto gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher des projets"
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
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Activity className="h-4 w-4" /> Autres filtres
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => {
            const isCompleted = progress.completedProjects.includes(proj.id);
            return (
              <div
                key={proj.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 flex flex-col h-full cursor-pointer"
                onClick={() => handleSelectProject(proj.id)}
              >
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-3">
                    Projet
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight font-display mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {proj.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 mb-4">
                    <BarChart2 className={`h-4 w-4 ${proj.level === 'Débutant' ? 'text-emerald-500' : proj.level === 'Intermédiaire' ? 'text-amber-500' : 'text-red-500'}`} />
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{proj.level}</span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-auto">
                    {proj.description}
                  </p>

                  <div className="mt-6">
                    <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded">
                      Prêt pour le projet
                    </span>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
                    <Clock className="h-4 w-4" /> {proj.estimatedTime}
                  </div>
                  <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                    {isCompleted ? 'Relancer' : 'Commencer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: project selectors if they exist */}
        <div className="md:col-span-3 apple-glass dark:apple-glass-dark rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Projets du Programme</h3>
          <div className="space-y-2">
            {listProjects.map((p) => {
              const projLocked = !unlockedProjects.includes(p.id);
              const active = p.id === currentProject.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className={`w-full flex items-center justify-between text-left p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-905 dark:text-indigo-400 font-bold shadow-2xs'
                      : projLocked
                      ? 'opacity-65 text-slate-400 hover:border-slate-150 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-50 dark:border-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate pr-1">
                    <span className="text-[10px] font-mono text-slate-450 block uppercase tracking-wider">{p.level}</span>
                    <span className="truncate block font-sans font-medium">{p.title}</span>
                  </div>
                  {projLocked ? <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locked Card Details */}
        <div className="md:col-span-9 max-w-xl mx-auto my-6 animate-fade-in text-slate-700 dark:text-slate-300">
          <div className="apple-glass dark:apple-glass-dark rounded-3xl p-8 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 flex items-center justify-center border border-amber-100 dark:border-amber-800">
              <Lock className="h-8 w-8 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display font-black text-xl text-slate-900 dark:text-slate-100 tracking-tight">
                Projet Guidé Bloqué : {currentProject.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans px-4">
                Ce défi final n'a pas encore été ouvert d'accès par l'administration. Par défaut, tous les cours, exercices et projets sont bloqués.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-left space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wide text-indigo-900 dark:text-indigo-400 font-display">
                <span>💡</span> Comment démarrer ce projet ?
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-1">
                Rendez-vous dans la section <strong className="text-slate-800 dark:text-slate-200">Administration</strong> de la barre latérale pour activer le projet <strong className="font-mono bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-1 py-0.5 rounded text-indigo-700 dark:text-indigo-400">{currentProject.id}</strong> avec le code secret.
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  const firstUnlocked = listProjects.find(p => unlockedProjects.includes(p.id));
                  if (firstUnlocked) {
                    onSelectProject(firstUnlocked.id);
                  }
                }}
                className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-3xs"
              >
                Aller au premier projet débloqué
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectProject = (id: string) => {
    onSelectProject(id);
    setActiveStepIdx(0);
    setShowSolution(false);
    setShowHint({});
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <button 
        onClick={handleQuitProject}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Retour au catalogue
      </button>

      {/* Portfolio Selector grid list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listProjects.map((proj, idx) => {
          const isSelected = proj.id === currentProject.id;
          const isCompleted = progress.completedProjects.includes(proj.id);
          
          let colorBorder = 'apple-glass dark:apple-glass-dark hover:shadow-md transition-shadow';
          if (isSelected) {
            colorBorder = 'apple-glass dark:apple-glass-dark ring-2 ring-indigo-500 dark:ring-indigo-400 shadow-md';
          }

          return (
            <button
              key={proj.id}
              onClick={() => handleSelectProject(proj.id)}
              className={`p-4 rounded-xl border transition-all text-left flex gap-3.5 items-start cursor-pointer group ${colorBorder}`}
            >
              <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm ${
                isCompleted 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-650 dark:text-emerald-400' 
                  : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-650 dark:text-indigo-400'
              }`}>
                {isCompleted ? <CheckCircle2 className="h-5.5 w-5.5 text-emerald-500 dark:text-emerald-400" /> : <Trophy className="h-5 w-5" />}
              </div>

              <div className="space-y-1 truncate w-[85%]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Étape {idx + 1} • {proj.level}
                  </span>
                  {isCompleted && <span className="text-[9px] font-semibold text-emerald-650 dark:text-emerald-400">Résolu</span>}
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">{proj.title}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-sans">{proj.technologies.slice(0, 3).join(', ')}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Step Guide Accordion & Overview (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="apple-glass dark:apple-glass-dark rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Projet Pratique {currentProject.level}</span>
                <h1 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {currentProject.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> {currentProject.estimatedTime}
                </span>
                {hasCompleted && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" /> Validé
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
              {currentProject.description}
            </p>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-1.5 pt-1.5 pb-2">
              {currentProject.technologies.map((tech, i) => (
                <span key={i} className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-md bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-800/30">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Stepped Milestones outline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Jalons d’Étapes</h3>

            <div className="space-y-3">
              {currentProject.steps.map((step, idx) => {
                const isOpen = idx === activeStepIdx;

                return (
                  <div 
                    key={step.id} 
                    className={`border rounded-xl transition-all overflow-hidden ${
                      isOpen 
                        ? 'border-indigo-100 dark:border-indigo-800 bg-linear-to-b from-white/90 dark:from-slate-900/90 to-slate-50/20 dark:to-slate-800/20 shadow-3xs' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-205 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-900/60'
                    }`}
                  >
                    {/* Header trigger */}
                    <button
                      onClick={() => setActiveStepIdx(idx)}
                      className="w-full text-left p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold font-mono ${
                          isOpen
                            ? 'apple-btn-primary shadow-3xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {step.id}
                        </span>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs font-sans sm:text-sm">
                          {step.title}
                        </h4>
                      </div>
                      <ChevronRight className={`h-4.5 w-4.5 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Step details inside accordion */}
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/30 space-y-4 animate-fade-in">
                        <div className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
                          <Markdown components={compactMarkdownComponents}>{step.instruction}</Markdown>
                        </div>

                        {/* Hint box */}
                        <div className="space-y-1.5">
                          <button
                            onClick={() => toggleHint(step.id)}
                            className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold flex items-center gap-1 cursor-pointer select-none"
                          >
                            <HelpCircle className="h-3.5 w-3.5" /> {showHint[step.id] ? "Masquer l'indice" : "Besoin d'un indice ?"}
                          </button>
                          
                          {showHint[step.id] && (
                            <div className="p-3 bg-indigo-50/40 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/50 rounded-lg text-xs text-indigo-950 dark:text-indigo-300 leading-relaxed font-sans">
                              <Markdown components={compactMarkdownComponents}>{step.hint}</Markdown>
                            </div>
                          )}
                        </div>

                        {/* Starting template if present */}
                        {step.initialCode && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Squelette de code initial (template) :</span>
                            <div className="rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden font-mono text-[11px] text-slate-305 p-3.5 max-h-48 overflow-auto">
                              <pre className="whitespace-pre-wrap"><code><PythonHighlighter code={step.initialCode} /></code></pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation section in bottom */}
          <div className="apple-glass dark:apple-glass-dark rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Avez-vous réussi le projet ?</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Une fois assemblé, enregistrez-le pour l’ajouter à votre score d’expert.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCompleteProject(currentProject.id)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                hasCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400'
                  : 'apple-btn-primary shadow-3xs'
              }`}
            >
              {hasCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> Projet Validé (Annuler)
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Déclarer Résolu &amp; Valider
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Right Side: Reference Solution Pane (5 cols) */}
        <div className="xl:col-span-5 sticky top-6 space-y-6">
          <div className="border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-950 shadow-md overflow-hidden">
            <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-mono font-bold text-slate-350">solution_référence.py</span>
              </div>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] rounded-lg text-slate-300 font-semibold transition-colors flex items-center gap-1"
              >
                {showSolution ? (
                  <>
                    <EyeOff className="h-3 w-3" /> Cacher la solution
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" /> Révéler la solution
                  </>
                )}
              </button>
            </div>

            {/* Solution Display or Hidden Overlay */}
            <div className="relative min-h-80 bg-black/90 p-5 font-mono text-[11px] leading-relaxed text-slate-300 overflow-auto">
              {showSolution ? (
                <pre className="whitespace-pre overflow-auto max-h-120 custom-scrollbar"><code><PythonHighlighter code={currentProject.solutionCode} /></code></pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-linear-to-b from-slate-950/80 to-slate-950 space-y-4">
                  <div className="h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400">
                    🔒
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-205 text-sm">Solution Professionnelle Verrouillée</h5>
                    <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed mt-1 font-sans">
                      Nous vous encourageons fortement à écrire le projet vous-même en combinant les jalons avant de consulter le fichier d’implémentation.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSolution(true)}
                    className="px-4 py-2 apple-btn-primary font-bold text-xs rounded-lg transition-colors cursor-pointer font-sans"
                  >
                    Révéler la solution quand même
                  </button>
                </div>
              )}
            </div>

            {/* Shell footer */}
            <div className="bg-slate-950 border-t border-slate-850 p-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-slate-400" /> Structure Clean-Code PEP8</span>
              <span>100% Fonctionnel</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
