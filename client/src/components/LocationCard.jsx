import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Dumbbell, Trees, Trophy, ShoppingBag, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CrowdBadge from './CrowdBadge';

const CATEGORY_ICONS = { gym: Dumbbell, park: Trees, court: Trophy, store: ShoppingBag };

const CATEGORY_META = {
  gym:   { label: 'Gym',       color: 'rgba(249,115,22,0.12)', text: 'rgba(251,146,60,0.9)',  border: 'rgba(249,115,22,0.20)' },
  park:  { label: 'Park',      color: 'rgba(34,197,94,0.10)',  text: 'rgba(74,222,128,0.9)',  border: 'rgba(34,197,94,0.18)' },
  court: { label: 'Court',     color: 'rgba(59,130,246,0.10)', text: 'rgba(96,165,250,0.9)',  border: 'rgba(59,130,246,0.18)' },
  store: { label: 'Nutrition', color: 'rgba(168,85,247,0.10)', text: 'rgba(192,132,252,0.9)', border: 'rgba(168,85,247,0.18)' },
};

const PRICE_LABELS = { 1: '₱', 2: '₱₱', 3: '₱₱₱', 4: '₱₱₱₱' };

export default function LocationCard({ location, showDistance = true }) {
  const { _id, name, category, area, rating, priceLevel, description, images, distance, crowd } = location;
  const { user, toggleFavorite, isFavorite } = useAuth();
  const fav = isFavorite(_id);
  const CategoryIcon = CATEGORY_ICONS[category];
  const meta = CATEGORY_META[category] || CATEGORY_META.gym;

  const handleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    await toggleFavorite(_id);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <Link to={`/location/${_id}`} className="block group">
        <div className="card h-full">
          {/* Image */}
          <div className="relative h-40 overflow-hidden" style={{ background: '#0d1117' }}>
            {images?.[0] ? (
              <img
                src={images[0]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {CategoryIcon && <CategoryIcon size={32} style={{ color: 'rgba(255,255,255,0.12)' }} strokeWidth={1.5} />}
              </div>
            )}
            {/* Gradient */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />

            {/* Category chip */}
            <span
              className="absolute top-2.5 left-2.5 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
              style={{ background: meta.color, color: meta.text, border: `1px solid ${meta.border}` }}
            >
              {CategoryIcon && <CategoryIcon size={10} strokeWidth={2.5} />}
              {meta.label}
            </span>

            {/* Favorite */}
            {user && (
              <button
                onClick={handleFav}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150"
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
              >
                <Heart
                  size={13}
                  strokeWidth={2}
                  style={{
                    fill: fav ? '#ef4444' : 'transparent',
                    color: fav ? '#ef4444' : 'rgba(255,255,255,0.7)',
                    transition: 'all 0.15s',
                  }}
                />
              </button>
            )}

            {/* Distance */}
            {showDistance && distance != null && (
              <span
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(34,197,94,0.85)', color: '#fff' }}
              >
                <Navigation size={9} strokeWidth={2.5} />
                {distance.toFixed(1)} km
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-3.5">
            <h3
              className="text-sm font-semibold leading-snug mb-1 line-clamp-1"
              style={{ color: 'rgba(255,255,255,0.90)' }}
            >
              {name}
            </h3>
            <div className="flex items-center gap-1 mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>
              <MapPin size={10} />
              <span className="text-xs">{area}</span>
            </div>
            <p className="text-xs line-clamp-2 mb-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: '#fbbf24' }}>
                  <Star size={10} fill="#fbbf24" strokeWidth={0} />
                  {rating?.toFixed(1)}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  {PRICE_LABELS[priceLevel]}
                </span>
              </div>
              {crowd && <CrowdBadge level={crowd.level} label={crowd.label} compact />}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
