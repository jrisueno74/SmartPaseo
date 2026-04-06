// Netlify Serverless Function — calls Gemini REST API directly (no SDK).
// Uses native fetch (Node 18+).

const GEMINI_MODEL = "gemini-1.5-flash";

const SYSTEM_INSTRUCTIONS = `Eres el motor de IA de "SmartPaseo AI", app de viajes para familias con adolescentes. Asistes a una familia de 4 (padres María y usuario, adolescentes 12 y 14 años) en Aveiro, Portugal.

Tono: Dinámico, divertido, empático, directo. Evita textos largos. Guía local moderno + salvavidas logístico.

Módulos:
1. Planificador: Hotel como punto A, restaurante como punto B. Sugiere lugares icónicos.
2. Radar Picoteo: Si hay hambre/cansancio, sugiere sitios cercanos con 4.5+ estrellas. Incluye frase en portugués.
3. Escáner Visual: Si envían foto, identifica en 2-3 líneas con analogías divertidas.
4. Gamificación: Propón retos rápidos con puntos XP.

Formato:
📍 Ruta / Estado
💡 Sugerencia de la IA
🎮 Misión / Reto (si cuadra)
❓ Siguiente Paso (pregunta corta)`;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Content-Type": "application/json",
};

function respond(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

async function callGemini(apiKey, contents) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTIONS }],
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  console.log("Calling Gemini:", url.replace(apiKey, "***"));
  console.log("Request body:", JSON.stringify(body).slice(0, 500));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  console.log("Gemini status:", res.status);
  console.log("Gemini response:", rawText.slice(0, 1000));

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Gemini devolvió respuesta no-JSON (HTTP ${res.status}): ${rawText.slice(0, 200)}`);
  }

  if (!res.ok) {
    const errMsg = data?.error?.message || `HTTP ${res.status}`;
    throw new Error(`Gemini API error (${res.status}): ${errMsg}`);
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // GET = health check + live API test
  if (event.httpMethod === "GET") {
    const hasKey = !!apiKey;
    const result = { status: "ok", function: "chat", geminiKeyConfigured: hasKey, model: GEMINI_MODEL };

    // If ?test=1 is passed, make a real API call to verify everything works
    if (hasKey && event.queryStringParameters?.test === "1") {
      try {
        const text = await callGemini(apiKey, [
          { role: "user", parts: [{ text: "Di 'hola' y nada más." }] }
        ]);
        result.testResult = "SUCCESS";
        result.testResponse = text.slice(0, 200);
      } catch (err) {
        result.testResult = "FAILED";
        result.testError = err.message;
      }
    }

    return respond(200, result);
  }

  if (event.httpMethod !== "POST") {
    return respond(405, { error: "Method not allowed" });
  }

  if (!apiKey) {
    return respond(500, {
      error: "GEMINI_API_KEY no configurada en Netlify.",
    });
  }

  // Parse body
  let messages;
  try {
    const parsed = JSON.parse(event.body || "{}");
    messages = parsed.messages;
  } catch {
    return respond(400, { error: "JSON inválido" });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return respond(400, { error: "Falta el array messages" });
  }

  // Build Gemini contents — ensure first message is from user
  const contents = [];
  for (const m of messages) {
    if (contents.length === 0 && m.role !== "user") continue; // skip leading model msgs
    const parts = [{ text: m.text || "" }];
    if (m.image) {
      const match = m.image.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
      }
    }
    contents.push({ role: m.role, parts });
  }

  if (contents.length === 0) {
    return respond(400, { error: "No hay mensajes de usuario" });
  }

  try {
    const text = await callGemini(apiKey, contents);
    if (!text) {
      return respond(200, { text: "La IA no generó respuesta. Intenta de nuevo." });
    }
    return respond(200, { text });
  } catch (err) {
    console.error("callGemini failed:", err);
    return respond(502, { error: err.message });
  }
};
