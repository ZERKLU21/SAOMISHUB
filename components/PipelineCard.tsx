
import React, { useState, useRef } from 'react';
import { PipelineProject, StageInfo, ChecklistItem, PipelineTemplate } from '../types';

interface Props {
  project: PipelineProject;
  onUpdateStage: (id: string, stage: string) => void;
  onUpdateProject: (project: PipelineProject) => void;
  onDelete: (id: string) => void;
}

const TEMPLATE_STAGES: Record<PipelineTemplate, string[]> = {
  'Animación': ['Storyboard', 'Layout', 'Animatic', 'Rough Animation', 'Cleanup', 'Color', 'Render', 'Finalizado'],
  'Ensayo Académico': ['Investigación', 'Esquema', 'Borrador', 'Citas/APA', 'Revisión', 'Formato', 'Entrega'],
  'Proyecto de Ciencias': ['Hipótesis', 'Diseño Exp.', 'Experimentación', 'Análisis', 'Conclusiones', 'Informe', 'Poster'],
  'Desarrollo de App': ['Requerimientos', 'Diseño UI', 'Frontend', 'Backend', 'Testing', 'Deploy', 'Finalizado']
};

const STAGE_CONFIG: Record<string, { desc: string, f1: string, f2: string, icon: string }> = {
  // Animación
  'Storyboard': { desc: 'Visualización narrativa.', f1: 'Guion / Diálogos', f2: 'Total Paneles', icon: '✏️' },
  'Layout': { desc: 'Bloqueo de cámaras.', f1: 'Cámara', f2: 'Props', icon: '📐' },
  'Animatic': { desc: 'Montaje tiempos/audio.', f1: 'BPM', f2: 'Duración', icon: '🎬' },
  'Rough Animation': { desc: 'Movimiento base.', f1: 'Referencias', f2: 'Keyframes', icon: '🏃' },
  'Cleanup': { desc: 'Limpieza de trazos.', f1: 'Pinceles', f2: 'Model Sheets', icon: '✒️' },
  'Color': { desc: 'Pintado final.', f1: 'Paleta Hex', f2: 'Iluminación', icon: '🎨' },
  'Render': { desc: 'Exportación.', f1: 'Software', f2: 'Resolución', icon: '💿' },
  'Finalizado': { desc: 'Proyecto terminado.', f1: 'Formato', f2: 'Feedback', icon: '⭐' },
  // Ensayo
  'Investigación': { desc: 'Búsqueda de fuentes.', f1: 'Fuentes principales', f2: 'Base de datos', icon: '🔍' },
  'Esquema': { desc: 'Estructura lógica.', f1: 'Secciones', f2: 'Argumentos', icon: '📝' },
  'Borrador': { desc: 'Escritura inicial.', f1: 'Palabras', f2: 'Capítulos', icon: '✍️' },
  'Citas/APA': { desc: 'Verificación bibliográfica.', f1: 'N° Citas', f2: 'Estilo', icon: '📖' },
  'Revisión': { desc: 'Corrección de estilo.', f1: 'Corrector', f2: 'Feedback', icon: '👀' },
  'Formato': { desc: 'Diseño de página.', f1: 'Tipografía', f2: 'Interlineado', icon: '📄' },
  'Entrega': { desc: 'Envío final.', f1: 'Plataforma', f2: 'Confirmación', icon: '🚀' },
  // Ciencias
  'Hipótesis': { desc: 'Planteamiento inicial.', f1: 'Variable Ind.', f2: 'Variable Dep.', icon: '🤔' },
  'Diseño Exp.': { desc: 'Metodología.', f1: 'Materiales', f2: 'Sujetos', icon: '🔬' },
  'Experimentación': { desc: 'Toma de datos.', f1: 'Repeticiones', f2: 'Control', icon: '🧪' },
  'Análisis': { desc: 'Procesamiento.', f1: 'Media/SD', f2: 'Software', icon: '📊' },
  'Conclusiones': { desc: 'Hallazgos.', f1: 'Verificación', f2: 'Nuevas dudas', icon: '💡' },
  'Informe': { desc: 'Redacción resultados.', f1: 'Páginas', f2: 'Anexos', icon: '📋' },
  'Poster': { desc: 'Divulgación.', f1: 'Dimensiones', f2: 'Gráficos', icon: '🖼️' },
  // App
  'Requerimientos': { desc: 'Funcionalidades.', f1: 'User Stories', f2: 'Tech Stack', icon: '📑' },
  'Diseño UI': { desc: 'Prototipado.', f1: 'Figma URL', f2: 'Componentes', icon: '🖥️' },
  'Frontend': { desc: 'Maquetado.', f1: 'Framework', f2: 'Rutas', icon: '⚛️' },
  'Backend': { desc: 'Servidor/DB.', f1: 'DB Engine', f2: 'Endpoints', icon: '🗄️' },
  'Testing': { desc: 'QA y Bugfix.', f1: 'Unit Tests', f2: 'Bugs abiertos', icon: '🐞' },
  'Deploy': { desc: 'Puesta en marcha.', f1: 'Hosting', f2: 'Dominio', icon: '☁️' }
};

