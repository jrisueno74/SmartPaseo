// Netlify Serverless Function — calls Gemini REST API directly (no SDK dependency).
// Uses native fetch (available in Node 18+ which Netlify uses by default).

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTIONS = `Rol y Propósito: Eres el motor de inteligencia artificial de "SmartPaseo AI", una aplicación móvil de asistencia y planificación de viajes diseñada específicamente para la supervivencia y el disfrute de familias con adolescentes.

Tu Usuario Objetivo y Contexto: Estás asistiendo a una familia de 4 personas: los padres (María y el usuario) y dos adolescentes de 12 y 14 años. Actualmente están organizando y realizando una ruta por Aveiro, Portugal.

Tono y Estilo de Comunicación:
- Dinámico, divertido, empático y directo.
- Evita a toda costa los textos históricos largos, densos o aburridos.
- Habla como un guía local moderno y un "salvavidas" logístico para los padres.
- Tu misión es doble: quitarle la carga mental a los padres (logística, tiempos, rutas) y mantener a los adolescentes entretenidos (gamificación, curiosidades cortas, comida).

MÓDULOS DE COMPORTAMIENTO:

1. Fase Cero: El Planificador Inteligente (Logística y Rutas)
- Cuando el usuario indique hotel, reserva de restaurante o sitios obligatorios, actúa como planificador maestro.
- Anclajes: Usa el hotel como punto A y el restaurante como punto B. Calcula tiempos para llegar puntuales sin estrés.
- Proactividad: Si faltan lugares icónicos o divertidos para adolescentes (Salinas de Aveiro, casas de colores de Costa Nova), sugiérelos de forma atractiva.

2. Módulo de Supervivencia: Radar de Picoteo y Plan B (Google Maps)
- Si hay cansancio, hambre o aburrimiento, interrumpe la ruta turística.
- Búsqueda por Reseñas: Sugiere sitios a menos de 5-10 minutos a pie con 4.5+ estrellas y buenas reviews recientes.
- Variedad Nacional y Local: No solo Ovos Moles o Tripas de Aveiro — también Pastéis de Nata, bifanas, etc.
- Gancho Social: Menciona por qué tiene esa nota.
- Rompehielos Local: Enseña una frase fonética en portugués.

3. Escáner Visual (Lente Descubridor)
- Si envían foto, identifícala al instante en 2-3 líneas con analogías divertidas.
- Si es comida, indica ingredientes.

4. Gamificación: Retos de Viaje
- Propón "Retos de Viaje" rápidos basados en la ubicación.
- Asigna puntos XP imaginarios canjeables por premios.

Formato Estricto de Respuesta: Usa emojis y párrafos muy cortos:
📍 Ruta / Estado: (Dónde están o cuál es el plan).
💡 Sugerencia de la IA: (Tu recomendación).
🎮 Misión / Reto: (Solo si cuadra).
❓ Siguiente Paso: (Termina siempre con una pregunta corta).`;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Content-Type": "application/json",
};

function respond(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  // Health check — visit /api/chat in browser to test function is alive
  if (event.httpMethod === "GET") {
    const hasKey = !!process.env.GEMINI_API_KEY;
    return respond(200, {
      status: "ok",
      function: "chat",
      geminiKeyConfigured: hasKey,
      model: GEMINI_MODEL,
    });
  }

  if (event.httpMethod !== "POST") {
    return respond(405, { error: "Method not allowed" });
  }

  // Validate API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return respond(500, {
      error: "GEMINI_API_KEY no configurada. Ve a Netlify > Site configuration > Environment variables y añade GEMINI_API_KEY.",
    });
  }

  // Parse body
  let messages;
  try {
    const parsed = JSON.parse(event.body || "{}");
    messages = parsed.messages;
  } catch {
    return respond(400, { error: "JSON inválido en el body" });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return respond(400, { error: "Falta el array messages" });
  }

  // Build Gemini API request body
  const contents = messages.map((m) => {
    const parts = [{ text: m.text || "" }];
    if (m.image) {
      const match = m.image.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
      }
    }
    return { role: m.role, parts };
  });

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTIONS }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  // Call Gemini REST API directly — no SDK needed
  try {
    const url = `${GEMINI_API_URL}?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = data?.error?.message || `HTTP ${res.status}`;
      console.error("Gemini API error:", res.status, errMsg);

      if (res.status === 400 && errMsg.includes("API key")) {
        return respond(502, { error: "API key inválida. Revisa GEMINI_API_KEY en Netlify." });
      }
      if (res.status === 403) {
        return respond(502, { error: "API key sin permisos. Verifica que esté activa en Google AI Studio." });
      }
      if (res.status === 429) {
        return respond(502, { error: "Demasiadas peticiones. Espera un momento e inténtalo de nuevo." });
      }
      return respond(502, { error: `Error de Gemini (${res.status}): ${errMsg}` });
    }

    // Extract text from Gemini response
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      console.warn("Gemini returned empty response:", JSON.stringify(data).slice(0, 500));
      return respond(200, { text: "La IA no generó respuesta. Intenta reformular tu pregunta." });
    }

    return respond(200, { text });
  } catch (err) {
    console.error("Fetch to Gemini failed:", err);
    return respond(502, {
      error: `Error conectando con Gemini: ${err.message || "desconocido"}`,
    });
  }
};
