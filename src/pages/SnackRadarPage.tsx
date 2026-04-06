import { useState } from 'react';
import { sendMessage, hasApiKey } from '../lib/gemini';

type Snack = {
  name: string;
  tag: string;
  rating: number;
  distance: string;
  price: string;
  hook: string;
  description: string;
  mapsQuery: string;
};

const INITIAL_SNACKS: Snack[] = [
  {
    name: 'Ovos Moles',
    tag: 'National Treasure',
    rating: 4.8,
    distance: '350m',
    price: '€1.50',
    hook: 'Famoso por las obleas con forma de barco. Los hacían las monjas para aprovechar yemas sobrantes.',
    description: 'Crema de yema y azúcar dentro de una oblea fina. Alma pura de Aveiro.',
    mapsQuery: 'Ovos Moles Aveiro Portugal',
  },
  {
    name: 'Pastéis de Nata',
    tag: 'Global Icon',
    rating: 4.9,
    distance: '1.2km',
    price: '€1.20',
    hook: 'Los sirven calientes con canela. En Maps los usuarios repiten por el punto del caramelizado.',
    description: 'Hojaldre crujiente con crema pastelera caramelizada. Imprescindible.',
    mapsQuery: 'Pastéis de Nata pastelaria Aveiro Portugal',
  },
  {
    name: 'Tripas de Aveiro',
    tag: 'Local Street Food',
    rating: 4.6,
    distance: '500m',
    price: '€2.00',
    hook: 'No son tripas: son crepes finitas rellenas de crema. Los adolescentes se enganchan.',
    description: 'Obleas dobladas con dulce de huevo, chocolate o frutas. Para caminar y picar.',
    mapsQuery: 'Tripas de Aveiro doces Portugal',
  },
  {
    name: 'Café Martinho',
    tag: 'Café Tradicional',
    rating: 4.5,
    distance: '600m',
    price: '€1.00',
    hook: 'Café de barrio de toda la vida. Sitio donde desayunan los locales antes de la jornada.',
    description: 'Café expreso portugués con pastel de nata o tosta. Perfecto para la pausa de media mañana.',
    mapsQuery: 'Café Martinho Rua Coimbra Aveiro Portugal',
  },
  {
    name: 'Mercado do Peixe',
    tag: 'Experiencia Local',
    rating: 4.7,
    distance: '900m',
    price: '€8-15',
    hook: 'Mercado de pescado histórico reconvertido en restaurante. El arroz de marisco es legendario.',
    description: 'Pescado fresquísimo de la ría. Ambiente auténtico con el bullicio del mercado.',
    mapsQuery: 'Mercado do Peixe Aveiro Portugal restaurante',
  },
  {
    name: 'O Mercantel',
    tag: 'Tapas & Vinos',
    rating: 4.6,
    distance: '750m',
    price: '€3-6',
    hook: 'Bar de tapas moderno en el centro histórico. Perfectos para parar a media tarde.',
    description: 'Taberna con petiscos portugueses y buena selección de vinos locales.',
    mapsQuery: 'O Mercantel tapas Aveiro Portugal',
  },
];

const CURATED_SUGGESTION = `📍 Ruta / Estado: Centro histórico de Aveiro, cerca del canal.

💡 Sugerencia de la IA: Para los adolescentes, id directos a las **Tripas de Aveiro** — son obleas rellenas de crema (¡no tripas reales!) que se comen caminando. Encontráis en cualquier pastelería del centro. Precio: ~€2. Después, para los padres, un café expreso en el **Café Martinho** con un Pastel de Nata recién salido del horno.

🎮 Misión: ¿Quién adivina el ingrediente secreto de los Ovos Moles? Pista: son de color amarillo y se usan mucho en repostería portuguesa. +30 XP al que lo descubra.

❓ Siguiente Paso: ¿Queréis que os localice la pastelería más cercana con mejor puntuación en Google Maps?`;

