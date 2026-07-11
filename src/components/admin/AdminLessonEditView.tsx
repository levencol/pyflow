import { useState } from 'react';
import { ArrowLeft, Save, FileText, Code, Shield, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { Lesson } from '../../types';
import RichTextEditor from './RichTextEditor';

interface AdminLessonEditViewProps {
  lesson: Lesson;
  onSave: (updatedLesson: Lesson) => void;
  onCancel: () => void;
}

export default function AdminLessonEditView({ lesson, onSave, onCancel }: AdminLessonEditViewProps) {
  const [formData, setFormData] = useState<Lesson>({ ...lesson });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Le titre est obligatoire.");
      return;
    }
    onSave(formData);
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
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Modifier la leçon {lesson.id}
            </h2>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Save className="h-4 w-4" /> Enregistrer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Propriétés de base */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            Propriétés Principales
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Titre de la leçon *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Identifiant (Lecture seule)</label>
              <input
                type="text"
                value={formData.id}
                disabled
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 font-mono opacity-70 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description courte</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white resize-y"
            />
          </div>
        </div>

        {/* Contenu Markdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Contenu de la leçon (Markdown)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-2">Utilisez la barre d'outils pour mettre en forme votre texte. L'éditeur génèrera automatiquement le code Markdown.</p>
          
          <RichTextEditor 
            value={formData.contentMarkdown || ''}
            onChange={(val) => setFormData({ ...formData, contentMarkdown: val })}
          />
        </div>

        {/* Code Example & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
              <Code className="h-5 w-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-white">
                Exemple de Code (Python)
              </h3>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800">
              <CodeMirror
                value={formData.codeExample || ''}
                onChange={(value) => setFormData({ ...formData, codeExample: value })}
                height="300px"
                theme="dark"
                extensions={[python()]}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  highlightActiveLine: true,
                }}
              />
            </div>
          </div>

          <div className="bg-black/90 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
              <Terminal className="h-5 w-5 text-slate-400" />
              <h3 className="text-lg font-bold text-white">
                Sortie Console Attendue
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-2">Texte exact qui apparaîtra dans le terminal simulé des étudiants.</p>
            <textarea
              value={formData.expectedOutput || ''}
              onChange={(e) => setFormData({ ...formData, expectedOutput: e.target.value })}
              rows={12}
              className="w-full px-4 py-3 font-mono text-sm bg-black border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-400 resize-y custom-scrollbar"
              placeholder="Ex: Hello, World!"
            />
          </div>
        </div>

        {/* Admin Guide */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-amber-200 dark:border-amber-800/50 pb-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-500">
              Guide Instructeur (Notes internes)
            </h3>
          </div>
          <p className="text-xs text-amber-700/70 dark:text-amber-500/70 mb-2">Ces notes sont invisibles pour les étudiants.</p>
          <textarea
            value={formData.adminGuide || ''}
            onChange={(e) => setFormData({ ...formData, adminGuide: e.target.value })}
            rows={5}
            className="w-full px-4 py-3 bg-white dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-amber-900 dark:text-amber-100 resize-y"
            placeholder="Conseils pour expliquer cette leçon..."
          />
        </div>

      </form>
    </motion.div>
  );
}
