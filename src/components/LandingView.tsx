import { ChevronRight, Terminal, BookOpen, Trophy, ShieldCheck, Zap } from 'lucide-react';

interface LandingViewProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function LandingView({ onLoginClick, onRegisterClick }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-x-hidden">
      
      {/* Navbar */}
      <header className="h-20 apple-glass dark:apple-glass-dark px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/30">
            <span className="text-white font-black text-xl tracking-tight font-display">Py</span>
          </div>
          <span className="font-display font-black text-xl tracking-tight">PyFlow</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onLoginClick}
            className="hidden sm:block px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Se connecter
          </button>
          <button 
            onClick={onRegisterClick}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            S'inscrire gratuitement
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-32 px-6 overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4">
              <Zap className="h-4 w-4" /> La plateforme nouvelle génération
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Apprenez Python.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Simplement. Efficacement.</span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Une expérience interactive avec terminal intégré, des exercices pratiques quotidiens et un système de progression ludique pour maîtriser le code.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button 
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                Commencer maintenant <ChevronRight className="h-5 w-5" />
              </button>
              <button 
                onClick={onLoginClick}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center cursor-pointer"
              >
                J'ai déjà un compte
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black font-display text-slate-900 dark:text-white mb-4">Tout ce dont vous avez besoin</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Une suite d'outils pensée pour vous faire passer de débutant à expert Python sans friction.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Terminal, 
                  title: 'Terminal Intégré', 
                  desc: 'Écrivez et exécutez du code Python directement dans votre navigateur. Pas d\'installation requise.',
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-500/10'
                },
                { 
                  icon: BookOpen, 
                  title: 'Parcours Guidé', 
                  desc: 'Des leçons interactives étape par étape avec une difficulté progressive pour ne jamais être perdu.',
                  color: 'text-indigo-500',
                  bg: 'bg-indigo-500/10'
                },
                { 
                  icon: Trophy, 
                  title: 'Gamification', 
                  desc: 'Gagnez des badges, maintenez votre régularité (streak) et obtenez des certificats valorisants.',
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10'
                }
              ].map((feature, idx) => (
                <div key={idx} className="apple-glass dark:apple-glass-dark rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-display">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security / Trust */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto apple-glass dark:apple-glass-dark rounded-[3rem] p-12 text-center border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <ShieldCheck className="h-16 w-16 text-indigo-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white mb-6">Prêt à coder ?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">Rejoignez l'aventure PyFlow et commencez à construire de vrais projets Python en quelques minutes.</p>
            <button 
              onClick={onRegisterClick}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              Créer mon compte gratuitement <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 dark:text-slate-500 text-sm border-t border-slate-200 dark:border-slate-900">
        <p>&copy; {new Date().getFullYear()} PyFlow Academy. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
