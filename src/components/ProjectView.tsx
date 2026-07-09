import { useState } from 'react';
import { Trophy, Clock, CheckCircle2, ChevronRight, HelpCircle, Eye, EyeOff, Terminal, Sparkles, BookOpen, Lock, ArrowLeft, Search, ChevronDown, Activity, Zap, Database, BarChart2, Play, Code2, RotateCcw } from 'lucide-react';
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

  const handleSelectProject = (id: string) => {
    onSelectProject(id);
    setActiveStepIdx(0);
    setShowSolution(false);
    setShowHint({});
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-[calc(100vh-6rem)] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl bg-white dark:bg-slate-900"
    >
      {/* Header */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900 shrink-0">
        <button 
          onClick={handleQuitProject}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> {currentProject.title}
        </button>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Instructions */}
        <div className="w-1/3 min-w-[300px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#f8fafc]">
          <div className="bg-slate-100 dark:bg-slate-200 text-slate-800 font-bold text-sm px-4 py-3 shrink-0 border-b border-slate-200 dark:border-slate-300">
            Instructions du projet
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-800 dark:text-slate-800 leading-relaxed font-sans space-y-6">
            <div className="space-y-4">
              <Markdown components={compactMarkdownComponents}>{currentProject.description}</Markdown>
            </div>
            
            <div className="space-y-6 mt-6">
              {currentProject.steps.map((step, idx) => (
                <div key={step.id} className="space-y-2">
                  <Markdown components={compactMarkdownComponents}>{step.instruction}</Markdown>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Accordion "Soumissions et aide" */}
          <div className="border-t border-slate-200 dark:border-slate-300 shrink-0 bg-white">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-200 hover:bg-slate-200 dark:hover:bg-slate-300 transition-colors text-slate-800 font-bold text-sm cursor-pointer">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" /> Soumissions et aide
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-6 border-b border-slate-200 pb-0">
                <button className="text-[11px] font-bold text-slate-900 border-b-2 border-slate-900 pb-2 uppercase cursor-pointer">
                  Soumissions
                </button>
                <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 pb-2 uppercase cursor-pointer">
                  Guides
                </button>
              </div>
              
              <div className="flex items-start gap-4 border border-slate-100 rounded-lg p-4 bg-white shadow-sm">
                <div className="p-2 border border-slate-200 rounded shrink-0 text-slate-700">
                  <Code2 className="h-5 w-5" />
                </div>
                <div className="text-[11px] text-slate-600 space-y-3 leading-relaxed">
                  <p>Cliquez sur "Soumettre le projet" pour obtenir un retour sur votre solution.</p>
                  <p>Pour expérimenter, utilisez "Exécuter tout" ou "Exécuter la cellule" dans l'éditeur pour voir le résultat de votre code avant de soumettre.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: IDE */}
        <div className="flex-1 flex flex-col bg-[#1e293b]">
          {/* Top IDE bar */}
          <div className="h-10 border-b border-slate-700/50 flex items-center justify-between px-4 text-xs font-medium text-slate-400 shrink-0 bg-[#0f172a]">
            <div className="flex items-center gap-4">
               <button className="text-slate-300 hover:text-white cursor-pointer transition-colors">File</button>
            </div>
            <button className="text-slate-400 hover:text-white cursor-pointer">
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
          
          {/* Editor Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#0f172a]/50">
            <div className="mb-4 text-[11px] text-slate-400">
              Complétez le code suivant afin que votre solution respecte les instructions.
            </div>
            <div className="font-mono text-[13px] leading-relaxed">
               <pre className="whitespace-pre-wrap"><code className="language-python">
                 <PythonHighlighter code={currentProject.steps[0]?.initialCode || '# Écrivez votre code ici'} isDark={true} />
               </code></pre>
            </div>
          </div>
          
          {/* Footer IDE Action Bar */}
          <div className="h-14 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0">
             <div className="flex items-center gap-3">
               <button className="p-2 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm">
                  <RotateCcw className="h-4 w-4" />
               </button>
               <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-sm">
                  <Play className="h-4 w-4" /> Exécuter Tout
               </button>
               <button 
                 onClick={() => onCompleteProject(currentProject.id)}
                 className={`flex items-center gap-2 px-6 py-2 transition-colors rounded-md font-bold text-sm text-white cursor-pointer shadow-sm ${
                   hasCompleted ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-[#00e676] hover:bg-[#00c853]'
                 }`}
               >
                 {hasCompleted ? 'Projet Soumis (Annuler)' : 'Soumettre Le Projet'}
               </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
