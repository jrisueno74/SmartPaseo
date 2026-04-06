const { GoogleGenAI } = require("@google/genai");

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
- Gancho Social: Menciona por qué tiene esa nota ("4.8 en Maps porque dicen que los pasteles salen calientes cada media hora").
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

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "GEMINI_API_KEY not configured in Netlify environment variables" }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}");
    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing messages array" }) };
    }

    const contents = messages.map((m) => {
      const parts = [{ text: m.text }];
      if (m.image) {
        const match = m.image.match(/^data:(.+);base64,(.+)$/);
        if (match) {
          parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
        }
      }
      return { role: m.role, parts };
    });

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: response.text || "" }),
    };
  } catch (err) {
    console.error("Gemini proxy error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Internal server error" }),
    };
  }
};
