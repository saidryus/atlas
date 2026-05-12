import { Link, NavLink } from 'react-router-dom';
import { Home, Compass, Heart, User, LogOut, MapPin, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="hidden md:block sticky top-0 z-50"
      style={{ background: 'rgba(13,17,23,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center">
            <MapPin size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
            Atlas
          </span>
          <span className="text-xs hidden lg:block" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Cebu
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-white/8 text-white font-medium'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5 font-normal'
                }`
              }
              style={({ isActive }) => ({ fontWeight: isActive ? 500 : 400 })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs hidden lg:flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
            <MapPin size={11} />
            Cebu City
          </span>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 group">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name}
                    className="w-7 h-7 rounded-full ring-1 ring-white/10 group-hover:ring-accent-500/40 transition-all" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent-700 flex items-center justify-center text-xs font-semibold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm hidden lg:block" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {user.name?.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-md transition-colors hover:bg-white/6"
                style={{ color: 'rgba(255,255,255,0.30)' }}
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-xs px-3 py-1.5">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
