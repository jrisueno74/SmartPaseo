import { useState } from 'react';
import { Link } from 'react-router-dom';

const TIPS = [
  '💡 Consejo: Los moliceiros salen con más frecuencia por la mañana. Intentad llegar al canal antes de las 11h.',
  '🗺️ El Museu de Aveiro cierra los lunes. Hoy es buen día para visitarlo.',
  '🍰 Los Ovos Moles más auténticos están en la Confeitaria Peixinho, frente al canal.',
  '📸 La mejor foto de las casas Art Nouveau es desde el Puente de los Lazos de Amistad.',
  '⏱️ La ruta completa son ~3h a pie a ritmo tranquilo. Contad paradas de snack.',
];

export default function TopAppBar() {
  const [tipIndex, setTipIndex] = useState<number | null>(null);

  function showTip() {
    const next = tipIndex === null ? 0 : (tipIndex + 1) % TIPS.length;
    setTipIndex(next);
  }

  function closeTip() {
    setTipIndex(null);
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-16 w-full bg-surface">
        <Link to="/" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">deployed_code</span>
          <h1 className="font-headline font-black text-xl tracking-tight text-primary">
            SmartPaseo AI
          </h1>
        </Link>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <button
            onClick={showTip}
            className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center relative"
            aria-label="Consejos de viaje"
          >
            <span className="material-symbols-outlined">notifications</span>
            {tipIndex === null && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface" />
            )}
          </button>
        </div>
      </header>

      {tipIndex !== null && (
        <div
          className="mx-4 mt-1 mb-2 bg-surface-container-highest rounded-2xl p-4 flex items-start gap-3 shadow-md border border-outline-variant/20 z-30 relative"
          role="alert"
        >
          <span
            className="material-symbols-outlined text-primary shrink-0 mt-0.5"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lightbulb
          </span>
          <p className="text-sm text-on-surface flex-1 leading-relaxed">{TIPS[tipIndex]}</p>
          <button
            onClick={closeTip}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high shrink-0"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </>
  );
}
