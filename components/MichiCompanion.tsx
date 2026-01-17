
import React, { useState, useEffect, useMemo } from 'react';
import { Task, MichiStats } from '../types';

interface MichiCompanionProps {
  tasks: Task[];
  nickname: string;
  michi: MichiStats;
  onUpdateMichi: (stats: MichiStats) => void;
}

interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  type: 'accessory' | 'food';
  boost?: { energy?: number; happiness?: number };
}

const SHOP_ITEMS: ShopItem[] = [
  // Accesorios
  { id: 'grad-hat', name: 'Birrete', price: 20, icon: '🎓', type: 'accessory' },
  { id: 'shades', name: 'Lentes Pro', price: 15, icon: '🕶️', type: 'accessory' },
  { id: 'headphones', name: 'Audífonos', price: 25, icon: '🎧', type: 'accessory' },
  { id: 'scarf', name: 'Bufanda', price: 10, icon: '🧣', type: 'accessory' },
  { id: 'crown', name: 'Corona', price: 80, icon: '👑', type: 'accessory' },
  { id: 'ribbon', name: 'Moño', price: 12, icon: '🎀', type: 'accessory' },
  { id: 'halo', name: 'Aura', price: 50, icon: '✨', type: 'accessory' },
  { id: 'tie', name: 'Corbata', price: 18, icon: '👔', type: 'accessory' },
  // Comida
  { id: 'pizza', name: 'Pizza', price: 5, icon: '🍕', type: 'food', boost: { energy: 20 } },
  { id: 'sushi', name: 'Sushi', price: 8, icon: '🍣', type: 'food', boost: { happiness: 15, energy: 5 } },
  { id: 'milk', name: 'Leche', price: 3, icon: '🥛', type: 'food', boost: { energy: 10, happiness: 5 } },
];

