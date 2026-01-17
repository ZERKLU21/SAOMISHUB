
import React from 'react';
import { LibraryItem, LibraryCategory } from '../types';

interface Props {
  item: LibraryItem;
  viewMode?: 'grid' | 'list';
  onDelete: (id: string) => void;
}

const categoryIcons: Record<LibraryCategory, string> = {
  Video: '🎬',
  Documento: '📄',
  Libro: '📕',
  Web: '🌐',
  Tutorial: '💡'
};

const LibraryItemCard: React.FC<Props> = ({ item, viewMode = 'grid', onDelete }) => {
  const isFile = !!item.fileData;
  const isPdf = item.fileMime === 'application/pdf';
  const isDocx = item.fileMime?.includes('officedocument.wordprocessingml.document') || item.fileName?.endsWith('.docx');
  const isExcel = item.fileMime?.includes('officedocument.spreadsheetml.sheet') || item.fileName?.endsWith('.xlsx') || item.fileName?.endsWith('.xls');
  const isImage = item.fileMime?.startsWith('image/');
  const isList = viewMode === 'list';

  // Solo mostrar botón de acción si hay un archivo o una URL válida.
  // Las notas exportadas no suelen tener ninguno de los dos.
  const hasAction = isFile || (!!item.url && item.url.trim() !== '');

  const handleOpen = () => {
    if (isFile && item.fileData) {
      const link = document.createElement('a');
      link.href = item.fileData;
      link.download = item.fileName || 'archivo';
      link.click();
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isList) {
    return (
      <div className="bg-white p-4 rounded-3xl border-2 border-gray-50 shadow-sm hover:shadow-md transition-all group flex items-center gap-4 relative overflow-hidden">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner 
          ${isPdf ? 'bg-red-50 text-red-500' : 
            isDocx ? 'bg-blue-50 text-blue-500' : 
            isExcel ? 'bg-emerald-50 text-emerald-500' : 
            isImage ? 'bg-purple-50 text-purple-500' : 
            'bg-orange-50 text-orange-500'}`}>
          {isPdf ? '📕' : isDocx ? '📘' : isExcel ? '📊' : isImage ? '🖼️' : categoryIcons[item.category]}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight truncate pr-8" title={item.title}>
            {item.title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
              {isFile ? (isPdf ? 'PDF' : isDocx ? 'Word' : isExcel ? 'Excel' : isImage ? 'Imagen' : 'Archivo') : item.category}
            </span>
            {item.note && (
              <>
                <span className="text-gray-200 text-[8px]">•</span>
                <span className="text-[8px] text-gray-400 font-medium truncate max-w-[150px] italic">{item.note}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasAction && (
            <button 
              onClick={handleOpen}
              className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest text-white shadow-sm transition-transform active:scale-95
                ${isPdf ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 
                  isDocx ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 
                  isExcel ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' :
                  isImage ? 'bg-purple-500 hover:bg-purple-600 shadow-purple-100' :
                  'bg-gray-900 hover:bg-orange-500 shadow-gray-100'}`}
            >
              {isFile ? 'Abrir' : 'Visitar'}
            </button>
          )}
          
          <button 
            onClick={() => onDelete(item.id)}
            className="p-2 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full">
      <div className="flex items-start gap-4 mb-5 min-w-0">
        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner 
          ${isPdf ? 'bg-red-50 text-red-500' : 
            isDocx ? 'bg-blue-50 text-blue-500' : 
            isExcel ? 'bg-emerald-50 text-emerald-500' : 
            isImage ? 'bg-purple-50 text-purple-500' : 
            'bg-orange-50 text-orange-500'}`}>
          {isPdf ? '📕' : isDocx ? '📘' : isExcel ? '📊' : isImage ? '🖼️' : categoryIcons[item.category]}
        </div>
        
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight truncate w-full" title={item.title}>
            {item.title}
          </h4>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
            {isFile ? (
              isPdf ? 'Archivo PDF' : 
              isDocx ? 'Archivo Word' : 
              isExcel ? 'Excel / Hoja' : 
              isImage ? 'Imagen' : 'Archivo'
            ) : item.category}
          </span>
        </div>

        <button 
          onClick={() => onDelete(item.id)}
          className="flex-shrink-0 p-2 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {isImage && item.fileData && (
        <div className="mb-5 rounded-3xl overflow-hidden aspect-video border-2 border-gray-50 bg-gray-50">
          <img src={item.fileData} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}

      {item.note && (
        <p className={`text-[10px] text-gray-500 font-medium leading-relaxed mb-5 ${hasAction ? 'line-clamp-2' : 'line-clamp-none'}`}>
          {item.note}
        </p>
      )}

      {hasAction && (
        <div className="mt-auto">
          <button 
            onClick={handleOpen}
            className={`w-full py-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 text-white 
              ${isPdf ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 
                isDocx ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 
                isExcel ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' :
                isImage ? 'bg-purple-500 hover:bg-purple-600 shadow-purple-100' :
                'bg-gray-900 hover:bg-orange-500 shadow-gray-100'}`}
          >
            {isFile ? (isImage ? 'Ver / Descargar' : 'Descargar') : 'Abrir Enlace'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LibraryItemCard;
