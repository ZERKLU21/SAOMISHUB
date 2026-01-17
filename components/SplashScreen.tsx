
import React, { useMemo } from 'react';

interface Props {
  nickname: string;
  themeColor: string;
  isExiting?: boolean;
}

const MOTIVATIONAL_PHRASES = [
  "¡Hoy es un gran día para aprender!",
  "Tu esfuerzo de hoy es tu éxito de mañana",
  "Pequeños pasos, grandes metas",
  "Cree en ti y todo será posible",
  "La constancia es la llave del éxito",
  "Haz que hoy valga la pena",
  "Tu conocimiento es tu mayor tesoro",
  "Enfócate en progresar, no en ser perfecta",
  "¡Tú puedes con todo lo que te propongas!",
  "Estudiar hoy es la recompensa del mañana",
  "La disciplina es el puente al éxito"
];

const SplashScreen: React.FC<Props> = ({ nickname, themeColor, isExiting }) => {
  const themeColors = {
    indigo: { main: '#4f46e5', light: '#818cf8', blob: 'bg-indigo-400' },
    pink: { main: '#ec4899', light: '#f472b6', blob: 'bg-pink-400' },
    emerald: { main: '#10b981', light: '#34d399', blob: 'bg-emerald-400' },
    orange: { main: '#f97316', light: '#fb923c', blob: 'bg-orange-400' },
    purple: { main: '#a855f7', light: '#c084fc', blob: 'bg-purple-400' },
    blue: { main: '#3b82f6', light: '#60a5fa', blob: 'bg-blue-400' }
  }[themeColor as keyof typeof themeColors] || { main: '#4f46e5', light: '#818cf8', blob: 'bg-indigo-400' };

  const selectedPhrase = useMemo(() => {
    return MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
  }, []);

  return (
    <div className={`fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Blobs de fondo animados con mayor radio de desenfoque */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full blur-[150px] opacity-25 animate-blob-slow ${themeColors.blob}`} style={{ animationDelay: '0s' }}></div>
        <div className={`absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[150px] opacity-25 animate-blob-slow ${themeColors.blob}`} style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-[15%] right-[5%] w-[40%] h-[40%] bg-yellow-100 rounded-full blur-[120px] opacity-15 animate-blob-slow" style={{ animationDelay: '4.5s' }}></div>
      </div>

      {/* Contenido principal coreografiado */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Michi en Burbuja con Levitación */}
        <div className="relative mb-14 animate-michi-entry">
          <div 
            className="absolute inset-0 rounded-full blur-[60px] opacity-30 animate-pulse-soft scale-150"
            style={{ backgroundColor: themeColors.main }}
          ></div>
          
          <div className="relative w-60 h-60 bg-white/40 backdrop-blur-xl rounded-full border-2 border-white/70 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] flex items-center justify-center p-10 animate-michi-float">
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
              <circle cx="60" cy="50" r="18" fill="#FFFFFF" />
              <path d="M42 50 Q45 35 60 35 Q75 35 78 50 L75 55 Q60 45 45 55 Z" fill="#1F2937" />
              <circle cx="53" cy="48" r="3" fill="#000000" />
              <circle cx="67" cy="48" r="3" fill="#000000" />
              <path d="M45 45 L53 28 L60 45 Z" fill="#1F2937" />
              <path d="M75 45 L67 28 L60 45 Z" fill="#1F2937" />
              <path d="M58 56 Q60 58 62 56" fill="none" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="60" cy="54" r="1.5" fill="#F9A8D4" />
              <path d="M45 95 Q45 55 60 55 Q75 55 75 95 Q75 102 60 102 Q45 102 45 95" fill="#FFFFFF" />
              <g transform="translate(40, 5) scale(0.8)">
                <rect x="0" y="20" width="40" height="5" fill="#1F2937" />
                <path d="M0 22 L20 12 L40 22 L20 32 Z" fill="#1F2937" />
                <line x1="40" y1="22" x2="40" y2="35" stroke={themeColors.main} strokeWidth="2.5" />
              </g>
            </svg>
            <div className="absolute top-6 right-10 text-3xl animate-sparkle-delayed">✨</div>
            <div className="absolute bottom-12 left-6 text-2xl animate-sparkle-delayed" style={{ animationDelay: '1.2s' }}>🌸</div>
          </div>
        </div>

        {/* Título con aparición suave */}
        <div className="text-center space-y-5 animate-title-entry">
          <div className="flex flex-col">
            <h1 className="text-6xl font-black tracking-[-0.06em] text-gray-900 leading-none drop-shadow-sm">
              SAOMI <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #1a1a1a' }}>HUB</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-3 opacity-60">
              <div className="h-[1.5px] w-10 bg-gray-200"></div>
              <p className="text-[11px] font-black uppercase tracking-[0.6em] text-gray-400">Estudio Inteligente</p>
              <div className="h-[1.5px] w-10 bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Carga Orgánica */}
      <div className="absolute bottom-28 left-0 w-full px-24 space-y-5 animate-bar-entry">
        <div className="flex justify-between items-end px-1">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-pulse"></span>
            Sincronizando Módulos
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: themeColors.main }}>Online</p>
        </div>
        <div className="relative h-[3px] w-full bg-gray-100/50 rounded-full overflow-hidden">
          {/* Brillo de progreso */}
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out z-10"
            style={{ 
              backgroundColor: themeColors.main,
              animation: 'organic-progress 3s cubic-bezier(0.65, 0, 0.35, 1) forwards',
              boxShadow: `0 0 15px ${themeColors.main}`
            }}
          >
            {/* Destello viajero */}
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Frase Motivacional */}
      <div className="absolute bottom-12 text-center px-12 animate-phrase-entry">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gray-300 leading-relaxed max-w-sm mx-auto italic">
          "{selectedPhrase}"
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes organic-progress {
          0% { width: 0%; }
          30% { width: 45%; }
          60% { width: 55%; }
          100% { width: 100%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        @keyframes michi-entry {
          0% { opacity: 0; transform: scale(0.8) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes michi-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.25; transform: scale(1.4); }
          50% { opacity: 0.4; transform: scale(1.6); }
        }
        .animate-blob-slow { animation: blob-slow 10s infinite ease-in-out; }
        .animate-michi-entry { animation: michi-entry 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-michi-float { animation: michi-float 4s ease-in-out infinite; animation-delay: 1s; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .animate-title-entry { 
          opacity: 0; 
          animation: fadeIn 0.8s ease-out forwards; 
          animation-delay: 0.6s; 
        }
        .animate-bar-entry { 
          opacity: 0; 
          animation: fadeIn 0.8s ease-out forwards; 
          animation-delay: 0.9s; 
        }
        .animate-phrase-entry { 
          opacity: 0; 
          animation: fadeIn 1.2s ease-out forwards; 
          animation-delay: 1.4s; 
        }
        .animate-sparkle-delayed {
          animation: sparkle 2s infinite ease-in-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}} />
    </div>
  );
};

export default SplashScreen;
