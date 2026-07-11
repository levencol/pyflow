import { useState, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, FileText, FileCode, PlaySquare, X, Check, AlertCircle, Image as ImageIcon, Link as LinkIcon, UploadCloud, Eye, Tags, ChevronUp, ChevronDown } from 'lucide-react';

export interface Document {
  id: string;
  title: string;
  category: string;
  type: 'PDF' | 'Code' | 'Vidéo' | 'Image';
  date: string;
  size: string;
  canDownload: boolean;
  content: string;
  sourceType?: 'upload' | 'link';
  url?: string;
  previewUrl?: string;
  file?: File;
}

// Initial mock state for the demo
const INITIAL_DOCUMENTS: Document[] = [
  { id: '1', title: 'Cheatsheet Python (Bases)', category: 'Mémos', type: 'PDF', date: '10 Fév 2024', size: '1.2 MB', canDownload: true, content: 'Contenu simulé...' },
  { id: '2', title: 'Architecture des algorithmes complexes', category: 'Théorie', type: 'PDF', date: '15 Mar 2024', size: '4.5 MB', canDownload: false, content: 'CONTENU PROTÉGÉ...' },
  { id: '3', title: "Exemple de script d'automatisation", category: 'Pratique', type: 'Code', date: '22 Avr 2024', size: '15 KB', canDownload: true, content: 'def automatiser(): pass' },
  { id: '4', title: 'Tutoriel Vidéo : Les décorateurs', category: 'Cours', type: 'Vidéo', date: '05 Mai 2024', size: '150 MB', canDownload: false, content: '[Lecteur vidéo]' }
];

