import { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, CheckCircle2, Sparkles, Code2, Database, Terminal, FileCode2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserProgress } from '../types';

interface CoursViewProps {
  progress: UserProgress;
  onSelectDay: (dayId: number) => void;
  unlockedDays: number[];
}

const MOCK_COURSES = [
  { 
    id: 'c1', 
    title: 'Introduction aux statistiques en Python', 
    level: 'Intermédiaire', 
    desc: 'Renforcez vos compétences statistiques en collectant, analysant et interprétant les données avec précision grâce à Python.', 
    author: { name: 'Maggie Matsui', role: 'Curriculum Manager at DataCamp', img: 'https://i.pravatar.cc/150?u=maggie' }, 
    time: '4 h', 
    isCompleted: false, 
    tech: 'Python' 
  },
  { 
    id: 'c2', 
    title: 'Introduction au shell', 
    level: 'Débutant', 
    desc: 'Découvrez les bases de la ligne de commande Unix pour naviguer dans vos fichiers et exécuter des programmes de manière efficace.', 
    author: { name: 'Filip Schouwenaars', role: 'Machine Learning Researcher', img: 'https://i.pravatar.cc/150?u=filip' }, 
    time: '4 h', 
    isCompleted: true, 
    tech: 'Shell' 
  },
  { 
    id: 'c3', 
    title: 'Structures de données et algorithmes en Python', 
    level: 'Avancé', 
    desc: 'Explorez les structures de données (listes chaînées, piles, files, tables de hachage, graphes) et maîtrisez les algorithmes de recherche et tri.', 
    author: { name: 'Miriam Antona', role: 'Software Engineer', img: 'https://i.pravatar.cc/150?u=miriam' }, 
    time: '4 h', 
    isCompleted: true, 
    tech: 'Python' 
  },
  { 
    id: 'c4', 
    title: 'Introduction aux tests en Python', 
    level: 'Débutant', 
    desc: 'Apprenez à écrire des tests unitaires robustes avec pytest pour assurer la qualité et la fiabilité de votre code Python.', 
    author: { name: 'Alex Watson', role: 'QA Engineer', img: 'https://i.pravatar.cc/150?u=alex' }, 
    time: '3 h', 
    isCompleted: false, 
    tech: 'Python' 
  },
  { 
    id: 'c5', 
    title: "Principes d'ingénierie logicielle en Python", 
    level: 'Intermédiaire', 
    desc: 'Écrivez du code propre, maintenable et modulaire en appliquant les principes SOLID et le design pattern MVC.', 
    author: { name: 'Sarah Lee', role: 'Senior Developer', img: 'https://i.pravatar.cc/150?u=sarah' }, 
    time: '5 h', 
    isCompleted: false, 
    tech: 'Python' 
  },
  { 
    id: 'c6', 
    title: 'Écrire du code Python efficace', 
    level: 'Intermédiaire', 
    desc: 'Optimisez les performances de vos scripts Python en utilisant les générateurs, les compréhensions et les modules intégrés avancés.', 
    author: { name: 'John Doe', role: 'Data Scientist', img: 'https://i.pravatar.cc/150?u=john' }, 
    time: '4 h', 
    isCompleted: false, 
    tech: 'Python' 
  },
];

const TAGS = [
  "Tout", "Python", "SQL", "R", "Power BI", "Tableau", "Excel", 
  "Google Sheets", "AWS", "Azure", "Snowflake", "Java", "Alteryx", 
  "KNIME", "Claude", "Microsoft Copilot", "ChatGPT", "Gemini", 
  "OpenAI", "PyTorch", "Google Cloud", "+24"
];

const getLevelBars = (level: string) => {
  if (level === 'Débutant') {
    return (
      <div className="flex items-end gap-[2px] h-3">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></div>
        <div className="w-1.5 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
        <div className="w-1.5 h-3.5 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
      </div>
    );
  }
  if (level === 'Intermédiaire') {
    return (
      <div className="flex items-end gap-[2px] h-3">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></div>
        <div className="w-1.5 h-2.5 bg-emerald-500 rounded-sm"></div>
        <div className="w-1.5 h-3.5 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-[2px] h-3">
      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></div>
      <div className="w-1.5 h-2.5 bg-emerald-500 rounded-sm"></div>
      <div className="w-1.5 h-3.5 bg-emerald-500 rounded-sm"></div>
    </div>
  );
};

const getTechIcon = (tech: string) => {
  if (tech === 'Python') return <div className="h-5 w-5 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center text-white"><FileCode2 className="h-3 w-3" /></div>;
  if (tech === 'Shell') return <div className="h-5 w-5 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center text-white"><Terminal className="h-3 w-3" /></div>;
  if (tech === 'SQL') return <div className="h-5 w-5 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center text-white"><Database className="h-3 w-3" /></div>;
  return <div className="h-5 w-5 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center text-white"><Code2 className="h-3 w-3" /></div>;
};

export default function CoursView({ progress, onSelectDay, unlockedDays = [] }: CoursViewProps) {
  const [activeTag, setActiveTag] = useState("Tout");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiTutorEnabled, setAiTutorEnabled] = useState(false);

  const filteredCourses = MOCK_COURSES.filter(c => {
    const matchesTag = activeTag === 'Tout' || c.tech === activeTag || c.title.includes(activeTag);
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto space-y-6 pb-12"
    >
      {/* Tags Scroll Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              activeTag === tag
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-slate-800">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
          679 cours
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* AI Tutor Toggle */}
          <button 
            onClick={() => setAiTutorEnabled(!aiTutorEnabled)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${aiTutorEnabled ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
              <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${aiTutorEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <span className={`text-sm font-bold flex items-center gap-1 ${aiTutorEnabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
              <Sparkles className="h-3.5 w-3.5" /> AI Tutor
            </span>
          </button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher des cour"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 pl-9 pr-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Dropdown */}
          <div className="relative">
            <select className="appearance-none w-40 pl-3 pr-8 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer">
              <option>Sujet</option>
              <option>Programmation</option>
              <option>Data Science</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Filters Button */}
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <SlidersHorizontal className="h-4 w-4" />
            Autres filtres
          </button>
        </div>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredCourses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full"
          >
            <div className="p-6 flex-1 flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                COURS
              </span>
              
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-3 line-clamp-2">
                {course.title}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                {getLevelBars(course.level)}
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {course.level}
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6 flex-1">
                {course.desc}
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <img 
                  src={course.author.img} 
                  alt={course.author.name} 
                  className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{course.author.name}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{course.author.role}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {getTechIcon(course.tech)}
                {course.time}
              </div>
              
              {course.isCompleted ? (
                <button 
                  onClick={() => onSelectDay(1)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Afficher la réussite
                </button>
              ) : (
                <button 
                  onClick={() => onSelectDay(1)}
                  className="px-6 py-2 border border-indigo-600 dark:border-indigo-500 rounded-lg text-sm font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer"
                >
                  Commencer
                </button>
              )}
            </div>
          </motion.div>
        ))}
        
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
            Aucun cours ne correspond à vos critères.
          </div>
        )}
      </div>
    </motion.div>
  );
}
