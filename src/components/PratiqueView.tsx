import { useState } from 'react';
import { Terminal, Play, RotateCcw, Code2, Zap, FileCode2, Eraser } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { runPythonCode } from '../utils/pythonRunner';

const SNIPPETS = [
  {
    name: 'Hello World',
    code: 'print("Bienvenue dans la zone de pratique !")\nprint("Testons quelques calculs :", 5 + 7)'
  },
  {
    name: 'Boucle For',
    code: 'for i in range(1, 6):\n    print(f"Itération numéro {i}")'
  },
  {
    name: 'Fibonacci',
    code: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    else:\n        return fibonacci(n-1) + fibonacci(n-2)\n\nprint("Les 10 premiers nombres :")\nfor i in range(10):\n    print(fibonacci(i))'
  },
  {
    name: 'Classe Python',
    code: 'class Animal:\n    def __init__(self, nom):\n        self.nom = nom\n\n    def parler(self):\n        print(f"{self.nom} fait du bruit !")\n\nchat = Animal("Félix")\nchat.parler()'
  }
];

export default function PratiqueView() {
  const [code, setCode] = useState(SNIPPETS[0].code);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    try {
      const result = await runPythonCode(code);
      setOutput(result.output);
      if (result.error) {
        setError(result.error);
      }
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue lors de l'exécution");
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearOutput = () => {
    setOutput('');
    setError('');
  };

  const handleResetCode = () => {
    setCode('');
    handleClearOutput();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in relative h-[calc(100vh-8rem)] flex flex-col">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-500/30">
            <Code2 className="h-4 w-4" /> Bac à sable
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display mb-2">
            Zone de Pratique Libre
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl">
            Expérimentez avec le code Python sans aucune contrainte. L'environnement d'exécution s'exécute localement dans votre navigateur.
          </p>
        </div>
        
        {/* Snippets rapides */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Snippets :</span>
          {SNIPPETS.map((snippet, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCode(snippet.code);
                handleClearOutput();
              }}
              className="px-3 py-1.5 text-xs font-bold bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-all flex items-center gap-1 cursor-pointer"
            >
              <FileCode2 className="h-3 w-3 text-emerald-500" />
              {snippet.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Workspace (Éditeur + Console) */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* Éditeur de Code */}
        <div className="flex-1 flex flex-col apple-glass rounded-3xl border border-white/20 shadow-xl overflow-hidden min-h-[300px]">
          {/* Toolbar Éditeur */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400 font-mono ml-2">script.py</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetCode}
                className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                title="Effacer le code"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <RotateCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 fill-white" />
                )}
                Exécuter
              </button>
            </div>
          </div>
          
          {/* CodeMirror */}
          <div className="flex-1 overflow-auto bg-white/50 dark:bg-[#1e1e1e]/80">
            <CodeMirror
              value={code}
              height="100%"
              extensions={[python()]}
              onChange={(value) => setCode(value)}
              className="h-full text-base"
              theme="dark" // Using dark theme directly as it often looks better in this context, or we can leave it default
            />
          </div>
        </div>

        {/* Terminal de Sortie */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col apple-glass bg-slate-900/90 dark:bg-slate-950/90 text-white rounded-3xl border border-white/10 shadow-2xl overflow-hidden min-h-[250px] lg:min-h-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-800/50">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-sm uppercase tracking-wider">
              <Terminal className="h-4 w-4" />
              Console Sortie
            </div>
            <button
              onClick={handleClearOutput}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Effacer la console"
            >
              <Eraser className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 p-6 overflow-auto font-mono text-sm leading-relaxed">
            {!output && !error && !isRunning && (
              <div className="text-slate-500 italic flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Appuyez sur Exécuter pour voir le résultat ici.
              </div>
            )}
            
            {isRunning && (
              <div className="text-slate-400 flex items-center gap-3 animate-pulse">
                <div className="w-2 h-4 bg-emerald-500/80 rounded-sm"></div>
                Exécution en cours...
              </div>
            )}
            
            {output && (
              <pre className="text-slate-200 whitespace-pre-wrap font-mono mb-4">{output}</pre>
            )}
            
            {error && (
              <pre className="text-rose-400 whitespace-pre-wrap font-mono p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl mt-4">
                {error}
              </pre>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
