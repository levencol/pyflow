import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Folder, 
  FileCode, 
  Trash2, 
  Play, 
  Save, 
  Plus, 
  HelpCircle, 
  ChevronRight,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle,
  Code
} from 'lucide-react';
import { runPythonCode } from '../utils/pythonRunner';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

// Default files in the simulated Linux virtual filesystem
const DEFAULT_VFS: Record<string, string> = {
  "welcome.py": `# Bienvenue dans PyFlow !\n# Utilisez 'python3 welcome.py' pour m'exécuter.\n\nprint("====================================")\nprint("    Bienvenue sur le Terminal Linux   ")\nprint("====================================")\nuser = "Étudiant"\nprint(f"Bonjour {user}, prêt à coder en Python ?")\n`,

  "fizzbuzz.py": `# Défi classique FizzBuzz\nprint("--- FizzBuzz jusqu'à 15 ---")\nfor i in range(1, 16):\n    if i % 3 === 0 and i % 5 === 0:\n        print(f"{i} : FizzBuzz")\n    elif i % 3 === 0:\n        print(f"{i} : Fizz")\n    elif i % 5 === 0:\n        print(f"{i} : Buzz")\n    else:\n        print(i)\n`,

  "scrapper.py": `# Simulation de web scraping\nimport requests\nfrom bs4 import BeautifulSoup\n\nurl = "https://mocksite.org"\nprint("Connexion à l'URL...")\nrep = requests.get(url)\n\nsoup = BeautifulSoup(rep.text)\ntitre = soup.find("h1")\nparagraphe = soup.find("p")\n\nprint(f"Statut : {rep.status_code}")\nprint(f"Titre trouvé : {titre.text if titre else 'Aucun'}")\nprint(f"Description : {paragraphe.text if paragraphe else 'Aucun'}")\n`,

  "analyse.py": `# Simulation d'analyse de données\nimport numpy as np\nimport pandas as pd\n\nnotes = [15, 18, 12, 19, 14, 16, 11]\nprint(f"Notes d'élèves : {notes}")\nprint(f"Notes triées : {sorted(notes)}")\n\nmoyenne = np.mean(notes)\necart_type = np.std(notes)\nprint(f"Statistiques calculées :")\nprint(f" -> Moyenne : {moyenne:.2f}")\nprint(f" -> Écart-type : {ecart_type:.2f}")\n`
};

interface TerminalHistoryLine {
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
}

