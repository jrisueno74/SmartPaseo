import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const GOOGLE_MAPS_FULL_ROUTE =
  'https://www.google.com/maps/dir/Hotel+Afonso+V+%26+SPA,+Rua+de+Doutor+Manuel+das+Neves,+Aveiro,+Portugal/Aveiro+Museum,+Avenida+Santa+Joana,+Aveiro,+Portugal/Forum+Aveiro,+Rua+do+Batalh%C3%A3o+de+Ca%C3%A7adores+10+Store+2.2a,+Aveiro,+Portugal/Ponte+dos+La%C3%A7os+de+Amizade,+Cais+do+C%C3%B4jo,+Aveiro,+Portugal/Pra%C3%A7a+do+Peixe+Aveiro,+Largo+da+Pra%C3%A7a+do+Peixe,+Aveiro,+Portugal/data=!4m32!4m31!1m5!1m1!19sChIJ67ZeTgiYIw0RBqfLuaHyu6o!2m2!1d-8.6472962999999989!2d40.637161899999995!1m5!1m1!19sChIJ_x7nY32iIw0R8BkOtYYsOFk!2m2!1d-8.6509489999999989!2d40.639299!1m5!1m1!19sChIJ0ZyhTASYIw0RXpirk-7k5D4!2m2!1d-8.6518787!2d40.6409327!1m5!1m1!19sChIJHSLRpQWYIw0R_LfjRR35JjQ!2m2!1d-8.6500073!2d40.6415837!1m5!1m1!19sChIJr5YHJgKZIw0RagwjmYocK20!2m2!1d-8.6553509!2d40.6422472!3e2';

const STORAGE_KEY = 'smartpaseo_visited_stops';

const stops = [
  {
    id: 'forum-aveiro',
    time: '10:00',
    title: 'Fórum Aveiro',
    subtitle: 'Centro comercial al aire libre, punto de encuentro · Rua Batalhão Caçadores · 15 min',
    icon: 'storefront',
    color: 'secondary',
    mapsQuery: 'Fórum Aveiro Rua Batalhão Caçadores Aveiro Portugal',
  },
  {
    id: 'canal-central',
    time: '10:15',
    title: 'Canal Central de Aveiro',
    subtitle: 'Canal principal con moliceiros pintados · Cais dos Botirões · 30 min',
    icon: 'directions_boat',
    color: 'tertiary',
    mapsQuery: 'Canal Central de Aveiro Cais dos Botirões Portugal',
  },
  {
    id: 'museu-aveiro',
    time: '10:45',
    title: 'Museu de Aveiro / Santa Joana',
    subtitle: 'Monasterio gótico convertido en museo · Av. Santa Joana Princesa · 45 min',
    icon: 'church',
    color: 'primary',
    mapsQuery: 'Museu de Aveiro Santa Joana Aveiro Portugal',
  },
  {
    id: 'se-catedral',
    time: '11:30',
    title: 'Sé Catedral de Aveiro',
    subtitle: 'Catedral barroca en el corazón de la ciudad · Praça Marquês de Pombal · 20 min',
    icon: 'account_balance',
    color: 'primary',
    mapsQuery: 'Sé Catedral de Aveiro Praça Marquês de Pombal Portugal',
  },
  {
    id: 'praca-peixe',
    time: '11:50',
    title: 'Praça do Peixe',
    subtitle: 'Plaza del mercado de pescado, ideal para café · Rua do Clube dos Galitos · 20 min',
    icon: 'restaurant',
    color: 'secondary',
    mapsQuery: 'Praça do Peixe Aveiro Rua do Clube dos Galitos Portugal',
  },
  {
    id: 'bairro-beira-mar',
    time: '12:10',
    title: 'Bairro da Beira-Mar',
    subtitle: 'Casas coloridas Art Nouveau y azulejos · Av. Dr. Lourenço Peixinho · 25 min',
    icon: 'grid_view',
    color: 'tertiary',
    mapsQuery: 'Bairro da Beira-Mar Aveiro Av Dr Lourenço Peixinho Portugal',
  },
  {
    id: 'jardim-publico',
    time: '12:35',
    title: 'Jardim Público de Aveiro',
    subtitle: 'Parque tranquilo para descansar · R. João Mendonça · 25 min',
    icon: 'park',
    color: 'secondary',
    mapsQuery: 'Jardim Público de Aveiro R João Mendonça Portugal',
  },
];

function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveVisited(visited: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
}