const PipelineCard: React.FC<Props> = ({ project, onUpdateStage, onUpdateProject, onDelete }) => {
  const STAGES = TEMPLATE_STAGES[project.template] || TEMPLATE_STAGES['Animación'];
  const [selectedStage, setSelectedStage] = useState<string>(project.currentStage);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentIndex = STAGES.indexOf(project.currentStage);
  const progress = ((currentIndex + 1) / STAGES.length) * 100;
  
  const currentStageInfo: StageInfo = project.stageData?.[selectedStage] || { 
    notes: '', links: '', technicalField1: '', technicalField2: '', checklist: [] 
  };
  
  const config = STAGE_CONFIG[selectedStage] || { desc: 'Etapa del proceso', f1: 'Campo 1', f2: 'Campo 2', icon: '📦' };

  const updateStageData = (updates: Partial<StageInfo>) => {
    const updatedProject = {
      ...project,
      stageData: {
        ...project.stageData,
        [selectedStage]: { ...currentStageInfo, ...updates }
      }
    };
    onUpdateProject(updatedProject);
  };

  const toggleChecklistItem = (itemId: string) => {
    const updatedChecklist = currentStageInfo.checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateStageData({ checklist: updatedChecklist });
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newChecklistItem.trim(),
      completed: false
    };
    updateStageData({ checklist: [...currentStageInfo.checklist, newItem] });
    setNewChecklistItem('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateStageData({ referenceImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-sm transition-all relative">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl bg-gray-50 p-2 rounded-2xl shadow-inner">{config.icon}</span>
            <div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none">{project.title}</h3>
              <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-1">Plantilla: {project.template}</p>
            </div>
          </div>
          {project.objective && (
            <div className="bg-indigo-50/30 p-3 rounded-2xl border border-indigo-50 mb-2">
              <span className="text-[7px] font-black uppercase text-indigo-400 block mb-1">Enfoque del Proyecto</span>
              <p className="text-[10px] text-gray-600 font-medium">{project.objective}</p>
            </div>
          )}
          <div className="flex gap-4">
             <span className="text-[9px] font-bold text-gray-400">Inicio: {project.startDate}</span>
             {project.deadline && <span className="text-[9px] font-bold text-red-400">Meta: {project.deadline}</span>}
          </div>
        </div>
        <button onClick={() => onDelete(project.id)} className="text-gray-300 hover:text-red-500 p-2 bg-gray-50 rounded-xl transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-black uppercase mb-2">
          <span className="text-indigo-600 flex items-center gap-1.5">
             <span className="animate-pulse w-2 h-2 bg-indigo-500 rounded-full"></span>
             {project.currentStage}
          </span>
          <span className="text-gray-300">{Math.round(progress)}% completado</span>
        </div>
        <div className="h-3 bg-gray-50 rounded-full border-2 border-gray-100 overflow-hidden shadow-inner">
          <div className="h-full bg-indigo-500 transition-all duration-700 shadow-[0_0_10px_rgba(79,70,229,0.3)]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-4 scrollbar-hide">
        {STAGES.map((stage) => {
          const isActive = project.currentStage === stage;
          const isPassed = STAGES.indexOf(stage) < currentIndex;
          const isViewing = selectedStage === stage;
          return (
            <button
              key={stage}
              onClick={() => { setSelectedStage(stage); onUpdateStage(project.id, stage); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl border-2 text-[8px] font-black uppercase transition-all
                ${isViewing ? 'border-indigo-600 scale-105' : 'border-transparent'} 
                ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 
                  isPassed ? 'bg-indigo-50 text-indigo-400 border-indigo-100' : 'bg-gray-50 text-gray-300'}`}
            >
              {stage}
            </button>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-[2.5rem] p-6 border-2 border-gray-100 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
          <div>
            <h4 className="text-[11px] font-black uppercase text-indigo-600 tracking-widest">{selectedStage}</h4>
            <p className="text-[9px] text-gray-400 font-medium">{config.desc}</p>
          </div>
          <span className="text-2xl opacity-40">{config.icon}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Campos Técnicos */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-gray-400 px-1">{config.f1}</p>
                <input type="text" placeholder="..." value={currentStageInfo.technicalField1} onChange={e => updateStageData({ technicalField1: e.target.value })} className="w-full p-3 bg-white rounded-xl text-[10px] font-bold outline-none border-2 border-transparent focus:border-indigo-100" />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-gray-400 px-1">{config.f2}</p>
                <input type="text" placeholder="..." value={currentStageInfo.technicalField2} onChange={e => updateStageData({ technicalField2: e.target.value })} className="w-full p-3 bg-white rounded-xl text-[10px] font-bold outline-none border-2 border-transparent focus:border-indigo-100" />
              </div>
            </div>

            {/* Micro-Checklist (Mejora #2) */}
            <div className="bg-white p-4 rounded-[1.5rem] border border-gray-200/50 space-y-3">
               <p className="text-[9px] font-black uppercase text-gray-400 px-1">Checklist de Etapa</p>
               <div className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-hide">
                 {currentStageInfo.checklist.map(item => (
                   <div key={item.id} className="flex items-center gap-3 group/item">
                     <button 
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center ${item.completed ? 'bg-emerald-500 border-emerald-500' : 'bg-gray-50 border-gray-200'}`}
                     >
                       {item.completed && <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                     </button>
                     <span className={`text-[10px] font-medium transition-all ${item.completed ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{item.text}</span>
                     <button onClick={() => updateStageData({ checklist: currentStageInfo.checklist.filter(i => i.id !== item.id) })} className="ml-auto opacity-0 group-hover/item:opacity-100 text-gray-200 hover:text-red-400 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                   </div>
                 ))}
               </div>
               <div className="flex gap-2">
                 <input 
                    type="text" 
                    placeholder="Nueva subtarea..." 
                    value={newChecklistItem}
                    onChange={e => setNewChecklistItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addChecklistItem()}
                    className="flex-1 bg-gray-50 p-2 rounded-lg text-[10px] outline-none" 
                 />
                 <button onClick={addChecklistItem} className="bg-indigo-600 text-white p-2 rounded-lg text-[10px] font-black">+</button>
               </div>
            </div>
          </div>

          <div className="space-y-4">
             {/* Galería de Referencias (Mejora #4) */}
             <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-gray-400 px-1">Referencia Visual</p>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${currentStageInfo.referenceImage ? 'border-indigo-200' : 'border-gray-200 bg-white hover:bg-gray-100'}`}
                >
                  {currentStageInfo.referenceImage ? (
                    <img src={currentStageInfo.referenceImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center opacity-40">
                      <span className="text-2xl mb-1 block">🖼️</span>
                      <span className="text-[8px] font-black uppercase">Subir Imagen</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
             </div>

             <div className="space-y-1">
               <p className="text-[8px] font-black uppercase text-gray-400 px-1">Notas Libres</p>
               <textarea placeholder="..." value={currentStageInfo.notes} onChange={e => updateStageData({ notes: e.target.value })} className="w-full p-4 bg-white rounded-[1.5rem] text-[10px] outline-none h-24 resize-none border-2 border-transparent focus:border-indigo-100" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineCard;
