
import React from 'react';
import { ViewState, UserConfig } from '../types';

interface MenuViewProps {
  setCurrentView: (view: ViewState) => void;
  userConfig: UserConfig;
  themeAccentColor: string;
  borderRadiusClass: string;
}

const MenuView: React.FC<MenuViewProps> = ({ setCurrentView, userConfig, themeAccentColor, borderRadiusClass }) => {
  return (
    <div className="animate-slideUp text-center">
      <h3 className="text-4xl font-black mb-10" style={{ color: userConfig.greetingColor || undefined }}>
        {userConfig.greeting || 'Hola,'} {userConfig.nickname} ✨
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MenuCard title="Notas" desc="Apuntes" icon="📝" color="bg-purple-400" radius={borderRadiusClass} onClick={() => setCurrentView('NOTES')} />
        <MenuCard title="Tareas" desc="Pendientes" icon="📋" color="bg-indigo-400" radius={borderRadiusClass} onClick={() => setCurrentView('TASKS')} />
        <MenuCard title="Biblioteca" desc="Recursos" icon="📚" color="bg-orange-400" radius={borderRadiusClass} onClick={() => setCurrentView('LIBRARY')} />
        <MenuCard title="Portafolio" desc="Logros" icon="🏆" color="bg-emerald-400" radius={borderRadiusClass} onClick={() => setCurrentView('PORTFOLIO')} />
        <MenuCard title="Moodboard" desc="Inspiración" icon="🖼️" color="bg-pink-400" radius={borderRadiusClass} onClick={() => setCurrentView('MOODBOARD')} />
        <MenuCard title="Producción" desc="Procesos" icon="📽️" color="bg-blue-400" radius={borderRadiusClass} onClick={() => setCurrentView('PIPELINE')} />
        <MenuCard title="Gastos" desc="Finanzas" icon="💰" color="bg-red-400" radius={borderRadiusClass} onClick={() => setCurrentView('EXPENSE_CONTROL')} />
        <MenuCard title="Ajustes" desc="Personalizar" icon="⚙️" color="bg-gray-400" radius={borderRadiusClass} onClick={() => setCurrentView('SETTINGS')} />
      </div>
    </div>
  );
};

const MenuCard = ({ title, desc, icon, color, onClick, radius }: any) => (
  <button onClick={onClick} className={`bg-white p-6 ${radius} border-2 border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center group h-full flex flex-col items-center`}>
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-xl mb-4 shadow-lg transition-transform group-hover:scale-110`}>{icon}</div>
    <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">{title}</h3>
    <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter opacity-60">{desc}</p>
  </button>
);

export default MenuView;
