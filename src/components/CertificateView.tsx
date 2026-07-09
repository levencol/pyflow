import { motion, useAnimation } from 'framer-motion';
import { Download, Share2, Linkedin, ArrowLeft, Clock, Database, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface CertificateViewProps {
  course: {
    title: string;
    tech: string;
    time: string;
    author: { name: string; role: string; img: string };
  };
  onClose: () => void;
}

export default function CertificateView({ course, onClose }: CertificateViewProps) {
  // Déterminer le logo tech à afficher
  let TechLogo = null;
  if (course.tech === 'Python') {
    TechLogo = <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" className="w-12 h-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />;
  } else if (course.tech === 'SQL') {
    TechLogo = <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" alt="SQL" className="w-12 h-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />;
  } else {
    TechLogo = <span className="text-3xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{course.tech[0]}</span>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-[calc(100vh-6rem)] bg-black overflow-hidden rounded-3xl flex flex-col p-6 sm:p-10 font-sans"
    >
      {/* Premium Background: Mesh Gradient + Glowing Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0a0a0a] to-black z-0 pointer-events-none"></div>
      
      {/* Animated Glowing Orbs */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] z-0"
      ></motion.div>
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[10%] right-[15%] w-[30rem] h-[30rem] bg-amber-600/20 rounded-full blur-[150px] z-0"
      ></motion.div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>

      {/* Header with Back button */}
      <div className="w-full relative z-50 mb-4 sm:mb-8 shrink-0">
        <button onClick={onClose} className="text-white/60 hover:text-white flex items-center gap-2 transition-all cursor-pointer font-medium group hover:-translate-x-1 w-fit">
          <ArrowLeft className="h-5 w-5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all" /> 
          <span className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">Retour aux cours</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
        
        {/* Left Side: Context & Actions */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="flex-1 space-y-8 max-w-xl"
        >
          {/* User Badge */}
          <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full p-2 pr-6 backdrop-blur-md shadow-2xl">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/50">
              <img src="https://i.pravatar.cc/150?u=marcel" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold">Certification obtenue par</p>
              <p className="text-white font-bold text-sm tracking-wide">MARCEL DINLA</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 font-black text-sm uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" /> Validation Officielle
            </h2>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight font-display drop-shadow-2xl">
              {course.title}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Félicitations ! Vous avez acquis des compétences fondamentales en {course.tech} qui boosteront votre carrière.
            </p>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-white font-medium">
              <Clock className="h-4 w-4 text-indigo-400" /> {course.time} de formation
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-white font-medium">
              <Database className="h-4 w-4 text-amber-400" /> 3900 XP Gagnés
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button className="group relative px-6 py-3.5 bg-gradient-to-r from-[#0077b5] to-[#00a0dc] text-white font-bold rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,119,181,0.4)] hover:shadow-[0_0_30px_rgba(0,119,181,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <Linkedin className="h-5 w-5 relative z-10" fill="currentColor" strokeWidth={0} />
              <span className="relative z-10">Partager sur LinkedIn</span>
            </button>
            <button className="group px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md">
              <Download className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
              Télécharger le PDF
            </button>
          </div>
        </motion.div>

        {/* Right Side: The Premium Holographic Certificate Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 0.4, duration: 1, type: "spring", stiffness: 100 }}
          className="flex-1 w-full flex justify-center perspective-[2000px]"
        >
          {/* Framer motion wrapper for 3D tilt effect on hover */}
          <motion.div 
            whileHover={{ scale: 1.02, rotateX: 5, rotateY: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full max-w-[420px] aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Glossy overlay reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full ease-in-out"></div>
            
            {/* Inner glowing borders */}
            <div className="absolute inset-[2px] border border-white/10 rounded-[2rem] z-10 pointer-events-none"></div>
            <div className="absolute inset-[12px] border border-white/5 rounded-[1.5rem] z-10 pointer-events-none"></div>

            {/* Certificate Content */}
            <div className="absolute inset-0 flex flex-col p-10 z-20">
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {TechLogo}
                </div>
                <Award className="h-10 w-10 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" strokeWidth={1.5} />
              </div>

              {/* Body */}
              <div className="mt-auto mb-8">
                <p className="text-white/60 font-mono text-xs uppercase tracking-widest mb-4">Certificat de complétion</p>
                <h3 className="text-3xl font-black text-white leading-tight font-display drop-shadow-md mb-2">
                  {course.title}
                </h3>
                <p className="text-indigo-300 font-medium">Technologie : {course.tech}</p>
              </div>

              {/* Footer ribbon */}
              <div className="w-full h-16 mt-auto bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 rounded-xl border border-white/10 backdrop-blur-md flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Validé officiellement</p>
                  <p className="text-white/50 text-[10px] font-mono">ID: {course.title.replace(/\s+/g, '').substring(0, 8).toUpperCase()}-2026</p>
                </div>
              </div>
            </div>

            {/* Background glowing orb inside the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/40 rounded-full blur-[80px] -z-10 group-hover:bg-indigo-400/50 transition-colors duration-500"></div>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}
