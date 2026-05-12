import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchFavorites } from '../services/api';
import LocationCard from '../components/LocationCard';
import SkeletonCard from '../components/SkeletonCard';
import PageTransition from '../components/PageTransition';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchFavorites().then(setFavorites).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Heart size={20} style={{ color: 'rgba(255,255,255,0.20)' }} strokeWidth={1.5} />
        </div>
        <h2 className="text-base font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.80)' }}>Save your favorites</h2>
        <p className="text-sm mb-5 max-w-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
          Sign in to save gyms, parks, and courts you love.
        </p>
        <Link to="/login" className="btn-primary text-sm">Sign in</Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.88)' }}>Saved Places</h1>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {loading ? '' : `${favorites.length} location${favorites.length !== 1 ? 's' : ''}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Heart size={20} style={{ color: 'rgba(255,255,255,0.18)' }} strokeWidth={1.5} />
            </div>
            <p className="text-base font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.60)' }}>No saved places yet</p>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.30)' }}>Tap the heart on any location to save it</p>
            <Link to="/explore" className="btn-primary text-sm inline-flex items-center gap-1.5">
              <Compass size={14} /> Explore places
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map((loc, i) => (
              <motion.div key={loc._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <LocationCard location={loc} showDistance={false} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
