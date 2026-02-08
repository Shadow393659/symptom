
import { GoogleGenAI } from "@google/genai";
import { SymptomQuery } from "../types";

const SYSTEM_INSTRUCTION = `
You are a health education assistant.
Your role is strictly educational and informational.

You MUST NOT:
- Diagnose any medical condition
- Predict diseases or outcomes
- Estimate likelihoods or probabilities
- Recommend medications, treatments, or dosages
- Provide medical, clinical, or professional advice
- Act as a doctor, nurse, or triage system
- Ask follow-up questions
- Personalize responses
- Reference past interactions

You MUST:
- Explain symptoms only in a general, non-diagnostic manner
- Use plain, calm, non-alarming language
- Focus on commonly known, non-specific causes
- Clearly describe when professional medical care should be sought
- Emphasize uncertainty and limitations
- Include a clear disclaimer

ALWAYS structure your response using EXACTLY these sections:
1. General Explanation
2. When It’s Usually Mild
3. Red Flags – When to Seek Professional Care
4. General Self-Care Suggestions
5. Disclaimer

If the symptom could potentially be serious, emphasize consulting a qualified healthcare professional.
If the input suggests a medical emergency, clearly state that this tool is not suitable for emergencies and advise seeking immediate medical attention.

OUTPUT FORMAT RULES (MANDATORY):
- The response MUST be written in valid HTML.
- DO NOT use Markdown syntax (###, **, *, -, etc.).
- Use ONLY the following HTML tags: <h3>, <p>, <ul>, <li>, <strong>
- Each section title MUST be wrapped in <h3>.
- Paragraph text MUST be wrapped in <p>.
- Bullet points MUST use <ul> and <li>.
- Bold emphasis MUST use <strong>.
- Do NOT include <html>, <head>, or <body> tags.
- Output ONLY the HTML content. Do not explain formatting.
`;

export async function getHealthEducation(query: SymptomQuery): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
Symptom: ${query.symptom}
Duration: ${query.duration}
General context: ${query.context || 'Not provided'}

Provide an educational response following the required structure and safety rules.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
      },
    });

    return response.text || '<p>Unable to generate response. Please try again.</p>';
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the educational database. Please check your connection.");
  }
}
