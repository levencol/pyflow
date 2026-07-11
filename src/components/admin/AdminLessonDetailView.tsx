import { ArrowLeft, Play, Terminal, Shield, FileText, Copy, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Lesson } from '../../types';
import { PythonHighlighter } from '../../utils/pythonHighlighter';

interface AdminLessonDetailViewProps {
  lesson: Lesson;
  onBack: () => void;
}

export default function AdminLessonDetailView({ lesson, onBack }: AdminLessonDetailViewProps) {
  const markdownComponents = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      if (inline) {
        return (
          <code className="bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
            {children}
          </code>
        );
      }
      const lang = match ? match[1] : 'python';
      return (
        <div className="my-4 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800/60 select-none">
            <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider">
              {lang}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
              }}
              className="px-2 py-1 text-[10px] text-slate-400 hover:text-white font-semibold font-mono flex items-center gap-1 transition-colors rounded hover:bg-slate-800"
            >
              <Copy className="h-2.5 w-2.5" /> Copier
            </button>
          </div>
          <pre className="p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 max-h-96 custom-scrollbar">
            <code className={className} {...props}>
              {lang === 'python' || !match ? (
                <PythonHighlighter code={String(children).replace(/\n$/, '')} />
              ) : (
                children
              )}
            </code>
          </pre>
        </div>
      );
    },
    h1: ({ children }: any) => <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white mt-8 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">{children}</h1>,
    h2: ({ children }: any) => <h2 className="font-display text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-display text-lg font-bold text-indigo-700 dark:text-indigo-400 mt-6 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="font-display text-base font-semibold text-slate-700 dark:text-slate-300 mt-5 mb-2">{children}</h4>,
    p: ({ children }: any) => <p className="text-slate-700 dark:text-slate-300 leading-loose text-base mb-5 font-sans">{children}</p>,
    strong: ({ children }: any) => <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-slate-600 dark:text-slate-400">{children}</em>,
    ul: ({ children }: any) => <ul className="list-disc pl-6 mb-5 space-y-2 text-slate-700 dark:text-slate-300 text-base">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-slate-700 dark:text-slate-300 text-base">{children}</ol>,
    li: ({ children }: any) => <li className="leading-relaxed font-sans">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="relative border-l-4 border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 p-5 my-6 rounded-r-2xl text-indigo-900 dark:text-indigo-200 font-sans shadow-sm">
        <div className="absolute top-5 left-[-2.5rem] bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm border border-slate-100 dark:border-slate-800">
          <AlertTriangle className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="text-base italic leading-relaxed">
          {children}
        </div>
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-6 border border-slate-200/80 dark:border-slate-700/80 rounded-xl shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs text-left text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{children}</tbody>,
    tr: ({ children }: any) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">{children}</tr>,
    th: ({ children }: any) => <th className="px-4 py-3 font-semibold">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 leading-relaxed">{children}</td>,
    a: ({ href, children, ...props }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline underline-offset-4 transition-colors font-medium"
        {...props}
      >
        {children}
      </a>
    ),
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
                Leçon {lesson.id}
              </span>
              {lesson.isActive === false && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Désactivée
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-500" />
              {lesson.title}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Markdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              Contenu du Cours (Markdown)
            </h3>
            
            {lesson.contentMarkdown ? (
              <div className="max-w-none">
                <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {lesson.contentMarkdown}
                </Markdown>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400">Aucun contenu markdown pour cette leçon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Code & Admin Guide */}
        <div className="space-y-6">
          {/* Code Example Preview */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-sm flex flex-col h-fit">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-bold text-slate-300">Code d'exemple (Lecture seule)</span>
              </div>
            </div>
            
            <div className="bg-slate-900 text-sm">
              {lesson.codeExample ? (
                <CodeMirror
                  value={lesson.codeExample}
                  height="200px"
                  theme="dark"
                  extensions={[python()]}
                  editable={false}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    highlightActiveLine: false,
                  }}
                />
              ) : (
                <div className="p-4 text-slate-500 text-center italic text-sm">
                  Pas de code d'exemple
                </div>
              )}
            </div>
            
            {/* Expected Output */}
            {lesson.expectedOutput && (
              <div className="p-4 border-t border-slate-800 bg-black/40">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sortie attendue</p>
                <pre className="font-mono text-sm text-emerald-400 whitespace-pre-wrap">{lesson.expectedOutput}</pre>
              </div>
            )}
          </div>

          {/* Admin Guide */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-500">
                Guide Instructeur
              </h3>
            </div>
            {lesson.adminGuide ? (
              <div className="max-w-none">
                <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {lesson.adminGuide}
                </Markdown>
              </div>
            ) : (
              <p className="text-sm text-amber-700/60 dark:text-amber-500/60 italic">
                Aucune note d'instructeur pour cette leçon.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
