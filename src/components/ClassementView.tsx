import { useState, useMemo } from 'react';
import { Search, ChevronDown, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserProgress } from '../types';

interface ClassementViewProps {
  studentName: string | null;
  progress: UserProgress;
}

const MOCK_USERS = [
  { id: 'u1', name: 'Marcellin LEBLANC', email: 'leblancmarcellin@gmail.com', courses: 3, chapters: 8, lastXp: '9 juil. 2026', xp: 232905, color: 'bg-emerald-500' },
  { id: 'u2', name: 'Brilland LEBLOND', email: 'leblondbrilland@gmail.com', courses: 37, chapters: 135, lastXp: '9 juil. 2026', xp: 216132, color: 'bg-purple-500' },
  { id: 'u3', name: 'Archimède LEBLEU', email: 'lebleuarchimede@gmail.com', courses: 3, chapters: 12, lastXp: '9 juil. 2026', xp: 179545, color: 'bg-teal-600' },
  { id: 'u4', name: 'Halik LEGENDRE', email: 'legendrehalik@gmail.com', courses: 28, chapters: 105, lastXp: '8 juil. 2026', xp: 136565, color: 'bg-orange-600' },
  { id: 'u5', name: 'Mustakeem LEGENDRE', email: 'legendremustakeem@gmail.com', courses: 36, chapters: 143, lastXp: '9 juil. 2026', xp: 93873, color: 'bg-indigo-500' },
  { id: 'u6', name: 'Sophie LENOIR', email: 'lerouxsophie@gmail.com', courses: 15, chapters: 42, lastXp: '7 juil. 2026', xp: 45000, color: 'bg-pink-500' },
];

const FILTERS = ["30 JOURS", "90 JOURS", "ANNÉE ÉCOULÉE", "TOUT"];

export default function ClassementView({ studentName, progress }: ClassementViewProps) {
  const [activeFilter, setActiveFilter] = useState("30 JOURS");
  const [searchQuery, setSearchQuery] = useState("");

  const leaderboard = useMemo(() => {
    // Calculate current user XP
    const daysCompleted = progress.completedDays?.length || 0;
    const quizzesCompleted = Object.keys(progress.completedQuizzes || {}).length;
    const challengesCompleted = Object.keys(progress.completedChallenges || {}).length;
    const computedXp = (daysCompleted * 100) + (quizzesCompleted * 10) + (challengesCompleted * 50);

    // Add current user to the list
    const currentUser = {
      id: 'current_user',
      name: studentName || 'Vous',
      email: 'mon.email@pyflow.com',
      courses: progress.completedProjects?.length + 2 || 2, // arbitrary mock stat
      chapters: daysCompleted,
      lastXp: "Aujourd'hui",
      xp: computedXp,
      color: 'bg-blue-600',
      isCurrentUser: true
    };

    const allUsers = [...MOCK_USERS, currentUser].sort((a, b) => (b.xp || 0) - (a.xp || 0));
    
    return allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [studentName, progress, searchQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-6xl mx-auto space-y-6 pb-12"
    >
      <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white font-display">
        <h1>Classement</h1>
        <ChevronDown className="h-5 w-5 text-slate-400 mt-1 cursor-pointer" />
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-6 text-xs font-bold tracking-wider">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`pb-4 border-b-2 transition-colors cursor-pointer ${
                activeFilter === f 
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher des membres."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                <th className="py-4 px-6 w-16">Rang</th>
                <th className="py-4 px-6">Nom</th>
                <th className="py-4 px-6 flex items-center gap-1">Cours Terminés <span className="text-[8px]">↕</span></th>
                <th className="py-4 px-6">Chapitres Terminés <span className="text-[8px] ml-1">↕</span></th>
                <th className="py-4 px-6">Derniers XP <span className="text-[8px] ml-1">▶</span></th>
                <th className="py-4 px-6 text-indigo-600 dark:text-indigo-400">XP Gagnés <span className="text-[8px] ml-1">↓</span></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {leaderboard.map((user, index) => {
                const rank = index + 1;
                
                let rankDisplay;
                if (rank === 1) rankDisplay = <div className="h-3 w-3 rounded-full bg-yellow-400 mx-auto" title="1er" />;
                else if (rank === 2) rankDisplay = <div className="h-3 w-3 rounded-full bg-slate-300 mx-auto" title="2ème" />;
                else if (rank === 3) rankDisplay = <div className="h-3 w-3 rounded-full bg-amber-700 mx-auto" title="3ème" />;
                else rankDisplay = <span className="text-slate-400 font-bold flex justify-center">{rank}</span>;

                const initial = user.name.charAt(0).toUpperCase();

                return (
                  <tr 
                    key={user.id} 
                    className={`border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${user.isCurrentUser ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                  >
                    <td className="py-4 px-6 text-center align-middle">
                      {rankDisplay}
                    </td>
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {initial}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          {user.name} 
                          {user.isCurrentUser && <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-[9px] rounded-sm uppercase tracking-widest">Vous</span>}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                      {user.courses}
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                      {user.chapters}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 text-xs">
                      {user.lastXp}
                    </td>
                    <td className="py-4 px-6 text-slate-800 dark:text-slate-200 font-mono font-medium">
                      {user.xp != null ? user.xp.toLocaleString() : '0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {leaderboard.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              Aucun membre trouvé pour cette recherche.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
