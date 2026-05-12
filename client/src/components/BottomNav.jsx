import { NavLink } from 'react-router-dom';
import { Home, Compass, Heart, User, BarChart2 } from 'lucide-react';

const TABS = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/favorites', icon: Heart, label: 'Saved' },
  { to: '/analytics', icon: BarChart2, label: 'Stats' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(11,14,19,0.96)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex justify-around px-1 py-1.5 pb-safe">
        {TABS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-150 min-w-0 ${
                isActive ? '' : ''
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  style={{ color: isActive ? '#22c55e' : 'rgba(255,255,255,0.38)' }}
                />
                <span
                  className="text-[10px] font-medium leading-none"
                  style={{ color: isActive ? '#22c55e' : 'rgba(255,255,255,0.35)' }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