const INITIAL_CATEGORIES = Array.from(new Set(INITIAL_DOCUMENTS.map(d => d.category)));

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [search, setSearch] = useState('');
  
  // Sort state
  type SortColumn = 'type' | 'title' | 'date' | 'canDownload' | null;
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  
  // Category state
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{old: string, new: string} | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Document>>({});

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let valA: any = a[sortColumn];
    let valB: any = b[sortColumn];
    
    if (sortColumn === 'title') {
      valA = a.title.toLowerCase();
      valB = b.title.toLowerCase();
    }
    
    if (sortColumn === 'date') {
      const parseDate = (dStr: string) => {
        const parts = dStr.split(' ');
        if (parts.length === 3) {
          const months: Record<string, number> = { 'Jan': 0, 'Fév': 1, 'Mar': 2, 'Avr': 3, 'Mai': 4, 'Juin': 5, 'Juil': 6, 'Août': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Déc': 11 };
          return new Date(parseInt(parts[2]), months[parts[1]] || 0, parseInt(parts[0])).getTime();
        }
        return 0;
      };
      valA = parseDate(a.date);
      valB = parseDate(b.date);
    }
    
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <span className="opacity-0 group-hover:opacity-50 ml-1 inline-flex"><ChevronUp className="h-3 w-3" /></span>;
    return sortDirection === 'asc' 
      ? <span className="ml-1 inline-flex text-indigo-500"><ChevronUp className="h-3 w-3" /></span> 
      : <span className="ml-1 inline-flex text-indigo-500"><ChevronDown className="h-3 w-3" /></span>;
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-5 w-5 text-rose-500" />;
      case 'Code': return <FileCode className="h-5 w-5 text-indigo-500" />;
      case 'Vidéo': return <PlaySquare className="h-5 w-5 text-emerald-500" />;
      case 'Image': return <ImageIcon className="h-5 w-5 text-sky-500" />;
      default: return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  const renderVideoPreview = (url: string | undefined, className: string) => {
    if (!url) return null;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
      else if (url.includes('watch?v=')) videoId = url.split('watch?v=')[1]?.split('&')[0];
      
      if (videoId) {
        return <iframe src={`https://www.youtube.com/embed/${videoId}`} className={`${className} bg-black`} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>;
      }
    }
    
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return <iframe src={`https://player.vimeo.com/video/${videoId}`} className={`${className} bg-black`} allowFullScreen allow="autoplay; fullscreen; picture-in-picture"></iframe>;
      }
    }
    
    return <video src={url} controls className={className}></video>;
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    if (confirm(`Supprimer la catégorie "${cat}" ? Les documents associés n'auront plus de catégorie valide.`)) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.new.trim() && !categories.includes(editingCategory.new.trim())) {
      const updatedCats = categories.map(c => c === editingCategory.old ? editingCategory.new.trim() : c);
      setCategories(updatedCats);
      setDocuments(documents.map(d => d.category === editingCategory.old ? { ...d, category: editingCategory.new.trim() } : d));
      setEditingCategory(null);
    }
  };

  const handleOpenModal = (doc?: Document) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData(doc);
    } else {
      setEditingDoc(null);
      setFormData({
        title: '', category: '', type: 'PDF', size: '0 KB', canDownload: true, content: '', sourceType: 'upload'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoc(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.title || !formData.category) return;
    
    if (editingDoc) {
      setDocuments(documents.map(d => d.id === editingDoc.id ? { ...d, ...formData } as Document : d));
    } else {
      const newDoc: Document = {
        ...formData,
        id: Math.random().toString(36).substring(7),
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      } as Document;
      setDocuments([newDoc, ...documents]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">Gestion des Documents</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gérez les ressources, PDFs, codes et vidéos pour les étudiants.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Tags className="h-4 w-4" /> Catégories
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Ajouter un document
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors"
            />
          </div>
          <div className="text-xs font-bold text-slate-500">
            {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
              <p>Aucun document trouvé.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('type')}>
                    Type <SortIcon column="type" />
                  </th>
                  <th className="px-6 py-4 font-bold cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('title')}>
                    Titre & Catégorie <SortIcon column="title" />
                  </th>
                  <th className="px-6 py-4 font-bold cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('date')}>
                    Détails <SortIcon column="date" />
                  </th>
                  <th className="px-6 py-4 font-bold cursor-pointer group hover:text-indigo-600 transition-colors" onClick={() => handleSort('canDownload')}>
                    Téléchargement <SortIcon column="canDownload" />
                  </th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                {sortedDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        {getIconForType(doc.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white mb-1">{doc.title}</div>
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded-md uppercase tracking-wider text-slate-500">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium space-y-1">
                      <div className="text-slate-600 dark:text-slate-300">{doc.date}</div>
                      <div className="text-slate-400">{doc.size}</div>
                    </td>
                    <td className="px-6 py-4">
                      {doc.canDownload ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                          <Check className="h-3 w-3" /> Autorisé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
                          <AlertCircle className="h-3 w-3" /> Restreint
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setViewingDoc(doc)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer" title="Aperçu">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleOpenModal(doc)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer" title="Modifier">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                {editingDoc ? 'Modifier le document' : 'Ajouter un document'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Titre du document *</label>
                  <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors" placeholder="Ex: Mémento complet" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Catégorie *</label>
                  <select value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors appearance-none">
                    <option value="" disabled>Sélectionner...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Type</label>
                  <select value={formData.type || 'PDF'} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors appearance-none">
                    <option value="PDF">PDF</option>
                    <option value="Image">Image</option>
                    <option value="Code">Fichier Code (.py)</option>
                    <option value="Vidéo">Lien Vidéo</option>
                  </select>
                </div>
                
                <div className="col-span-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">Source du document</label>
                  <div className="flex gap-4 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button 
                      onClick={() => setFormData({...formData, sourceType: 'upload'})}
                      className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${formData.sourceType === 'upload' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <UploadCloud className="h-4 w-4" /> Importer un fichier
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, sourceType: 'link'})}
                      className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${formData.sourceType === 'link' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <LinkIcon className="h-4 w-4" /> Lien externe (URL)
                    </button>
                  </div>
                  
                  {formData.sourceType === 'upload' ? (
                    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center">
                      <input 
                        type="file" 
                        accept={formData.type === 'Image' ? 'image/*' : formData.type === 'PDF' ? 'application/pdf' : formData.type === 'Vidéo' ? 'video/*' : '*/*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            let sizeStr = '';
                            if (file.size < 1024 * 1024) {
                              sizeStr = (file.size / 1024).toFixed(1) + ' KB';
                            } else {
                              sizeStr = (file.size / 1024 / 1024).toFixed(2) + ' MB';
                            }
                            
                            let detectedType: 'PDF' | 'Code' | 'Vidéo' | 'Image' = formData.type || 'PDF';
                            if (file.type.startsWith('image/')) detectedType = 'Image';
                            else if (file.type.startsWith('video/')) detectedType = 'Vidéo';
                            else if (file.type === 'application/pdf') detectedType = 'PDF';
                            else if (file.name.endsWith('.py') || file.type.includes('python')) detectedType = 'Code';
                            
                            setFormData({
                              ...formData, 
                              file, 
                              previewUrl, 
                              size: sizeStr,
                              type: detectedType,
                              title: formData.title || file.name.split('.')[0]
                            });
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {formData.file ? formData.file.name : 'Cliquez ou glissez un fichier ici'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Format recommandé : {formData.type}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="url" 
                        value={formData.url || ''} 
                        onChange={e => {
                          const val = e.target.value;
                          const lowerVal = val.toLowerCase();
                          let detectedType: 'PDF' | 'Code' | 'Vidéo' | 'Image' = formData.type || 'PDF';
                          
                          if (lowerVal.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/)) detectedType = 'Image';
                          else if (lowerVal.match(/\.(mp4|webm|ogg)(\?.*)?$/) || lowerVal.includes('youtube.com') || lowerVal.includes('youtu.be') || lowerVal.includes('vimeo')) detectedType = 'Vidéo';
                          else if (lowerVal.includes('.pdf')) detectedType = 'PDF';
                          else if (lowerVal.includes('.py')) detectedType = 'Code';
                          
                          setFormData({
                            ...formData, 
                            url: val, 
                            previewUrl: val,
                            type: detectedType,
                            size: formData.size && formData.size !== '0 KB' ? formData.size : 'Lien externe'
                          });
                        }}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500" 
                        placeholder="Ex: https://..." 
                      />
                    </div>
                  )}
                </div>

                {formData.previewUrl && (
                  <div className="col-span-2 bg-slate-100 dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 flex justify-center items-center min-h-[150px] max-h-[350px] overflow-hidden mt-2 relative group">
                    {formData.type === 'Image' && <img src={formData.previewUrl} alt="Aperçu" className="max-h-[330px] max-w-full object-contain rounded-xl" />}
                    {formData.type === 'Vidéo' && renderVideoPreview(formData.previewUrl, "w-full aspect-video rounded-xl")}
                    {formData.type === 'PDF' && <iframe src={formData.previewUrl} className="w-full h-72 rounded-xl border-none"></iframe>}
                    {formData.type === 'Code' && <div className="text-sm font-mono text-slate-500 flex items-center gap-2"><FileCode className="h-5 w-5" /> Fichier prêt</div>}
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                      Aperçu
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 mt-2">Taille / Poids <span className="text-[10px] text-slate-400 normal-case font-normal">(Détecté auto)</span></label>
                  <input readOnly type="text" value={formData.size || ''} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none transition-colors opacity-70 cursor-not-allowed" placeholder="Calcul automatique..." />
                </div>
                <div className="flex flex-col justify-end mt-2">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                    <input type="checkbox" checked={formData.canDownload || false} onChange={e => setFormData({...formData, canDownload: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Autoriser le téléchargement</span>
                  </label>
                </div>
                <div className="col-span-2 mt-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Description courte</label>
                  <textarea value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} rows={2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors resize-none" placeholder="Description du document pour les étudiants..."></textarea>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl transition-colors cursor-pointer">
                Annuler
              </button>
              <button onClick={handleSave} disabled={!formData.title || !formData.category} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={() => setViewingDoc(null)}></div>
          <div className="relative w-full max-w-4xl h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {getIconForType(viewingDoc.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{viewingDoc.title}</h3>
                  <div className="text-xs text-slate-500 font-bold tracking-wider uppercase mt-0.5">{viewingDoc.type} • {viewingDoc.size}</div>
                </div>
              </div>
              <button onClick={() => setViewingDoc(null)} className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-[#0d1117] p-4 md:p-8 overflow-y-auto flex items-center justify-center">
              {viewingDoc.previewUrl ? (
                <>
                  {viewingDoc.type === 'Image' && <img src={viewingDoc.previewUrl} alt="Aperçu" className="max-w-full max-h-full rounded-xl shadow-lg" />}
                  {viewingDoc.type === 'Vidéo' && renderVideoPreview(viewingDoc.previewUrl, "w-full aspect-video rounded-xl shadow-lg")}
                  {viewingDoc.type === 'PDF' && <iframe src={viewingDoc.previewUrl} className="w-full h-full rounded-xl shadow-lg border-none bg-white"></iframe>}
                  {viewingDoc.type === 'Code' && <pre className="w-full h-full p-6 bg-slate-900 text-slate-100 rounded-xl overflow-auto font-mono text-sm shadow-lg border border-slate-800">{viewingDoc.content}</pre>}
                </>
              ) : (
                <div className="text-center max-w-2xl w-full bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-center mb-6 text-slate-200 dark:text-slate-800">
                    <Eye className="h-20 w-20" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Aperçu du contenu</h4>
                  {viewingDoc.type === 'Code' ? (
                    <pre className="text-left p-6 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto text-sm mt-4 border border-slate-800">{viewingDoc.content}</pre>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{viewingDoc.content || "Aucun contenu ou aperçu disponible pour ce document."}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={() => setIsCategoryModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tags className="h-5 w-5 text-indigo-500" /> Gestion des catégories
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                  placeholder="Nouvelle catégorie..." 
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm outline-none transition-colors"
                />
                <button 
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || categories.includes(newCategoryName.trim())}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Ajouter
                </button>
              </div>

              <div className="mt-6 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto bg-slate-50/50 dark:bg-slate-800/20">
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {categories.map(cat => (
                    <li key={cat} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      {editingCategory?.old === cat ? (
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <input 
                            type="text" 
                            value={editingCategory.new} 
                            onChange={e => setEditingCategory({...editingCategory, new: e.target.value})}
                            onKeyDown={e => e.key === 'Enter' && handleUpdateCategory()}
                            className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-indigo-500 rounded-lg text-sm outline-none"
                            autoFocus
                          />
                          <button onClick={handleUpdateCategory} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg cursor-pointer">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => setEditingCategory(null)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg cursor-pointer">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat}</span>
                          <div className="flex gap-1">
                            <button onClick={() => setEditingCategory({old: cat, new: cat})} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteCategory(cat)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                  {categories.length === 0 && (
                    <li className="p-4 text-center text-sm text-slate-500">Aucune catégorie existante.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
