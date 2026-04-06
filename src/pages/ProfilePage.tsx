import { useState, useEffect } from 'react';

const STORAGE_KEY = 'smartpaseo_visited_stops';
const XP_PER_STOP = 50;
const TOTAL_STOPS = 7;

// Static family members (non-route XP)
const FAMILY_BASE = [
  { name: 'María', xp: 200, color: 'primary' },
  { name: 'Leo (14)', xp: 150, color: 'tertiary', pro: true },
  { name: 'Sofía (12)', xp: 100, color: 'tertiary' },
];

const CHALLENGES = [
  { id: 'visit_3', title: 'Primeros Pasos', desc: 'Visita 3 paradas de la ruta', xp: 50, icon: 'directions_walk', color: 'primary', required: 3 },
  { id: 'visit_5', title: 'Explorador', desc: 'Visita 5 paradas de la ruta', xp: 100, icon: 'explore', color: 'secondary', required: 5 },
  { id: 'visit_all', title: 'Ruta Completada', desc: 'Completa las 7 paradas de Aveiro', xp: 200, icon: 'emoji_events', color: 'tertiary', required: 7 },
  { id: 'moliceiro', title: 'El Misterio del Moliceiro', desc: 'Encuentra el barco con el mural más gracioso', xp: 50, icon: 'directions_boat', color: 'primary', required: 0 },
  { id: 'azulejos', title: 'Cazadores de Azulejos', desc: 'Fotografía 3 patrones azules distintos', xp: 30, icon: 'grid_view', color: 'secondary', required: 0 },
  { id: 'tripa', title: 'El Grito de la Tripa', desc: 'Pide una Tripa en portugués sin ayuda', xp: 40, icon: 'restaurant_menu', color: 'tertiary', required: 0 },
];

const TROPHIES = [
  { title: 'Pastel de Nata Expert', desc: 'Encontraron la mejor masa en Lisboa', icon: 'bakery_dining', big: true },
  { title: 'Moliceiro Spotter', icon: 'directions_boat' },
  { title: 'Punctual Planners', icon: 'schedule' },
];

const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Viajeros Nóvatos', min: 0 },
  { level: 2, name: 'Exploradores', min: 300 },
  { level: 3, name: 'Aventureros', min: 700 },
  { level: 4, name: 'Master Navigators', min: 1200 },
  { level: 5, name: 'Grand Voyagers', min: 2000 },
];

function getLevel(xp: number) {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].min) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] ?? LEVEL_THRESHOLDS[i];
      break;
    }
  }
  return { current, next };
}

function loadVisitedCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw).length : 0;
  } catch {
    return 0;
  }
}

