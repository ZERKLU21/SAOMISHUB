
import React from 'react';
import { MoodboardItem } from '../types';

interface Props {
  item: MoodboardItem;
  onDelete: (id: string) => void;
}

const MoodboardCard: React.FC<Props> = ({ item, onDelete }) => {
  return (
    <div className="break-inside-avoid mb-4 bg-white rounded-[2rem] border-2 border-gray-50 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative">
      <div className="w-full overflow-hidden bg-gray-50">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x400/f3f4f6/94a3b8?text=Imagen+no+valida";
          }}
        />
      </div>
      <div className="p-4">
        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate">{item.title}</h4>
        
        {/* Paleta de Colores (Mejora #4) */}
        {item.palette && item.palette.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {item.palette.map((color, idx) => (
              <div 
                key={idx} 
                className="w-4 h-4 rounded-full border border-white shadow-sm" 
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        {item.link && (
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[8px] font-bold text-indigo-500 uppercase tracking-tighter mt-2 block truncate hover:underline"
          >
            Ver enlace original
          </a>
        )}
      </div>
      <button 
        onClick={() => onDelete(item.id)}
        className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border-2 border-gray-50 opacity-0 group-hover:opacity-100 transition-all text-red-500 hover:bg-red-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default MoodboardCard;
