
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API client directly with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCertificateQuote = async (courseName: string, studentName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a high-vibration, mystical, and encouraging one-sentence congratulatory quote for ${studentName} who has completed a course in ${courseName}. Focus on wisdom and enlightenment.`,
    });
    return response.text || "May your path be illuminated with celestial wisdom.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The stars align for your success.";
  }
};

export const generateDailyInsight = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short (max 20 words), powerful daily mystical guidance or cosmic insight for a student of Numerology and Vastu. It should sound professional yet spiritual. Today is ${new Date().toDateString()}.`,
    });
    return response.text || "Align your workspace with the eastern sun today to unlock hidden creative potential.";
  } catch (error) {
    return "The universe conspires in your favor when your intentions are clear and your heart is open.";
  }
};

export const generateCourseSummary = async (courseDescription: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this course description in 2 catchy bullet points: ${courseDescription}`,
    });
    return response.text || "• Professional curriculum • Expert guidance";
  } catch (error) {
    return "• Master mystical arts • Practical knowledge";
  }
};