export default function RoutePage() {
  const [visited, setVisited] = useState<Set<string>>(() => loadVisited());

  useEffect(() => {
    saveVisited(visited);
    // Dispatch event so ProfilePage can react if open
    window.dispatchEvent(new Event('smartpaseo_visited_changed'));
  }, [visited]);

  function toggleVisited(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function openMaps(query: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  }

  const visitedCount = visited.size;

  return (
    <div className="px-6 py-4 space-y-6">
      <section>
        <span className="inline-block bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3">
          Hoy · Aveiro, Portugal
        </span>
        <h1 className="font-headline font-extrabold text-3xl text-primary leading-tight">
          Ruta de Mañana
        </h1>
        <p className="text-on-surface-variant font-medium mt-1">
          Desde Hotel Afonso V · {stops.length} paradas · ~3h a pie
        </p>
      </section>

      <div className="bg-surface-container-highest rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Estado</p>
            <p className="font-headline font-black text-xl text-on-surface">
              {visitedCount === 0
                ? 'En ruta'
                : visitedCount === stops.length
                ? '¡Ruta completada!'
                : `${visitedCount}/${stops.length} paradas visitadas`}
            </p>
          </div>
          <Link
            to="/chat"
            className="signature-gradient text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Preguntar a la IA
          </Link>
        </div>
        {visitedCount > 0 && (
          <div className="mt-3 relative z-10">
            <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div
                className="h-full signature-gradient rounded-full transition-all"
                style={{ width: `${(visitedCount / stops.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <a
        href={GOOGLE_MAPS_FULL_ROUTE}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 hover:bg-surface-container transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              map
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-headline font-bold text-on-surface">Abrir en Google Maps</h3>
            <p className="text-xs text-on-surface-variant">Ver la ruta completa con navegación paso a paso</p>
          </div>
          <span className="material-symbols-outlined text-primary">open_in_new</span>
        </div>
      </a>

      <ol className="relative space-y-4 before:content-[''] before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-outline-variant/40">
        {stops.map((s, i) => {
          const isVisited = visited.has(s.id);
          return (
            <li key={i} className="relative flex gap-4 items-start">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-all ${
                  isVisited
                    ? 'bg-secondary-container text-on-secondary-container ring-2 ring-secondary'
                    : s.color === 'primary'
                    ? 'bg-primary text-on-primary'
                    : s.color === 'secondary'
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-tertiary-container text-on-tertiary-container'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isVisited ? 'check_circle' : s.icon}
                </span>
              </div>
              <div
                className={`flex-1 rounded-2xl p-4 transition-colors cursor-pointer select-none ${
                  isVisited
                    ? 'bg-surface-container-high opacity-70'
                    : 'bg-surface-container-low hover:bg-surface-container-high'
                }`}
                onClick={() => openMaps(s.mapsQuery)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openMaps(s.mapsQuery)}
                aria-label={`Abrir ${s.title} en Google Maps`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-primary">{s.time}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleVisited(s.id, e)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                        isVisited
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                      aria-label={isVisited ? 'Marcar como no visitado' : 'Marcar como visitado'}
                    >
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isVisited ? 'check' : 'radio_button_unchecked'}
                      </span>
                    </button>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      open_in_new
                    </span>
                  </div>
                </div>
                <h3 className={`font-headline font-bold text-on-surface mt-1 ${isVisited ? 'line-through opacity-60' : ''}`}>{s.title}</h3>
                <p className="text-xs text-on-surface-variant">{s.subtitle}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
        <h3 className="font-headline font-bold text-on-surface flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary">restaurant</span>
          Dónde comer (Zona Beira Mar)
        </h3>
        <div className="space-y-3">
          <div
            className="bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:bg-surface-container transition-colors"
            onClick={() => openMaps('Restaurante O Bairro Aveiro Portugal')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openMaps('Restaurante O Bairro Aveiro Portugal')}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-headline font-bold text-on-surface">Restaurante O Bairro</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-surface-container-highest px-2 py-1 rounded-full font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  4.7
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">open_in_new</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Cocina portuguesa contemporánea con platos de pescado creativos. Ambiente fantástico.
            </p>
          </div>
          <div
            className="bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:bg-surface-container transition-colors"
            onClick={() => openMaps('O Batel Restaurante Aveiro Portugal')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openMaps('O Batel Restaurante Aveiro Portugal')}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-headline font-bold text-on-surface">O Batel</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-surface-container-highest px-2 py-1 rounded-full font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  4.6
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">open_in_new</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Cocina tradicional: arroces caldosos, arroz de marisco y pescado fresco de la zona.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
