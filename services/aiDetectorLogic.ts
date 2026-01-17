
import { GoogleGenAI, Type } from "@google/genai";

export interface AIDetectorResult {
  probability: number;
  label: 'Humano' | 'Dudoso' | 'Probable IA' | 'IA Altamente Probable';
  reasoning: string;
  keyFindings: string[];
  metrics: {
    perplexity: number; // Predictibilidad del lenguaje
    burstiness: number; // Variabilidad del ritmo
    uniformity: number; // Consistencia sintáctica
  };
}

/**
 * MÉTODO 1: DETECTOR ESTADÍSTICO (SIN IA)
 * Basado en reglas lingüísticas, entropía y variabilidad rítmica.
 */
export const analyzeLocally = (text: string): AIDetectorResult => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  if (words.length < 25) {
    return {
      probability: 5,
      label: 'Humano',
      reasoning: "Muestra insuficiente para un análisis forense confiable.",
      keyFindings: ["Texto demasiado breve para extraer patrones estadísticos."],
      metrics: { perplexity: 10, burstiness: 100, uniformity: 0 }
    };
  }

  // 1. CÁLCULO DE BURSTINESS (Variabilidad de longitud - Firma Humana)
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLen, 2), 0) / sentenceLengths.length;
  const stdDev = Math.sqrt(variance);
  
  // Normalización: stdDev > 10 es muy humano. < 4 es sospecha de IA (ritmo plano).
  const burstinessScore = Math.min((stdDev / 12) * 100, 100);

  // 2. CÁLCULO DE PERPLEJIDAD (Predictibilidad / N-Gramas comunes)
  const AI_CONNECTORS = [
    "en conclusión", "por otro lado", "asimismo", "es importante destacar", 
    "en este sentido", "cabe mencionar", "a través de", "un papel fundamental",
    "en el mundo actual", "fundamentalmente", "impacto significativo"
  ];
  let connectorCount = 0;
  AI_CONNECTORS.forEach(c => { if(text.toLowerCase().includes(c)) connectorCount++; });
  
  // A más conectores de "relleno", menor perplejidad (más predecible)
  const perplexityScore = Math.max(0, 100 - (connectorCount * 18));

  // 3. UNIFORMIDAD SINTÁCTICA (Falta de estilo personal)
  const startWords = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase());
  const uniqueStarts = new Set(startWords).size;
  const uniformityScore = (1 - (uniqueStarts / sentences.length)) * 100;

  // Lógica de decisión estadística calibrada
  let aiProb = 0;
  
  // Si el ritmo es plano (IA), penalizamos fuerte
  if (burstinessScore < 35) aiProb += 50; 
  else if (burstinessScore < 50) aiProb += 25;

  // Si es muy predecible (IA), penalizamos
  if (perplexityScore < 45) aiProb += 40;
  else if (perplexityScore < 60) aiProb += 20;

  // Si la estructura es repetitiva
  if (uniformityScore > 65) aiProb += 10;

  // Factor de seguridad: Si el texto es corto, reducimos la certeza para evitar falsos positivos
  if (words.length < 80) aiProb *= 0.75;

  // Aplicamos un límite de seguridad
  aiProb = Math.min(Math.max(aiProb, 2), 99);

  let label: AIDetectorResult['label'] = 'Humano';
  if (aiProb > 85) label = 'IA Altamente Probable';
  else if (aiProb > 65) label = 'Probable IA';
  else if (aiProb > 38) label = 'Dudoso';

  const findings = [];
  if (burstinessScore < 40) findings.push("Ritmo plano: Las oraciones tienen longitudes demasiado uniformes.");
  if (perplexityScore < 55) findings.push("Alta predictibilidad: Uso frecuente de conectores genéricos de IA.");
  if (uniformityScore > 60) findings.push("Monotonía estructural: Poca variedad en el inicio de las frases.");

  return {
    probability: aiProb,
    label,
    reasoning: aiProb > 60 
      ? "El análisis detecta una uniformidad rítmica y una predictibilidad estructural que son firmas clásicas de modelos como GPT o Claude."
      : "Se observa un flujo orgánico con variaciones naturales en la longitud de las frases, típico de la redacción humana.",
    keyFindings: findings,
    metrics: {
      perplexity: Math.round(perplexityScore),
      burstiness: Math.round(burstinessScore),
      uniformity: Math.round(uniformityScore)
    }
  };
};

/**
 * MÉTODO 2: DETECTOR CON IA (AUTOPSIA LINGÜÍSTICA PRO)
 * Utiliza Gemini Pro como clasificador forense para detectar la "voz robótica".
 */
export const analyzeTextWithAI = async (textInput: string): Promise<AIDetectorResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `ERES UN EXPERTO EN LINGÜÍSTICA COMPUTACIONAL Y DETECCIÓN DE FRAUDE ACADÉMICO.
Tu misión es actuar como un detector de IA de "Cero Tolerancia".

CRITERIOS DE DETECCIÓN (IA SIGNATURES):
1. ESTRUCTURA DE SÁNDWICH: Intro perfecta -> Puntos claros -> Conclusión resumen.
2. NEUTRALIDAD FORZADA: El texto es excesivamente equilibrado, objetivo y carece de sesgo personal o jerga.
3. BUZZWORDS DE LLM: Uso de 'crucial', 'fundamental', 'diversos factores', 'es importante destacar'.
4. PERFECCIÓN GRAMATICAL: Ausencia total de errores de puntuación o variaciones rítmicas humanas.

REGLAS:
- Si el texto parece escrito por un manual o asistente, pon la probabilidad por encima del 90%.
- Si detectas "voz de asistente", etiqueta como 'IA Altamente Probable'.
- Si tienes dudas reales (50/50), inclínate por 'Dudoso' para evitar falsos positivos injustos.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `REALIZA UN ANÁLISIS FORENSE DE ESTE TEXTO. BUSCA LA FIRMA DE GPT. Devuelve estrictamente JSON.
      TEXTO: "${textInput.substring(0, 5000)}"`,
      config: { 
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            probability: { type: Type.NUMBER, description: "Probabilidad 0-100" },
            label: { type: Type.STRING, description: "Humano, Dudoso, Probable IA, IA Altamente Probable" },
            reasoning: { type: Type.STRING, description: "Explicación breve del veredicto" },
            keyFindings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 2-3 hallazgos clave" },
            metrics: {
              type: Type.OBJECT,
              properties: {
                perplexity: { type: Type.NUMBER },
                burstiness: { type: Type.NUMBER },
                uniformity: { type: Type.NUMBER }
              },
              required: ["perplexity", "burstiness", "uniformity"]
            }
          },
          required: ["probability", "label", "reasoning", "keyFindings", "metrics"]
        }
      }
    });
    
    return JSON.parse(response.text?.trim() || "{}");
  } catch (error) {
    console.error("Error en validación forense:", error);
    return analyzeLocally(textInput);
  }
};
