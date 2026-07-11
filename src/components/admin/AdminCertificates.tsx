import { useState, useRef, useEffect, useCallback } from 'react';
import { Type, Image as ImageIcon, Layout, Download, Save, MousePointer2, Move, Trash2, SlidersHorizontal, ArrowLeft, Stamp, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, GripVertical } from 'lucide-react';

export type ElementType = 'text' | 'image' | 'dynamic';
export type TextAlign = 'left' | 'center' | 'right';

export interface CertElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  content: string; // Text content, or image URL, or dynamic placeholder (e.g., '{student_name}')
  style: {
    fontSize?: number;
    color?: string;
    fontWeight?: 'normal' | 'bold' | 'black';
    textAlign?: TextAlign;
    width?: number;
    height?: number;
    fontFamily?: string;
  };
}

export interface CertTemplate {
  id: string;
  name: string;
  backgroundUrl?: string;
  backgroundColor: string;
  elements: CertElement[];
}

const DEFAULT_TEMPLATE: CertTemplate = {
  id: 'default',
  name: 'Modèle Principal',
  backgroundColor: '#fdfbf7', // Légèrement crème/chaud
  elements: [
    {
      id: 'cert_officiel',
      type: 'text',
      x: 50,
      y: 60,
      content: 'CERTIFICAT OFFICIEL',
      style: { fontSize: 12, color: '#f59e0b', fontWeight: 'black', textAlign: 'left', fontFamily: 'sans-serif' }
    },
    {
      id: 'school_name',
      type: 'text',
      x: 50,
      y: 80,
      content: 'PyFlow Academy',
      style: { fontSize: 18, color: '#334155', fontWeight: 'bold', textAlign: 'left', fontFamily: 'sans-serif' }
    },
    {
      id: 'star_badge',
      type: 'text',
      x: 700,
      y: 50,
      content: '⭐',
      style: { fontSize: 48, color: '#f59e0b', fontWeight: 'normal', textAlign: 'right' }
    },
    {
      id: 'subtitle_1',
      type: 'text',
      x: 400,
      y: 180,
      content: 'Décerné avec les honneurs à',
      style: { fontSize: 14, color: '#64748b', fontWeight: 'normal', textAlign: 'center', fontFamily: 'sans-serif' }
    },
    {
      id: 'student_name',
      type: 'dynamic',
      x: 400,
      y: 220,
      content: '{student_name}',
      style: { fontSize: 48, color: '#0f172a', fontWeight: 'bold', textAlign: 'center', fontFamily: 'serif' } // Idéalement Italique, mais on utilise serif bold
    },
    {
      id: 'subtitle_2',
      type: 'text',
      x: 400,
      y: 310,
      content: 'Pour la complétion du parcours :',
      style: { fontSize: 14, color: '#64748b', fontWeight: 'normal', textAlign: 'center', fontFamily: 'sans-serif' }
    },
    {
      id: 'course_name',
      type: 'dynamic',
      x: 400,
      y: 340,
      content: '{course_name}',
      style: { fontSize: 28, color: '#f97316', fontWeight: 'black', textAlign: 'center', fontFamily: 'sans-serif' }
    },
    {
      id: 'description',
      type: 'text',
      x: 400,
      y: 400,
      content: '"A démontré une compréhension approfondie et validé l\'acquisition des compétences requises."',
      style: { fontSize: 13, color: '#475569', fontWeight: 'normal', textAlign: 'center', fontFamily: 'serif', width: 500 }
    },
    {
      id: 'date_label',
      type: 'text',
      x: 50,
      y: 500,
      content: 'DATE D\'OBTENTION',
      style: { fontSize: 10, color: '#64748b', fontWeight: 'black', textAlign: 'left', fontFamily: 'sans-serif' }
    },
    {
      id: 'date_icon',
      type: 'text',
      x: 50,
      y: 520,
      content: '✅',
      style: { fontSize: 14, color: '#10b981', fontWeight: 'normal', textAlign: 'left' }
    },
    {
      id: 'date',
      type: 'dynamic',
      x: 80,
      y: 520,
      content: '{date}',
      style: { fontSize: 14, color: '#0f172a', fontWeight: 'bold', textAlign: 'left', fontFamily: 'sans-serif' }
    }
  ]
};

