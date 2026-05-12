import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { SlidersHorizontal, X, Wifi, Car, Droplets, UserCheck, Clock } from 'lucide-react';

const AREAS = ['IT Park', 'Ayala', 'Lahug', 'Banilad', 'Talamban', 'Fuente Osmeña', 'Mabolo', 'Guadalupe', 'SRP', 'Downtown Cebu'];

const FILTER_CONFIGS = [
  { key: 'area', label: 'Area', options: [{ value: '', label: 'All Areas' }, ...AREAS.map(a => ({ value: a, label: a }))] },
  { key: 'distance', label: 'Distance', options: [{ value: '', label: 'Any' }, { value: '1', label: '1 km' }, { value: '3', label: '3 km' }, { value: '5', label: '5 km' }, { value: '10', label: '10 km' }] },
  { key: 'priceLevel', label: 'Price', options: [{ value: '', label: 'Any' }, { value: '1', label: '₱ Free' }, { value: '2', label: '₱₱ Affordable' }, { value: '3', label: '₱₱₱ Moderate' }, { value: '4', label: '₱₱₱₱ Premium' }] },
  { key: 'rating', label: 'Rating', options: [{ value: '', label: 'Any' }, { value: '4', label: '4+ stars' }, { value: '4.5', label: '4.5+ stars' }] },
];

const AMENITY_CHIPS = [
  { key: 'airConditioned', label: 'AC', icon: Wifi },
  { key: 'parking', label: 'Parking', icon: Car },
  { key: 'shower', label: 'Shower', icon: Droplets },
  { key: 'beginnerFriendly', label: 'Beginner', icon: UserCheck },
  { key: 'is24Hours', label: '24/7', icon: Clock },
];

const EMPTY = { area: '', distance: '', priceLevel: '', rating: '', amenities: [] };

export default function FilterBar({ filters, onChange }) {
  const [open, setOpen] = useState(false);
  const amenities = filters.amenities || [];
  const selectCount = Object.entries(filters).filter(([k, v]) => k !== 'amenities' && v).length;
  const activeCount = selectCount + amenities.length;

  const toggleAmenity = (key) => {
    const next = amenities.includes(key) ? amenities.filter(a => a !== key) : [...amenities, key];
    onChange({ ...filters, amenities: next });
  };

  return (
    <div>
      {/* Trigger row */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150"
          style={{
            background: open || activeCount > 0 ? 'rgba(34,197,94,0.10)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${open || activeCount > 0 ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
            color: open || activeCount > 0 ? 'rgba(74,222,128,0.90)' : 'rgba(255,255,255,0.50)',
          }}
        >
          <SlidersHorizontal size={13} />
          Filters
          {activeCount > 0 && (
            <span
              className="text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold"
              style={{ background: '#22c55e', color: '#fff', fontSize: '10px' }}
            >
              {activeCount}
            </span>
          )}
        </button>

        {/* Active chips */}
        <AnimatePresence>
          {filters.area && (
            <motion.button key="area" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
              onClick={() => onChange({ ...filters, area: '' })}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all"
              style={{ background: 'rgba(34,197,94,0.10)', color: 'rgba(74,222,128,0.85)', border: '1px solid rgba(34,197,94,0.20)' }}
            >
              {filters.area} <X size={9} />
            </motion.button>
          )}
          {filters.priceLevel && (
            <motion.button key="price" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
              onClick={() => onChange({ ...filters, priceLevel: '' })}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md"
              style={{ background: 'rgba(34,197,94,0.10)', color: 'rgba(74,222,128,0.85)', border: '1px solid rgba(34,197,94,0.20)' }}
            >
              {'₱'.repeat(Number(filters.priceLevel))} <X size={9} />
            </motion.button>
          )}
          {amenities.map(a => {
            const chip = AMENITY_CHIPS.find(c => c.key === a);
            return chip ? (
              <motion.button key={a} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                onClick={() => toggleAmenity(a)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-md"
                style={{ background: 'rgba(34,197,94,0.10)', color: 'rgba(74,222,128,0.85)', border: '1px solid rgba(34,197,94,0.20)' }}
              >
                {chip.label} <X size={9} />
              </motion.button>
            ) : null;
          })}
          {activeCount > 1 && (
            <motion.button key="clear" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => onChange(EMPTY)}
              className="text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.30)' }}
            >
              Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 p-4 rounded-xl space-y-4"
              style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Selects */}
              <div className="flex flex-wrap gap-3">
                {FILTER_CONFIGS.map(({ key, label, options }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</label>
                    <select
                      value={filters[key] || ''}
                      onChange={(e) => onChange({ ...filters, [key]: e.target.value })}
                      className="text-sm rounded-lg px-3 py-2 min-w-[130px] focus:outline-none transition-all"
                      style={{
                        background: '#0d1117',
                        border: '1px solid rgba(255,255,255,0.09)',
                        color: 'rgba(255,255,255,0.80)',
                      }}
                    >
                      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {AMENITY_CHIPS.map(({ key, label, icon: Icon }) => {
                    const active = amenities.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleAmenity(key)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150"
                        style={{
                          background: active ? 'rgba(34,197,94,0.10)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${active ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
                          color: active ? 'rgba(74,222,128,0.90)' : 'rgba(255,255,255,0.45)',
                        }}
                      >
                        <Icon size={11} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
