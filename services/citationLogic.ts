
import { GoogleGenAI, Type } from "@google/genai";
import { CitationFormData, SourceType } from '../types';

/**
 * Servicio para extraer metadatos de una URL usando Google Gemini con Grounding de búsqueda.
 */
export const extractMetadata = async (urlInput: string): Promise<CitationFormData> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY no configurada. Verifica que la llave de Google AI Studio esté presente.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Como experto bibliotecario y especialista en Normas APA 7ª edición, analiza exhaustivamente esta URL: ${urlInput}

Tu objetivo es extraer los metadatos exactos para crear una referencia bibliográfica perfecta.

INSTRUCCIONES DE EXTRACCIÓN:
1. AUTOR: Busca el autor individual. Si no hay, busca el autor corporativo.
2. FECHA: Año de publicación o "s. f.".
3. TÍTULO: Título del contenido específico.
4. SITIO WEB: Nombre comercial del sitio.
5. TIPO: 'web', 'libro', 'articulo', 'blog', o 'pdf'.
6. URL: Devuelve la URL proporcionada.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            author: { type: Type.STRING },
            date: { type: Type.STRING },
            title: { type: Type.STRING },
            siteName: { type: Type.STRING },
            type: { type: Type.STRING },
            url: { type: Type.STRING }
          },
          required: ["author", "date", "title", "siteName", "type", "url"]
        }
      }
    });

    if (!response.text) {
      throw new Error("La IA devolvió una respuesta vacía. Intenta con otro link.");
    }

    const data = JSON.parse(response.text.trim());
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingSources = groundingChunks?.map((chunk: any) => {
      if (chunk.web) {
        return {
          title: chunk.web.title || "Fuente verificada",
          url: chunk.web.uri
        };
      }
      return null;
    }).filter(Boolean) as Array<{ title: string; url: string }> || [];

    const validTypes: SourceType[] = ['web', 'libro', 'articulo', 'blog', 'pdf'];
    const sourceType = validTypes.includes(data.type) ? data.type : 'web';

    return {
      author: data.author || 'Autor desconocido',
      date: data.date || 's. f.',
      title: data.title || 'Sin título',
      siteName: data.siteName || 'Sitio web',
      url: data.url || urlInput,
      type: sourceType,
      groundingSources
    };
  } catch (error: any) {
    console.error("Error técnico detallado:", error);
    
    // Diagnóstico detallado para el usuario (Opción 1)
    let detail = error.message || "Error desconocido";
    if (detail.includes("401")) detail = "Error 401: API Key inválida o no autorizada.";
    if (detail.includes("429")) detail = "Error 429: Límite de cuota excedido. Espera un minuto.";
    if (detail.includes("fetch")) detail = "Error de conexión: El entorno (EXE) bloqueó la petición a Google (CORS).";
    
    throw new Error(detail);
  }
};
