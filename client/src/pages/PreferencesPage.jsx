import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Save, Dumbbell, Trees, Trophy, ShoppingBag, Clock, DollarSign, MapPin } from 'lucide-react';
import { updatePreferences } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'gym', label: 'Gyms', icon: Dumbbell },
  { value: 'park', label: 'Parks', icon: Trees },
  { value: 'court', label: 'Courts', icon: Trophy },
  { value: 'store', label: 'Nutrition', icon: ShoppingBag },
];

const WORKOUT_TIMES = ['morning', 'midday', 'afternoon', 'evening', 'night'];
const AREAS = ['IT Park', 'Ayala', 'Lahug', 'Banilad', 'Talamban', 'Fuente Osmeña', 'Mabolo', 'Guadalupe', 'SRP'];

export default function PreferencesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    categories: [],
    workoutTimes: [],
    budgetLevel: 2,
    preferredAreas: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setForm({
        categories: user.preferences.categories || [],
        workoutTimes: user.preferences.workoutTimes || [],
        budgetLevel: user.preferences.budgetLevel || 2,
        preferredAreas: user.preferences.preferredAreas || [],
      });
    }
  }, [user]);

  const toggleItem = (key, value) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter(v => v !== value) : [...f[key], value],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updatePreferences(form);
      toast.success('Preferences saved!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Settings size={48} className="text-white/20 mb-4" />
        <p className="text-white/60">Sign in to set preferences</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-6">
          <Settings size={22} className="text-brand-400" />
          <h1 className="text-2xl font-bold text-white">Preferences</h1>
        </div>

        <div className="space-y-5">
          {/* Categories */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Dumbbell size={16} className="text-white/60" /> Favorite Categories
            </h3>
            <p className="text-xs text-white/40 mb-3">Select your preferred fitness activities</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => toggleItem('categories', value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    form.categories.includes(value)
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-400'
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Workout Times */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Clock size={16} className="text-white/60" /> Preferred Workout Times
            </h3>
            <p className="text-xs text-white/40 mb-3">When do you usually work out?</p>
            <div className="flex flex-wrap gap-2">
              {WORKOUT_TIMES.map((time) => (
                <button
                  key={time}
                  onClick={() => toggleItem('workoutTimes', time)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${
                    form.workoutTimes.includes(time)
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-400'
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <DollarSign size={16} className="text-white/60" /> Budget Level
            </h3>
            <p className="text-xs text-white/40 mb-3">How much are you willing to spend?</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40">₱</span>
              <input
                type="range"
                min="1"
                max="4"
                value={form.budgetLevel}
                onChange={(e) => setForm({ ...form, budgetLevel: Number(e.target.value) })}
                className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-500"
              />
              <span className="text-xs text-white/40">₱₱₱₱</span>
            </div>
            <p className="text-sm text-brand-400 mt-2 text-center font-medium">
              {'₱'.repeat(form.budgetLevel)} {['Free/Cheap', 'Affordable', 'Moderate', 'Premium'][form.budgetLevel - 1]}
            </p>
          </div>

          {/* Areas */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-white/60" /> Preferred Areas
            </h3>
            <p className="text-xs text-white/40 mb-3">Which areas do you frequent?</p>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleItem('preferredAreas', area)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    form.preferredAreas.includes(area)
                      ? 'bg-brand-500/20 border-brand-500/50 text-brand-400'
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <motion.button
            onClick={handleSave}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                Save Preferences
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
