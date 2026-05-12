import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MapPin, Star, Clock, Dumbbell, Trees, Trophy, ShoppingBag, Users, Zap, TrendingUp, CheckCircle, Wifi, Car, Droplets, UserCheck, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchLocationById, fetchLocationCheckIns, trackView } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getDailyForecast } from '../utils/crowdPredictor';
import MapView from '../components/MapView';
import CrowdBadge from '../components/CrowdBadge';
import CheckInModal from '../components/CheckInModal';
import toast from 'react-hot-toast';

const CATEGORY_ICONS = { gym: Dumbbell, park: Trees, court: Trophy, store: ShoppingBag };
const CATEGORY_COLORS = {
  gym: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  park: 'bg-green-500/20 text-green-300 border-green-500/30',
  court: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  store: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};
const PRICE_LABELS = { 1: '₱ Free / Very Cheap', 2: '₱₱ Affordable', 3: '₱₱₱ Moderate', 4: '₱₱₱₱ Premium' };
const AMENITY_ICONS = { airConditioned: { icon: Wifi, label: 'Air-conditioned' }, parking: { icon: Car, label: 'Parking' }, shower: { icon: Droplets, label: 'Shower' }, beginnerFriendly: { icon: UserCheck, label: 'Beginner Friendly' } };

export default function LocationDetailPage() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const { user, toggleFavorite, isFavorite } = useAuth();
  const fav = isFavorite(id);

  const loadData = () => {
    Promise.all([
      fetchLocationById(id),
      fetchLocationCheckIns(id),
    ]).then(([loc, ci]) => {
      setLocation(loc);
      setCheckIns(ci);
      if (user) trackView(id);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id, user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <div className="h-72 shimmer rounded-2xl" />
        <div className="h-8 shimmer rounded w-1/2" />
        <div className="h-4 shimmer rounded w-1/3" />
        <div className="h-20 shimmer rounded" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="text-center py-20 text-white/40">
        <MapPin size={48} className="mx-auto mb-4 text-white/20" />
        <p className="text-white/60 font-medium">Location not found</p>
        <Link to="/" className="text-brand-400 underline text-sm mt-2 block">Back to home</Link>
      </div>
    );
  }

  const CategoryIcon = CATEGORY_ICONS[location.category];
  const crowd = location.crowd;
  const forecast = getDailyForecast(location.category, [0, 6].includes(new Date().getDay()));
  const activeAmenities = Object.entries(location.amenities || {}).filter(([, v]) => v);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to results
      </Link>

      {/* Hero */}
      {location.images?.[0] && (
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 bg-gray-800">
          <img src={location.images[0]} alt={location.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {user && (
            <motion.button
              onClick={() => toggleFavorite(location._id)}
              whileTap={{ scale: 0.8 }}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <motion.div animate={{ scale: fav ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.3 }}>
                <Heart size={18} strokeWidth={2} className={fav ? 'fill-red-500 text-red-500' : 'text-white'} />
              </motion.div>
            </motion.button>
          )}
          {crowd && (
            <div className="absolute bottom-4 left-4">
              <CrowdBadge level={crowd.level} label={crowd.label} />
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {CategoryIcon && <CategoryIcon size={22} className="text-white/60" strokeWidth={1.5} />}
            <h1 className="text-2xl font-bold text-white">{location.name}</h1>
          </div>
          <div className="flex items-center gap-1.5 text-white/50 text-sm">
            <MapPin size={13} /><span>{location.address}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center justify-end gap-1 text-yellow-400 font-bold text-lg">
            <Star size={16} className="fill-yellow-400" strokeWidth={0} />
            {location.rating?.toFixed(1)}
          </div>
          <div className="text-white/40 text-sm mt-0.5">{PRICE_LABELS[location.priceLevel]}</div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border capitalize ${CATEGORY_COLORS[location.category]}`}>
          {CategoryIcon && <CategoryIcon size={11} strokeWidth={2.5} />}{location.category}
        </span>
        <span className="flex items-center gap-1 text-xs bg-white/5 text-white/50 border border-white/10 px-3 py-1 rounded-full">
          <MapPin size={10} />{location.area}
        </span>
        {location.openingHours?.is24Hours && (
          <span className="text-xs bg-brand-500/20 text-brand-400 border border-brand-500/30 px-3 py-1 rounded-full font-semibold">24/7</span>
        )}
        <span className="flex items-center gap-1 text-xs bg-white/5 text-white/50 border border-white/10 px-3 py-1 rounded-full">
          <Users size={10} />{location.checkInCount || 0} check-ins
        </span>
      </div>

      <p className="text-white/70 mb-6 leading-relaxed">{location.description}</p>

      {/* Amenities */}
      {activeAmenities.length > 0 && (
        <div className="glass rounded-2xl p-5 mb-5">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-brand-400" /> Amenities
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeAmenities.map(([key]) => {
              const a = AMENITY_ICONS[key];
              if (!a) return null;
              const Icon = a.icon;
              return (
                <span key={key} className="flex items-center gap-1.5 text-xs bg-white/5 text-white/60 border border-white/10 px-3 py-1.5 rounded-full">
                  <Icon size={12} className="text-brand-400" />{a.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Crowd Intelligence */}
      {crowd && (
        <div className="glass rounded-2xl p-5 mb-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={16} className="text-brand-400" /> Crowd Intelligence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-xs text-white/40 mb-1">Right now</p>
              <CrowdBadge level={crowd.level} label={crowd.label} compact />
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><Zap size={10} /> Best time</p>
              <p className="text-xs text-white/80 font-medium">{crowd.bestTime}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-xs text-white/40 mb-1 flex items-center gap-1"><TrendingUp size={10} /> Peak hours</p>
              <p className="text-xs text-white/80 font-medium">{crowd.peakHours}</p>
            </div>
          </div>

          {/* Hourly forecast chart */}
          <p className="text-xs text-white/40 mb-2">Typical daily traffic</p>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} tickLine={false} axisLine={false} interval={3} />
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                  itemStyle={{ color: '#22c55e' }}
                  formatter={(v) => [`${v}%`, 'Busyness']}
                />
                <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                  {forecast.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Opening Hours */}
      {location.openingHours && (
        <div className="glass rounded-2xl p-5 mb-5">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Clock size={16} className="text-white/60" /> Opening Hours
          </h3>
          <div className="text-sm text-white/60 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-white/40">Weekdays</span>
              <span className="text-white/80">{location.openingHours.weekdays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Weekends</span>
              <span className="text-white/80">{location.openingHours.weekends}</span>
            </div>
          </div>
        </div>
      )}

      {/* Check-in section */}
      <div className="glass rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Users size={16} className="text-white/60" /> Recent Check-ins
          </h3>
          {user ? (
            <motion.button
              onClick={() => setShowCheckIn(true)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn-primary text-xs py-1.5 px-3"
            >
              Check In
            </motion.button>
          ) : (
            <Link to="/login" className="text-xs text-brand-400 hover:text-brand-300">Sign in to check in</Link>
          )}
        </div>
        {checkIns.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-4">No check-ins yet. Be the first!</p>
        ) : (
          <div className="space-y-3">
            {checkIns.slice(0, 5).map((ci) => (
              <div key={ci._id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {ci.userId?.name?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-white/80">{ci.userId?.name || 'Anonymous'}</span>
                    <CrowdBadge level={ci.crowdLevel} label={ci.crowdLevel} compact />
                    <span className="text-xs text-white/30">{new Date(ci.createdAt).toLocaleDateString()}</span>
                  </div>
                  {ci.note && <p className="text-xs text-white/50 mt-0.5">{ci.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      {location.latitude && location.longitude && (
        <div>
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-white/60" /> Location
          </h3>
          <div className="h-64 rounded-2xl overflow-hidden border border-white/10 shadow-glass">
            <MapView locations={[location]} />
          </div>
        </div>
      )}

      {showCheckIn && (
        <CheckInModal
          locationId={location._id}
          locationName={location.name}
          onClose={() => setShowCheckIn(false)}
          onSuccess={loadData}
        />
      )}
    </motion.div>
  );
}