export default function SnackRadarPage() {
  const [snacks] = useState<Snack[]>(INITIAL_SNACKS);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [loading, setLoading] = useState(false);

  function openMaps(query: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  }

  async function askAI() {
    setLoading(true);
    setAiSuggestion('');
    try {
      if (!hasApiKey()) {
        // Show curated suggestion when no API key
        await new Promise((r) => setTimeout(r, 800)); // simulate thinking
        setAiSuggestion(CURATED_SUGGESTION);
        return;
      }
      const text = await sendMessage([
        {
          role: 'user',
          text: 'Estamos en el centro de Aveiro, cerca del canal y la Praça do Peixe. Los adolescentes tienen hambre. Dame UNA sugerencia de picoteo siguiendo tu formato estricto con emojis.',
        },
      ]);
      setAiSuggestion(text || CURATED_SUGGESTION);
    } catch (e: any) {
      // On API error, show curated suggestion with error notice
      const msg = e?.message ?? '';
      if (msg.includes('API') || msg.includes('key') || msg.includes('401') || msg.includes('403') || msg.includes('servidor')) {
        setAiSuggestion(
          `⚠️ Para usar el chat IA, necesitas configurar tu API key de Gemini en Netlify.\n\nMientras tanto, aquí tienes una selección curada:\n\n${CURATED_SUGGESTION}`
        );
      } else {
        setAiSuggestion(`⚠️ Error al contactar con la IA: ${msg}\n\nSugerencia sin conexión:\n\n${CURATED_SUGGESTION}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 py-4 space-y-6">
      <section>
        <span className="inline-block bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3">
          AI-Powered Snack Radar
        </span>
        <h1 className="font-headline font-extrabold text-3xl text-primary leading-tight">
          Radar de Picoteo
        </h1>
        <p className="text-on-surface-variant font-medium mt-1">
          Prevención de meltdown activa · {snacks.length} spots cerca
        </p>
      </section>

      <div className="bg-surface-container-highest p-5 rounded-2xl border-l-4 border-primary">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            translate
          </span>
          <h3 className="font-headline text-sm font-bold uppercase tracking-wider">Rompehielos Local</h3>
        </div>
        <p className="italic text-xl text-primary-dim">"Queria um, por favor."</p>
        <p className="text-xs text-on-surface-variant font-medium">(Quería uno, por favor)</p>
      </div>

      <button
        onClick={askAI}
        disabled={loading}
        className="w-full py-4 signature-gradient text-white font-headline font-extrabold rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <span className="material-symbols-outlined">auto_awesome</span>
        {loading ? 'Pensando...' : 'Sugerir con IA qué picotear ahora'}
      </button>

      {aiSuggestion && (
        <div className="bg-surface-container-low p-5 rounded-2xl border-l-4 border-secondary whitespace-pre-wrap text-sm leading-relaxed">
          {aiSuggestion}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-headline font-bold text-xl">Objetivos de hoy</h3>
        <p className="text-xs text-on-surface-variant -mt-2">Toca una tarjeta para abrir en Google Maps</p>
        {snacks.map((s) => (
          <article
            key={s.name}
            className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm cursor-pointer hover:bg-surface-container-low transition-colors active:scale-[0.99]"
            onClick={() => openMaps(s.mapsQuery)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openMaps(s.mapsQuery)}
            aria-label={`Ver ${s.name} en Google Maps`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                  {s.tag}
                </p>
                <h4 className="font-headline font-extrabold text-xl text-on-surface">{s.name}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-lg">{s.price}</span>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">open_in_new</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3 text-xs font-bold">
              <span className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                {s.rating}
              </span>
              <span className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-sm">distance</span>
                {s.distance}
              </span>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border-l-2 border-secondary mb-2">
              <p className="text-[10px] font-bold text-secondary uppercase mb-1">Social Hook</p>
              <p className="text-xs font-medium">{s.hook}</p>
            </div>
            <p className="text-sm text-on-surface-variant">{s.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
