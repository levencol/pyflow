import { Shield, Flame, Zap, Trophy, Target, Star, Lock, CheckCircle2, Medal, X, Users, Compass, Hammer, Clock, Brain, Rocket } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  category: 'Progression' | 'Régularité' | 'Maîtrise' | 'Vitesse' | 'Communauté' | 'Exploration' | 'Projet';
  unlocked: boolean;
  progress?: { current: number; total: number };
}

const MOCK_BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'Premier Sang',
    description: "Vous avez exécuté votre premier script Python avec succès.",
    iconName: 'zap',
    color: 'from-amber-400 to-amber-600',
    category: 'Progression',
    unlocked: true,
  },
  {
    id: 'b2',
    name: 'Semaine de Feu',
    description: "Vous vous êtes connecté et avez pratiqué 7 jours d'affilée.",
    iconName: 'flame',
    color: 'from-rose-400 to-rose-600',
    category: 'Régularité',
    unlocked: true,
  },
  {
    id: 'b3',
    name: 'As de la Logique',
    description: "Vous avez résolu 5 exercices de difficulté 'Difficile'.",
    iconName: 'target',
    color: 'from-indigo-400 to-indigo-600',
    category: 'Maîtrise',
    unlocked: false,
    progress: { current: 3, total: 5 }
  },
  {
    id: 'b4',
    name: 'Code Propre',
    description: "Vous avez soumis un code sans aucune erreur de syntaxe du premier coup.",
    iconName: 'star',
    color: 'from-emerald-400 to-emerald-600',
    category: 'Maîtrise',
    unlocked: false,
  },
  {
    id: 'b5',
    name: 'Marathonien',
    description: "Vous avez cumulé plus de 50 heures d'apprentissage sur la plateforme.",
    iconName: 'medal',
    color: 'from-purple-400 to-purple-600',
    category: 'Régularité',
    unlocked: false,
    progress: { current: 12, total: 50 }
  },
  {
    id: 'b6',
    name: 'Gardien du Savoir',
    description: "Vous avez terminé tous les modules théoriques du parcours de base.",
    iconName: 'shield',
    color: 'from-cyan-400 to-blue-600',
    category: 'Progression',
    unlocked: false,
    progress: { current: 8, total: 10 }
  },
  {
    id: 'b7',
    name: "Esprit d'Équipe",
    description: "Vous avez aidé 10 autres apprenants sur le forum d'entraide.",
    iconName: 'users',
    color: 'from-pink-400 to-pink-600',
    category: 'Communauté',
    unlocked: false,
    progress: { current: 4, total: 10 }
  },
  {
    id: 'b8',
    name: 'Explorateur Curieux',
    description: "Vous avez consulté toutes les rubriques annexes (documentation, glossaire).",
    iconName: 'compass',
    color: 'from-teal-400 to-teal-600',
    category: 'Exploration',
    unlocked: true,
  },
  {
    id: 'b9',
    name: 'Bâtisseur',
    description: "Vous avez soumis votre premier projet pratique.",
    iconName: 'hammer',
    color: 'from-orange-400 to-orange-600',
    category: 'Projet',
    unlocked: false,
  },
  {
    id: 'b10',
    name: 'Oiseau de Nuit',
    description: "Vous avez validé une session d'apprentissage entre minuit et 4h du matin.",
    iconName: 'clock',
    color: 'from-slate-700 to-slate-900',
    category: 'Régularité',
    unlocked: true,
  },
  {
    id: 'b11',
    name: "Génie de l'Algo",
    description: "Vous avez résolu un défi d'algorithmique complexe avec une complexité optimale.",
    iconName: 'brain',
    color: 'from-fuchsia-400 to-fuchsia-600',
    category: 'Maîtrise',
    unlocked: false,
  },
  {
    id: 'b12',
    name: 'Vitesse Lumière',
    description: "Vous avez terminé un quiz de 10 questions en moins de 2 minutes avec 100% de réussite.",
    iconName: 'rocket',
    color: 'from-yellow-400 to-yellow-600',
    category: 'Vitesse',
    unlocked: false,
  }
];

const getIcon = (name: string, className: string) => {
  switch (name) {
    case 'zap': return <Zap className={className} />;
    case 'flame': return <Flame className={className} />;
    case 'target': return <Target className={className} />;
    case 'star': return <Star className={className} />;
    case 'medal': return <Medal className={className} />;
    case 'shield': return <Shield className={className} />;
    case 'users': return <Users className={className} />;
    case 'compass': return <Compass className={className} />;
    case 'hammer': return <Hammer className={className} />;
    case 'clock': return <Clock className={className} />;
    case 'brain': return <Brain className={className} />;
    case 'rocket': return <Rocket className={className} />;
    default: return <Trophy className={className} />;
  }
};

