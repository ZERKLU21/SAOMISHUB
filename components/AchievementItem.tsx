
import React from 'react';
import { Achievement, AchievementCategory } from '../types';

interface AchievementItemProps {
  achievement: Achievement;
  onDelete: (id: string) => void;
  onEdit: (achievement: Achievement) => void;
}

const categoryStyles: Record<AchievementCategory, string> = {
  'Proyecto': 'bg-blue-50 text-blue-600 border-blue-100',
  'Habilidad': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Logro': 'bg-amber-50 text-amber-600 border-amber-100',
  'Práctica': 'bg-purple-50 text-purple-600 border-purple-100',
  'Certificación': 'bg-rose-50 text-rose-600 border-rose-100'
};

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, onDelete, onEdit }) => {
  const isImage = achievement.fileMime?.startsWith('image/');
  const isPdf = achievement.fileMime === 'application/pdf';

  const handleDownload = () => {
    if (achievement.fileData) {
      const link = document.createElement('a');
      link.href = achievement.fileData;
      link.download = achievement.fileName || 'evidencia';
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full overflow-hidden">
      {/* Media Preview (Mejora #1) */}
      <div className="relative aspect-video w-full bg-gray-50 overflow-hidden border-b-2 border-gray-50 flex items-center justify-center">
        {isImage && achievement.fileData ? (
          <img src={achievement.fileData} alt={achievement.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : isPdf ? (
          <div className="flex flex-col items-center gap-3 text-red-400 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-4xl">📕</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Vista previa PDF</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-emerald-200 group-hover:text-emerald-300 transition-colors">
            <span className="text-4xl">✨</span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">{achievement.category}</span>
          </div>
        )}
        
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
          <button onClick={() => onEdit(achievement)} className="p-3 bg-white rounded-2xl text-indigo-600 hover:scale-110 transition-transform shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button onClick={() => onDelete(achievement.id)} className="p-3 bg-white rounded-2xl text-red-500 hover:scale-110 transition-transform shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${categoryStyles[achievement.category]}`}>
            {achievement.category}
          </span>
          <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{achievement.date}</span>
        </div>
        
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2 line-clamp-1">{achievement.title}</h3>
        <p className="text-[11px] text-gray-500 leading-relaxed mb-6 flex-1 line-clamp-3 font-medium">{achievement.description || 'Sin descripción adicional.'}</p>
        
        {achievement.fileData && (
          <button 
            onClick={handleDownload}
            className={`w-full flex items-center justify-between py-3 px-5 rounded-2xl transition-all active:scale-95 border-2 ${isPdf ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}
          >
            <div className="flex items-center gap-3 truncate">
              <span className="text-lg">{isPdf ? '📕' : '📎'}</span>
              <span className="text-[9px] font-black uppercase tracking-widest truncate">{achievement.fileName}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AchievementItem;
