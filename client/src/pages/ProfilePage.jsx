import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Heart, Compass, LogOut, Settings, BarChart2, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserCheckIns } from '../services/api';
import LocationCard from '../components/LocationCard';
import CrowdBadge from '../components/CrowdBadge';
import PageTransition from '../components/PageTransition';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    if (user) fetchUserCheckIns().then(setCheckIns).catch(() => {});
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <User size={20} style={{ color: 'rgba(255,255,255,0.20)' }} strokeWidth={1.5} />
        </div>
        <h2 className="text-base font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.80)' }}>Your Profile</h2>
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.38)' }}>Sign in to view your profile.</p>
        <Link to="/login" className="btn-primary text-sm">Sign in</Link>
      </div>
    );
  }

  const recentlyViewed = user.recentlyViewed || [];
  const favCount = user.favorites?.length || 0;

  const NAV_ITEMS = [
    { to: '/favorites',   icon: Heart,    label: 'Saved Places',  sub: `${favCount} locations` },
    { to: '/analytics',   icon: BarChart2, label: 'Analytics',    sub: 'Trends & insights' },
    { to: '/preferences', icon: Settings,  label: 'Preferences',  sub: 'Customize your experience' },
    { to: '/explore',     icon: Compass,   label: 'Explore',      sub: 'Discover new places' },
  ];

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Profile card */}
        <div className="rounded-2xl p-6 text-center" style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.08)' }}>
          {user.profilePic ? (
            <img src={user.profilePic} alt={user.name}
              className="w-16 h-16 rounded-full mx-auto mb-3 ring-2"
              style={{ ringColor: 'rgba(34,197,94,0.25)' }} />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent-700 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
          <h2 className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>{user.name}</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{user.email}</p>
          <span
            className="inline-block mt-2 text-xs px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {user.authProvider === 'google' ? 'Google account' : 'Email account'}
          </span>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { label: 'Saved', value: favCount },
              { label: 'Viewed', value: recentlyViewed.length },
              { label: 'Check-ins', value: checkIns.length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold" style={{ color: 'rgba(255,255,255,0.88)' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recently viewed */}
        {recentlyViewed.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-3 section-label">Recently Viewed</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentlyViewed.slice(0, 4).map((loc) => (
                <LocationCard key={loc._id || loc} location={loc} showDistance={false} />
              ))}
            </div>
          </div>
        )}

        {/* Recent check-ins */}
        {checkIns.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-medium mb-3 section-label">Recent Check-ins</p>
            <div className="space-y-2.5">
              {checkIns.slice(0, 4).map((ci) => (
                <Link key={ci._id} to={`/location/${ci.locationId?._id}`}
                  className="flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors"
                  style={{ color: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {ci.locationId?.images?.[0]
                    ? <img src={ci.locationId.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    : <div className="w-9 h-9 rounded-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.75)' }}>{ci.locationId?.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>{new Date(ci.createdAt).toLocaleDateString()}</p>
                  </div>
                  <CrowdBadge level={ci.crowdLevel} label={ci.crowdLevel} compact />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Nav links */}
        <div className="space-y-1.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label, sub }) => (
            <Link key={to} to={to}
              className="flex items-center justify-between w-full rounded-xl px-4 py-3.5 transition-all duration-150 group"
              style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#161e28'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#111820'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Icon size={15} style={{ color: 'rgba(255,255,255,0.45)' }} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>{label}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>{sub}</p>
                </div>
              </div>
              <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.22)' }} />
            </Link>
          ))}

          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3.5 transition-all duration-150 text-left"
            style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#111820'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)' }}>
              <LogOut size={15} style={{ color: 'rgba(248,113,113,0.80)' }} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'rgba(248,113,113,0.80)' }}>Sign Out</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>See you next time</p>
            </div>
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
