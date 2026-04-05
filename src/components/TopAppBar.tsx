export default function TopAppBar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-16 w-full bg-surface">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">deployed_code</span>
        <h1 className="font-headline font-black text-xl tracking-tight text-primary">
          SmartPaseo AI
        </h1>
      </div>
      <div className="flex items-center gap-2 text-on-surface-variant">
        <button
          className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
}
