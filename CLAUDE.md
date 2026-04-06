# SmartPaseo AI — Project Notes

## Gemini API + Netlify Functions: Lessons Learned

### Model Names
- **Always use ListModels** to discover available models for the user's API key.
  Endpoint: `GET https://generativelanguage.googleapis.com/v1beta/models?key={KEY}`
  Filter by `supportedGenerationMethods.includes("generateContent")`.
- Model IDs change frequently. Gists and docs go stale. ListModels is the source of truth.
- As of April 2026, confirmed working: `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.0-flash`.

### REST API Gotchas (Netlify Functions)
- **Do NOT use `@google/genai` SDK in Netlify Functions.** Bundling issues (ESM/CJS conflicts) cause silent deploy failures. Use `fetch()` directly against the REST API instead.
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}`
- **`systemInstruction` field is NOT supported on all model+version combos.** Safest approach: inject system instructions as the first user/model message pair in `contents[]`.
- **`contents[0]` must have `role: "user"`.** Gemini rejects requests where the first content has `role: "model"`.
- Function file must be `.mjs` when `package.json` has `"type": "module"`.

### Netlify Config
- Use `force = true` on `/api/*` redirect to prevent SPA catch-all from intercepting API calls.
- API key goes in Netlify env as `GEMINI_API_KEY` (no VITE_ prefix — server-side only, not exposed to browser).
- Add a GET health check handler (`/api/chat`) and a `?test=1` param for live API verification.
- Add a `?list=1` param to call ListModels for debugging model availability.

### Free Tier Limits
- Free-tier quotas are **per-model**. If one model hits 429, switching to another model resets the counter.
- `gemini-2.5-flash` has the most generous free-tier quota.
- Pro models (`gemini-2.5-pro`) have lower free-tier limits.
- Error "limit: 0" means the daily quota is fully exhausted for that model.

### Architecture Pattern
```
Browser → /api/chat (Netlify Function) → Gemini REST API
```
- Frontend calls `/api/chat` (POST with `{messages: [...]}`)
- Netlify redirect maps `/api/*` → `/.netlify/functions/:splat`
- Function injects system instructions, calls Gemini, returns `{text: "..."}`
- No API keys exposed in frontend JavaScript.

## Tech Stack
- Vite + React 18 + TypeScript + Tailwind CSS
- Design system: Kinetic Horizon
- Deployment: Netlify (GitHub integration)
- AI: Google Gemini via REST API (serverless proxy)
