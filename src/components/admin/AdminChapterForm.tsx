import { useState } from 'react';
import { Chapter } from '../../types';
import { Save, X, Info } from 'lucide-react';

interface AdminChapterFormProps {
  initialData?: Chapter | null;
  onSave: (chapter: Chapter) => void;
  onCancel: () => void;
}

export default function AdminChapterForm({ initialData, onSave, onCancel }: AdminChapterFormProps) {
  const [formData, setFormData] = useState<Partial<Chapter>>(
    initialData || {
      id: '',
      title: '',
      lessons: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.title) {
      alert("L'ID et le Titre sont obligatoires.");
      return;
    }
    onSave(formData as Chapter);
  };

  return (
    <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm animate-fade-in mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {initialData ? 'Modifier le chapitre' : 'Nouveau Chapitre'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {initialData ? 'Modifiez le titre de ce chapitre.' : 'Ajoutez un nouveau module de formation.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" /> Titre du Chapitre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
              placeholder="Ex: Phase 1 : Les Fondamentaux"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" /> Identifiant unique (ID)
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-mono text-sm"
              placeholder="Ex: ch-fondamentaux"
              required
              disabled={!!initialData} // On ne modifie pas l'ID d'un chapitre existant
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl flex items-center gap-2 transition-colors text-sm"
          >
            <X className="h-4 w-4" /> Annuler
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all text-sm"
          >
            <Save className="h-4 w-4" /> {initialData ? 'Enregistrer' : 'Ajouter le chapitre'}
          </button>
        </div>
      </form>
    </div>
  );
}
