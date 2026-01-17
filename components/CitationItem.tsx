
import React, { useState } from 'react';
import { Citation, SourceType } from '../types';

interface CitationItemProps {
  citation: Citation;
  onDelete: (id: string) => void;
}

const typeLabels: Record<SourceType, string> = {
  web: 'Web',
  libro: 'Libro',
  articulo: 'Artículo',
  blog: 'Blog',
  pdf: 'PDF'
};

const CitationItem: React.FC<CitationItemProps> = ({ citation, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(citation.apaString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 soft-shadow group transition-standard hover:border-indigo-200 relative">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black text-gray-500 rounded uppercase tracking-widest border border-gray-200">
                {typeLabels[citation.type || 'web']}
              </span>
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">APA 7</span>
            </div>
            <div className="font-times text-gray-800 leading-relaxed selection:bg-indigo-100 text-[15px]">
              {citation.apaString}
            </div>
          </div>
          
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-standard">
            <button 
              onClick={handleCopy}
              title="Copiar cita"
              className={`p-2 rounded-lg border transition-all ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-200'}`}
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              )}
            </button>
            <button 
              onClick={() => onDelete(citation.id)}
              title="Eliminar"
              className="p-2 rounded-lg border border-gray-100 text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        {/* Fixed: Mandatory Grounding Sources Display as per Search Grounding rules */}
        {citation.groundingSources && citation.groundingSources.length > 0 && (
          <div className="mt-2 pt-3 border-t border-gray-50">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Fuentes de Verificación (Grounding):</p>
            <div className="flex flex-wrap gap-2">
              {citation.groundingSources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[9px] font-bold text-indigo-500 hover:underline bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 transition-colors hover:bg-indigo-100 flex items-center gap-1.5"
                >
                  <span className="text-[10px]">🔗</span> {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      {copied && (
        <div className="absolute top-2 right-14 text-[8px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase">Copiado</div>
      )}
    </div>
  );
};

export default CitationItem;
