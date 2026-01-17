
import React from 'react';
import { LibraryFolder } from '../types';

interface FolderItemProps {
  folder: LibraryFolder;
  onDelete: (id: string) => void;
  onEdit: (folder: LibraryFolder) => void;
  onClick: (id: string) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onDelete, onEdit, onClick }) => {
  const folderIcon = folder.icon || '📂';
  const folderColor = folder.color || '#ffedd5'; // Naranja por defecto

  return (
    <div className="group relative bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden h-full flex flex-col">
      {/* Fondo decorativo sutil basado en el color de la carpeta */}
      <div 
        className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 pointer-events-none"
        style={{ backgroundColor: folderColor }}
      ></div>
      
      <div className="relative z-10 flex-1" onClick={() => onClick(folder.id)}>
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: folderColor + '40' }} // 40 is opacity in hex
        >
          {folderIcon}
        </div>
        
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight truncate mb-1">
          {folder.name}
        </h3>
        
        {folder.description ? (
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight line-clamp-2 opacity-60">
            {folder.description}
          </p>
        ) : (
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tight italic">
            Sin descripción
          </p>
        )}
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(folder);
          }}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 text-gray-300 hover:text-indigo-600 hover:border-indigo-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
          title="Editar carpeta"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(folder.id);
          }}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
          title="Eliminar carpeta"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FolderItem;
