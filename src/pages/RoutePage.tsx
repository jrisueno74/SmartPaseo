import { Link } from 'react-router-dom';

const stops = [
  { time: '09:30', title: 'Hotel Moliceiro', subtitle: 'Punto de partida', icon: 'hotel', color: 'primary' },
  { time: '10:00', title: 'Canal Central & Moliceiros', subtitle: 'Paseo en barco tradicional · 45 min', icon: 'directions_boat', color: 'secondary' },
  { time: '11:15', title: 'Arte Nova Museum', subtitle: 'Tour rápido · fachadas de azulejos', icon: 'palette', color: 'tertiary' },
  { time: '13:00', title: 'Restaurante Salpoente', subtitle: 'Reserva confirmada · mesa 12', icon: 'restaurant', color: 'primary' },
  { time: '15:30', title: 'Costa Nova', subtitle: 'Casas de rayas · 20 min en coche', icon: 'beach_access', color: 'secondary' },
];

export default function RoutePage() {
  return (
    <div className="px-6 py-4 space-y-6">
      <section>
        <span className="inline-block bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3">
          Hoy · Aveiro, Portugal
        </span>
        <h1 className="font-headline font-extrabold text-3xl text-primary leading-tight">
          Tu ruta del día
        </h1>
        <p className="text-on-surface-variant font-medium mt-1">
          5 paradas · ~6h de aventura familiar
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
    </div>
  );
}
