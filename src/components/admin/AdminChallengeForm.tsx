import React, { useState } from 'react';
import { CodingChallenge } from '../../types';
import { Save, X, PlusCircle, Trash2 } from 'lucide-react';

interface AdminChallengeFormProps {
  initialData?: CodingChallenge | null;
  chapterId: string;
  onSave: (challenge: CodingChallenge) => void;
  onCancel: () => void;
}

export default function AdminChallengeForm({ initialData, chapterId, onSave, onCancel }: AdminChallengeFormProps) {
  const [formData, setFormData] = useState<Partial<CodingChallenge>>(
    initialData || {
      chapterId,
      title: '',
      description: '',
      instructions: [''],
      initialCode: '# Écrivez votre code ici\n',
      testCases: [{ input: '', expectedOutput: '', description: '' }],
      validationKeywords: []
    }
  );

  const handleArrayChange = (field: 'instructions' | 'validationKeywords', index: number, value: string) => {
    const newArr = [...(formData[field] || [])];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field: 'instructions' | 'validationKeywords') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayItem = (field: 'instructions' | 'validationKeywords', index: number) => {
    const newArr = [...(formData[field] || [])];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  const handleTestCaseChange = (index: number, key: keyof typeof formData.testCases[0], value: string) => {
    const newTests = [...(formData.testCases || [])];
    newTests[index] = { ...newTests[index], [key]: value };
    setFormData({ ...formData, testCases: newTests });
  };

  const addTestCase = () => {
    setFormData({ ...formData, testCases: [...(formData.testCases || []), { input: '', expectedOutput: '', description: '' }] });
  };

  const removeTestCase = (index: number) => {
    const newTests = [...(formData.testCases || [])];
    newTests.splice(index, 1);
    setFormData({ ...formData, testCases: newTests });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Titre et description requis.");
      return;
    }
    onSave({
      id: formData.id || `challenge_${Date.now()}`,
      chapterId: formData.chapterId!,
      title: formData.title,
      description: formData.description,
      instructions: formData.instructions?.filter(i => i.trim() !== '') || [],
      initialCode: formData.initialCode || '',
      testCases: formData.testCases || [],
      validationKeywords: formData.validationKeywords?.filter(k => k.trim() !== '') || [],
      dayId: initialData?.dayId || 1 // Fallback since it's required in types right now
    } as CodingChallenge);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in max-h-[80vh] overflow-y-auto">
      <h3 className="font-bold text-lg mb-4">{initialData ? 'Modifier le Défi' : 'Nouveau Défi'}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titre du défi</label>
            <input
              type="text" required
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
            <input
              type="text" required
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Instructions étape par étape</label>
          <div className="space-y-2">
            {(formData.instructions || []).map((inst, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-slate-400 text-xs w-4">{idx + 1}.</span>
                <input
                  type="text"
                  value={inst}
                  onChange={e => handleArrayChange('instructions', idx, e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm focus:border-indigo-500 outline-none"
                />
                <button type="button" onClick={() => removeArrayItem('instructions', idx)} className="p-1.5 text-slate-400 hover:text-rose-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addArrayItem('instructions')} className="mt-2 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700">
            <PlusCircle className="h-3 w-3" /> Ajouter une instruction
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Code Initial</label>
          <textarea
            value={formData.initialCode || ''}
            onChange={e => setFormData({ ...formData, initialCode: e.target.value })}
            className="w-full font-mono bg-slate-900 text-slate-100 border border-slate-700 px-4 py-3 rounded-xl text-sm focus:border-indigo-500 outline-none h-32"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mots-clés requis (Validation basique)</label>
          <div className="space-y-2">
            {(formData.validationKeywords || []).map((kw, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={kw}
                  onChange={e => handleArrayChange('validationKeywords', idx, e.target.value)}
                  className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm focus:border-indigo-500 outline-none"
                  placeholder="ex: for, print, while"
                />
                <button type="button" onClick={() => removeArrayItem('validationKeywords', idx)} className="p-1.5 text-slate-400 hover:text-rose-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addArrayItem('validationKeywords')} className="mt-2 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700">
            <PlusCircle className="h-3 w-3" /> Ajouter un mot-clé
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cas de test (Exécution)</label>
          <div className="space-y-3">
            {(formData.testCases || []).map((tc, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 relative">
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Entrée simulée (si input())" value={tc.input} onChange={e => handleTestCaseChange(idx, 'input', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm" />
                  <input type="text" placeholder="Sortie attendue (print)" value={tc.expectedOutput} onChange={e => handleTestCaseChange(idx, 'expectedOutput', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm" />
                </div>
                <input type="text" placeholder="Description du test" value={tc.description} onChange={e => handleTestCaseChange(idx, 'description', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm" />
                <button type="button" onClick={() => removeTestCase(idx)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addTestCase} className="mt-2 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700">
            <PlusCircle className="h-3 w-3" /> Ajouter un cas de test
          </button>
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl cursor-pointer flex items-center gap-2">
            <X className="h-4 w-4" /> Annuler
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg cursor-pointer flex items-center gap-2">
            <Save className="h-4 w-4" /> Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
}
