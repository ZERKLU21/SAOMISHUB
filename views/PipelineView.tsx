
import React, { useState } from 'react';
// Fix: Removed PipelineStage from imports as it is not defined in types.ts and not used in this file.
import { PipelineProject, ViewState, PipelineTemplate, StageInfo } from '../types';
import PipelineCard from '../components/PipelineCard';

interface PipelineViewProps {
  setCurrentView: (view: ViewState) => void;
  pipelines: PipelineProject[];
  setPipelines: React.Dispatch<React.SetStateAction<PipelineProject[]>>;
}

const TEMPLATES: PipelineTemplate[] = ['Animación', 'Ensayo Académico', 'Proyecto de Ciencias', 'Desarrollo de App'];

const PipelineView: React.FC<PipelineViewProps> = ({ setCurrentView, pipelines, setPipelines }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProj, setNewProj] = useState({ 
    title: '', 
    objective: '', 
    template: 'Animación' as PipelineTemplate,
    startDate: new Date().toISOString().split('T')[0] 
  });

  const handleUpdateStage = (id: string, stage: string) => {
    setPipelines(pipelines.map(p => p.id === id ? { ...p, currentStage: stage } : p));
  };

  const handleUpdateProject = (updatedProj: PipelineProject) => {
    setPipelines(pipelines.map(p => p.id === updatedProj.id ? updatedProj : p));
  };

  const handleCreateProject = () => {
    if (!newProj.title.trim()) return;
    
    const initialStages: Record<string, StageInfo> = {};
    const firstStage = {
      'Animación': 'Storyboard',
      'Ensayo Académico': 'Investigación',
      'Proyecto de Ciencias': 'Hipótesis',
      'Desarrollo de App': 'Requerimientos'
    }[newProj.template];

    const project: PipelineProject = {
      id: crypto.randomUUID(),
      title: newProj.title,
      objective: newProj.objective,
      template: newProj.template,
      startDate: newProj.startDate,
      description: '',
      deadline: '',
      currentStage: firstStage || 'Inicio',
      stageData: initialStages,
      timestamp: Date.now()
    };

    setPipelines([project, ...pipelines]);
    setIsAdding(false);
    setNewProj({ title: '', objective: '', template: 'Animación', startDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <>
      <div className="animate-slideUp space-y-6 pb-20">
        <div className="flex justify-between items-center">
          <button onClick={() => setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-500">← Menú Principal</button>
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-lg shadow-blue-100/50 group flex items-center gap-2">
            <span>🚀</span>
            Nuevo Proyecto
          </button>
        </div>

        {pipelines.length > 0 ? (
          <div className="space-y-12">
            {pipelines.map(p => (
              <PipelineCard 
                key={p.id} 
                project={p} 
                onUpdateStage={handleUpdateStage} 
                onUpdateProject={handleUpdateProject}
                onDelete={id => setPipelines(pipelines.filter(prj => prj.id !== id))} 
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <div className="text-4xl mb-4">⚙️</div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Configura tu primer flujo de trabajo</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl space-y-6 my-auto animate-slideUp">
            <h3 className="text-xl font-black text-blue-600 uppercase text-center">Planificar Proyecto</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Título</p>
                <input type="text" placeholder="Ej. Cortometraje final" value={newProj.title} onChange={e => setNewProj({...newProj, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-100 transition-colors" />
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Tipo de Proyecto (Plantilla)</p>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map(t => (
                    <button 
                      key={t}
                      onClick={() => setNewProj({...newProj, template: t})}
                      className={`py-3 px-2 rounded-xl text-[8px] font-black uppercase transition-all border-2 ${newProj.template === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-400 border-transparent hover:border-blue-100'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Objetivo General</p>
                <input type="text" placeholder="¿Qué quieres lograr?" value={newProj.objective} onChange={e => setNewProj({...newProj, objective: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-100 transition-colors" />
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Fecha de Inicio</p>
                <input type="date" value={newProj.startDate} onChange={e => setNewProj({...newProj, startDate: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase hover:bg-gray-200 transition-colors">Cancelar</button>
              <button 
                onClick={handleCreateProject}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Empezar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PipelineView;
