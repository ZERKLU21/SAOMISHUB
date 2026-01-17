
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ViewState } from '../types';

interface SecretViewProps {
  setCurrentView: (view: ViewState) => void;
  fontClass: string;
}

const AUDIO_URL = "https://www.chosic.com/wp-content/uploads/2021/07/Rain-and-Pianos-Lofi-Chill.mp3";

const SecretView: React.FC<SecretViewProps> = ({ setCurrentView, fontClass }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generar partículas aleatorias (Mejora #2)
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 20}s`,
      content: ['🌸', '❤️', '✨', '☁️'][Math.floor(Math.random() * 4)],
      size: `${0.8 + Math.random() * 1.5}rem`
    }));
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="animate-slideUp flex flex-col items-center justify-center min-h-[85vh] text-center space-y-10 relative overflow-hidden rounded-[4rem] bg-gradient-to-b from-pink-50/30 to-white">
      
      {/* Sistema de Partículas (Mejora #2) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute animate-float-particle opacity-0"
            style={{ 
              left: p.left, 
              '--delay': p.delay, 
              '--duration': p.duration,
              fontSize: p.size 
            } as any}
          >
            {p.content}
          </div>
        ))}
      </div>
      
      {/* Corazón Central */}
      <div className="relative z-20">
        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center text-7xl animate-pulse shadow-2xl border-4 border-pink-100 relative group overflow-hidden">
          <span className="relative z-10">❤️</span>
          <div className="absolute inset-0 bg-pink-100/30 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full"></div>
        </div>
      </div>

      {/* Tarjeta de Mensaje */}
      <div className="bg-white/80 backdrop-blur-3xl p-10 md:p-14 rounded-[3.5rem] border-4 border-pink-50 shadow-2xl shadow-pink-200/20 relative max-w-xl z-20 transition-all hover:scale-[1.01]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
           </svg>
        </div>
        
        <p className={`text-gray-800 font-bold leading-relaxed text-xl italic mb-10 ${fontClass}`}>
          "Recuerda que siempre te voy a amar, eres la mejor y tu puedes. Estoy muy orgulloso de ti, esfuérzate vas muy bien, recuerda que yo estaré contigo en las buenas , en las malas y en las peores, porque te quiero en toda mi vida. Te Amo."
        </p>
        
        <div className="pt-8 border-t border-pink-50 flex justify-between items-center">
          <div className="flex flex-col items-start">
             <p className="text-[9px] font-black text-pink-300 uppercase tracking-widest">Para: Saomi</p>
             <p className="text-[9px] font-black text-pink-300 uppercase tracking-widest">De: Alberto Lucio</p>
          </div>
          <p className="text-3xl text-pink-500 italic font-playfair select-none">Alberto Lucio</p>
        </div>
      </div>

      {/* Controles e Interacción */}
      <div className="flex flex-col md:flex-row gap-4 relative z-40 items-center">
        {/* Reproductor de Música (Mejora #3) */}
        <div className="bg-white p-2 rounded-full shadow-xl border-2 border-pink-50 flex items-center gap-3 pr-6">
           <button 
             onClick={toggleMusic}
             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-pink-500 text-white rotate-180' : 'bg-pink-50 text-pink-500 hover:bg-pink-100'}`}
           >
             {isPlaying ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" /></svg>
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
             )}
           </button>
           <div className="text-left">
              <p className="text-[9px] font-black text-gray-900 uppercase leading-none">Study & Chill</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{isPlaying ? 'Reproduciendo lofi...' : 'Pausado'}</p>
           </div>
           <audio ref={audioRef} src={AUDIO_URL} loop />
        </div>

        <button 
          onClick={() => setCurrentView('MENU')} 
          className="px-12 py-5 bg-white text-pink-500 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-pink-500 hover:text-white shadow-xl transition-all border-4 border-pink-50 active:scale-95"
        >
          Volver al Hub 🌸
        </button>
      </div>
    </div>
  );
};

export default SecretView;