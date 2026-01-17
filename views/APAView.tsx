
import React, { useState, useMemo } from 'react';
import { Citation, CitationProject, ViewState } from '../types';
import CitationItem from '../components/CitationItem';
import { extractMetadata } from '../services/citationLogic';

interface APAViewProps {
  setCurrentView: (view: ViewState) => void;
  citations: Citation[];
  setCitations: React.Dispatch<React.SetStateAction<Citation[]>>;
  citationProjects: CitationProject[];
  setCitationProjects: React.Dispatch<React.SetStateAction<CitationProject[]>>;
}

const APAView: React.FC<APAViewProps> = ({ setCurrentView, citations, setCitations, citationProjects, setCitationProjects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleStartExtraction = async (url: string) => {
    if (!url.trim() || isExtracting) return;
    setIsExtracting(true);
    try {
      const data = await extractMetadata(url);
      const newCitationItem: Citation = {
        id: crypto.randomUUID(),
        projectId: selectedProjectId || undefined,
        originalUrl: url,
        apaString: `${data.author}. (${data.date}). ${data.title}. ${data.siteName}. ${data.url}`,
        title: data.title,
        author: data.author,
        year: data.date,
        source: data.siteName,
        type: data.type,
        timestamp: Date.now(),
        groundingSources: data.groundingSources
      };
      setCitations([newCitationItem, ...citations]);
      setSearchQuery('');
    } catch (e) { alert("Error al extraer datos."); }
    finally { setIsExtracting(false); }
  };

  const filteredCitations = useMemo(() => {
    if (!selectedProjectId) return citations;
    return citations.filter(c => c.projectId === selectedProjectId);
  }, [citations, selectedProjectId]);

  return (
    <>
      <div className="animate-slideUp space-y-8 pb-20">
        <button onClick={() => setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors hover:text-indigo-600">← Volver al Menú Principal</button>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mis Proyectos / Materias</h3>
            <button onClick={() => setIsAddingProject(true)} className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">+ Nueva Materia</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
            <button onClick={() => setSelectedProjectId(null)} className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${!selectedProjectId ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-50'}`}>Todas</button>
            {citationProjects.map(proj => (
              <button key={proj.id} onClick={() => setSelectedProjectId(proj.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selectedProjectId === proj.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-50'}`}>{proj.name}</button>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-indigo-600 uppercase tracking-tight">APA 7 Automatizado</h2>
          <div className="flex gap-3">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="URL del sitio..." className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none font-bold" />
            <button onClick={() => handleStartExtraction(searchQuery)} disabled={isExtracting} className={`px-8 rounded-2xl font-black uppercase text-[10px] text-white ${isExtracting ? 'bg-gray-400' : 'bg-indigo-600'}`}>{isExtracting ? 'Analizando...' : 'Extraer'}</button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCitations.map(c => <CitationItem key={c.id} citation={c} onDelete={id => setCitations(citations.filter(cit => cit.id !== id))} />)}
        </div>
      </div>

      {isAddingProject && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl space-y-6 text-center my-auto">
            <h3 className="text-xl font-black text-gray-900 uppercase">Nueva Materia</h3>
            <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="Ej. Historia" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none text-center" />
            <div className="flex gap-3">
              <button onClick={() => { setIsAddingProject(false); setNewProjectName(''); }} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
              <button onClick={() => { if(!newProjectName.trim()) return; const newProj = { id: crypto.randomUUID(), name: newProjectName.trim(), timestamp: Date.now() }; setCitationProjects([...citationProjects, newProj]); setSelectedProjectId(newProj.id); setIsAddingProject(false); setNewProjectName(''); }} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-indigo-100">Crear</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default APAView;
