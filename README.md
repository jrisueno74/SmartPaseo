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
| Var | Default | Purpose |
|---|---|---|
| `VITE_GEMINI_API_KEY` | — | Google AI Studio key |
| `VITE_BOT_ID` | `jules` | Identificador del bot |
