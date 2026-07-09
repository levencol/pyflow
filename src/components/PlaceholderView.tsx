import { motion } from 'framer-motion';

interface PlaceholderViewProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export default function PlaceholderView({ title, icon, description }: PlaceholderViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      <div className="apple-glass rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            {icon}
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
        </div>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      <div className="apple-glass rounded-3xl p-12 border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center animate-pulse">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-white">Page en construction</h2>
        <p className="text-slate-400 text-sm max-w-md">
          Cette section fait partie du nouveau programme de formation PyFlow et sera bientôt disponible.
        </p>
      </div>
    </div>
  );
}
