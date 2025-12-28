
import { GoogleGenAI } from "@google/genai";

export const generateSmartDescription = async (keywords: string): Promise<string> => {
  // Safe access to process.env
  let apiKey: string | undefined;
  try {
    apiKey = process.env.API_KEY;
  } catch (e) {
    console.warn("Environnement non configuré pour l'IA (process.env inaccessible).");
  }
  
  if (!apiKey) {
      console.warn("API Key manquante. Mode hors-ligne simulé.");
      return `Je recherche un professionnel compétent pour : ${keywords}. Besoin de sérieux et de ponctualité.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";
    const prompt = `
      Tu es un assistant pour l'application JobLibre au Gabon.
      L'utilisateur veut poster une annonce de job.
      Voici ses mots-clés ou sa description brute : "${keywords}".
      Rédige une description d'annonce courte, claire, professionnelle et rassurante (max 30 mots).
      Ton : Utile et direct.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text?.trim() || "Description générée automatiquement.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Je recherche un professionnel pour : ${keywords}.`;
  }
};
