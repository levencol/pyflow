import { useState, useEffect } from 'react';
import { User, Mail, AlignLeft, Save, LogOut, Bell, Moon, Sun, MonitorSmartphone, ShieldCheck, Camera } from 'lucide-react';
import { UserProgress } from '../types';

interface ProfilViewProps {
  studentName: string | null;
  progress: UserProgress;
  theme: string;
  setTheme: (theme: string) => void;
  onLogout: () => void;
  onNameChange: (name: string) => void;
}

export default function ProfilView({ studentName, progress, theme, setTheme, onLogout, onNameChange }: ProfilViewProps) {
  const [name, setName] = useState(studentName || '');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarData, setAvatarData] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load local profile data if exists
  useEffect(() => {
    const savedProfile = localStorage.getItem('pyflow_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.avatarData) setAvatarData(parsed.avatarData);
        if (parsed.notifications !== undefined) setNotifications(parsed.notifications);
      } catch (e) {
        console.error("Error parsing profile", e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('pyflow_profile', JSON.stringify({ name, email, bio, notifications, avatarData }));
      onNameChange(name);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const getInitials = (name: string) => {
    if (!name) return 'Py';
    return name.substring(0, 2).toUpperCase();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* 1. En-tête (Hero) du profil */}
      <div className="apple-glass rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative group">
          <label htmlFor="avatar-upload" className="block cursor-pointer">
            <div className="h-28 w-28 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 p-1 shadow-xl relative overflow-hidden transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full border-2 border-white/20 bg-slate-900/50 flex items-center justify-center backdrop-blur-md overflow-hidden relative">
                {avatarData ? (
                  <img src={avatarData} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-white font-display tracking-tighter">{getInitials(studentName || '')}</span>
                )}
                
                {/* Hover overlay for editing */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white mb-1" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider">Modifier</span>
                </div>
              </div>
            </div>
          </label>
          <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleImageUpload} />
          
          <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full h-6 w-6 border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center z-10" title="Connecté"></div>
        </div>

        <div className="flex-1 text-center sm:text-left z-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display mb-1">{studentName || 'Étudiant'}</h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wide uppercase mb-3 flex items-center justify-center sm:justify-start gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Apprenti PyFlow
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/40 shadow-xs flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">STREAK</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{progress.streak} j</span>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/40 shadow-xs flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">PROJETS</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{progress.completedProjects.length}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="mt-4 sm:mt-0 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold rounded-xl flex items-center gap-2 transition-colors border border-rose-200 dark:border-rose-800 cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. Formulaire d'édition */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="apple-glass rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
              Informations Personnelles
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-500" /> Nom complet
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-500" /> Adresse Email
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <AlignLeft className="h-4 w-4 text-indigo-500" /> Bio / Objectifs
                </label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Quels sont vos objectifs avec Python ?"
                  rows={4}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  saveSuccess 
                    ? 'bg-emerald-500 text-white' 
                    : 'apple-btn-primary shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95'
                }`}
              >
                {isSaving ? (
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : saveSuccess ? (
                  <>Sauvegardé !</>
                ) : (
                  <><Save className="h-5 w-5" /> Enregistrer</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 3. Paramètres */}
        <div className="lg:col-span-4">
          <div className="apple-glass rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6 h-full flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide border-b border-slate-200 dark:border-white/10 pb-4 mb-2">
              Paramètres
            </h2>
            
            <div className="space-y-6 flex-1">
              


              {/* Notifications */}
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">Préférences</p>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                        <Bell className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Rappels quotidiens</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Pour garder votre streak</div>
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={notifications} 
                        onChange={() => setNotifications(!notifications)} 
                      />
                      <div className={`block w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                        <MonitorSmartphone className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Mode focus strict</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Désactiver animations</div>
                      </div>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="block w-12 h-6 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-0"></div>
                    </div>
                  </label>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
