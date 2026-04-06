# SmartPaseo AI

Guía de viaje familiar con IA (Gemini) — pensada para familias con adolescentes.

## Stack
- Vite + React + TypeScript
- Tailwind CSS (Kinetic Horizon design system)
- Google Gemini (`@google/genai`)
- React Router

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY
npm run dev
```

Get an API key at https://aistudio.google.com/apikey

## Features
- **Route** — plan del día con paradas (hotel, restaurante, atracciones).
- **AI Chat** — concierge con las instrucciones del sistema SmartPaseo, streaming, y visión (envío de fotos).
- **Snack Radar** — recomendaciones de picoteo con "Gancho Social" y sugerencia on-demand del AI.
- **Profile** — XP familiar, retos pendientes, vitrina de trofeos, canje de puntos.

## Environment
| Var | Where | Purpose |
|---|---|---|
| `VITE_GEMINI_API_KEY` | `.env` or Netlify env vars | Google AI Studio key |

> **Note:** On Netlify, also add `GEMINI_API_KEY` (without VITE_ prefix) for the serverless proxy function. The `VITE_` prefixed key is only needed for local dev.
