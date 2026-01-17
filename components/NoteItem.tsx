
import React, { useState } from 'react';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onExport: (note: Note) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete, onEdit, onExport }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div 
      className={`break-inside-avoid w-full p-6 rounded-[2.5rem] border-2 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col group relative overflow-hidden`}
      style={{ 
        backgroundColor: note.color,
        borderColor: 'rgba(0,0,0,0.03)'
      }}
    >
      {/* Indicador de degradado sutil en el borde superior */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-black/5 via-transparent to-black/5"></div>

      {/* Overlay de Confirmación */}
      {showConfirm && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>
          <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">¿Borrar este apunte?</p>
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => onDelete(note.id)}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl text-[9px] font-black uppercase shadow-lg shadow-red-100 active:scale-95 transition-transform"
            >
              Sí
            </button>
            <button 
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl text-[9px] font-black uppercase active:scale-95 transition-transform"
            >
              No
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-tight leading-tight pr-8">{note.title || 'Apunte sin título'}</h3>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all absolute top-0 right-0">
          <button 
            onClick={() => onExport(note)}
            className="p-2 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white transition-colors border border-black/5 shadow-sm"
            title="Exportar a Biblioteca"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </button>
          <button 
            onClick={() => onEdit(note)}
            className="p-2 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white transition-colors border border-black/5 shadow-sm"
            title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={() => setShowConfirm(true)}
            className="p-2 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white transition-colors border border-black/5 shadow-sm"
            title="Eliminar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-[12px] text-gray-700 leading-relaxed font-medium whitespace-pre-wrap relative z-10 mb-4">
        {note.content}
      </p>

      <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between relative z-10">
        <span className="text-[8px] font-black text-black/30 uppercase tracking-[0.2em]">
          {new Date(note.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
        </span>
        <div className="flex gap-1">
           <div className="w-1.5 h-1.5 bg-black/5 rounded-full"></div>
           <div className="w-1.5 h-1.5 bg-black/5 rounded-full"></div>
           <div className="w-1.5 h-1.5 bg-black/5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
