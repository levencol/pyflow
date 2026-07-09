import { Award, Download, Share2, Lock, Star, CheckCircle2, Shield } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  date: string | null;
  issuer: string;
  level: string;
  description: string;
  locked: boolean;
  requirement: string | null;
}

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Fondamentaux de Python',
    date: '15 Mai 2024',
    issuer: 'PyFlow Academy',
    level: 'Débutant',
    description: "A complété avec succès le cursus d'introduction à la programmation Python, validant l'acquisition des bases algorithmiques.",
    locked: false,
    requirement: null
  },
  {
    id: 'cert-2',
    title: 'Maîtrise de la POO',
    date: '2 Juin 2024',
    issuer: 'PyFlow Academy',
    level: 'Intermédiaire',
    description: 'A démontré une compréhension approfondie de la Programmation Orientée Objet (Classes, Héritage, Polymorphisme).',
    locked: false,
    requirement: null
  },
  {
    id: 'cert-3',
    title: 'Algorithmique Avancée',
    date: null,
    issuer: 'PyFlow Academy',
    level: 'Avancé',
    description: "Expertise dans l'optimisation, les structures de données complexes et les algorithmes de graphes.",
    locked: true,
    requirement: 'Terminez le module "Algorithmes de Tri et Graphes"'
  },
  {
    id: 'cert-4',
    title: 'Expertise Data Science',
    date: null,
    issuer: 'PyFlow Academy',
    level: 'Expert',
    description: "Maîtrise de Pandas, NumPy, et des concepts fondamentaux de l'analyse de données et de l'apprentissage automatique.",
    locked: true,
    requirement: 'Validez 5 projets de niveau Expert'
  }
];

export default function CertificatsView({ studentName }: { studentName: string | null }) {
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* 1. Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display mb-2 flex items-center gap-3">
            <Award className="h-8 w-8 text-amber-500" />
            Mes Certificats
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Vos accomplissements et diplômes officiels PyFlow.</p>
        </div>
      </div>

      {/* 2. Grille des Certificats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_CERTIFICATES.map(cert => (
          <div key={cert.id} className="relative group">
            
            {!cert.locked ? (
              // --- CERTIFICAT DÉBLOQUÉ (Design Premium) ---
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-2 border-amber-200/50 dark:border-amber-500/30 shadow-2xl transition-all hover:scale-[1.02] hover:shadow-amber-500/20">
                {/* Reflet de verre */}
                <div className="absolute inset-0 bg-linear-to-br from-white/60 to-transparent dark:from-white/10 dark:to-transparent opacity-50 pointer-events-none"></div>
                
                {/* Ornements dorés */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative p-8 sm:p-10 flex flex-col h-full border-4 border-double border-amber-200/40 dark:border-amber-700/40 m-2 rounded-2xl">
                  
                  {/* Sceau & Badge */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-500 uppercase mb-1">Certificat Officiel</span>
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{cert.issuer}</span>
                    </div>
                    <div className="h-14 w-14 rounded-full bg-linear-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40 border-2 border-white/20">
                      <Star className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                  
                  {/* Contenu principal */}
                  <div className="text-center my-6 flex-1">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Décerné avec les honneurs à</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight mb-6 font-serif italic">
                      {studentName || 'Étudiant'}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Pour la complétion du parcours :</p>
                    <h3 className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mb-4">{cert.title}</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-md mx-auto italic">
                      "{cert.description}"
                    </p>
                  </div>
                  
                  {/* Bas de page & Date */}
                  <div className="mt-6 pt-6 border-t border-amber-200/50 dark:border-amber-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date d'obtention</p>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {cert.date}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-2 sm:px-4 sm:py-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold text-sm transition-colors border border-slate-200 dark:border-slate-600 flex items-center gap-2 cursor-pointer backdrop-blur-sm">
                        <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Partager</span>
                      </button>
                      <button className="p-2 sm:px-4 sm:py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer">
                        <Download className="h-4 w-4" /> <span className="hidden sm:inline">Télécharger</span>
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            ) : (
              // --- CERTIFICAT VERROUILLÉ (Design Fumé) ---
              <div className="relative overflow-hidden rounded-3xl apple-glass border border-white/10 dark:border-white/5 opacity-80 transition-all hover:opacity-100 flex flex-col h-full h-[400px]">
                <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-900/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 m-4 rounded-2xl">
                  
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 shadow-inner border border-slate-200 dark:border-slate-700">
                    <Lock className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{cert.title}</h3>
                  <div className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
                    Niveau {cert.level}
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-white/10 w-full max-w-sm">
                    <Shield className="h-5 w-5 text-indigo-500 shrink-0" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">
                      <span className="block text-xs font-bold text-indigo-500 uppercase mb-0.5">Pré-requis</span>
                      {cert.requirement}
                    </p>
                  </div>
                  
                </div>
              </div>
            )}
            
          </div>
        ))}
      </div>
      
    </div>
  );
}
