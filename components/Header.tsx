
import React from 'react';

interface HeaderProps {
  onHomeClick?: () => void;
  onTitleClick?: () => void;
  nickname: string;
  avatar: string;
  themeColor: string;
  syncStatus?: 'synced' | 'loading' | 'error';
}

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-600',
  pink: 'bg-pink-500',
  emerald: 'bg-emerald-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  blue: 'bg-blue-500'
};

const Header: React.FC<HeaderProps> = ({ onHomeClick, onTitleClick, nickname, avatar, themeColor, syncStatus = 'synced' }) => {
  const bgColor = colorMap[themeColor] || 'bg-indigo-600';
  const hubName = nickname || 'Saomi';
  const isCustomAvatar = avatar && avatar.startsWith('data:image');

  return (
    <div className="fixed top-4 left-0 w-full px-6 z-[60] pointer-events-none animate-fadeIn">
      <header className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-gray-200/20 rounded-[2rem] py-3 px-6 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center gap-3">
          <div 
            onClick={onHomeClick}
            className={`w-9 h-9 ${bgColor} rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/20 rotate-3 transition-all duration-500 hover:scale-110 hover:rotate-0 overflow-hidden cursor-pointer`}
          >
             {isCustomAvatar ? (
               <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <span className="text-base">{avatar || '🐾'}</span>
             )}
          </div>
          <div className="flex flex-col">
            <h1 
              onClick={onTitleClick}
              className="font-black text-gray-900 tracking-tighter text-sm leading-none cursor-pointer hover:text-indigo-600 transition-colors"
            >
              {hubName} Hub
            </h1>
            <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Asistente</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900/5 rounded-full border border-white/50">
            <div className={`w-1.5 h-1.5 rounded-full ${
              syncStatus === 'loading' ? 'bg-amber-400 animate-pulse' : 
              syncStatus === 'error' ? 'bg-red-400' : 'bg-emerald-400'
            }`}></div>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
              {syncStatus === 'loading' ? 'Sincronizando' : syncStatus === 'error' ? 'Error Sync' : 'Nube'}
            </span>
          </div>
          <div className="px-3 py-1 bg-gray-900/5 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest border border-white/50">Online</div>
        </div>
      </header>
    </div>
  );
};

export default Header;
