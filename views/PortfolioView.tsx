
import React, { useState, useRef } from 'react';
import { Achievement, ViewState, AchievementCategory } from '../types';
import AchievementItem from '../components/AchievementItem';

interface PortfolioViewProps {
  setCurrentView: (view: ViewState) => void;
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ setCurrentView, achievements, setAchievements }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);
  const [newAchData, setNewAchData] = useState({ title: '', date: new Date().toISOString().split('T')[0], description: '', fileData: '', fileName: '', fileMime: '', category: 'Logro' as AchievementCategory });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewAchData({...newAchData, fileData: reader.result as string, fileName: file.name, fileMime: file.type});
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="animate-slideUp space-y-6 pb-20">
        <div className="flex justify-between items-center">
          <button onClick={() => setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-emerald-500">← Menú Principal</button>
          <button onClick={() => { setEditingAch(null); setIsAdding(true); }} className="bg-emerald-500 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-lg shadow-emerald-100">+ Nuevo Logro</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(a => <AchievementItem key={a.id} achievement={a} onDelete={id => setAchievements(achievements.filter(ach => ach.id !== id))} onEdit={ach => { setEditingAch(ach); setNewAchData({ title: ach.title, date: ach.date, description: ach.description, fileData: ach.fileData || '', fileName: ach.fileName || '', fileMime: ach.fileMime || '', category: ach.category }); setIsAdding(true); }} />)}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto pt-10">
          <div className="bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl space-y-6 my-auto">
            <h3 className="text-xl font-black text-emerald-600 uppercase text-center">Registrar Logro</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Título" value={newAchData.title} onChange={e => setNewAchData({...newAchData, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold" />
              <div className="grid grid-cols-2 gap-3">
                <select value={newAchData.category} onChange={e => setNewAchData({...newAchData, category: e.target.value as any})} className="p-4 bg-gray-50 rounded-2xl font-bold text-xs">
                  <option value="Logro">Logro</option><option value="Certificación">Certificación</option><option value="Proyecto">Proyecto</option><option value="Habilidad">Habilidad</option>
                </select>
                <input type="date" value={newAchData.date} onChange={e => setNewAchData({...newAchData, date: e.target.value})} className="p-4 bg-gray-50 rounded-2xl font-bold text-xs" />
              </div>
              <textarea placeholder="Descripción..." value={newAchData.description} onChange={e => setNewAchData({...newAchData, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl h-24 text-sm" />
              <div onClick={() => fileRef.current?.click()} className="w-full p-6 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 text-gray-400">
                <span className="text-3xl">{newAchData.fileData ? '✅' : '📁'}</span>
                <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-full px-4">{newAchData.fileName || 'Subir evidencia'}</span>
              </div>
              <input type="file" ref={fileRef} className="hidden" onChange={handleFileUpload} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
              <button onClick={() => { if(!newAchData.title.trim()) return; if(editingAch) setAchievements(achievements.map(a => a.id === editingAch.id ? { ...a, ...newAchData } : a)); else setAchievements([{ id: crypto.randomUUID(), ...newAchData, timestamp: Date.now() }, ...achievements]); setIsAdding(false); }} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioView;
