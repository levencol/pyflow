import { useState, useMemo } from 'react';
import { Search, FileText, Download, Lock, Eye, X, Filter, FileCode, PlaySquare, ChevronRight } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  category: string;
  type: 'PDF' | 'Code' | 'Vidéo';
  date: string;
  size: string;
  canDownload: boolean;
  content: string; // Used for mocking the viewer
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Cheatsheet Python (Bases)',
    category: 'Mémos',
    type: 'PDF',
    date: '10 Fév 2024',
    size: '1.2 MB',
    canDownload: true,
    content: "Ceci est le contenu simulé du document PDF 'Cheatsheet Python'. Il contient un résumé des variables, des boucles, et des conditions fondamentales."
  },
  {
    id: '2',
    title: 'Architecture des algorithmes complexes',
    category: 'Théorie',
    type: 'PDF',
    date: '15 Mar 2024',
    size: '4.5 MB',
    canDownload: false,
    content: "CONTENU PROTÉGÉ : Ce document traite de la conception algorithmique avancée. L'administrateur a bloqué le téléchargement pour protéger la propriété intellectuelle."
  },
  {
    id: '3',
    title: "Exemple de script d'automatisation",
    category: 'Pratique',
    type: 'Code',
    date: '22 Avr 2024',
    size: '15 KB',
    canDownload: true,
    content: "def automatiser():\\n    print('Automatisation en cours...')\\n    return True\\n\\n# Ce script démontre comment manipuler le système de fichiers."
  },
  {
    id: '4',
    title: 'Tutoriel Vidéo : Les décorateurs',
    category: 'Cours',
    type: 'Vidéo',
    date: '05 Mai 2024',
    size: '150 MB',
    canDownload: false,
    content: "[Lecteur vidéo simulé] Vous regardez le tutoriel sur les décorateurs Python."
  }
];

export default function DocumentView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);

  const categories = ['Tous', ...Array.from(new Set(MOCK_DOCUMENTS.map(doc => doc.category)))];

  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Tous' || doc.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-6 w-6 text-rose-500" />;
      case 'Code': return <FileCode className="h-6 w-6 text-indigo-500" />;
      case 'Vidéo': return <PlaySquare className="h-6 w-6 text-emerald-500" />;
      default: return <FileText className="h-6 w-6 text-slate-500" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in relative">
      
      {/* 1. Header & Recherche */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display mb-2">Documents & Ressources</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Consultez les supports mis à disposition par vos administrateurs.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un document..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full apple-glass border-slate-200/50 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl pl-12 pr-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Filtres par catégorie */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-300 dark:border-slate-700">
          <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filtres</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              activeCategory === cat 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Grille des documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 apple-glass rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            Aucun document ne correspond à votre recherche.
          </div>
        ) : (
          filteredDocuments.map(doc => (
            <div key={doc.id} className="apple-glass rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col transition-all hover:scale-[1.02] hover:shadow-2xl group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/60 dark:bg-slate-900/60 rounded-xl shadow-xs border border-white/40 dark:border-white/10 group-hover:scale-110 transition-transform">
                  {getIconForType(doc.type)}
                </div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400">
                  {doc.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-2" title={doc.title}>
                {doc.title}
              </h3>
              
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">
                <span>{doc.type}</span>
                <span>•</span>
                <span>{doc.size}</span>
                <span>•</span>
                <span>{doc.date}</span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 flex gap-3">
                <button 
                  onClick={() => setViewingDocument(doc)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  <Eye className="h-4 w-4" /> Lire
                </button>
                
                {doc.canDownload ? (
                  <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors cursor-pointer" title="Télécharger">
                    <Download className="h-4 w-4" />
                  </button>
                ) : (
                  <button disabled className="px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 rounded-xl font-bold cursor-not-allowed border border-slate-200 dark:border-slate-800" title="Téléchargement restreint par l'administrateur">
                    <Lock className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Visionneuse (Modal) */}
      {viewingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 animate-fade-in">
          {/* Backdrop avec flou intense */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
            onClick={() => setViewingDocument(null)}
          ></div>
          
          <div className="relative w-full max-w-5xl h-[85vh] bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-slate-700 animate-slide-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {getIconForType(viewingDocument.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{viewingDocument.title}</h2>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>{viewingDocument.type}</span>
                    <span>•</span>
                    <span>{viewingDocument.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {viewingDocument.canDownload ? (
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-colors cursor-pointer">
                    <Download className="h-4 w-4" /> <span className="hidden sm:inline">Télécharger</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-500 font-bold rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <Lock className="h-4 w-4" /> <span className="hidden sm:inline">Protégé</span>
                  </div>
                )}
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-2"></div>
                <button 
                  onClick={() => setViewingDocument(null)}
                  className="p-2 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content (Viewer Simulation) */}
            <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-[#0d1117]">
              {viewingDocument.type === 'Code' ? (
                <pre className="p-6 rounded-xl bg-slate-900 text-slate-100 font-mono text-sm overflow-x-auto shadow-inner">
                  {viewingDocument.content}
                </pre>
              ) : (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <Eye className="h-5 w-5" />
                    <span className="font-bold text-sm tracking-widest uppercase">Mode Lecture</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-300 leading-relaxed text-lg font-medium">
                    {viewingDocument.content}
                  </p>
                  
                  {/* Faux pages */}
                  <div className="mt-12 h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Fin du document</p>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
}
