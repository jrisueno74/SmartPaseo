import { Link } from 'react-router-dom';

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/dir/Hotel+Afonso+V+%26+SPA,+Rua+de+Doutor+Manuel+das+Neves,+Aveiro,+Portugal/Aveiro+Museum,+Avenida+Santa+Joana,+Aveiro,+Portugal/Forum+Aveiro,+Rua+do+Batalh%C3%A3o+de+Ca%C3%A7adores+10+Store+2.2a,+Aveiro,+Portugal/Ponte+dos+La%C3%A7os+de+Amizade,+Cais+do+C%C3%B4jo,+Aveiro,+Portugal/Pra%C3%A7a+do+Peixe+Aveiro,+Largo+da+Pra%C3%A7a+do+Peixe,+Aveiro,+Portugal/data=!4m32!4m31!1m5!1m1!19sChIJ67ZeTgiYIw0RBqfLuaHyu6o!2m2!1d-8.6472962999999989!2d40.637161899999995!1m5!1m1!19sChIJ_x7nY32iIw0R8BkOtYYsOFk!2m2!1d-8.6509489999999989!2d40.639299!1m5!1m1!19sChIJ0ZyhTASYIw0RXpirk-7k5D4!2m2!1d-8.6518787!2d40.6409327!1m5!1m1!19sChIJHSLRpQWYIw0R_LfjRR35JjQ!2m2!1d-8.6500073!2d40.6415837!1m5!1m1!19sChIJr5YHJgKZIw0RagwjmYocK20!2m2!1d-8.6553509!2d40.6422472!3e2';

const stops = [
  {
    time: '10:00',
    title: 'Catedral & Museo de Aveiro',
    subtitle: 'Sé de Aveiro + Museo Santa Joana · claustro y barroco · 45 min',
    icon: 'church',
    color: 'primary',
  },
  {
    time: '10:45',
    title: 'Forum Aveiro & Puente de los Lazos',
    subtitle: 'Centro comercial al aire libre + cintas de colores de estudiantes · 30 min',
    icon: 'storefront',
    color: 'secondary',
  },
  {
    time: '11:15',
    title: 'Paseo en Moliceiro',
    subtitle: 'Barco por los canales · Art Nouveau desde el agua · 45 min',
    icon: 'directions_boat',
    color: 'tertiary',
  },
  {
    time: '12:15',
    title: 'Barrio Beira Mar & Ovos Moles',
    subtitle: 'Callejuelas de azulejos + Oficina do Doce para probar Ovos Moles',
    icon: 'bakery_dining',
    color: 'secondary',
  },
  {
    time: '13:00',
    title: 'Praça do Peixe — Comida',
    subtitle: 'Restaurante O Bairro o O Batel · cocina portuguesa · arroz de marisco',
    icon: 'restaurant',
    color: 'primary',
  },
];

export default function RoutePage() {
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
            <p className="font-headline font-black text-xl text-on-surface">En ruta</p>
          </div>
          <Link
            to="/chat"
            className="signature-gradient text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Preguntar a la IA
          </Link>
        </div>
      </div>

      <a
        href={GOOGLE_MAPS_URL}
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
        {stops.map((s, i) => (
          <li key={i} className="relative flex gap-4 items-start">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 ${
                s.color === 'primary'
                  ? 'bg-primary text-on-primary'
                  : s.color === 'secondary'
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-tertiary-container text-on-tertiary-container'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {s.icon}
              </span>
            </div>
            <div className="flex-1 bg-surface-container-low rounded-2xl p-4 hover:bg-surface-container-high transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-primary">{s.time}</p>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">
                  chevron_right
                </span>
              </div>
              <h3 className="font-headline font-bold text-on-surface mt-1">{s.title}</h3>
              <p className="text-xs text-on-surface-variant">{s.subtitle}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
        <h3 className="font-headline font-bold text-on-surface flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary">restaurant</span>
          Dónde comer (Zona Beira Mar)
        </h3>
        <div className="space-y-3">
          <div className="bg-surface-container-lowest rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-headline font-bold text-on-surface">Restaurante O Bairro</h4>
              <span className="text-xs bg-surface-container-highest px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                4.7
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Cocina portuguesa contemporánea con platos de pescado creativos. Ambiente fantástico.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-headline font-bold text-on-surface">O Batel</h4>
              <span className="text-xs bg-surface-container-highest px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                4.6
              </span>
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
