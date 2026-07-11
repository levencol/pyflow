import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Award, Star, Zap, Shield, Crown, TrendingUp, Target, UploadCloud, Link as LinkIcon, Image as ImageIcon, X, Check } from 'lucide-react';

export interface Badge {
  id: string;
  title: string;
  description: string;
  rarity: 'Commune' | 'Rare' | 'Épique' | 'Légendaire';
  points: number;
  unlockCondition: string;
  iconType: 'icon' | 'url' | 'upload';
  iconName?: string;
  imageUrl?: string;
}

const INITIAL_BADGES: Badge[] = [
  { id: '1', title: 'Premier Pas', description: 'A terminé son premier chapitre de cours.', rarity: 'Commune', points: 10, unlockCondition: 'Terminer 1 chapitre', iconType: 'icon', iconName: 'Star' },
  { id: '2', title: 'Codeur Assidu', description: 'A complété 10 exercices pratiques.', rarity: 'Rare', points: 50, unlockCondition: 'Valider 10 exercices', iconType: 'icon', iconName: 'Zap' },
  { id: '3', title: 'Maître Python', description: 'A fini tous les modules de base.', rarity: 'Épique', points: 200, unlockCondition: '100% complétion module base', iconType: 'icon', iconName: 'Crown' },
];

const AVAILABLE_ICONS = ['Award', 'Star', 'Zap', 'Shield', 'Crown', 'TrendingUp', 'Target'];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Commune': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    case 'Rare': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30';
    case 'Épique': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30';
    case 'Légendaire': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export default function AdminBadges() {
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [formData, setFormData] = useState<Partial<Badge>>({});

  const filteredBadges = badges.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (badge?: Badge) => {
    if (badge) {
      setEditingBadge(badge);
      setFormData(badge);
    } else {
      setEditingBadge(null);
      setFormData({
        title: '', description: '', rarity: 'Commune', points: 10, unlockCondition: '', iconType: 'icon', iconName: 'Award'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBadge(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) return;
    
    if (editingBadge) {
      setBadges(badges.map(b => b.id === editingBadge.id ? { ...b, ...formData } as Badge : b));
    } else {
      const newBadge: Badge = {
        ...formData,
        id: Math.random().toString(36).substring(7)
      } as Badge;
      setBadges([newBadge, ...badges]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce badge ?")) {
      setBadges(badges.filter(b => b.id !== id));
    }
  };

  const renderIcon = (type: string, name?: string, url?: string, className: string = "h-8 w-8") => {
    if (type === 'upload' || type === 'url') {
      return url ? <img src={url} alt="Badge" className={`${className} object-contain`} /> : <ImageIcon className={className} />;
    }
    
    switch (name) {
      case 'Star': return <Star className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Target': return <Target className={className} />;
      default: return <Award className={className} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Gestion des Badges</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Créez et gérez les récompenses pour motiver les étudiants.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Créer un badge
        </button>
      </div>

      <div className="flex-1 flex flex-col apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un badge..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors"
            />
          </div>
          <div className="text-xs font-bold text-slate-500">
            {filteredBadges.length} badge{filteredBadges.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Badge Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredBadges.length === 0 ? (
            <div className="text-center text-slate-500 flex flex-col items-center mt-12">
              <Award className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
              <p>Aucun badge trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges.map(badge => (
                <div key={badge.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-xl hover:border-indigo-500/30 transition-all group flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${getRarityColor(badge.rarity)}`}>
                      {renderIcon(badge.iconType, badge.iconName, badge.imageUrl, "h-8 w-8")}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(badge)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(badge.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{badge.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">{badge.description}</p>
                  
                  <div className="mt-auto space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 uppercase tracking-wider font-bold">Rareté</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold border ${getRarityColor(badge.rarity)}`}>{badge.rarity}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 uppercase tracking-wider font-bold">Points</span>
                      <span className="font-black text-amber-500">+{badge.points} XP</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 uppercase tracking-wider font-bold">Condition</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]" title={badge.unlockCondition}>{badge.unlockCondition}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingBadge ? 'Modifier le badge' : 'Créer un badge'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Informations Générales */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2"><Award className="h-4 w-4 text-indigo-500"/> Informations Générales</h4>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Titre du badge *</label>
                  <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors" placeholder="Ex: Maître Python" />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Description *</label>
                  <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors resize-none" placeholder="Expliquez ce qu'il représente..."></textarea>
                </div>
              </div>

              {/* Rareté & Récompenses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Rareté</label>
                  <select value={formData.rarity || 'Commune'} onChange={e => setFormData({...formData, rarity: e.target.value as any})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors appearance-none">
                    <option value="Commune">🟢 Commune</option>
                    <option value="Rare">🔵 Rare</option>
                    <option value="Épique">🟣 Épique</option>
                    <option value="Légendaire">🟡 Légendaire</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Points (XP)</label>
                  <input type="number" value={formData.points || 0} onChange={e => setFormData({...formData, points: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors" min="0" />
                </div>
              </div>

              {/* Apparence */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2"><ImageIcon className="h-4 w-4 text-indigo-500"/> Apparence</h4>
                
                <div className="flex gap-2">
                  <button onClick={() => setFormData({...formData, iconType: 'icon'})} className={`flex-1 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-colors ${formData.iconType === 'icon' ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30' : 'bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-700'}`}>
                    <Award className="h-4 w-4" /> Icône intégrée
                  </button>
                  <button onClick={() => setFormData({...formData, iconType: 'upload'})} className={`flex-1 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-colors ${formData.iconType === 'upload' ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30' : 'bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-700'}`}>
                    <UploadCloud className="h-4 w-4" /> Fichier
                  </button>
                  <button onClick={() => setFormData({...formData, iconType: 'url'})} className={`flex-1 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-colors ${formData.iconType === 'url' ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30' : 'bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-700'}`}>
                    <LinkIcon className="h-4 w-4" /> Lien (URL)
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 border ${getRarityColor(formData.rarity || 'Commune')}`}>
                    {renderIcon(formData.iconType || 'icon', formData.iconName, formData.imageUrl, "h-8 w-8")}
                  </div>
                  
                  <div className="flex-1">
                    {formData.iconType === 'icon' && (
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-2">Choisir une icône</label>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_ICONS.map(icon => (
                            <button key={icon} onClick={() => setFormData({...formData, iconName: icon})} className={`p-2 rounded-lg border transition-colors ${formData.iconName === icon ? 'bg-indigo-100 border-indigo-300 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50'}`}>
                              {renderIcon('icon', icon, undefined, "h-5 w-5")}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.iconType === 'upload' && (
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            setFormData({...formData, imageUrl: url});
                          }
                        }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-sm text-center font-medium text-slate-500 hover:border-indigo-500 transition-colors">
                          Cliquez pour uploader une image
                        </div>
                      </div>
                    )}
                    {formData.iconType === 'url' && (
                      <div>
                        <input type="text" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors" placeholder="https://..." />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2"><Target className="h-4 w-4 text-indigo-500"/> Déblocage</h4>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Critères d'obtention</label>
                  <input type="text" value={formData.unlockCondition || ''} onChange={e => setFormData({...formData, unlockCondition: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors" placeholder="Ex: Terminer 10 exercices ou Attribution Manuelle" />
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">L'attribution peut se faire manuellement depuis la page Étudiants ou être liée à des critères.</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl transition-colors cursor-pointer">
                Annuler
              </button>
              <button onClick={handleSave} disabled={!formData.title || !formData.description} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2">
                <Check className="h-4 w-4" /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
