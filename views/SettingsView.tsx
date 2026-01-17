
import React, { useRef, useState } from 'react';
import { UserConfig, ViewState } from '../types';

interface SettingsViewProps {
  setCurrentView: (view: ViewState) => void;
  userConfig: UserConfig;
  setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ setCurrentView, userConfig, setUserConfig }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserConfig({...userConfig, avatar: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="animate-slideUp space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <button onClick={() => setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">← Volver al Menú</button>
        <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">v2.5 Pro</span>
      </div>
      
      <div className="bg-white p-8 md:p-12 rounded-[3rem] border-2 border-gray-50 shadow-sm space-y-12">
        {/* IDENTIDAD */}
        <section className="space-y-6">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Identidad
          </h4>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div onClick={() => fileRef.current?.click()} className="relative group w-32 h-32 flex-shrink-0">
               <div className="w-full h-full bg-gray-50 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center cursor-pointer overflow-hidden text-5xl transition-transform group-hover:scale-105 active:scale-95">
                {userConfig.avatar.startsWith('data') ? <img src={userConfig.avatar} className="w-full h-full object-cover" /> : userConfig.avatar}
               </div>
               <div className="absolute inset-0 bg-black/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                 <span className="text-white text-[10px] font-black uppercase">Cambiar</span>
               </div>
            </div>
            <input type="file" ref={fileRef} className="hidden" onChange={handleAvatarChange} />
            <div className="flex-1 w-full space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-300 uppercase px-1">Tu nombre de usuario</p>
                <input type="text" value={userConfig.nickname} onChange={e => setUserConfig({...userConfig, nickname: e.target.value})} placeholder="Nombre" className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none border-2 border-transparent focus:border-indigo-100 transition-all" />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-300 uppercase px-1">Saludo personalizado</p>
                <input type="text" value={userConfig.greeting} onChange={e => setUserConfig({...userConfig, greeting: e.target.value})} placeholder="Saludo" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-100 transition-all" />
              </div>
            </div>
          </div>
        </section>

        {/* CLOUD CONNECTION (NEW) */}
        <section className="space-y-6">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Almacenamiento en la Nube
          </h4>
          <div className="p-6 bg-emerald-50/50 rounded-[2.5rem] border-2 border-emerald-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl">☁️</div>
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-700 leading-none mb-1">Supabase Conectado</p>
                <p className="text-[9px] text-emerald-600/70 font-bold uppercase tracking-tighter">Tus citas y links se sincronizan automáticamente</p>
              </div>
            </div>
            <div className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest">Activo</div>
          </div>
        </section>

        {/* TIPOGRAFIA */}
        <section className="space-y-6">
          <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Tipografía y Lectura
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
             {[
               {id: 'modern', name: 'Sans', font: 'font-sans'},
               {id: 'academic', name: 'Serif', font: 'font-times'},
               {id: 'playful', name: 'Soft', font: 'font-quicksand'},
               {id: 'mono', name: 'Mono', font: 'font-mono'},
               {id: 'retro', name: 'Retro', font: 'font-playfair'}
             ].map(f => (
               <button 
                key={f.id} 
                onClick={() => setUserConfig({...userConfig, fontStyle: f.id as any})}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${userConfig.fontStyle === f.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-50 bg-gray-50/50 hover:border-indigo-100'}`}
               >
                 <span className={`${f.font} text-lg font-bold`}>Aa</span>
                 <span className="text-[8px] font-black uppercase tracking-widest">{f.name}</span>
               </button>
             ))}
          </div>
          <div className="space-y-3">
            <p className="text-[9px] font-black text-gray-300 uppercase px-1">Tamaño de Texto</p>
            <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
               {['sm', 'base', 'lg', 'xl'].map(s => (
                 <button 
                  key={s} 
                  onClick={() => setUserConfig({...userConfig, fontSize: s as any})}
                  className={`flex-1 py-2 text-[10px] font-black uppercase transition-all rounded-xl ${userConfig.fontSize === s ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}
                 >
                   {s}
                 </button>
               ))}
            </div>
          </div>
        </section>

        {/* INTERFAZ AVANZADA */}
        <section className="space-y-8">
           <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> Personalización Visual
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <p className="text-[9px] font-black text-gray-300 uppercase px-1">Opacidad del Fondo: {Math.round(userConfig.bgOpacity * 100)}%</p>
               <input 
                type="range" min="0" max="0.5" step="0.01" 
                value={userConfig.bgOpacity} 
                onChange={e => setUserConfig({...userConfig, bgOpacity: parseFloat(e.target.value)})}
                className="w-full accent-indigo-600"
               />
               <div className="flex justify-between gap-4">
                  <button 
                    onClick={() => setUserConfig({...userConfig, bgPattern: 'cats'})}
                    className={`flex-1 p-3 rounded-xl border-2 text-[8px] font-black uppercase transition-all ${userConfig.bgPattern === 'cats' ? 'border-indigo-600 bg-indigo-50' : 'bg-gray-50 border-transparent'}`}
                  >Michis</button>
                  <button 
                    onClick={() => bgRef.current?.click()}
                    className={`flex-1 p-3 rounded-xl border-2 text-[8px] font-black uppercase transition-all ${userConfig.bgPattern === 'custom' ? 'border-indigo-600 bg-indigo-50' : 'bg-gray-50 border-transparent'}`}
                  >Custom</button>
               </div>
               <input type="file" ref={bgRef} className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setUserConfig({...userConfig, customBg: reader.result as string, bgPattern: 'custom'});
                    reader.readAsDataURL(file);
                  }
               }} />
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black text-gray-300 uppercase px-1">Forma de Bordes</p>
              <div className="grid grid-cols-3 gap-2">
                 {['sharp', 'standard', 'bento'].map(b => (
                   <button 
                    key={b} 
                    onClick={() => setUserConfig({...userConfig, borderRadius: b as any})}
                    className={`p-3 rounded-xl border-2 text-[8px] font-black uppercase transition-all ${userConfig.borderRadius === b ? 'border-indigo-600 bg-indigo-50' : 'bg-gray-50 border-transparent'}`}
                   >
                     {b === 'sharp' ? 'Recto' : b === 'standard' ? 'Normal' : 'Bento'}
                   </button>
                 ))}
              </div>
              <p className="text-[9px] font-black text-gray-300 uppercase px-1 mt-4">Estilo de Tarjetas</p>
              <div className="flex gap-2">
                 <button 
                  onClick={() => setUserConfig({...userConfig, cardStyle: 'flat'})}
                  className={`flex-1 py-3 rounded-xl border-2 text-[8px] font-black uppercase transition-all ${userConfig.cardStyle === 'flat' ? 'border-indigo-600 bg-indigo-50' : 'bg-gray-50 border-transparent'}`}
                 >Sólido</button>
                 <button 
                  onClick={() => setUserConfig({...userConfig, cardStyle: 'glass'})}
                  className={`flex-1 py-3 rounded-xl border-2 text-[8px] font-black uppercase transition-all ${userConfig.cardStyle === 'glass' ? 'border-indigo-600 bg-indigo-50' : 'bg-gray-50 border-transparent'}`}
                 >Glass 🥂</button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <p className="text-[9px] font-black text-gray-300 uppercase px-1">Color de Acento Principal</p>
             <div className="flex flex-wrap gap-3">
              {['indigo', 'pink', 'emerald', 'orange', 'purple', 'blue'].map(c => {
                const colorHex = {indigo: '#4f46e5', pink: '#ec4899', emerald: '#10b981', orange: '#f97316', purple: '#a855f7', blue: '#3b82f6'}[c as any];
                return (
                  <button 
                    key={c} 
                    onClick={() => setUserConfig({...userConfig, themeColor: c as any})} 
                    className={`w-10 h-10 rounded-full transition-all border-4 ${userConfig.themeColor === c ? 'border-gray-900 scale-110 shadow-lg' : 'border-white hover:scale-105'}`} 
                    style={{ backgroundColor: colorHex }}
                  />
                );
              })}
             </div>
          </div>
        </section>

        {/* PRIVACIDAD */}
        <section className="p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <span className="text-xl">🕵️‍♂️</span>
                <div>
                   <h4 className="text-[10px] font-black uppercase text-gray-900 tracking-widest leading-none">Modo Privacidad</h4>
                   <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Oculta montos de dinero automáticamente</p>
                </div>
             </div>
             <button 
               onClick={() => setUserConfig({...userConfig, privacyMode: !userConfig.privacyMode})}
               className={`w-14 h-8 rounded-full transition-all p-1 flex items-center ${userConfig.privacyMode ? 'bg-indigo-600 justify-end' : 'bg-gray-200 justify-start'}`}
             >
                <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
             </button>
          </div>
        </section>

        {/* PELIGRO */}
        <section className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-center md:text-left">
              <p className="text-[9px] font-black text-gray-900 uppercase">Zona de Peligro</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Elimina todos tus datos localmente</p>
           </div>
           {!showClearConfirm ? (
             <button 
              onClick={() => setShowClearConfirm(true)}
              className="px-8 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all active:scale-95"
             >Restablecer App</button>
           ) : (
             <div className="flex gap-2 animate-fadeIn">
               <button onClick={handleClearData} className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[9px] font-black uppercase shadow-lg shadow-red-100">Confirmar Borrado</button>
               <button onClick={() => setShowClearConfirm(false)} className="px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl text-[9px] font-black uppercase hover:bg-gray-200">Cancelar</button>
             </div>
           )}
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