export default function BadgesView() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const unlockedCount = useMemo(() => MOCK_BADGES.filter(b => b.unlocked).length, []);
  const totalCount = MOCK_BADGES.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 pb-12 animate-fade-in relative">
      
      {/* 1. Header & Jauge Globale */}
      <div className="apple-glass rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex-1 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200 dark:border-indigo-500/30">
            <Trophy className="h-4 w-4" /> Mur des Trophées
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display mb-2">
            Vos Badges d'Accomplissement
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xl">
            Collectionnez ces insignes en relevant des défis, en maintenant votre régularité et en prouvant votre maîtrise de Python. Cliquez sur un badge pour plus de détails.
          </p>
        </div>

        <div className="w-full md:w-auto bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-inner flex flex-col items-center justify-center min-w-[250px] z-10">
          <div className="text-4xl font-black text-slate-900 dark:text-white font-display mb-1">
            {unlockedCount} <span className="text-xl text-slate-400">/ {totalCount}</span>
          </div>
          <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Badges Obtenus</div>
          
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. Grille des Badges (Icônes circulaires) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 pt-8">
        {MOCK_BADGES.map(badge => (
          <div 
            key={badge.id}
            onClick={() => setSelectedBadge(badge)}
            className="flex flex-col items-center gap-5 cursor-pointer group"
          >
            {/* Cercle du badge */}
            <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              badge.unlocked 
                ? `bg-linear-to-br ${badge.color} shadow-xl shadow-indigo-500/20 group-hover:scale-110 group-hover:shadow-2xl border-4 border-white dark:border-slate-800` 
                : 'bg-slate-200 dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-700 opacity-60 group-hover:opacity-100'
            }`}>
              {/* Effet interne (verre) */}
              <div className="absolute inset-1 rounded-full bg-linear-to-b from-white/40 to-transparent dark:from-white/10 pointer-events-none"></div>
              
              {/* Icône du badge */}
              {badge.unlocked ? (
                getIcon(badge.iconName, "h-12 w-12 sm:h-14 sm:w-14 text-white drop-shadow-lg")
              ) : (
                <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-600" />
              )}
              
              {/* Étiquette "Check" si débloqué */}
              {badge.unlocked && (
                <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-slate-50 dark:border-slate-900 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            {/* Titre uniquement */}
            <h3 className={`text-center font-bold text-sm sm:text-base leading-tight transition-colors ${
              badge.unlocked ? 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400' : 'text-slate-500 dark:text-slate-500'
            }`}>
              {badge.name}
            </h3>
          </div>
        ))}
      </div>

      {/* 3. Modal de détails du badge */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
            onClick={() => setSelectedBadge(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md apple-glass bg-white/95 dark:bg-slate-900/95 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center animate-slide-up border border-white/20 dark:border-white/10">
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Grand badge dans la modale */}
            <div className={`relative w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl ${
              selectedBadge.unlocked 
                ? `bg-linear-to-br ${selectedBadge.color} border-4 border-white dark:border-slate-800 shadow-indigo-500/40` 
                : 'bg-slate-200 dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-700'
            }`}>
              <div className="absolute inset-1 rounded-full bg-linear-to-b from-white/40 to-transparent dark:from-white/10 pointer-events-none"></div>
              {selectedBadge.unlocked ? (
                getIcon(selectedBadge.iconName, "h-14 w-14 text-white drop-shadow-xl")
              ) : (
                <Lock className="h-12 w-12 text-slate-400 dark:text-slate-600" />
              )}
            </div>

            <span className="px-3 py-1 mb-4 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
              {selectedBadge.category}
            </span>

            <h2 className={`text-2xl font-black font-display tracking-tight mb-4 ${
              selectedBadge.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
            }`}>
              {selectedBadge.name}
            </h2>

            <p className={`text-base leading-relaxed mb-6 ${
              selectedBadge.unlocked ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'
            }`}>
              {selectedBadge.description}
            </p>

            {/* Barre de progression ou état */}
            {!selectedBadge.unlocked && selectedBadge.progress && (
              <div className="w-full pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                  <span>Progression</span>
                  <span>{selectedBadge.progress.current} / {selectedBadge.progress.total}</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-slate-400 dark:bg-slate-600 rounded-full"
                    style={{ width: `${(selectedBadge.progress.current / selectedBadge.progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {!selectedBadge.unlocked && !selectedBadge.progress && (
              <div className="w-full pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <Lock className="h-4 w-4" /> Badge Verrouillé
              </div>
            )}

            {selectedBadge.unlocked && (
              <div className="w-full pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="h-5 w-5" /> Badge Obtenu
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}
