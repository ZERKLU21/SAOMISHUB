
import React, { useState } from 'react';
import { ViewState } from '../types';
import { analyzeLocally, analyzeTextWithAI, AIDetectorResult } from '../services/aiDetectorLogic';

interface AIDetectorViewProps {
  setCurrentView: (view: ViewState) => void;
}

const AIDetectorView: React.FC<AIDetectorViewProps> = ({ setCurrentView }) => {
  const [text, setText] = useState('');
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [result, setResult] = useState<AIDetectorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'local' | 'ai'>('local');

  const handleLocalScan = () => {
    if (text.trim().split(/\s+/).length < 20) {
      setError("Necesito al menos 20 palabras para un análisis estadístico fiable.");
      return;
    }
    setError(null);
    setSource('local');
    setResult(analyzeLocally(text));
  };

  const handleAIScan = async () => {
    if (text.trim().length < 50) {
      setError("El texto es demasiado corto para una autopsia forense.");
      return;
    }
    setIsAnalyzingAI(true);
    setError(null);
    try {
      const res = await analyzeTextWithAI(text);
      setSource('ai');
      setResult(res);
    } catch (e) {
      setError("Error en el laboratorio de análisis. Intenta de nuevo.");
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const circumference = 339.29; 

  return (
    <div className="animate-slideUp space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <button onClick={() => setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-rose-600 transition-colors">← Volver al Hub</button>
        <div className="flex gap-2">
          <span className="text-[8px] font-black text-white bg-rose-600 px-3 py-1 rounded-lg uppercase shadow-lg shadow-rose-100 animate-pulse">Forensics v6.5 Pro</span>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[3rem] border-2 border-gray-100 shadow-xl space-y-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Análisis de Originalidad</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Detectamos patrones de perplejidad y variabilidad rítmica para identificar textos artificiales.
          </p>
        </div>

        <div className="relative">
          <textarea 
            value={text}
            onChange={(e) => { setText(e.target.value); if(result) setResult(null); }}
            placeholder="Pega el texto aquí para buscar la firma de la IA..."
            className="w-full h-64 p-8 bg-gray-50 rounded-[2.5rem] text-sm font-medium leading-relaxed outline-none border-2 border-transparent focus:border-rose-100 transition-all resize-none shadow-inner"
          />
          <div className="absolute bottom-6 right-8 text-[9px] font-black text-gray-300 uppercase tracking-widest">
            {text.split(/\s+/).filter(Boolean).length} palabras a procesar
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 animate-fadeIn">⚠️ {error}</div>}

        <div className="flex justify-center">
          <button 
            onClick={handleAIScan} 
            disabled={isAnalyzingAI || text.length < 50} 
            className={`w-full py-5 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95
              ${isAnalyzingAI ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'}`}
          >
            {isAnalyzingAI ? 'Realizando Autopsia...' : 'Validación Forense Pro'}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-slideUp space-y-6">
          <div className="bg-white p-10 rounded-[4rem] border-2 border-gray-100 shadow-2xl relative overflow-hidden">
            {/* Indicador de rigor */}
            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest">
              Laboratorio Forense Activo
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              
              <div className="relative w-56 h-56 flex-shrink-0">
                <svg className="w-full h-full rotate-[-90deg] overflow-visible" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="54" fill="none" stroke="#f1f5f9" strokeWidth="18" />
                  <circle 
                    cx="64" cy="64" r="54" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="18" 
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset="0"
                    className="transition-all duration-1000 ease-out"
                  />
                  {result.probability > 1 && (
                    <circle 
                      cx="64" cy="64" r="54" 
                      fill="none" 
                      stroke="#f43f5e" 
                      strokeWidth="18" 
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (circumference * result.probability) / 100}
                      className="transition-all duration-1000 ease-out"
                      style={{ 
                        transform: `rotate(${((100 - result.probability) / 100) * 360}deg)`,
                        transformOrigin: 'center'
                      }}
                    />
                  )}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-[-4px]">Humano</span>
                    <span className="text-5xl font-black text-gray-900 tracking-tighter">{Math.round(100 - result.probability)}%</span>
                    <div className="w-12 h-[3px] bg-gray-100 my-1 rounded-full"></div>
                    <span className="text-xl font-black text-rose-600 leading-none">{Math.round(result.probability)}%</span>
                    <span className="text-[9px] font-black text-rose-300 uppercase tracking-widest">IA</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 ${result.probability < 35 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : result.probability < 65 ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                  <span className={`w-3 h-3 rounded-full ${result.probability < 35 ? 'bg-emerald-500' : result.probability < 65 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'}`}></span>
                  <h3 className="text-sm font-black uppercase tracking-widest">{result.label}</h3>
                </div>
                
                <p className="text-base font-bold text-gray-600 leading-relaxed italic">
                  "{result.reasoning}"
                </p>

                {/* Métricas Técnicas Estilo Forense */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Perplejidad</span>
                      <span className="text-[10px] font-black text-gray-900">{result.metrics.perplexity}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${result.metrics.perplexity}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Variabilidad</span>
                      <span className="text-[10px] font-black text-gray-900">{result.metrics.burstiness}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: `${result.metrics.burstiness}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Uniformidad</span>
                      <span className="text-[10px] font-black text-gray-900">{result.metrics.uniformity}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${result.metrics.uniformity}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Evidencias Detectadas</h4>
              <div className="space-y-3">
                {result.keyFindings.map((f, i) => (
                  <div key={i} className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-xl">🔬</span>
                    <p className="text-[10px] font-bold text-gray-700 uppercase leading-tight">{f}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-[3rem] border-2 border-amber-100 space-y-4 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-7xl opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">👤</div>
              <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest px-2">¿Cómo interpretarlo?</h4>
              <p className="text-[11px] font-bold text-amber-900 leading-relaxed italic">
                "Este modelo no busca solo palabras, sino la falta de alma en el ritmo. Los humanos somos caóticos; las máquinas son demasiado perfectas y predecibles."
              </p>
              <div className="pt-4 flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                    <p className="text-[9px] font-black text-amber-700 uppercase">Perplejidad alta = Texto humano / Único</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                    <p className="text-[9px] font-black text-amber-700 uppercase">Variabilidad alta = Ritmo orgánico humano</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDetectorView;
