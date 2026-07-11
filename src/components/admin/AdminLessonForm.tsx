import { useState } from 'react';
import { Lesson } from '../../types';
import { Save, X, Info } from 'lucide-react';

interface AdminLessonFormProps {
  initialData?: Lesson | null;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

export default function AdminLessonForm({ initialData, onSave, onCancel }: AdminLessonFormProps) {
  const [formData, setFormData] = useState<Partial<Lesson>>(
    initialData || {
      id: '',
      title: '',
      description: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.title) {
      alert("L'ID et le Titre sont obligatoires.");
      return;
    }
    onSave(formData as Lesson);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 my-2 shadow-sm animate-fade-in mx-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          {initialData ? 'Modifier la leçon' : 'Nouvelle Leçon'}
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Titre de la leçon</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white text-sm"
              placeholder="Ex: Les variables"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Identifiant (ID)</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-mono text-sm"
              placeholder="Ex: 101 ou les-variables"
              required
              disabled={!!initialData}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description courte</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white text-sm resize-none"
            placeholder="Ce que les étudiants vont apprendre dans cette leçon..."
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-lg flex items-center gap-1.5 transition-colors text-xs"
          >
            <X className="h-3 w-3" /> Annuler
          </button>
          <button 
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all text-xs"
          >
            <Save className="h-3 w-3" /> {initialData ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
}
