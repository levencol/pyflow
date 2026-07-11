import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import { Save, X, PlusCircle, Trash2 } from 'lucide-react';

interface AdminQuizFormProps {
  initialData?: QuizQuestion | null;
  lessonId: string | number;
  onSave: (quiz: QuizQuestion) => void;
  onCancel: () => void;
}

export default function AdminQuizForm({ initialData, lessonId, onSave, onCancel }: AdminQuizFormProps) {
  const [formData, setFormData] = useState<Partial<QuizQuestion>>(
    initialData || {
      lessonId,
      question: '',
      options: ['', '', '', ''],
      answerIndex: 0,
      explanation: ''
    }
  );

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...(formData.options || []), ''] });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(formData.options || [])];
    newOptions.splice(index, 1);
    
    let newAnswerIndex = formData.answerIndex || 0;
    if (newAnswerIndex === index) {
      newAnswerIndex = 0;
    } else if (newAnswerIndex > index) {
      newAnswerIndex -= 1;
    }
    
    setFormData({ ...formData, options: newOptions, answerIndex: newAnswerIndex });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.options || formData.options.length < 2) {
      alert("Veuillez remplir la question et au moins deux options.");
      return;
    }
    onSave({
      id: formData.id || `quiz_${Date.now()}`,
      lessonId: formData.lessonId!,
      question: formData.question,
      options: formData.options,
      answerIndex: formData.answerIndex || 0,
      explanation: formData.explanation || ''
    } as QuizQuestion);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in">
      <h3 className="font-bold text-lg mb-4">{initialData ? 'Modifier le Quiz' : 'Nouveau Quiz'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question</label>
          <input
            type="text"
            required
            value={formData.question || ''}
            onChange={e => setFormData({ ...formData, question: e.target.value })}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm focus:border-indigo-500 outline-none"
            placeholder="Ex: Que fait la fonction print() ?"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Options de réponse</label>
          <div className="space-y-2">
            {(formData.options || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct_answer"
                  checked={formData.answerIndex === idx}
                  onChange={() => setFormData({ ...formData, answerIndex: idx })}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  title="Marquer comme bonne réponse"
                />
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm focus:border-indigo-500 outline-none"
                  placeholder={`Option ${idx + 1}`}
                />
                {(formData.options || []).length > 2 && (
                  <button type="button" onClick={() => removeOption(idx)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addOption} className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:text-indigo-700">
            <PlusCircle className="h-3 w-3" /> Ajouter une option
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Explication (Affichée après la réponse)</label>
          <textarea
            value={formData.explanation || ''}
            onChange={e => setFormData({ ...formData, explanation: e.target.value })}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm focus:border-indigo-500 outline-none h-20 resize-none"
            placeholder="Expliquez brièvement pourquoi c'est la bonne réponse..."
          />
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-2">
            <X className="h-4 w-4" /> Annuler
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2">
            <Save className="h-4 w-4" /> Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
}
