import { useState } from 'react';
import { BookOpen, Trophy, Edit3, Eye, FileText, ChevronRight, PlusCircle } from 'lucide-react';
import { courseDays } from '../../data/curriculum';
import { projects } from '../../data/projects';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'projects'>('lessons');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Gestion du Contenu (Mock)</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Cette section est une maquette visuelle pour le moment.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20">
          <PlusCircle className="h-4 w-4" /> Créer un nouveau contenu
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button 
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'lessons' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Parcours & Leçons
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

      {/* Content List */}
      <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div className="col-span-1">ID</div>
          <div className="col-span-6">Titre & Phase</div>
          <div className="col-span-3">Statut</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-[60vh] overflow-y-auto">
          {activeTab === 'lessons' && courseDays.map((day) => (
            <div key={day.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
              <div className="col-span-1 font-mono text-sm font-bold text-slate-400">J-{day.id}</div>
              <div className="col-span-6">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{day.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{day.phase}</p>
              </div>
              <div className="col-span-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Publié
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'projects' && projects.map((proj) => (
            <div key={proj.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
              <div className="col-span-1 font-mono text-xs font-bold text-slate-400 truncate" title={proj.id}>{proj.id.split('_').pop()?.toUpperCase()}</div>
              <div className="col-span-6">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{proj.title}</p>
                <span className="inline-block px-2 py-0.5 mt-1 rounded bg-slate-200 dark:bg-slate-800 text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400">{proj.level}</span>
              </div>
              <div className="col-span-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Actif
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