const MichiCompanion: React.FC<MichiCompanionProps> = ({ tasks, nickname, michi, onUpdateMichi }) => {
  const [showBubble, setShowBubble] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [activeTab, setActiveTab] = useState<'boutique' | 'snacks'>('boutique');
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [michiState, setMichiState] = useState<'idle' | 'happy' | 'studying' | 'sleeping' | 'sad'>('idle');

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  useEffect(() => {
    if (michi.energy < 15) {
      setMichiState('sleeping');
    } else if (michi.happiness < 25) {
      setMichiState('sad');
    } else if (stats.completed > 0 && stats.pending === 0 && stats.total > 0) {
      setMichiState('happy');
    } else if (stats.pending > 0) {
      setMichiState('studying');
    } else {
      setMichiState('idle');
    }
  }, [stats, michi]);

  const handleInteract = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newHeart = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setHearts([...hearts, newHeart]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1000);

    onUpdateMichi({
      ...michi,
      happiness: Math.min(michi.happiness + 2, 100),
      energy: Math.min(michi.energy + 0.2, 100)
    });

    setShowPersonalization(true);
  };

  const handleAction = (item: ShopItem) => {
    if (item.type === 'food') {
      if (michi.pescaditos >= item.price) {
        onUpdateMichi({
          ...michi,
          pescaditos: michi.pescaditos - item.price,
          energy: Math.min(michi.energy + (item.boost?.energy || 0), 100),
          happiness: Math.min(michi.happiness + (item.boost?.happiness || 0), 100)
        });
      }
    } else {
      if (michi.pescaditos >= item.price && !michi.unlockedAccessories.includes(item.id)) {
        onUpdateMichi({
          ...michi,
          pescaditos: michi.pescaditos - item.price,
          unlockedAccessories: [...michi.unlockedAccessories, item.id],
          activeAccessory: item.id
        });
      } else if (michi.unlockedAccessories.includes(item.id)) {
        onUpdateMichi({
          ...michi,
          activeAccessory: michi.activeAccessory === item.id ? null : item.id
        });
      }
    }
  };

  const getMessage = () => {
    const mName = michi.name || 'Michi';
    if (michiState === 'sleeping') return `Zzz... ${mName} está agotado. Necesito un snack o dormir. 🌙`;
    if (michiState === 'sad') return `Me siento solito... ¿Jugamos un rato? 😿`;
    if (michiState === 'happy') return `¡Miau! ¡Todo completado! ¡Eres genial, ${nickname}! 🌟`;
    if (michiState === 'studying') return `¡Concentración! Solo ${stats.pending} tareas más. ✍️`;
    return `¡Hola ${nickname}! Soy ${mName}. ¿En qué trabajamos hoy? 🐾`;
  };

  // El Michi SVG Renderizado (Reutilizable para Preview y Floating)
  const renderMichiSVG = (isSmall = false) => (
    <svg viewBox="0 0 120 120" className={`w-full h-full transition-all duration-700 ${michiState === 'sleeping' ? 'rotate-12 translate-y-2' : ''}`}>
      <ellipse cx="60" cy="100" rx="35" ry="5" fill="rgba(0,0,0,0.08)" />
      
      {/* Cuerpo */}
      <path 
        d={michiState === 'sleeping' ? "M40 90 Q60 70 80 90 Q80 105 60 105 Q40 105 40 90" : "M45 95 Q45 55 60 55 Q75 55 75 95 Q75 102 60 102 Q45 102 45 95"} 
        fill="#FFFFFF" 
        stroke="#F3F4F6" 
        strokeWidth="1.5"
      />
      
      {/* Patas */}
      {michiState !== 'sleeping' && (
        <>
          <rect x="52" y="90" width="6" height="12" rx="3" fill="#FFFFFF" stroke="#F3F4F6" strokeWidth="1" />
          <rect x="62" y="90" width="6" height="12" rx="3" fill="#FFFFFF" stroke="#F3F4F6" strokeWidth="1" />
        </>
      )}

      {/* Cabeza */}
      <g transform={michiState === 'sleeping' ? "translate(10, 5) rotate(-10, 60, 60)" : "translate(0, 0)"}>
        {/* Orejas */}
        <path d="M45 45 L53 28 L60 45 Z" fill="#1F2937" />
        <path d="M75 45 L67 28 L60 45 Z" fill="#1F2937" />
        <path d="M48 43 L52 34 L56 43 Z" fill="#FEE2E2" />
        <path d="M72 43 L68 34 L64 43 Z" fill="#FEE2E2" />
        
        {/* Cara */}
        <circle cx="60" cy="50" r="18" fill="#FFFFFF" />
        <path d="M42 50 Q45 35 60 35 Q75 35 78 50 L75 55 Q60 45 45 55 Z" fill="#1F2937" />

        {/* Ojos */}
        {michiState === 'sleeping' ? (
          <>
            <path d="M52 52 Q55 54 58 52" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M62 52 Q65 54 68 52" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="53" cy="48" r="3" fill="#000000" />
            <circle cx="67" cy="48" r="3" fill="#000000" />
            <circle cx="54" cy="47" r="1" fill="#FFFFFF" opacity="0.8" />
            <circle cx="68" cy="47" r="1" fill="#FFFFFF" opacity="0.8" />
          </>
        )}

        {/* Hocico */}
        <path d={michiState === 'sad' ? "M57 58 Q60 56 63 58" : "M58 56 Q60 58 62 56"} fill="none" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="60" cy="54" r="1.5" fill="#F9A8D4" />

        {/* ACCESORIOS DE CABEZA */}
        {michi.activeAccessory === 'grad-hat' && (
          <g transform="translate(40, 5) scale(0.8)">
            <rect x="0" y="20" width="40" height="5" fill="#1F2937" />
            <path d="M0 22 L20 12 L40 22 L20 32 Z" fill="#1F2937" />
            <line x1="40" y1="22" x2="40" y2="35" stroke="#FBBF24" strokeWidth="2" />
          </g>
        )}
        {michi.activeAccessory === 'shades' && (
          <g transform="translate(45, 44) scale(0.8)">
            <rect x="0" y="0" width="12" height="8" rx="2" fill="#000000" />
            <rect x="18" y="0" width="12" height="8" rx="2" fill="#000000" />
            <line x1="12" y1="4" x2="18" y2="4" stroke="#000000" strokeWidth="2" />
          </g>
        )}
        {michi.activeAccessory === 'headphones' && (
          <g transform="translate(38, 35)">
            <path d="M0 15 A22 22 0 0 1 44 15" fill="none" stroke="#6366F1" strokeWidth="4" />
            <rect x="-4" y="12" width="10" height="12" rx="3" fill="#4F46E5" />
            <rect x="38" y="12" width="10" height="12" rx="3" fill="#4F46E5" />
          </g>
        )}
        {michi.activeAccessory === 'crown' && (
          <path d="M50 25 L54 18 L60 25 L66 18 L70 25 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" transform="translate(0, 5)" />
        )}
        {michi.activeAccessory === 'ribbon' && (
          <path d="M45 30 Q40 25 35 30 L35 35 Q40 40 45 35 Z M50 32.5 L45 32.5 L45 32.5 Z M45 35 Q50 40 55 35 L55 30 Q50 25 45 30 Z" fill="#F472B6" />
        )}
      </g>

      {/* ACCESORIOS DE CUELLO / CUERPO */}
      {michi.activeAccessory === 'scarf' && (
        <path d="M45 60 Q60 70 75 60 L72 80 Q60 90 48 80 Z" fill="#EF4444" />
      )}
      {michi.activeAccessory === 'tie' && (
        <path d="M56 58 L64 58 L62 75 L60 78 L58 75 Z" fill="#3B82F6" />
      )}

      {/* Cola */}
      <path 
        d="M75 90 Q95 85 92 65" 
        fill="none" 
        stroke="#1F2937" 
        strokeWidth="5" 
        strokeLinecap="round" 
        className="origin-bottom-left"
        style={{ animation: 'tailWag 3s ease-in-out infinite' }}
      />

      {/* Estado Estudiando */}
      {michiState === 'studying' && (
        <g transform="translate(75, 65) scale(0.6)">
          <rect width="35" height="25" rx="6" fill="#1F2937" />
          <rect x="3" y="3" width="29" height="19" rx="3" fill="#6366F1" />
          <line x1="17.5" y1="22" x2="17.5" y2="28" stroke="#1F2937" strokeWidth="2" />
        </g>
      )}
    </svg>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
      
      {/* Panel de Personalización Expandido */}
      {showPersonalization && (
        <div className="fixed inset-0 z-[110] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-2xl overflow-hidden border-4 border-white flex flex-col max-h-[90vh] animate-slideUp">
            
            {/* Cabecera con Preview */}
            <div className="bg-indigo-600 p-6 text-white relative flex-shrink-0">
              <button 
                onClick={() => setShowPersonalization(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 bg-white/10 rounded-[2rem] p-2 shadow-inner flex-shrink-0">
                  {renderMichiSVG()}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Nombre del Compañero</p>
                  <input 
                    type="text" 
                    value={michi.name}
                    onChange={(e) => onUpdateMichi({ ...michi, name: e.target.value })}
                    className="bg-transparent border-b-2 border-white/30 w-full text-xl font-black outline-none focus:border-white transition-colors py-1"
                  />
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-400 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">
                      🐟 {michi.pescaditos} Pescaditos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs de Selección */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => setActiveTab('boutique')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'boutique' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                👕 Michi Boutique
              </button>
              <button 
                onClick={() => setActiveTab('snacks')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'snacks' ? 'text-orange-500 border-b-2 border-orange-500 bg-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                🍕 Michi Snacks
              </button>
            </div>

            {/* Contenido Scrolleable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {/* Stats Rápidos */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[8px] font-black text-pink-400 uppercase tracking-widest">Felicidad</p>
                    <span className="text-[8px] font-black text-pink-400">{Math.round(michi.happiness)}%</span>
                  </div>
                  <div className="h-1.5 bg-pink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-400 transition-all duration-700" style={{ width: `${michi.happiness}%` }}></div>
                  </div>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Energía</p>
                    <span className="text-[8px] font-black text-indigo-400">{Math.round(michi.energy)}%</span>
                  </div>
                  <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 transition-all duration-700" style={{ width: `${michi.energy}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Grid de Objetos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SHOP_ITEMS.filter(item => item.type === (activeTab === 'boutique' ? 'accessory' : 'food')).map(item => {
                  const isUnlocked = michi.unlockedAccessories.includes(item.id);
                  const isActive = michi.activeAccessory === item.id;
                  const canAfford = michi.pescaditos >= item.price;
                  const isFood = item.type === 'food';

                  return (
                    <button 
                      key={item.id}
                      onClick={() => handleAction(item)}
                      className={`p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 group ${
                        isActive ? 'border-indigo-600 bg-indigo-50 shadow-md scale-105' : 
                        isUnlocked ? 'border-emerald-200 bg-emerald-50/30' : 
                        canAfford ? 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-lg active:scale-95' : 'opacity-40 border-transparent bg-gray-50 grayscale'
                      }`}
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <div className="text-center">
                        <p className="text-[8px] font-black uppercase tracking-tight text-gray-900">{item.name}</p>
                        <p className={`text-[9px] font-bold ${isUnlocked && !isFood ? 'text-emerald-500' : 'text-gray-400'}`}>
                          {isFood ? `${item.price}🐟` : isUnlocked ? (isActive ? 'Usando' : 'Vestir') : `${item.price}🐟`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 flex-shrink-0">
              <button 
                onClick={() => setShowPersonalization(false)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
              >
                ¡Quedó Genial! ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Burbuja de Texto Flotante */}
      <div className={`mb-4 transition-all duration-500 transform origin-bottom-right pointer-events-none ${showBubble && !showPersonalization ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-4'}`}>
        <div className="bg-white p-4 rounded-[1.8rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-gray-50 max-w-[200px] relative">
          <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight leading-tight">
            {getMessage()}
          </p>
          <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white border-r-2 border-b-2 border-gray-50 rotate-45"></div>
        </div>
      </div>
      
      {/* Michi Gatito Interactuable */}
      <div className="flex items-end gap-3 pointer-events-auto">
        <div 
          onClick={handleInteract}
          onMouseEnter={() => setShowBubble(true)}
          onMouseLeave={() => setShowBubble(false)}
          className="relative group cursor-pointer"
        >
          {/* Aura de Super Michi */}
          {michi.activeAccessory === 'halo' && (
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl animate-pulse scale-150"></div>
          )}

          {/* Partículas de Corazones */}
          {hearts.map(h => (
            <span 
              key={h.id} 
              className="absolute text-pink-500 text-sm animate-ping pointer-events-none z-20"
              style={{ left: h.x, top: h.y }}
            >
              ❤️
            </span>
          ))}

          {/* El Michi SVG Principal */}
          <div className="w-28 h-28 relative drop-shadow-2xl">
            {renderMichiSVG()}

            {/* Marcadores de Estado Flotantes */}
            <div className="absolute -top-4 -right-2 flex flex-col items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <span className="bg-emerald-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg animate-bounce">
                  🐟 {michi.pescaditos}
               </span>
               <div className="w-10 h-1.5 bg-white/80 backdrop-blur-md rounded-full overflow-hidden border border-gray-100 shadow-sm">
                  <div 
                    className={`h-full transition-all duration-1000 ${michi.energy > 30 ? 'bg-indigo-400' : 'bg-red-400 animate-pulse'}`} 
                    style={{ width: `${michi.energy}%` }}
                  ></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tailWag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes floatMichi {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .group:hover svg {
          animation: floatMichi 2s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default MichiCompanion;
