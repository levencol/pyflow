import { Play, Flame, Award, BookOpen, Trophy } from 'lucide-react';
import { UserProgress } from '../types';

interface AccueilViewProps {
  studentName: string | null;
  progress: UserProgress;
  onNavigateTab: (tab: string) => void;
}

export default function AccueilView({ studentName, progress, onNavigateTab }: AccueilViewProps) {
  const totalDays = 28;
  const completedDaysCount = progress.completedDays.length;
  const progressPercent = Math.round((completedDaysCount / totalDays) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* 1. Hero Section: Bienvenue */}
      <div className="apple-glass rounded-3xl p-10 border border-white/20 shadow-2xl relative overflow-hidden">
        {/* Glow effect behind */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-2xl relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display mb-4">
            Bon retour, <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-emerald-500">{studentName || 'Étudiant'}</span> !
          </h1>
          <p className="text-xl font-medium text-slate-900 dark:text-white mb-8 leading-relaxed">
            Prêt à reprendre votre apprentissage ? Vous êtes à {progressPercent}% de la maîtrise de Python. Continuez sur votre lancée !
          </p>
          
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="px-6 py-3.5 apple-btn-primary rounded-xl font-bold text-lg flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            <Play className="h-5 w-5 fill-current" />
            <span>Reprendre la formation</span>
          </button>
        </div>
      </div>

      {/* 2. Résumé Express (Métriques) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="apple-glass rounded-2xl p-6 border border-white/10 shadow-xl flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="h-14 w-14 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shrink-0">
            <Flame className="h-7 w-7 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Régularité</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">{progress.streak}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Jours</span>
            </div>
          </div>
        </div>

        <div className="apple-glass rounded-2xl p-6 border border-white/10 shadow-xl flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="h-14 w-14 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <BookOpen className="h-7 w-7 text-indigo-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-1">Progression</p>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{progressPercent}%</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{completedDaysCount} / {totalDays}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="apple-glass rounded-2xl p-6 border border-white/10 shadow-xl flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="h-14 w-14 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Trophy className="h-7 w-7 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Projets</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">{progress.completedProjects.length}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Validés</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Actualités & Prochaine Étape */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8">
          <div className="apple-glass rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
              <Award className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">Conseil du Jour</h2>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">La Pratique Fait le Maître</h3>
              <p className="text-slate-900 font-medium dark:text-slate-100 leading-relaxed text-lg">
                N'oubliez pas que lire le cours ne suffit pas. La meilleure façon d'assimiler la syntaxe Python est de se tromper, de comprendre les messages d'erreur et de corriger.
              </p>
              <p className="text-slate-900 font-medium dark:text-slate-100 leading-relaxed text-lg">
                Prenez l'habitude de tester chaque petit bout de code dans la <strong className="text-indigo-700 dark:text-indigo-300 font-bold">Zone de Pratique Libre</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="apple-glass rounded-3xl p-8 border border-white/10 shadow-2xl h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-4 mb-4">Accès Rapide</h3>
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <button 
                onClick={() => onNavigateTab('exercices')}
                className="w-full text-left p-4 apple-btn dark:apple-btn-dark rounded-xl flex items-center justify-between group cursor-pointer border border-white/20"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Dernier Exercice</div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Reprendre le défi</div>
                </div>
                <Play className="h-5 w-5 text-indigo-600 dark:text-indigo-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button 
                onClick={() => onNavigateTab('projets')}
                className="w-full text-left p-4 apple-btn dark:apple-btn-dark rounded-xl flex items-center justify-between group cursor-pointer border border-white/20"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Projet en Cours</div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Milestone final</div>
                </div>
                <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
