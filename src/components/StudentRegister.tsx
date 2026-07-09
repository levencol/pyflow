import { useState } from 'react';
import { UserPlus, Copy, CheckCircle2, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { setStoredStudentCode } from '../services/api';

interface StudentRegisterProps {
  onSuccess: (studentName: string, unlockedDays: number[], unlockedProjects: string[]) => void;
  onBack?: () => void;
  onLogin?: () => void;
}

export default function StudentRegister({ onSuccess, onBack, onLogin }: StudentRegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) { setError('Veuillez remplir tous les champs.'); return; }

    setLoading(true);
    setError('');
    
    // Simulate API delay
    setTimeout(() => {
      const studentCode = password.trim();
      // Store in local mock database for future logins
      try {
        const mockUsersStr = localStorage.getItem('pyflow_mock_users');
        const mockUsers = mockUsersStr ? JSON.parse(mockUsersStr) : {};
        if (mockUsers[studentCode]) {
           setError('Ce mot de passe / identifiant est déjà utilisé (simulation). Veuillez en choisir un autre.');
           setLoading(false);
           return;
        }
        mockUsers[studentCode] = { name: name.trim(), email: email.trim(), unlocked_days: [1], unlocked_projects: [] };
        localStorage.setItem('pyflow_mock_users', JSON.stringify(mockUsers));
      } catch (err) {
        console.error("Erreur lors de la sauvegarde locale :", err);
      }

      setStoredStudentCode(studentCode);
      onSuccess(name.trim(), [1], []);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="relative w-full max-w-md space-y-8 animate-fade-in-up z-10">

        {/* Brand */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-2xl shadow-indigo-500/30 mx-auto border-4 border-white/50 dark:border-white/10">
            <span className="text-white font-black text-3xl tracking-tight font-display">Py</span>
          </div>
        </div>

        {/* Register card */}
        <div className="apple-glass dark:apple-glass-dark border border-white/40 dark:border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-1.5 text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2 font-display">
              <UserPlus className="h-6 w-6 text-indigo-500" />
              Créer un compte
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed max-w-xs mx-auto">
              Rejoignez PyFlow pour commencer votre apprentissage du Python dès aujourd'hui.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Prénom & Nom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="John Doe"
                  className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Adresse Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="votre@email.com"
                  className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Choisissez un mot de passe"
                  className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim() || !password.trim()}
              className="w-full py-4 apple-btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading
                ? <><RefreshCw className="h-4 w-4 animate-spin" /> Inscription…</>
                : <><UserPlus className="h-4 w-4" /> S'inscrire gratuitement</>
              }
            </button>
            
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all text-sm mt-4 cursor-pointer"
              >
                Retour à l'accueil
              </button>
            )}
          </form>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Déjà un compte ?{' '}
              <button onClick={onLogin} className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer">
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
