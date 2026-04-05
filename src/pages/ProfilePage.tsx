const members = [
  { name: 'User (You)', xp: 840, color: 'primary' },
  { name: 'María', xp: 910, color: 'primary' },
  { name: 'Leo (14)', xp: 420, color: 'tertiary', pro: true },
  { name: 'Sofía (12)', xp: 280, color: 'tertiary' },
];

const challenges = [
  { title: 'El Misterio del Moliceiro', desc: 'Encuentra el barco con el mural más gracioso', xp: 50, icon: 'directions_boat', color: 'primary' },
  { title: 'Cazadores de Azulejos', desc: 'Fotografía 3 patrones azules distintos', xp: 30, icon: 'grid_view', color: 'secondary' },
  { title: 'El Grito de la Tripa', desc: 'Pide una Tripa en portugués sin ayuda', xp: 40, icon: 'restaurant_menu', color: 'tertiary' },
];

const trophies = [
  { title: 'Pastel de Nata Expert', desc: 'Encontraron la mejor masa en Lisboa', icon: 'bakery_dining', big: true },
  { title: 'Moliceiro Spotter', icon: 'directions_boat' },
  { title: 'Punctual Planners', icon: 'schedule' },
];

export default function ProfilePage() {
  const total = members.reduce((a, m) => a + m.xp, 0);
  const levelTarget = 3000;
  const pct = Math.min(100, (total / levelTarget) * 100);

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
            <p className="text-on-surface-variant font-medium text-sm">Adventuring since 2023</p>
          </div>
        </div>

        <div className="bg-surface-container-highest rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-primary font-headline font-bold text-xs tracking-widest uppercase">
                  Current Score
                </span>
                <div className="text-4xl font-headline font-black text-primary flex items-center gap-2">
                  {total.toLocaleString()} <span className="text-base font-bold opacity-60">XP</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-on-surface-variant font-bold text-xs">Level 4</span>
                <p className="font-headline font-extrabold text-on-surface">Master Navigators</p>
              </div>
            </div>
            <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full signature-gradient rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mt-2">
              <span>{total} XP</span>
              <span>Next: Grand Voyagers ({levelTarget} XP)</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">diversity_3</span>
          Member Contributions
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
                {m.pro && (
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

      <section>
        <h2 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">assignment_late</span>
          Retos Pendientes
        </h2>
        <div className="space-y-3">
          {challenges.map((c) => (
            <div
              key={c.title}
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
          Trophy Cabinet
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {trophies.map((t) => (
            <div
              key={t.title}
              className={`bg-surface-container-low p-4 rounded-2xl ${t.big ? 'col-span-2' : 'flex flex-col items-center justify-center text-center'}`}
            >
              <span
                className="material-symbols-outlined text-primary mb-2"
                style={{ fontSize: t.big ? '28px' : '32px' }}
              >
                {t.icon}
              </span>
              <h3 className="font-headline font-bold text-xs leading-tight">{t.title}</h3>
              {t.desc && <p className="text-[10px] text-on-surface-variant mt-1">{t.desc}</p>}
            </div>
          ))}
        </div>
      </section>

      <button className="w-full signature-gradient text-white py-4 rounded-full font-headline font-extrabold shadow-xl active:scale-95 flex items-center justify-center gap-2">
        Redeem Points
        <span className="material-symbols-outlined">redeem</span>
      </button>
    </div>
  );
}
