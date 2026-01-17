
import { GoogleGenAI, Type } from "@google/genai";
import { CitationFormData, SourceType } from '../types';

/**
 * Servicio para extraer metadatos de una URL usando Google Gemini con Grounding de búsqueda.
 * Esto permite a la IA "visitar" virtualmente el sitio y extraer datos precisos.
 */
export const extractMetadata = async (urlInput: string): Promise<CitationFormData> => {
  // Always use {apiKey: ...} for GoogleGenAI initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prompt refinado para un análisis profundo del sitio web
  const prompt = `Como experto bibliotecario y especialista en Normas APA 7ª edición, analiza exhaustivamente esta URL: ${urlInput}

Tu objetivo es extraer los metadatos exactos para crear una referencia bibliográfica perfecta.

INSTRUCCIONES DE EXTRACCIÓN:
1. AUTOR: Busca el autor individual. Si no hay, busca el autor corporativo (la organización). Si es un blog, el nombre del blogger.
2. FECHA: Busca la fecha de publicación más reciente o la fecha de actualización. Solo el año. Si no hay absolutamente nada, usa "s. f.".
3. TÍTULO: El título del artículo, post o página específica. No incluyas el nombre del sitio aquí.
4. SITIO WEB: El nombre comercial del sitio web, portal de noticias o editorial.
5. TIPO: Clasifica estrictamente en: 'web', 'libro', 'articulo', 'blog', o 'pdf'.
6. URL: Devuelve la URL proporcionada.

Utiliza Google Search para verificar si existe información de autoría o fechas que no sean visibles a simple vista en el HTML base.`;

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
            author: { type: Type.STRING, description: "Nombre del autor completo o Institución" },
            date: { type: Type.STRING, description: "Año (ej. 2024) o 's. f.'" },
            title: { type: Type.STRING, description: "Título del contenido específico" },
            siteName: { type: Type.STRING, description: "Nombre del sitio web principal" },
            type: { type: Type.STRING, description: "Categoría: web, libro, articulo, blog, pdf" },
            url: { type: Type.STRING, description: "URL de la fuente" }
          },
          required: ["author", "date", "title", "siteName", "type", "url"]
        }
      }
    });

    // Access .text property directly and trim whitespace
    const text = response.text?.trim() || "{}";
    const data = JSON.parse(text);
    
    // Fix: MUST ALWAYS extract URLs from groundingChunks when using googleSearch
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingSources = groundingChunks?.map((chunk: any) => {
      if (chunk.web) {
        return {
          title: chunk.web.title || "Fuente web verificada",
          url: chunk.web.uri
        };
      }
      return null;
    }).filter(Boolean) as Array<{ title: string; url: string }> || [];

    // Validar tipo de fuente
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
  } catch (error) {
    console.error("Error en extractMetadata:", error);
    throw new Error("No se pudo conectar con el servicio de IA para analizar la URL.");
  }
};
