
import React, { useState, useRef } from 'react';
import { LibraryItem, LibraryFolder, ViewState, LibraryCategory } from '../types';
import LibraryItemCard from '../components/LibraryItem';
import FolderItem from '../components/FolderItem';

interface LibraryViewProps {
  setCurrentView: (view: ViewState) => void;
  library: LibraryItem[];
  setLibrary: React.Dispatch<React.SetStateAction<LibraryItem[]>>;
  folders: LibraryFolder[];
  setFolders: React.Dispatch<React.SetStateAction<LibraryFolder[]>>;
}

const FOLDER_COLORS = ['#ffedd5', '#e0f2fe', '#f0fdf4', '#fdf2f8', '#f5f3ff', '#fff7ed'];
const FOLDER_ICONS = ['📂', '🎨', '📝', '🧪', '💻', '📐', '📚', '🎬', '💡', '🏆', '🎵', '🏥'];

const LibraryView: React.FC<LibraryViewProps> = ({ setCurrentView, library, setLibrary, folders, setFolders }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [editingFolder, setEditingFolder] = useState<LibraryFolder | null>(null);
  const [newFolderData, setNewFolderData] = useState({ 
    name: '', 
    description: '', 
    color: FOLDER_COLORS[0], 
    icon: FOLDER_ICONS[0] 
  });

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemData, setNewItemData] = useState({ title: '', url: '', category: 'Web' as LibraryCategory, note: '', fileData: '', fileName: '', fileMime: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemData({
          ...newItemData,
          fileData: reader.result as string,
          fileName: file.name,
          fileMime: file.type,
          title: newItemData.title || file.name,
          category: file.type.includes('video') ? 'Video' : file.type.includes('pdf') ? 'Documento' : 'Web'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditFolder = (folder: LibraryFolder) => {
    setEditingFolder(folder);
    setNewFolderData({
      name: folder.name,
      description: folder.description || '',
      color: folder.color || FOLDER_COLORS[0],
      icon: folder.icon || FOLDER_ICONS[0]
    });
    setIsAddingFolder(true);
  };

  const handleSaveFolder = () => {
    if (!newFolderData.name.trim()) return;

    if (editingFolder) {
      setFolders(folders.map(f => 
        f.id === editingFolder.id ? { ...f, ...newFolderData } : f
      ));
    } else {
      setFolders([{ 
        id: crypto.randomUUID(), 
        ...newFolderData, 
        timestamp: Date.now() 
      }, ...folders]);
    }
    
    setIsAddingFolder(false);
    setEditingFolder(null);
    setNewFolderData({ name: '', description: '', color: FOLDER_COLORS[0], icon: FOLDER_ICONS[0] });
  };

  return (
    <>
      <div className="animate-slideUp space-y-6 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button onClick={() => currentFolderId ? setCurrentFolderId(null) : setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-500">
            {currentFolderId ? '← Volver a Carpetas' : '← Menú Principal'}
          </button>
          <div className="flex gap-2">
            {!currentFolderId && <button onClick={() => { setEditingFolder(null); setIsAddingFolder(true); }} className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full font-black text-[10px] uppercase">Nueva Carpeta</button>}
            <button onClick={() => setIsAddingItem(true)} className="bg-orange-500 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-lg shadow-orange-100">Nuevo Recurso</button>
          </div>
        </div>

        <div className={viewMode === 'list' && currentFolderId ? "flex flex-col gap-3" : "grid grid-cols-2 md:grid-cols-3 gap-6"}>
          {!currentFolderId ? (
            folders.map(f => (
              <FolderItem 
                key={f.id} 
                folder={f} 
                onClick={id => { setCurrentFolderId(id); setViewMode('grid'); }} 
                onEdit={openEditFolder}
                onDelete={id => setFolders(folders.filter(folder => folder.id !== id))} 
              />
            ))
          ) : (
            library.filter(i => i.folderId === currentFolderId).map(i => (
              <LibraryItemCard key={i.id} item={i} viewMode={viewMode} onDelete={id => setLibrary(library.filter(item => item.id !== id))} />
            ))
          )}
        </div>
      </div>

      {isAddingFolder && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl space-y-6 my-auto">
            <h3 className="text-xl font-black text-orange-600 uppercase text-center">{editingFolder ? 'Editar Carpeta' : 'Nueva Carpeta'}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div 
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-inner border-2 border-white"
                  style={{ backgroundColor: newFolderData.color }}
                >
                  {newFolderData.icon}
                </div>
              </div>

              <input 
                type="text" 
                placeholder="Nombre de la materia/carpeta" 
                value={newFolderData.name} 
                onChange={e => setNewFolderData({...newFolderData, name: e.target.value})} 
                className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-200 transition-colors" 
              />

              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Elegir Color</p>
                <div className="flex justify-between gap-2">
                  {FOLDER_COLORS.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setNewFolderData({...newFolderData, color: c})}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${newFolderData.color === c ? 'border-orange-500 scale-110 shadow-lg' : 'border-white'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Elegir Icono</p>
                <div className="grid grid-cols-6 gap-2">
                  {FOLDER_ICONS.map(i => (
                    <button 
                      key={i} 
                      onClick={() => setNewFolderData({...newFolderData, icon: i})}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all border-2 ${newFolderData.icon === i ? 'bg-orange-50 border-orange-200 scale-110' : 'bg-gray-50 border-transparent'}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <textarea 
                placeholder="Descripción corta..." 
                value={newFolderData.description} 
                onChange={e => setNewFolderData({...newFolderData, description: e.target.value})} 
                className="w-full p-4 bg-gray-50 rounded-2xl h-24 text-sm outline-none border-2 border-transparent focus:border-orange-200 transition-colors" 
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setIsAddingFolder(false); setEditingFolder(null); }} 
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveFolder} 
                className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-orange-100 hover:bg-orange-600 transition-colors"
              >
                {editingFolder ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddingItem && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl space-y-4 my-auto">
            <h3 className="text-xl font-black text-orange-600 uppercase text-center">Nuevo Recurso</h3>
            <input type="text" placeholder="Título" value={newItemData.title} onChange={e => setNewItemData({...newItemData, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <select value={newItemData.category} onChange={e => setNewItemData({...newItemData, category: e.target.value as any})} className="p-4 bg-gray-50 rounded-2xl font-bold text-xs outline-none">
                <option value="Web">Web</option><option value="Documento">Documento</option><option value="Video">Video</option><option value="Libro">Libro</option>
              </select>
              <button onClick={() => fileRef.current?.click()} className="p-4 bg-orange-50 text-orange-600 rounded-2xl font-black text-[10px] uppercase border-2 border-dashed border-orange-100 truncate">
                {newItemData.fileName ? 'Cambiado' : 'Subir'}
              </button>
              <input type="file" ref={fileRef} className="hidden" onChange={handleFileUpload} />
            </div>
            <textarea placeholder="Nota..." value={newItemData.note} onChange={e => setNewItemData({...newItemData, note: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl h-20 text-sm outline-none" />
            <div className="flex gap-3">
              <button onClick={() => setIsAddingItem(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase">Cerrar</button>
              <button onClick={() => { if(!newItemData.title.trim()) return; setLibrary([{ id: crypto.randomUUID(), ...newItemData, folderId: currentFolderId, timestamp: Date.now() }, ...library]); setIsAddingItem(false); }} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LibraryView;
