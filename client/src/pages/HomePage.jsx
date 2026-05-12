import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Dumbbell, Trees, Trophy, ShoppingBag, ArrowRight } from 'lucide-react';
import { fetchLocations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import LocationCard from '../components/LocationCard';
import RecommendationSection from '../components/RecommendationSection';
import SkeletonCard from '../components/SkeletonCard';
import PageTransition from '../components/PageTransition';

const CATEGORY_CARDS = [
  { value: 'gym',   label: 'Gyms',          icon: Dumbbell,   accent: '#f97316' },
  { value: 'park',  label: 'Parks & Trails', icon: Trees,      accent: '#22c55e' },
  { value: 'court', label: 'Sports Courts',  icon: Trophy,     accent: '#3b82f6' },
  { value: 'store', label: 'Nutrition',      icon: ShoppingBag,accent: '#a855f7' },
];

const QUICK_AREAS = ['IT Park', 'Ayala', 'Lahug', 'Banilad', 'Talamban'];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { location: userLocation } = useGeolocation();
  const [search, setSearch] = useState('');
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  useEffect(() => {
    if (!userLocation) return;
    setLoadingNearby(true);
    fetchLocations({ lat: userLocation.lat, lng: userLocation.lng, distance: 5 })
      .then((data) => setNearbyLocations(data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoadingNearby(false));
  }, [userLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/explore?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <PageTransition>
      <div>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(160deg, #0d1117 0%, #0f1a12 55%, #0d1117 100%)' }}>
          <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Location pill */}
              <div
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-5"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', color: 'rgba(74,222,128,0.85)' }}
              >
                <MapPin size={10} strokeWidth={2.5} />
                Cebu City, Philippines
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
                Discover fitness &<br />
                <span style={{ color: '#4ade80' }}>sports in Cebu</span>
              </h1>
              <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Gyms, parks, courts, and nutrition stores — all near you.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="max-w-lg mx-auto">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.30)' }} />
                    <input
                      type="text"
                      placeholder='Try "gym near IT Park" or "basketball"'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="input w-full pl-10 py-3 text-sm"
                    />
                  </div>
                  <button type="submit" className="btn-primary px-5 py-3 shrink-0">
                    Search
                  </button>
                </div>
              </form>

              {/* Quick areas */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {QUICK_AREAS.map((area) => (
                  <Link
                    key={area}
                    to={`/explore?area=${encodeURIComponent(area)}`}
                    className="text-xs px-2.5 py-1 rounded-md transition-all duration-150"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.40)',
                    }}
                  >
                    {area}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
          {/* Category grid */}
          <section>
            <h2 className="text-sm font-semibold mb-4 section-label">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORY_CARDS.map(({ value, label, icon: Icon, accent }, i) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.25 }}
                >
                  <Link
                    to={`/explore?category=${value}`}
                    className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl transition-all duration-200 group"
                    style={{
                      background: '#111820',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = accent + '35'; e.currentTarget.style.background = '#161e28'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#111820'; }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: accent + '18' }}
                    >
                      <Icon size={20} style={{ color: accent }} strokeWidth={1.8} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Near You */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold section-label">Near You</h2>
              <Link
                to="/explore"
                className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: 'rgba(74,222,128,0.70)' }}
              >
                See all <ArrowRight size={12} />
              </Link>
            </div>
            {loadingNearby ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyLocations.map((loc) => (
                  <LocationCard key={loc._id} location={loc} />
                ))}
              </div>
            )}
          </section>

          <RecommendationSection userLocation={userLocation} />
        </div>
      </div>
    </PageTransition>
  );
}
