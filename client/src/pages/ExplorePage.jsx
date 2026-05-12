import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, List, Map } from 'lucide-react';
import { fetchLocations } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useDebounce } from '../hooks/useDebounce';
import CategoryFilter from '../components/CategoryFilter';
import FilterBar from '../components/FilterBar';
import LocationCard from '../components/LocationCard';
import MapView from '../components/MapView';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import PageTransition from '../components/PageTransition';

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const { location: userLocation } = useGeolocation();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [filters, setFilters] = useState({
    area: searchParams.get('area') || '',
    distance: '',
    priceLevel: '',
    rating: '',
    amenities: [],
  });
  const [view, setView] = useState('list');

  // Debounce the search input — only fires API call 400ms after user stops typing
  const search = useDebounce(searchInput, 400);

  const loadLocations = useCallback(() => {
    setLoading(true);
    const params = {
      ...(category && { category }),
      ...(search && { search }),
      ...(filters.area && { area: filters.area }),
      ...(filters.priceLevel && { priceLevel: filters.priceLevel }),
      ...(filters.rating && { rating: filters.rating }),
      ...(userLocation && { lat: userLocation.lat, lng: userLocation.lng }),
      ...(filters.distance && { distance: filters.distance }),
      ...(filters.amenities?.length && { amenities: filters.amenities.join(',') }),
    };
    fetchLocations(params)
      .then(setLocations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, search, filters, userLocation]);

  useEffect(() => { loadLocations(); }, [loadLocations]);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-1">Explore</h1>
        <p className="text-white/40 text-sm mb-5">Find fitness & sports spots across Cebu</p>

        {/* Search with instant feedback */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder='Search "gym", "IT Park", "basketball"...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-dark w-full pl-11 pr-4"
          />
          {searchInput && searchInput !== search && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Category pills */}
        <div className="mb-4">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        {/* Advanced filters */}
        <div className="mb-5">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {/* Results count + view toggle */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-white/40">
            {loading
              ? 'Searching...'
              : `${locations.length} place${locations.length !== 1 ? 's' : ''} found`}
          </p>
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'list', icon: List, label: 'List' },
              { id: 'map', icon: Map, label: 'Map' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                style={view === id ? { color: '#ffffff' } : {}}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  view === id ? 'bg-brand-500 shadow-sm' : 'text-white/50 hover:text-white'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Map view */}
        {view === 'map' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[500px] mb-6 rounded-2xl overflow-hidden border border-white/10 shadow-glass"
          >
            <MapView locations={locations} userLocation={userLocation} showHeatmapToggle />
          </motion.div>
        )}

        {/* List view */}
        {view === 'list' && (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : locations.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No places found"
                description="Try adjusting your filters or search term"
                action={{ to: '/explore', label: 'Clear search' }}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {locations.map((loc, i) => (
                  <motion.div
                    key={loc._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <LocationCard location={loc} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
