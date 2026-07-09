import { Users, BookOpen, Trophy, Flame, Activity, TrendingUp, Clock, MousePointerClick } from 'lucide-react';
import { Student } from '../../services/api';

interface AdminDashboardProps {
  students: Student[];
}

export default function AdminDashboard({ students }: AdminDashboardProps) {
  // Calculer quelques statistiques intéressantes basées sur les étudiants
  const totalStudents = students.length;
  const totalDaysUnlocked = students.reduce((acc, s) => acc + s.pyflow_unlocked_days.length, 0);
  const avgDaysUnlocked = totalStudents > 0 ? (totalDaysUnlocked / totalStudents).toFixed(1) : '0';
  
  // Statistiques Mock pour donner vie au Dashboard
  const activeToday = Math.min(totalStudents, Math.floor(totalStudents * 0.4) + 1);
  const completionRate = '68%';
  const avgSessionTime = '42 min';

  const stats = [
    { label: 'Étudiants Inscrits', value: totalStudents, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Actifs Aujourd\'hui', value: activeToday, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Jours débloqués (Moy)', value: avgDaysUnlocked, icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Taux de Complétion', value: completionRate, icon: Trophy, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Vue d'ensemble</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Statistiques et activité en temps réel de la plateforme.</p>
        </div>
        <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Système Opérationnel
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="apple-glass dark:apple-glass-dark p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +12% cette semaine
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement / Activity Graph (Mock) */}
        <div className="lg:col-span-2 apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Activité Hebdomadaire</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sessions d'apprentissage (Simulation)</p>
            </div>
            <select className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border-none outline-none">
              <option>Cette semaine</option>
              <option>Ce mois-ci</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 px-2 mt-auto h-48">
            {/* Bar chart mock */}
            {[40, 65, 45, 80, 55, 90, 75].map((val, i) => (
              <div key={i} className="w-full relative flex flex-col items-center justify-end h-full group">
                <div 
                  className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 dark:bg-indigo-500/30 dark:hover:bg-indigo-500/50 rounded-t-lg transition-all duration-300"
                  style={{ height: `${val}%` }}
                ></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-opacity">
                  {val * 2} sessions
                </div>
                <span className="text-[10px] text-slate-400 font-medium mt-2">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Other metrics */}
        <div className="space-y-6">
          <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Mesures d'engagement</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <Clock className="h-4 w-4 text-slate-400" /> Temps moyen
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{avgSessionTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <Flame className="h-4 w-4 text-orange-500" /> Streak moyen
                </div>
                <span className="font-bold text-slate-900 dark:text-white">4.2 jours</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <MousePointerClick className="h-4 w-4 text-indigo-500" /> Taux de rebond
                </div>
                <span className="font-bold text-slate-900 dark:text-white">12%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20">
            <h3 className="text-sm font-bold mb-1">Rapport Mensuel Prêt</h3>
            <p className="text-xs text-indigo-100 mb-4 leading-relaxed">Les statistiques détaillées du mois dernier ont été compilées avec succès.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors">
              Télécharger le PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
