import { GoogleGenAI } from '@google/genai';
import { SMARTPASEO_SYSTEM_INSTRUCTIONS } from './systemInstructions';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
export const BOT_ID = (import.meta.env.VITE_BOT_ID as string) || 'jules';

export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
  image?: string; // base64 data URL
};

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!API_KEY) {
    throw new Error(
      'Missing VITE_GEMINI_API_KEY. Copy .env.example to .env and set your Google AI Studio key.'
    );
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
}

export function hasApiKey(): boolean {
  return !!API_KEY;
}

function toGenAIContents(history: ChatMessage[]) {
  return history.map((m) => {
    const parts: any[] = [{ text: m.text }];
    if (m.image) {
      const match = m.image.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: { mimeType: match[1], data: match[2] },
        });
      }
    }
    return { role: m.role, parts };
  });
}

export async function sendMessage(history: ChatMessage[]): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: toGenAIContents(history),
    config: {
      systemInstruction: SMARTPASEO_SYSTEM_INSTRUCTIONS,
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });
  return response.text ?? '';
}

export async function* streamMessage(
  history: ChatMessage[]
): AsyncGenerator<string> {
  const ai = getClient();
  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.0-flash-exp',
    contents: toGenAIContents(history),
    config: {
      systemInstruction: SMARTPASEO_SYSTEM_INSTRUCTIONS,
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });
  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
}
