import { GoogleGenAI } from '@google/genai';
import { SMARTPASEO_SYSTEM_INSTRUCTIONS } from './systemInstructions';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const IS_LOCAL = !!API_KEY;

export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
  image?: string; // base64 data URL
};

export function hasApiKey(): boolean {
  return IS_LOCAL || import.meta.env.PROD;
}

/**
 * Gemini requires contents to start with a "user" role message.
 * The UI welcome message has role "model" — strip leading model messages
 * before sending to the API.
 */
function sanitizeHistory(history: ChatMessage[]): ChatMessage[] {
  const firstUserIdx = history.findIndex((m) => m.role === 'user');
  if (firstUserIdx === -1) return history;
  return history.slice(firstUserIdx);
}

// --- Netlify proxy path (production) ---

async function sendViaProxy(history: ChatMessage[]): Promise<string> {
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: sanitizeHistory(history) }),
    });
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Comprueba tu conexión a internet.'
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Error del servidor (${res.status})`);
  }

  const data = await res.json();
  if (!data.text) {
    throw new Error('La IA devolvió una respuesta vacía. Intenta de nuevo.');
  }
  return data.text;
}

// --- Direct Gemini SDK path (local dev) ---

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!API_KEY) {
    throw new Error(
      'Missing VITE_GEMINI_API_KEY. Copy .env.example to .env and set your key.'
    );
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
}

function toGenAIContents(history: ChatMessage[]) {
  return sanitizeHistory(history).map((m) => {
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

async function sendDirect(history: ChatMessage[]): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
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

// --- Public API ---

export async function sendMessage(history: ChatMessage[]): Promise<string> {
  if (IS_LOCAL) return sendDirect(history);
  return sendViaProxy(history);
}

export async function* streamMessage(
  history: ChatMessage[]
): AsyncGenerator<string> {
  // Proxy doesn't support streaming — use single response and yield it all
  if (!IS_LOCAL) {
    const text = await sendViaProxy(history);
    yield text;
    return;
  }

  const ai = getClient();
  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
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
