import { useState } from 'react';
import { Settings, Shield, UserPlus, RefreshCw, Pencil, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { AdminAccount, createAdmin, updateAdmin, fetchAdmins } from '../../services/api';

interface AdminSettingsProps {
  admins: AdminAccount[];
  adminsLoading: boolean;
  onRefreshAdmins: () => void;
}

export default function AdminSettings({ admins, adminsLoading, onRefreshAdmins }: AdminSettingsProps) {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminDisplayName, setNewAdminDisplayName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminFormError, setAdminFormError] = useState('');
  const [adminFormLoading, setAdminFormLoading] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim() || !newAdminDisplayName.trim() || !newAdminPassword.trim()) { 
      setAdminFormError('Tous les champs sont requis.'); 
      return; 
    }
    setAdminFormLoading(true); setAdminFormError('');
    try {
      await createAdmin({ username: newAdminUsername.trim().toLowerCase(), display_name: newAdminDisplayName.trim(), password: newAdminPassword.trim() });
      setNewAdminUsername(''); setNewAdminDisplayName(''); setNewAdminPassword('');
      setShowAdminForm(false);
      onRefreshAdmins();
    } catch (err: unknown) { setAdminFormError((err as Error).message); }
    finally { setAdminFormLoading(false); }
  };

  const handleUpdateAdminPassword = async (adminId: string) => {
    if (!editPassword.trim()) return;
    try { 
      await updateAdmin(adminId, { password: editPassword.trim() }); 
      setEditingAdminId(null); 
      setEditPassword(''); 
      onRefreshAdmins(); 
    }
    catch (err: unknown) { alert((err as Error).message); }
  };

  const handleToggleAdminActive = async (adminId: string, currentState: boolean) => {
    try { 
      await updateAdmin(adminId, { is_active: !currentState }); 
      onRefreshAdmins(); 
    }
    catch (err: unknown) { alert((err as Error).message); }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Paramètres du système</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gérez les accès administrateurs et la configuration de la plateforme.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Administrateurs */}
        <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[500px]">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-500" /> Comptes Administrateurs
            </h3>
            <button onClick={() => setShowAdminForm(!showAdminForm)} className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer shadow-sm">
              <UserPlus className="h-4 w-4" />
            </button>
          </div>

          {showAdminForm && (
            <form onSubmit={handleCreateAdmin} className="p-6 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-500/5 space-y-4">
              <div className="space-y-3">
                <input value={newAdminUsername} onChange={e => setNewAdminUsername(e.target.value)} placeholder="Identifiant (ex: admin1) *"
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-none" />
                <input value={newAdminDisplayName} onChange={e => setNewAdminDisplayName(e.target.value)} placeholder="Nom complet *"
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-none" />
                <input type="password" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} placeholder="Mot de passe *"
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-none font-mono" />
              </div>
              {adminFormError && <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl">{adminFormError}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={adminFormLoading}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {adminFormLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                  Créer le compte
                </button>
                <button type="button" onClick={() => setShowAdminForm(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer">
                  Annuler
                </button>
              </div>
            </form>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {adminsLoading && <div className="text-center p-8 text-slate-500"><RefreshCw className="h-6 w-6 animate-spin mx-auto" /></div>}
            
            {admins.map(adm => (
              <div key={adm.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{adm.display_name}</p>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-lg ${adm.is_active ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        {adm.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">@{adm.username}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggleAdminActive(adm.id, adm.is_active)} title={adm.is_active ? 'Désactiver' : 'Activer'}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                      {adm.is_active ? <ToggleRight className="h-5 w-5 text-emerald-500" /> : <ToggleLeft className="h-5 w-5 text-slate-400" />}
                    </button>
                    <button onClick={() => { setEditingAdminId(editingAdminId === adm.id ? null : adm.id); setEditPassword(''); }} title="Changer mot de passe"
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-indigo-500">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {editingAdminId === adm.id && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Nouveau mot de passe"
                      className="flex-1 text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 font-mono outline-none" />
                    <button onClick={() => handleUpdateAdminPassword(adm.id)} disabled={!editPassword.trim()}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-colors">
                      Valider
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Global Settings (Mock) */}
        <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <Settings className="h-4 w-4 text-slate-500" /> Préférences Globales
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Mode Maintenance</p>
                <p className="text-xs text-slate-500 mt-1">Bloque l'accès aux étudiants.</p>
              </div>
              <ToggleLeft className="h-8 w-8 text-slate-300 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Inscriptions Ouvertes</p>
                <p className="text-xs text-slate-500 mt-1">Permet aux étudiants de créer un compte.</p>
              </div>
              <ToggleRight className="h-8 w-8 text-emerald-500 cursor-pointer" />
            </div>
            
            <div className="p-4 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20">
              <h4 className="font-bold text-sm text-rose-700 dark:text-rose-400">Zone de Danger</h4>
              <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1 mb-3">Réinitialisation des données de la plateforme.</p>
              <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer">
                Purger les statistiques
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
