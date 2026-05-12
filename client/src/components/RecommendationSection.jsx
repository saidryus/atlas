import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { fetchRecommendations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LocationCard from './LocationCard';
import SkeletonCard from './SkeletonCard';

export default function RecommendationSection({ userLocation }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const lat = userLocation?.lat || 10.3157;
    const lng = userLocation?.lng || 123.8854;
    fetchRecommendations(lat, lng, user?.categoryPreference)
      .then(setGroups)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userLocation, user]);

  if (loading) {
    return (
      <section>
        <div className="h-4 shimmer rounded w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    );
  }

  if (!groups.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={15} style={{ color: '#22c55e' }} />
        <h2 className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Smart Suggestions
        </h2>
        <span
          className="text-xs px-2 py-0.5 rounded-md"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {user ? 'Personalized' : 'Trending'}
        </span>
      </div>
      <div className="space-y-8">
        {groups.map((group, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.25 }}
          >
            <p className="text-xs font-medium mb-3" style={{ color: 'rgba(74,222,128,0.75)' }}>
              {group.label}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((loc) => (
                <LocationCard key={loc._id} location={loc} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