export default function AdminCertificates() {
  const [template, setTemplate] = useState<CertTemplate>(DEFAULT_TEMPLATE);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [leftWidth, setLeftWidth] = useState(256);
  const [showLeft, setShowLeft] = useState(true);
  const [rightWidth, setRightWidth] = useState(288);
  const [showRight, setShowRight] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const availableW = width - 64; // padding
        const availableH = height - 64;
        const newScale = Math.min(1, Math.min(availableW / 800, availableH / 600));
        setScale(newScale > 0.1 ? newScale : 0.1);
      }
    });
    if (workspaceRef.current) {
      observer.observe(workspaceRef.current);
    }
    return () => observer.disconnect();
  }, [showLeft, showRight, leftWidth, rightWidth]);

  const handleDragLeft = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(200, Math.min(startWidth + (moveEvent.clientX - startX), 500));
      setLeftWidth(newWidth);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [leftWidth]);

  const handleDragRight = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(200, Math.min(startWidth - (moveEvent.clientX - startX), 500));
      setRightWidth(newWidth);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [rightWidth]);

  // Add Element
  const addElement = (type: ElementType) => {
    const newEl: CertElement = {
      id: Math.random().toString(36).substring(7),
      type,
      x: 50,
      y: 50,
      content: type === 'text' ? 'Nouveau texte' : type === 'dynamic' ? '{variable}' : 'https://placehold.co/100x100',
      style: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'normal',
        textAlign: 'left',
        width: type === 'image' ? 100 : undefined,
        height: type === 'image' ? 100 : undefined
      }
    };
    setTemplate({ ...template, elements: [...template.elements, newEl] });
    setSelectedElementId(newEl.id);
  };

  // Remove Element
  const removeElement = (id: string) => {
    setTemplate({ ...template, elements: template.elements.filter(e => e.id !== id) });
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // Update Element
  const updateElement = (id: string, updates: Partial<CertElement>) => {
    setTemplate({
      ...template,
      elements: template.elements.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  };

  const updateElementStyle = (id: string, styleUpdates: Partial<CertElement['style']>) => {
    setTemplate({
      ...template,
      elements: template.elements.map(e => e.id === id ? { ...e, style: { ...e.style, ...styleUpdates } } : e)
    });
  };

  // Drag & Drop Logic
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElementId(id);
    setIsDragging(true);

    const el = template.elements.find(el => el.id === id);
    if (el && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = 800 / rect.width; // 800 is canvas logical width
      const scaleY = 600 / rect.height; // 600 is canvas logical height
      
      dragOffset.current = {
        x: (e.clientX - rect.left) * scaleX - el.x,
        y: (e.clientY - rect.top) * scaleY - el.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElementId || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;

    const newX = (e.clientX - rect.left) * scaleX - dragOffset.current.x;
    const newY = (e.clientY - rect.top) * scaleY - dragOffset.current.y;

    updateElement(selectedElementId, { x: Math.round(newX), y: Math.round(newY) });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mock replace variables for preview
  const parseContent = (content: string) => {
    return content
      .replace('{student_name}', 'Jean Dupont')
      .replace('{course_name}', 'Python Avancé')
      .replace('{date}', new Date().toLocaleDateString('fr-FR'));
  };

  const selectedElement = template.elements.find(e => e.id === selectedElementId);

  return (
    <div className="flex h-[calc(100vh-140px)] animate-fade-in relative">
      
      {/* LEFT TOOLBAR */}
      {showLeft && (
        <div style={{ width: leftWidth }} className="shrink-0 flex flex-col gap-6 pr-4">
          <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Layout className="h-5 w-5 text-indigo-500" /> Outils</h3>
            <div className="space-y-2">
              <button onClick={() => addElement('text')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                <Type className="h-4 w-4" /> Texte libre
              </button>
              <button onClick={() => addElement('dynamic')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                <Stamp className="h-4 w-4" /> Variable (Nom, Date)
              </button>
              <button onClick={() => addElement('image')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                <ImageIcon className="h-4 w-4" /> Image / Logo
              </button>
            </div>
          </div>

          <div className="apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex-1 overflow-y-auto">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 text-indigo-500" /> Fond du certificat</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Couleur de fond</label>
                <input type="color" value={template.backgroundColor} onChange={e => setTemplate({...template, backgroundColor: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Image de fond (URL)</label>
                <input type="text" value={template.backgroundUrl || ''} onChange={e => setTemplate({...template, backgroundUrl: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEFT RESIZER */}
      {showLeft && (
        <div 
          onMouseDown={handleDragLeft}
          className="w-2 cursor-col-resize hover:bg-indigo-500/20 active:bg-indigo-500/40 rounded-full transition-colors flex items-center justify-center shrink-0 mr-4 group"
        >
          <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* CENTER CANVAS */}
      <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowLeft(!showLeft)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors" title="Toggle Left Panel">
              {showLeft ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </button>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white leading-tight">Éditeur Visuel</h2>
              <p className="text-xs text-slate-500">Glissez-déposez les éléments pour les positionner</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
              <Save className="h-4 w-4" /> Enregistrer le modèle
            </button>
            <button onClick={() => setShowRight(!showRight)} className="p-2 ml-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors" title="Toggle Right Panel">
              {showRight ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* The Workspace */}
        <div 
          ref={workspaceRef}
          className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-950"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Virtual Canvas (Fixed logical size: 800x600) scaled via CSS or aspect ratio */}
          <div 
            className="flex items-center justify-center"
            style={{ width: '800px', height: '600px', transform: `scale(${scale})`, transformOrigin: 'center center' }}
          >
            <div 
              ref={canvasRef}
              className="relative shadow-2xl overflow-hidden transition-all bg-white"
            style={{ 
              width: '800px', 
              height: '600px',
              backgroundColor: template.backgroundColor,
              backgroundImage: template.backgroundUrl ? `url(${template.backgroundUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={() => setSelectedElementId(null)}
          >
            {template.elements.map(el => (
              <div
                key={el.id}
                onMouseDown={(e) => handleMouseDown(e, el.id)}
                className={`absolute cursor-move select-none ${selectedElementId === el.id ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent outline-dashed outline-1 outline-indigo-300' : 'hover:outline-dashed hover:outline-1 hover:outline-slate-400'}`}
                style={{
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  color: el.style.color,
                  fontSize: `${el.style.fontSize}px`,
                  fontWeight: el.style.fontWeight,
                  fontFamily: el.style.fontFamily || 'inherit',
                  textAlign: el.style.textAlign,
                  width: el.style.width ? `${el.style.width}px` : 'auto',
                  height: el.style.height ? `${el.style.height}px` : 'auto',
                  whiteSpace: 'pre-wrap',
                  transform: el.style.textAlign === 'center' ? 'translateX(-50%)' : el.style.textAlign === 'right' ? 'translateX(-100%)' : 'none'
                }}
              >
                {el.type === 'image' ? (
                  <img src={el.content} alt="element" className="w-full h-full object-contain pointer-events-none" />
                ) : (
                  <span className="pointer-events-none leading-tight">{parseContent(el.content)}</span>
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT RESIZER */}
      {showRight && (
        <div 
          onMouseDown={handleDragRight}
          className="w-2 cursor-col-resize hover:bg-indigo-500/20 active:bg-indigo-500/40 rounded-full transition-colors flex items-center justify-center shrink-0 ml-4 group"
        >
          <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* RIGHT PROPERTIES */}
      {showRight && (
        <div style={{ width: rightWidth }} className="shrink-0 flex flex-col apple-glass dark:apple-glass-dark border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MousePointer2 className="h-4 w-4 text-indigo-500" /> Propriétés
          </h3>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {!selectedElement ? (
            <div className="text-center text-slate-400 text-sm mt-10">
              Sélectionnez un élément sur le certificat pour modifier ses propriétés.
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Contenu</label>
                {selectedElement.type === 'text' || selectedElement.type === 'dynamic' ? (
                  <textarea 
                    value={selectedElement.content} 
                    onChange={e => updateElement(selectedElement.id, { content: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm min-h-[80px]"
                  />
                ) : (
                  <input 
                    type="text"
                    value={selectedElement.content} 
                    onChange={e => updateElement(selectedElement.id, { content: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    placeholder="URL de l'image"
                  />
                )}
                {selectedElement.type === 'dynamic' && (
                  <p className="text-[10px] text-slate-500 mt-1">Variables : {'{student_name}'}, {'{course_name}'}, {'{date}'}</p>
                )}
              </div>

              {selectedElement.type !== 'image' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Taille (px)</label>
                    <input type="number" value={selectedElement.style.fontSize || 16} onChange={e => updateElementStyle(selectedElement.id, { fontSize: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Couleur</label>
                    <input type="color" value={selectedElement.style.color || '#000000'} onChange={e => updateElementStyle(selectedElement.id, { color: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Graisse</label>
                    <select value={selectedElement.style.fontWeight || 'normal'} onChange={e => updateElementStyle(selectedElement.id, { fontWeight: e.target.value as any })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
                      <option value="normal">Normal</option>
                      <option value="bold">Gras</option>
                      <option value="black">Très Gras (Black)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Police</label>
                    <select value={selectedElement.style.fontFamily || 'sans-serif'} onChange={e => updateElementStyle(selectedElement.id, { fontFamily: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Serif (Classique)</option>
                      <option value="monospace">Monospace</option>
                      <option value="cursive">Cursive (Signature)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Alignement (Ancrage)</label>
                    <select value={selectedElement.style.textAlign || 'left'} onChange={e => updateElementStyle(selectedElement.id, { textAlign: e.target.value as any })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
                      <option value="left">Gauche</option>
                      <option value="center">Centre</option>
                      <option value="right">Droite</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedElement.type === 'image' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Largeur (px)</label>
                    <input type="number" value={selectedElement.style.width || 100} onChange={e => updateElementStyle(selectedElement.id, { width: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Hauteur (px)</label>
                    <input type="number" value={selectedElement.style.height || 100} onChange={e => updateElementStyle(selectedElement.id, { height: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" />
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <button onClick={() => removeElement(selectedElement.id)} className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Trash2 className="h-4 w-4" /> Supprimer l'élément
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
