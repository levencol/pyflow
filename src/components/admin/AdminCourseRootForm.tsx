import { useState } from 'react';
import { Course } from '../../types';
import { Save, X, Info, Tag } from 'lucide-react';

interface AdminCourseRootFormProps {
  initialData?: Course | null;
  onSave: (course: Course) => void;
  onCancel: () => void;
}

export default function AdminCourseRootForm({ initialData, onSave, onCancel }: AdminCourseRootFormProps) {
  const [formData, setFormData] = useState<Partial<Course>>(
    initialData || {
      id: '',
      title: '',
      status: 'Brouillon',
      description: '',
      technologies: [],
      studentCount: 0,
      duration: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      chapters: []
    }
  );

  const [techInput, setTechInput] = useState('');

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim() !== '') {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.title) {
      alert("L'ID et le Titre sont obligatoires.");
      return;
    }
    onSave(formData as Course);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            {initialData ? 'Modifier le cours' : 'Nouveau Cours'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {initialData ? 'Modifiez les informations générales de ce cours.' : 'Créez la fiche de présentation pour un nouveau programme.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl flex items-center gap-2 transition-colors"
          >
            <X className="h-4 w-4" /> Annuler
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
          >
            <Save className="h-4 w-4" /> {initialData ? 'Enregistrer' : 'Créer le cours'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" /> Titre du Cours
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
              placeholder="Ex: Python Masterclass"
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
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-mono text-sm"
              placeholder="Ex: python-masterclass"
              required
              disabled={!!initialData} // On ne modifie pas l'ID d'un cours existant
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Statut de publication</label>
            <div className="flex gap-4">
              {['Brouillon', 'Publié', 'Archivé'].map((status) => (
                <label key={status} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.status === status ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400'}`}>
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="hidden"
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" /> Durée estimée (heures)
            </label>
            <input
              type="number"
              min="0"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
              placeholder="Ex: 15"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description courte</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white resize-none"
            placeholder="Une description accrocheuse du programme..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Tag className="h-4 w-4 text-slate-400" /> Technologies (Appuyez sur Entrée pour ajouter)
          </label>
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleAddTech}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
            placeholder="Ex: React, Node.js, Python..."
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.technologies?.map((tech, index) => (
              <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-bold group">
                {tech}
                <button 
                  type="button" 
                  onClick={() => handleRemoveTech(index)}
                  className="p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-500/40 rounded-full transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {(!formData.technologies || formData.technologies.length === 0) && (
              <p className="text-sm text-slate-500 italic">Aucune technologie ajoutée.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