export default function ProfilePage() {
  const [visitedCount, setVisitedCount] = useState<number>(() => loadVisitedCount());

  useEffect(() => {
    function onChanged() {
      setVisitedCount(loadVisitedCount());
    }
    window.addEventListener('smartpaseo_visited_changed', onChanged);
    // Also poll storage changes from other tabs
    window.addEventListener('storage', onChanged);
    return () => {
      window.removeEventListener('smartpaseo_visited_changed', onChanged);
      window.removeEventListener('storage', onChanged);
    };
  }, []);

  const myXp = visitedCount * XP_PER_STOP;
  const members = [
    { name: 'Tú (Jorge)', xp: myXp, color: 'primary' },
    ...FAMILY_BASE,
  ];
  const total = members.reduce((a, m) => a + m.xp, 0);

  const { current: lvl, next: nextLvl } = getLevel(total);
  const pct = nextLvl.min > lvl.min
    ? Math.min(100, ((total - lvl.min) / (nextLvl.min - lvl.min)) * 100)
    : 100;

  const completedChallenges = new Set<string>();
  if (visitedCount >= 3) completedChallenges.add('visit_3');
  if (visitedCount >= 5) completedChallenges.add('visit_5');
  if (visitedCount >= TOTAL_STOPS) completedChallenges.add('visit_all');

  const pendingChallenges = CHALLENGES.filter((c) => !completedChallenges.has(c.id));
  const doneChallenges = CHALLENGES.filter((c) => completedChallenges.has(c.id));

  return (
    <div className="px-6 py-4 space-y-8">
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full signature-gradient flex items-center justify-center text-white shadow-xl rotate-3">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              groups
            </span>
          </div>
          <div>
            <h1 className="font-headline font-extrabold text-2xl text-on-surface">
              Familia Exploradora
            </h1>
            <p className="text-on-surface-variant font-medium text-sm">Aventurando desde 2023</p>
          </div>
        </div>

        <div className="bg-surface-container-highest rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-primary font-headline font-bold text-xs tracking-widest uppercase">
                  Puntuación Total
                </span>
                <div className="text-4xl font-headline font-black text-primary flex items-center gap-2">
                  {total.toLocaleString()} <span className="text-base font-bold opacity-60">XP</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-on-surface-variant font-bold text-xs">Nivel {lvl.level}</span>
                <p className="font-headline font-extrabold text-on-surface">{lvl.name}</p>
              </div>
            </div>
            <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full signature-gradient rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mt-2">
              <span>{total} XP</span>
              {nextLvl !== lvl ? (
                <span>Próximo: {nextLvl.name} ({nextLvl.min} XP)</span>
              ) : (
                <span>¡Nivel máximo!</span>
              )}
            </div>
          </div>
        </div>

        {visitedCount > 0 && (
          <div className="mt-3 bg-secondary-container/30 rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">
                {visitedCount}/{TOTAL_STOPS} paradas visitadas hoy
              </p>
              <p className="text-xs text-on-surface-variant">
                +{myXp} XP ganados en esta ruta
              </p>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">diversity_3</span>
          Contribuciones del Equipo
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {members.map((m, i) => (
            <div
              key={m.name}
              className={`p-4 rounded-2xl ${m.color === 'tertiary' ? 'bg-tertiary-container/30' : 'bg-surface-container-low'} ${i % 2 === 1 ? 'translate-y-4' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm mb-2 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div className="flex justify-between items-start">
                <p className="font-headline font-bold text-sm text-on-surface">{m.name}</p>
                {'pro' in m && m.pro && (
                  <span className="text-[9px] bg-tertiary text-on-tertiary px-2 py-0.5 rounded-full font-bold">
                    PRO
                  </span>
                )}
              </div>
              <p className={`font-black text-lg ${m.color === 'tertiary' ? 'text-tertiary' : 'text-primary'}`}>
                {m.xp} <span className="text-xs font-medium opacity-60">XP</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {doneChallenges.length > 0 && (
        <section>
          <h2 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            Retos Completados
          </h2>
          <div className="space-y-3">
            {doneChallenges.map((c) => (
              <div
                key={c.id}
                className="bg-surface-container-low p-4 rounded-2xl border-l-4 border-secondary flex items-center justify-between opacity-70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/10 text-secondary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-sm text-on-surface line-through">{c.title}</h3>
                    <p className="text-[11px] text-on-surface-variant">{c.desc}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">assignment_late</span>
          Retos Pendientes
        </h2>
        <div className="space-y-3">
          {pendingChallenges.map((c) => (
            <div
              key={c.id}
              className={`bg-surface-container-low p-4 rounded-2xl border-l-4 flex items-center justify-between hover:bg-surface-container-high transition-colors ${
                c.color === 'primary'
                  ? 'border-primary'
                  : c.color === 'secondary'
                    ? 'border-secondary'
                    : 'border-tertiary'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    c.color === 'primary'
                      ? 'bg-primary/10 text-primary'
                      : c.color === 'secondary'
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-tertiary/10 text-tertiary'
                  }`}
                >
                  <span className="material-symbols-outlined">{c.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-on-surface">{c.title}</h3>
                  <p className="text-[11px] text-on-surface-variant">{c.desc}</p>
                  {c.required > 0 && (
                    <p className="text-[10px] text-primary font-bold mt-0.5">
                      {Math.min(visitedCount, c.required)}/{c.required} paradas
                    </p>
                  )}
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  c.color === 'primary'
                    ? 'bg-primary text-on-primary'
                    : c.color === 'secondary'
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-tertiary text-on-tertiary'
                }`}
              >
                +{c.xp} XP
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            workspace_premium
          </span>
          Vitrina de Trofeos
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {TROPHIES.map((t) => (
            <div
              key={t.title}
              className={`bg-surface-container-low p-4 rounded-2xl ${t.big ? 'col-span-2' : 'flex flex-col items-center justify-center text-center'}`}
            >
              <span
                className="material-symbols-outlined text-primary mb-2"
                style={{ fontSize: t.big ? '28px' : '32px', fontVariationSettings: "'FILL' 1" }}
              >
                {t.icon}
              </span>
              <h3 className="font-headline font-bold text-xs leading-tight">{t.title}</h3>
              {t.desc && <p className="text-[10px] text-on-surface-variant mt-1">{t.desc}</p>}
            </div>
          ))}
        </div>
      </section>

      <div className="bg-surface-container-low rounded-2xl p-4 text-center">
        <p className="text-xs text-on-surface-variant">
          Marca paradas como visitadas en la <strong>Ruta</strong> para ganar XP.
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
          Cada parada visitada = <strong>{XP_PER_STOP} XP</strong>
        </p>
      </div>
    </div>
  );
}
