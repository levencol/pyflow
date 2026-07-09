import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Terminal, 
  BookOpen, 
  Trophy, 
  ShieldCheck, 
  Zap, 
  Users, 
  Award, 
  BrainCircuit, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Code
} from 'lucide-react';

interface LandingViewProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function LandingView({ onLoginClick, onRegisterClick }: LandingViewProps) {
  // Variants for parent animations (staggered)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  // Variants for children fade-up
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[200px] left-1/3 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Navbar */}
      <header className="h-20 border-b border-slate-200/50 dark:border-slate-800/50 apple-glass dark:apple-glass-dark px-8 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <span className="text-white font-black text-xl tracking-tight font-display">Py</span>
          </div>
          <span className="font-display font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-850 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400">
            PyFlow
          </span>
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
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-500/20 hover:scale-[1.02] cursor-pointer"
          >
            S'inscrire gratuitement
          </button>
        </div>
      </header>

      <main className="flex-1">
        
        {/* 1. Hero Section */}
        <section className="relative pt-24 pb-20 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4"
            >
              <Zap className="h-4 w-4 fill-current" /> L'apprentissage Python Réinventé
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black font-display tracking-tight leading-[1.1] text-slate-900 dark:text-white"
            >
              Maîtrisez Python.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Pas à pas, jour après jour.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              Une expérience d'apprentissage interactive de 28 jours avec un simulateur de code en temps réel, un coach IA dédié et une progression gamifiée.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <button 
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 hover:scale-[1.03] cursor-pointer"
              >
                Commencer l'aventure <ChevronRight className="h-5 w-5" />
              </button>
              <button 
                onClick={onLoginClick}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-900 dark:text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center cursor-pointer"
              >
                J'ai déjà un compte
              </button>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60"
            >
              {[
                { value: '28 jours', label: 'de formation structurée' },
                { value: '100% interactif', label: 'aucun logiciel à installer' },
                { value: 'Coach IA', label: 'disponible 24h/24' },
                { value: 'Certificat', label: 'de fin de parcours' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 2. Section : Comment ça marche ? */}
        <section className="py-24 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-100/50 dark:bg-slate-900/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white">Comment fonctionne l'apprentissage ?</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Suivez notre méthode interactive simple et structurée pour acquérir des compétences solides.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Process line for large screens */}
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-slate-200 dark:bg-slate-800 -z-10"></div>

              {[
                {
                  step: '01',
                  title: 'Théorie & Démo',
                  desc: 'Chaque jour, lisez une leçon concise de 5 à 10 minutes avec des explications claires et interactives.'
                },
                {
                  step: '02',
                  title: 'Pratique immédiate',
                  desc: 'Écrivez du vrai code Python dans l\'éditeur interactif et observez directement le résultat.'
                },
                {
                  step: '03',
                  title: 'Validation IA',
                  desc: 'Notre Coach IA analyse votre code, vous donne des explications précises et vous corrige avec bienveillance.'
                },
                {
                  step: '04',
                  title: 'Certifications',
                  desc: 'Complétez les projets, gagnez des points XP et obtenez votre certificat officiel PyFlow.'
                }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-display font-black text-indigo-600 dark:text-indigo-400 shadow-md">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-2">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section className="py-24 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white">Tout ce dont vous avez besoin</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Une suite d'outils haut de gamme pour vous faire progresser sans aucune friction matérielle.</p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { 
                  icon: Terminal, 
                  title: 'Terminal & Interpréteur', 
                  desc: 'Un émulateur Python complet intégré. Écrivez, modifiez et exécutez votre code instantanément sans rien configurer.',
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-500/10'
                },
                { 
                  icon: BrainCircuit, 
                  title: 'Coach IA Dédié', 
                  desc: 'Un tuteur disponible en permanence. Posez-lui vos questions sur le cours ou faites évaluer votre code en un clic.',
                  color: 'text-indigo-500',
                  bg: 'bg-indigo-500/10'
                },
                { 
                  icon: Trophy, 
                  title: 'Système Gamifié', 
                  desc: 'Maintenez votre série quotidienne de code, gagnez des points d\'expérience et débloquez des badges exclusifs.',
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10'
                },
                {
                  icon: Award,
                  title: 'Certificats Vérifiables',
                  desc: 'Obtenez des certificats numériques sécurisés par signature cryptographique pour attester de vos compétences Python.',
                  color: 'text-purple-500',
                  bg: 'bg-purple-500/10'
                },
                {
                  icon: Code,
                  title: 'Projets Réels',
                  desc: 'Créez de vrais scripts à la fin de chaque chapitre : générateurs de mots de passe, calculateurs de budget et jeux.',
                  color: 'text-pink-500',
                  bg: 'bg-pink-500/10'
                },
                {
                  icon: Users,
                  title: 'Classement Général',
                  desc: 'Participez à la ligue amicale des étudiants. Accumulez les points de défis et hissez-vous au sommet.',
                  color: 'text-sky-500',
                  bg: 'bg-sky-500/10'
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  variants={itemVariants}
                  className="apple-glass dark:apple-glass-dark rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-display">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. Section : Témoignages (Testimonials) */}
        <section className="py-24 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white">Ce que disent nos étudiants</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Rejoignez une communauté d'apprenants satisfaits qui ont sauté le pas avec nous.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Lucas Dupont',
                  role: 'Reconversion Professionnelle',
                  img: 'https://ui-avatars.com/api/?name=Lucas+Dupont&background=6366f1&color=fff&bold=true',
                  text: 'J\'avais peur de ne pas accrocher au code. La méthode progressive de PyFlow en 28 jours est géniale : l\'éditeur intégré m\'a évité de perdre mon temps dans l\'installation.',
                  stars: 5
                },
                {
                  name: 'Sarah Benali',
                  role: 'Étudiante en Marketing',
                  img: 'https://ui-avatars.com/api/?name=Sarah+Benali&background=d946ef&color=fff&bold=true',
                  text: 'Le Coach IA est un vrai plus ! Dès que j\'avais une erreur de syntaxe sur une boucle, il m\'expliquait précisément mon erreur en français plutôt que de me donner bêtement le code.',
                  stars: 5
                },
                {
                  name: 'Marc Lefevre',
                  role: 'Data Analyst Junior',
                  img: 'https://ui-avatars.com/api/?name=Marc+Lefevre&background=10b981&color=fff&bold=true',
                  text: 'Les certificats générés cryptographiquement m\'ont permis de prouver mes compétences sur mon profil LinkedIn. Les recruteurs apprécient cette clarté.',
                  stars: 5
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="apple-glass dark:apple-glass-dark rounded-3xl p-8 space-y-6 flex flex-col justify-between border border-slate-200/50 dark:border-slate-800/50">
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-350 text-sm italic leading-relaxed">
                      "{testimonial.text}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <img src={testimonial.img} alt={testimonial.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto apple-glass dark:apple-glass-dark rounded-[3rem] p-12 text-center border border-slate-200 dark:border-slate-800/80 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-6">
              <Sparkles className="h-8 w-8" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white mb-6">Prêt à coder en Python ?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">Rejoignez l'aventure PyFlow gratuitement dès aujourd'hui et maîtrisez les bases de la programmation moderne.</p>
            
            <button 
              onClick={onRegisterClick}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 inline-flex items-center justify-center gap-2 hover:scale-[1.03] cursor-pointer"
            >
              Créer mon compte gratuit <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-900/60 bg-slate-50 dark:bg-slate-950/40">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <span className="text-white font-black text-sm">Py</span>
              </div>
              <span className="font-display font-black text-lg">PyFlow</span>
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-xs">
              La plateforme moderne et interactive pour maîtriser Python sans friction.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Plateforme</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-500 text-xs">
              <li><a href="#accueil" onClick={onRegisterClick} className="hover:underline">Parcours 28 Jours</a></li>
              <li><a href="#accueil" onClick={onRegisterClick} className="hover:underline">Simulateur de Code</a></li>
              <li><a href="#accueil" onClick={onRegisterClick} className="hover:underline">Coach IA</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Ressources</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-500 text-xs">
              <li><a href="#" className="hover:underline">Documentation Python</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Légal</h4>
            <ul className="space-y-2 text-slate-500 dark:text-slate-500 text-xs">
              <li><a href="#" className="hover:underline">Mentions Légales</a></li>
              <li><a href="#" className="hover:underline">Conditions d'Utilisation</a></li>
              <li><a href="#" className="hover:underline">Confidentialité</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 dark:text-slate-500 text-xs border-t border-slate-200/50 dark:border-slate-800/50 pt-8">
          <p>&copy; {new Date().getFullYear()} PyFlow Academy. Développé avec passion pour l'éducation.</p>
        </div>
      </footer>
    </div>
  );
}
