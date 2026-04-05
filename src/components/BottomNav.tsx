import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', icon: 'explore', label: 'Route' },
  { to: '/chat', icon: 'psychology', label: 'AI' },
  { to: '/snacks', icon: 'restaurant', label: 'Snacks' },
  { to: '/profile', icon: 'account_circle', label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/15 shadow-[0_-12px_32px_rgba(74,37,6,0.08)] rounded-t-[2rem]">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all active:scale-90 duration-200 ${
              isActive
                ? 'bg-surface-container-highest text-primary scale-110'
                : 'text-on-surface opacity-60 hover:opacity-100 hover:bg-surface-container-low'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-[11px] font-semibold tracking-wide mt-0.5">
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
