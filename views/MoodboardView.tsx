
import React, { useState, useRef } from 'react';
import { MoodboardItem, ViewState } from '../types';
import MoodboardCard from '../components/MoodboardItem';

interface MoodboardViewProps {
  setCurrentView: (view: ViewState) => void;
  moodboard: MoodboardItem[];
  setMoodboard: React.Dispatch<React.SetStateAction<MoodboardItem[]>>;
}

const MoodboardView: React.FC<MoodboardViewProps> = ({ setCurrentView, moodboard, setMoodboard }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newData, setNewData] = useState({ title: '', imageUrl: '', link: '', palette: [] as string[] });
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractPalette = (imgSrc: string): Promise<string[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imgSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve([]);
        
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);
        
        const pixels = ctx.getImageData(0, 0, 100, 100).data;
        const colors: string[] = [];
        
        // Muestrear 3 puntos diferentes (esquinas y centro para variedad)
        const samples = [
          (10 * 100 + 10) * 4,    // Top-left
          (50 * 100 + 50) * 4,    // Middle
          (80 * 100 + 80) * 4     // Bottom-right
        ];

        samples.forEach(index => {
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          colors.push(`rgb(${r}, ${g}, ${b})`);
        });

        resolve(colors);
      };
      img.onerror = () => resolve([]);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsExtracting(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const palette = await extractPalette(base64);
        setNewData({ ...newData, imageUrl: base64, title: newData.title || file.name, palette });
        setIsExtracting(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddIdea = () => {
    if (!newData.imageUrl.trim()) return;
    setMoodboard([{ id: crypto.randomUUID(), ...newData, timestamp: Date.now() }, ...moodboard]);
    setNewData({ title: '', imageUrl: '', link: '', palette: [] });
    setIsAdding(false);
  };

  return (
    <>
      <div className="animate-slideUp space-y-6 pb-20">
        <div className="flex justify-between items-center">
          <button onClick={() => setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-pink-500">← Menú Principal</button>
          <button onClick={() => setIsAdding(true)} className="bg-pink-500 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-lg shadow-pink-100/50 group flex items-center gap-2">
            <span className="group-hover:rotate-90 transition-transform">✨</span>
            Nueva Idea
          </button>
        </div>

        {/* Masonry Layout (Mejora #3) */}
        {moodboard.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {moodboard.map(item => <MoodboardCard key={item.id} item={item} onDelete={id => setMoodboard(moodboard.filter(i => i.id !== id))} />)}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <div className="text-4xl mb-4">🖼️</div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tu muro de inspiración está vacío</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl space-y-5 my-auto animate-slideUp">
            <h3 className="text-xl font-black text-pink-600 uppercase text-center">Capturar Inspiración</h3>
            
            <div className="space-y-4">
              <input type="text" placeholder="Título (opcional)" value={newData.title} onChange={e => setNewData({...newData, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-pink-100" />
              
              {/* Subida Directa (Mejora #1) */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${newData.imageUrl ? 'border-pink-200' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
              >
                {newData.imageUrl ? (
                  <>
                    <img src={newData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-black uppercase">Cambiar Imagen</div>
                  </>
                ) : (
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">📸</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Toca para subir una foto</span>
                  </div>
                )}
                {isExtracting && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

              <div className="relative">
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1 px-1">O pega una URL directa</p>
                <input type="text" placeholder="https://..." value={newData.imageUrl} onChange={async (e) => {
                  const url = e.target.value;
                  setNewData({...newData, imageUrl: url});
                  if (url.startsWith('http')) {
                    const p = await extractPalette(url);
                    setNewData(prev => ({...prev, imageUrl: url, palette: p}));
                  }
                }} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-[11px] outline-none" />
              </div>

              <input type="text" placeholder="Link original (opcional)" value={newData.link} onChange={e => setNewData({...newData, link: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-[11px] outline-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase hover:bg-gray-200 transition-colors">Cancelar</button>
              <button 
                onClick={handleAddIdea} 
                disabled={!newData.imageUrl}
                className={`flex-1 py-4 text-white rounded-2xl font-black text-[10px] uppercase transition-all shadow-xl ${newData.imageUrl ? 'bg-pink-500 shadow-pink-100 hover:bg-pink-600' : 'bg-gray-200'}`}
              >
                Añadir al Muro
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoodboardView;