export default function TerminalView() {
  // Virtual Filesystem
  const [vfs, setVfs] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('pyflow_vfs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_VFS;
      }
    }
    return DEFAULT_VFS;
  });

  const [selectedFile, setSelectedFile] = useState<string>("welcome.py");
  const [editorCode, setEditorCode] = useState<string>("");
  const [newFileName, setNewFileName] = useState<string>("");
  const [isSaved, setIsSaved] = useState(true);

  // Custom states to handle notifications/confirmations inside the iframe
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Terminal state
  const [history, setHistory] = useState<TerminalHistoryLine[]>([
    { type: 'info', content: 'Bienvenue sur la console virtuelle PyFlow v1.1.' },
    { type: 'info', content: 'Saisissez de vraies commandes Linux. Tapez "help" pour voir la liste.' },
    { type: 'output', content: 'user@pyflow:~$ ' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Interactive modes: 'bash' | 'python'
  const [mode, setMode] = useState<'bash' | 'python'>('bash');
  // Persistent Python state variables when in interactive python REPL mode
  const [replBuffer, setReplBuffer] = useState<string[]>([]);
  const [replGlobals, setReplGlobals] = useState<Record<string, any>>({});

  // Sync editor content when selected file changes
  useEffect(() => {
    if (vfs[selectedFile] !== undefined) {
      setEditorCode(vfs[selectedFile]);
      setIsSaved(true);
    }
  }, [selectedFile, vfs]);

  // Save VFS changes in localStorage
  const updateVfs = (newVfs: Record<string, string>) => {
    setVfs(newVfs);
    localStorage.setItem('pyflow_vfs', JSON.stringify(newVfs));
  };

  const handleSaveFile = () => {
    const updated = { ...vfs, [selectedFile]: editorCode };
    updateVfs(updated);
    setIsSaved(true);
    // Append auto confirmation system line
    appendTerminalLine('info', `Fichier ${selectedFile} sauvegardé avec succès.`);
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    let name = newFileName.trim();
    if (!name) return;
    if (!name.endsWith('.py')) {
      name += '.py';
    }
    if (vfs[name] !== undefined) {
      setAlertMessage("Un fichier portant ce nom existe déjà.");
      return;
    }
    const updated = { ...vfs, [name]: "# Nouveau fichier Python\nprint('Hello world!')\n" };
    updateVfs(updated);
    setSelectedFile(name);
    setNewFileName("");
    appendTerminalLine('info', `Fichier ${name} créé.`);
  };

  const handleDeleteFile = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (Object.keys(vfs).length <= 1) {
      setAlertMessage("Impossible de supprimer le dernier fichier restant, créez-en un autre d'abord.");
      return;
    }
    setDeleteConfirmFile(name);
  };

  const confirmDeleteFile = () => {
    if (!deleteConfirmFile) return;
    const name = deleteConfirmFile;
    const updated = { ...vfs };
    delete updated[name];
    updateVfs(updated);
    if (selectedFile === name) {
      setSelectedFile(Object.keys(updated)[0]);
    }
    appendTerminalLine('error', `Fichier ${name} supprimé du bac à sable.`);
    setDeleteConfirmFile(null);
  };

  // Run the code currently in the text editor
  const handleRunEditorCode = () => {
    // Save to make sure we run the latest edits
    const updatedVfs = { ...vfs, [selectedFile]: editorCode };
    updateVfs(updatedVfs);
    setIsSaved(true);

    appendTerminalLine('input', `python3 ${selectedFile}`);
    executePythonScript(selectedFile, editorCode);
  };

  // Append a message or prompt output back to the console
  const appendTerminalLine = (type: 'input' | 'output' | 'error' | 'info', content: string) => {
    setHistory(prev => {
      // Create new lines list and remove standard prompt prefix output line if we insert input
      let cleared = [...prev];
      if (cleared.length > 0) {
        const last = cleared[cleared.length - 1];
        if (last.type === 'output' && (last.content.endsWith('$ ') || last.content.endsWith('>>> '))) {
          cleared.pop();
        }
      }
      return [
        ...cleared,
        { type, content },
        { type: 'output', content: mode === 'python' ? '>>> ' : 'user@pyflow:~$ ' }
      ];
    });
  };

  // Execute the code using PyFlow's standard sandbox runtime
  const executePythonScript = async (filename: string, pythonCode: string) => {
    try {
      const result = await runPythonCode(pythonCode);
      if (result.success) {
        if (result.stdout) {
          appendTerminalLine('output', result.stdout);
        } else {
          appendTerminalLine('info', `[Script exécuté avec succès mais n'a retourné aucune sortie stdout]`);
        }
      } else if (result.error) {
        appendTerminalLine('error', result.error);
      }
    } catch (err: any) {
      appendTerminalLine('error', `Interprétation échouée : ${err.message || err}`);
    }
  };

  // Keyboard navigation through terminal inputs
  const handleTerminalInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = inputValue;
      setInputValue('');
      if (!command.trim()) {
        // Just print prompt again
        setHistory(prev => [
          ...prev,
          { type: 'output', content: mode === 'python' ? '>>> ' : 'user@pyflow:~$ ' }
        ]);
        return;
      }

      // Add to command queue history
      setCommandHistory(prev => [...prev.filter(c => c !== command), command]);
      setHistoryIndex(-1);

      // Process command
      if (mode === 'python') {
        handlePythonReplInput(command);
      } else {
        handleBashInput(command);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(nextIndex);
          setInputValue(commandHistory[nextIndex]);
        }
      }
    }
  };

  // Interactive Python interpreter step execution
  const handlePythonReplInput = async (input: string) => {
    const trimmed = input.trim();

    // Check exit trigger
    if (trimmed === 'exit()' || trimmed === 'quit()' || trimmed === 'exit' || trimmed === 'quit') {
      setMode('bash');
      setHistory(prev => {
        let cleared = [...prev];
        if (cleared[cleared.length - 1]?.type === 'output') {
          cleared.pop();
        }
        return [
          ...cleared,
          { type: 'input', content: input },
          { type: 'info', content: 'Sortie du REPL Python. Retour à Bash.' },
          { type: 'output', content: 'user@pyflow:~$ ' }
        ];
      });
      return;
    }

    setHistory(prev => {
      let cleared = [...prev];
      if (cleared[cleared.length - 1]?.type === 'output') {
        cleared.pop();
      }
      return [...cleared, { type: 'input', content: `>>> ${input}` }];
    });

    // Run simple code single-line REPL block step-by-step
    try {
      // Assemble single line commands or store in accumulator if block detection is desired
      // For instant feedback react-runner logic:
      const replResult = await runPythonCode(input, true);
      if (replResult.success) {
        if (replResult.stdout) {
          setHistory(prev => [...prev, { type: 'output', content: replResult.stdout }]);
        }
        // Save declared outcome variables back to local dynamic globals sandbox pool
        setReplGlobals(prev => ({ ...prev, ...replResult.variables }));
      } else {
        setHistory(prev => [...prev, { type: 'error', content: replResult.error || 'SyntaxError' }]);
      }
    } catch (e: any) {
      setHistory(prev => [...prev, { type: 'error', content: `SyntaxError: ${e.message || e}` }]);
    }

    // Prompt again
    setHistory(prev => [...prev, { type: 'output', content: '>>> ' }]);
  };

  // standard Linux Bash commands processor
  const handleBashInput = (input: string) => {
    const orig = input;
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    setHistory(prev => {
      let cleared = [...prev];
      if (cleared[cleared.length - 1]?.type === 'output') {
        cleared.pop();
      }
      return [...cleared, { type: 'input', content: `user@pyflow:~$ ${orig}` }];
    });

    switch (cmd) {
      case 'help':
      case 'aide':
        setHistory(prev => [
          ...prev,
          { type: 'info', content: 'Commandes Linux disponibles :' },
          { type: 'info', content: '  ls                 - Liste les fichiers Python disponibles.' },
          { type: 'info', content: '  cat <fichier>       - Affiche le code d’un script.' },
          { type: 'info', content: '  touch <fichier>     - Crée un nouveau fichier script.' },
          { type: 'info', content: '  python3 <fichier>   - Exécute un script Python.' },
          { type: 'info', content: '  python3            - Lance l’interpréteur interactif REPL.' },
          { type: 'info', content: '  rm <fichier>        - Supprime un script.' },
          { type: 'info', content: '  echo <texte>        - Affiche un message à l’écran.' },
          { type: 'info', content: '  pwd                - Affiche le dossier courant de travail.' },
          { type: 'info', content: '  clear              - Efface l’écran du terminal.' },
          { type: 'output', content: 'user@pyflow:~$ ' }
        ]);
        break;

      case 'pwd':
        setHistory(prev => [
          ...prev,
          { type: 'output', content: '/home/pyflow/bac-a-sable' },
          { type: 'output', content: 'user@pyflow:~$ ' }
        ]);
        break;

      case 'clear':
      case 'clean':
        setHistory([
          { type: 'output', content: 'user@pyflow:~$ ' }
        ]);
        break;

      case 'echo':
        setHistory(prev => [
          ...prev,
          { type: 'output', content: args.join(' ') },
          { type: 'output', content: 'user@pyflow:~$ ' }
        ]);
        break;

      case 'ls':
        const fileNames = Object.keys(vfs).join('    ');
        setHistory(prev => [
          ...prev,
          { type: 'info', content: `Permissions  Taille  Modifié          Nom` },
          ...Object.keys(vfs).map(name => ({
            type: 'info' as const,
            content: `-rw-r--r--   1 pyflow  1.2KB   Juin 14 07:46   ${name}`
          })),
          { type: 'output', content: 'user@pyflow:~$ ' }
        ]);
        break;

      case 'cat':
        if (args.length === 0) {
          setHistory(prev => [
            ...prev,
            { type: 'error', content: 'cat: Argument manquant. Usage: cat <votre_script.py>' },
            { type: 'output', content: 'user@pyflow:~$ ' }
          ]);
        } else {
          const target = args[0];
          const script = vfs[target];
          if (script !== undefined) {
            setHistory(prev => [
              ...prev,
              { type: 'output', content: script },
              { type: 'output', content: 'user@pyflow:~$ ' }
            ]);
          } else {
            setHistory(prev => [
              ...prev,
              { type: 'error', content: `cat: ${target}: Aucun fichier de ce type` },
              { type: 'output', content: 'user@pyflow:~$ ' }
            ]);
          }
        }
        break;

      case 'touch':
        if (args.length === 0) {
          setHistory(prev => [
            ...prev,
            { type: 'error', content: 'touch: Argument manquant. Usage: touch <nom_script.py>' },
            { type: 'output', content: 'user@pyflow:~$ ' }
          ]);
        } else {
          let target = args[0];
          if (!target.endsWith('.py')) {
            target += '.py';
          }
          if (vfs[target] !== undefined) {
            setHistory(prev => [
              ...prev,
              { type: 'info', content: `touch: ${target} existe déjà (temps de modification actualisé).` },
              { type: 'output', content: 'user@pyflow:~$ ' }
            ]);
          } else {
            const updated = { ...vfs, [target]: `# Script ${target}\nprint("Exécution de ${target}")\n` };
            updateVfs(updated);
            setHistory(prev => [
              ...prev,
              { type: 'info', content: `Fichier ${target} créé avec succès.` },
              { type: 'output', content: 'user@pyflow:~$ ' }
            ]);
          }
        }
        break;

      case 'rm':
        if (args.length === 0) {
          setHistory(prev => [
            ...prev,
            { type: 'error', content: 'rm: Argument manquant. Usage: rm <script.py>' },
            { type: 'output', content: 'user@pyflow:~$ ' }
          ]);
        } else {
          const target = args[0];
          if (vfs[target] !== undefined) {
            if (Object.keys(vfs).length <= 1) {
              setHistory(prev => [
                ...prev,
                { type: 'error', content: "rm: Abandon. Impossible de supprimer l'unique fichier restant." },
                { type: 'output', content: 'user@pyflow:~$ ' }
              ]);
            } else {
              const updated = { ...vfs };
              delete updated[target];
              updateVfs(updated);
              if (selectedFile === target) {
                setSelectedFile(Object.keys(updated)[0]);
              }
              setHistory(prev => [
                ...prev,
                { type: 'info', content: `rm: ${target} supprimé.` },
                { type: 'output', content: 'user@pyflow:~$ ' }
              ]);
            }
          } else {
            setHistory(prev => [
              ...prev,
              { type: 'error', content: `rm: ${target}: Fichier introuvable.` },
              { type: 'output', content: 'user@pyflow:~$ ' }
            ]);
          }
        }
        break;

      case 'python':
      case 'python3':
        if (args.length === 0) {
          // Enter interactive Python REPL mode
          setMode('python');
          setHistory(prev => [
            ...prev,
            { type: 'info', content: 'Lancement du REPL Python Interactif (Fictif v3.11)...' },
            { type: 'info', content: 'Tapez "exit()" ou "quit()" pour revenir au shell.' },
            { type: 'output', content: '>>> ' }
          ]);
        } else {
          const target = args[0];
          const script = vfs[target];
          if (script !== undefined) {
            // Run script
            executePythonScript(target, script);
          } else {
            setHistory(prev => [
              ...prev,
              { type: 'error', content: `python3: impossible d’ouvrir le fichier '${target}': Aucun fichier de ce type` },
              { type: 'output', content: 'user@pyflow:~$ ' }
            ]);
          }
        }
        break;

      default:
        setHistory(prev => [
          ...prev,
          { type: 'error', content: `bash: commande introuvable: ${cmd}. Tapez "help" pour voir les commandes disponibles.` },
          { type: 'output', content: 'user@pyflow:~$ ' }
        ]);
    }
  };

  // Auto scroll to bottom of terminal output
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);



  return (
    <div className="space-y-6" id="linux-terminal-sandbox-view">
      {/* Intro descriptive Banner */}
      <div className="bg-linear-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-slate-800">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="h-10 w-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <Terminal className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight font-display">Console Linux Virtuelle &amp; REPL Python</h1>
            <p className="text-xs text-indigo-200/80 font-sans mt-0.5">
              Gérez vos fichiers, éditez vos scripts avec la touche Tab, l’auto-indentation, l’historique d’annulation, puis lancez l’exécution avec de vraies commandes Unix.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COMPONENT: VIRTUAL FILESYSTEM SIDEBAR AND ADVANCED CODE EDITOR (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header bar of structural panel */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Folder className="h-4.5 w-4.5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase font-sans">
                  Fichiers Utilisateur (.py)
                </span>
              </div>

              {/* Add file inline form */}
              <form onSubmit={handleCreateFile} className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="nouveau_script.py"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg outline-hidden focus:border-indigo-500 font-mono w-40 h-8"
                />
                <button
                  type="submit"
                  className="p-1.5 apple-btn-primary rounded-lg transition-colors cursor-pointer flex items-center justify-center h-8 w-8"
                  title="Créer le fichier"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Simulated file row cards */}
            <div className="p-3.5 bg-slate-50/50 border-b border-slate-200/60 flex flex-wrap gap-2">
              {Object.keys(vfs).map(filename => (
                <div
                  key={filename}
                  className={`flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-xl text-xs font-mono font-semibold transition-all border ${
                    selectedFile === filename
                      ? 'apple-btn-primary border-transparent shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setSelectedFile(filename)}
                    className="flex items-center gap-2 cursor-pointer outline-hidden border-none bg-transparent text-inherit text-xs font-semibold font-mono h-7"
                  >
                    <FileCode className={`h-3.5 w-3.5 ${selectedFile === filename ? 'text-white' : 'text-slate-500'}`} />
                    <span>{filename}</span>
                  </button>
                  <button
                    onClick={(e) => handleDeleteFile(filename, e)}
                    className={`p-1 rounded-lg transition-all cursor-pointer flex items-center justify-center h-6 w-6 ${
                      selectedFile === filename ? 'hover:bg-indigo-700/85 text-indigo-200 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-rose-600'
                    }`}
                    title={`Supprimer ${filename}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Code Workspace Editor */}
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/50">
                    {selectedFile}
                  </span>
                  {!isSaved && (
                    <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 animate-pulse">
                      <span className="h-1 w-1 bg-amber-500 rounded-full"></span> Non sauvegardé
                    </span>
                  )}
                  {isSaved && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-emerald-500" /> Enregistré
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSaveFile}
                    className="px-3 py-1.5 apple-btn dark:apple-btn-dark rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Sauvegarder les modifications"
                  >
                    <Save className="h-3.5 w-3.5 text-slate-500" />
                    <span>Sauver (Ctrl+S)</span>
                  </button>
                  <button
                    onClick={handleRunEditorCode}
                    className="px-3.5 py-1.5 apple-btn-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Exécuter et lier au terminal"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Lancer le Script</span>
                  </button>
                </div>
              </div>

              {/* Textarea code editor replaced with robust CodeMirror */}
              <div 
                className="border border-slate-200 rounded-xl overflow-hidden shadow-inner"
                onKeyDown={(e) => {
                  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                  if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 's') {
                    e.preventDefault();
                    handleSaveFile();
                  }
                }}
              >
                <CodeMirror
                  value={editorCode}
                  height="380px"
                  extensions={[python()]}
                  onChange={(val) => {
                    setEditorCode(val);
                    setIsSaved(false);
                  }}
                  theme="dark"
                  className="text-xs font-mono"
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    highlightActiveLine: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                  }}
                />
              </div>

              {/* Editor Keyboard shortcuts details footer */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-semibold text-slate-500 font-mono">
                <div className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-center" title="Indente d'un bloc de 4 espaces">
                  <kbd className="bg-white border rounded px-1 shadow-2xs text-[9px] text-slate-650">Tab</kbd> Indenter
                </div>
                <div className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-center" title="Désindente d'un bloc de 4 espaces">
                  <kbd className="bg-white border rounded px-1 shadow-2xs text-[9px] text-slate-650">Shift+Tab</kbd> Désindenter
                </div>
                <div className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-center" title="Garde le même alignement ou l'approfondit si deux-points (:)">
                  <kbd className="bg-white border rounded px-1 shadow-2xs text-[9px] text-slate-650">Entrée</kbd> Auto-indentation
                </div>
                <div className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-center" title="Historique d'annulation intelligente">
                  <kbd className="bg-white border rounded px-1 shadow-2xs text-[9px] text-slate-650">Ctrl+Z / Y</kbd> Undo / Redo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: INTERACTIVE LINUX BASH TERMINAL PORTAL (5 cols) */}
        <div className="xl:col-span-12 xl:col-span-5 flex flex-col gap-6" id="linux-terminal-section">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col h-[520px]">
            {/* Terminal Top Window Frame bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-850 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                {/* Simulated colorful window action buttons */}
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="h-4 w-[1px] bg-slate-800 mx-1.5"></span>
                <Terminal className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-semibold font-mono text-slate-300 tracking-wide uppercase">
                  {mode === 'python' ? 'Interactive Python REPL' : 'bash - user@pyflow:~'}
                </span>
              </div>

              {/* Helper badge or button */}
              <button
                onClick={() => {
                  if (mode === 'python') {
                    handlePythonReplInput('exit()');
                  } else {
                    handleBashInput('help');
                  }
                }}
                className="text-[10px] font-semibold font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 bg-slate-850 px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                <HelpCircle className="h-3 w-3" />
                <span>{mode === 'python' ? 'Quitter REPL' : 'Aide'}</span>
              </button>
            </div>

            {/* Terminal Screen Console prompt lines logs */}
            <div className="p-4 flex-1 overflow-y-auto font-mono text-xs leading-relaxed space-y-1.5 custom-scrollbar text-slate-300 select-text">
              {history.map((line, i) => {
                if (line.type === 'input') {
                  const isPythonPref = line.content.startsWith('>>>');
                  const style = isPythonPref ? 'text-cyan-400' : 'text-slate-100';
                  return (
                    <div key={i} className="flex items-start gap-1">
                      <span className={`${style} select-none`}></span>
                      <span className={style}>{line.content}</span>
                    </div>
                  );
                }
                if (line.type === 'error') {
                  return (
                    <div key={i} className="text-rose-400 whitespace-pre-wrap pl-2 border-l-2 border-rose-500/40 py-0.5">
                      {line.content}
                    </div>
                  );
                }
                if (line.type === 'info') {
                  return (
                    <div key={i} className="text-indigo-400 font-sans tracking-wide text-[11px] py-0.5 bg-indigo-950/25 px-2 rounded border border-indigo-900/10">
                      {line.content}
                    </div>
                  );
                }
                if (line.type === 'output') {
                  // Check if this is the final interactive prompt line at script bottom
                  const isPrompt = line.content === 'user@pyflow:~$ ' || line.content === '>>> ';
                  if (isPrompt) {
                    return (
                      <div key={i} className="flex items-center">
                        <span className={line.content === '>>> ' ? 'text-cyan-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>
                          {line.content}
                        </span>
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleTerminalInputKeyDown}
                            className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 font-mono text-xs text-slate-200 select-text caret-transparent"
                            autoFocus
                            placeholder={mode === 'python' ? "# Tapez du code..." : "Saisissez help..."}
                          />
                          {/* Custom blinking terminal absolute cursor overlay next to chars */}
                          <span 
                            className="absolute bottom-0 h-4 bg-emerald-400 pointer-events-none animate-pulse"
                            style={{
                              left: `${inputValue.length * 7}px`,
                              width: '8px'
                            }}
                          ></span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="whitespace-pre-wrap text-slate-200 pl-1">
                      {line.content}
                    </div>
                  );
                }
                return null;
              })}
              <div ref={terminalBottomRef} />
            </div>

            {/* Handy terminal interactive guidance banner */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-850 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span className="hidden sm:inline">Exemple : <code className="text-emerald-400">python3 scrapper.py</code></span>
              <div className="flex items-center gap-1.5 bg-slate-950/50 px-2 py-1 rounded border border-slate-850">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Type : <code className="text-cyan-400">python3</code> pour interagir</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Modern Deletion Confirmation Modal */}
      {deleteConfirmFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="apple-glass dark:apple-glass-dark rounded-2xl max-w-md w-full p-6 transform transition-all scale-100">
            <div className="flex items-center gap-3.5 text-rose-600 mb-4">
              <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100">
                <Trash2 className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Supprimer le fichier ?</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Cette action est définitive.</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed font-sans mb-5">
              Êtes-vous sûr de vouloir supprimer définitivement le script <code className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md font-mono text-xs font-bold text-rose-605">{deleteConfirmFile}</code> ?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmFile(null)}
                className="px-4 py-2 apple-btn dark:apple-btn-dark font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteFile}
                className="px-4 py-2 apple-btn-primary !bg-rose-500/80 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Modern Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="apple-glass dark:apple-glass-dark rounded-2xl max-w-sm w-full p-6 transform transition-all scale-100">
            <div className="flex items-center gap-3.5 text-amber-600 mb-4">
              <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
                <HelpCircle className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Attention</h3>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed font-sans mb-5">
              {alertMessage}
            </p>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setAlertMessage(null)}
                className="px-4 py-2 apple-btn-primary font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                D'accord
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
