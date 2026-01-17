
import React, { useState, useMemo } from 'react';
import { Note, ViewState, LibraryItem, LibraryFolder } from '../types';
import NoteItem from '../components/NoteItem';

interface NotesViewProps {
  setCurrentView: (view: ViewState) => void;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  library: LibraryItem[];
  setLibrary: React.Dispatch<React.SetStateAction<LibraryItem[]>>;
  folders: LibraryFolder[];
}

const COLORS = ['#fff9db', '#e3faf2', '#e7f5ff', '#f3f0ff', '#fff0f6', '#fff5f5', '#f8f9fa'];

const NotesView: React.FC<NotesViewProps> = ({ setCurrentView, notes, setNotes, library, setLibrary, folders }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '', color: COLORS[0] });
  
  // Para la exportación a biblioteca
  const [exportingNote, setExportingNote] = useState<Note | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => b.timestamp - a.timestamp);
  }, [notes, searchQuery]);

  const handleExportToLibrary = () => {
    if (!exportingNote) return;

    const newLibraryItem: LibraryItem = {
      id: crypto.randomUUID(),
      folderId: selectedFolderId,
      title: exportingNote.title || 'Nota Exportada',
      note: exportingNote.content,
      category: 'Documento',
      timestamp: Date.now()
    };

    setLibrary([newLibraryItem, ...library]);
    setExportingNote(null);
    setSelectedFolderId(null);
    
    // Feedback visual (opcional)
    alert("¡Nota guardada en tu biblioteca!");
  };

  return (
    <>
      <div className="animate-slideUp space-y-6 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button onClick={() => setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-purple-500 transition-colors">← Volver al Menú Principal</button>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input 
                type="text" 
                placeholder="Buscar en apuntes..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-gray-50 pl-10 pr-4 py-2.5 rounded-full text-[11px] font-bold outline-none focus:border-purple-100 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
            </div>
            <button onClick={() => { setEditingNote(null); setNewNote({ title: '', content: '', color: COLORS[0] }); setIsAdding(true); }} className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase shadow-lg shadow-purple-100/50 flex-shrink-0 active:scale-95 transition-transform">
              + Nueva Nota
            </button>
          </div>
        </div>

        {filteredNotes.length > 0 ? (
          <div className="columns-2 md:columns-3 gap-6 space-y-6">
            {filteredNotes.map(n => (
              <NoteItem 
                key={n.id} 
                note={n} 
                onDelete={id => setNotes(notes.filter(not => not.id !== id))} 
                onEdit={note => { setEditingNote(note); setNewNote({ ...note }); setIsAdding(true); }}
                onExport={note => setExportingNote(note)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
             <div className="w-32 h-32 opacity-40 mb-6 grayscale hover:grayscale-0 transition-all duration-700">
               <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M30 80 Q50 60 70 80 Q70 95 50 95 Q30 95 30 80" fill="#f3f4f6" stroke="#e5e7eb" />
                  <circle cx="50" cy="40" r="18" fill="#f3f4f6" stroke="#e5e7eb" />
                  <path d="M48 46 Q50 48 52 46" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
                  <circle cx="43" cy="38" r="2" fill="#9ca3af" />
                  <circle cx="57" cy="38" r="2" fill="#9ca3af" />
                  <rect x="70" y="20" width="15" height="20" rx="2" fill="#6366f1" opacity="0.4" />
                  <line x1="72" y1="24" x2="83" y2="24" stroke="white" strokeWidth="1" />
                  <line x1="72" y1="28" x2="83" y2="28" stroke="white" strokeWidth="1" />
               </svg>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
               {searchQuery ? 'No se encontraron notas con ese nombre' : 'El Michi Escritor está esperando tus apuntes'}
             </p>
          </div>
        )}
      </div>

      {/* Modal Añadir/Editar Nota */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl space-y-6 my-auto animate-slideUp">
            <h3 className="text-xl font-black text-purple-600 uppercase text-center">{editingNote ? 'Editar Apunte' : 'Nuevo Apunte'}</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Título del tema..." 
                value={newNote.title} 
                onChange={e => setNewNote({...newNote, title: e.target.value})} 
                className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none border-2 border-transparent focus:border-purple-100 transition-all" 
              />
              <textarea 
                placeholder="Escribe tus ideas aquí..." 
                value={newNote.content} 
                onChange={e => setNewNote({...newNote, content: e.target.value})} 
                className="w-full p-6 bg-gray-50 rounded-[2rem] h-64 text-[13px] font-medium leading-relaxed outline-none border-2 border-transparent focus:border-purple-100 transition-all resize-none" 
              />
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Color de la nota</p>
                <div className="flex flex-wrap gap-2.5">
                  {COLORS.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setNewNote({...newNote, color: c})} 
                      className={`w-9 h-9 rounded-full border-4 transition-all ${newNote.color === c ? 'border-gray-900 scale-110 shadow-lg' : 'border-white hover:scale-105'}`} 
                      style={{ backgroundColor: c }} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase hover:bg-gray-200 transition-colors">Cancelar</button>
              <button 
                onClick={() => { 
                  if(!newNote.content.trim()) return; 
                  if(editingNote) setNotes(notes.map(n => n.id === editingNote.id ? { ...n, ...newNote } : n)); 
                  else setNotes([{ id: crypto.randomUUID(), ...newNote, timestamp: Date.now() }, ...notes]); 
                  setIsAdding(false); 
                }} 
                className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-purple-100 active:scale-95 transition-transform"
              >
                Guardar Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Exportar a Biblioteca */}
      {exportingNote && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-purple-900/40 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-sm p-8 rounded-[3.5rem] shadow-2xl space-y-6 animate-slideUp border-4 border-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
                📚
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Exportar a Biblioteca</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">¿En qué carpeta guardamos esta nota?</p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
              <button 
                onClick={() => setSelectedFolderId(null)}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 border-2 transition-all ${selectedFolderId === null ? 'border-purple-500 bg-purple-50' : 'border-gray-50 bg-gray-50 hover:border-purple-200'}`}
              >
                <span className="text-xl">📥</span>
                <span className="text-[10px] font-black uppercase text-gray-700">Sin carpeta (Raíz)</span>
              </button>
              
              {folders.map(folder => (
                <button 
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 border-2 transition-all ${selectedFolderId === folder.id ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-50 bg-gray-50 hover:border-purple-200'}`}
                >
                  <span className="text-xl">{folder.icon || '📂'}</span>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-gray-700">{folder.name}</p>
                    {folder.description && <p className="text-[8px] text-gray-400 truncate max-w-[150px]">{folder.description}</p>}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => { setExportingNote(null); setSelectedFolderId(null); }} 
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase"
              >
                Cancelar
              </button>
              <button 
                onClick={handleExportToLibrary}
                className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-purple-100 active:scale-95 transition-transform"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotesView;
