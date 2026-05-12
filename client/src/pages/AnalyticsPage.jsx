import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, MapPin, Users, Dumbbell, Trees, Trophy, ShoppingBag, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { fetchDashboard, fetchAccessibilityScores } from '../services/api';
import SkeletonCard from '../components/SkeletonCard';
import PageTransition from '../components/PageTransition';

const CAT_COLORS = { gym: '#f97316', park: '#22c55e', court: '#3b82f6', store: '#a855f7' };
const CAT_ICONS  = { gym: Dumbbell, park: Trees, court: Trophy, store: ShoppingBag };
const SCORE_COLORS = { Excellent: '#22c55e', Good: '#3b82f6', Moderate: '#f59e0b', Poor: '#ef4444' };

const TOOLTIP_STYLE = {
  contentStyle: { background: '#161e28', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,0.80)' },
  itemStyle: { color: 'rgba(255,255,255,0.70)' },
  labelStyle: { color: 'rgba(255,255,255,0.50)' },
};

function MetricCard({ icon: Icon, label, value, accent = '#22c55e', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="rounded-xl p-4"
      style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: accent + '18' }}>
          <Icon size={15} style={{ color: accent }} strokeWidth={2} />
        </div>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.90)' }}>{value}</p>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState(null);
  const [accessibility, setAccessibility] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchAccessibilityScores()])
      .then(([d, a]) => { setDashboard(d); setAccessibility(a); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="h-6 shimmer rounded w-32 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 shimmer rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const pieData = dashboard?.categoryBreakdown?.map(c => ({
    name: c._id, value: c.count, fill: CAT_COLORS[c._id] || '#6b7280',
  })) || [];

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={18} style={{ color: '#22c55e' }} />
          <h1 className="text-xl font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>Analytics</h1>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricCard icon={MapPin}    label="Locations"     value={dashboard?.totalLocations || 0} accent="#22c55e" delay={0} />
          <MetricCard icon={Users}     label="Check-ins"     value={dashboard?.totalCheckIns || 0}  accent="#3b82f6" delay={0.05} />
          <MetricCard icon={TrendingUp}label="Areas"         value={accessibility.length}            accent="#a855f7" delay={0.10} />
          <MetricCard icon={Star}      label="Avg Rating"    value="4.2"                             accent="#f59e0b" delay={0.15} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {/* Pie */}
          <div className="rounded-xl p-5" style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(255,255,255,0.70)' }}>Locations by Category</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={44} outerRadius={72} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} opacity={0.85} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  <span className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.45)' }}>{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar */}
          <div className="rounded-xl p-5" style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(255,255,255,0.70)' }}>Most Active Locations</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard?.topCheckedIn || []} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} tickLine={false} axisLine={false} width={90} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v, 'Check-ins']} />
                  <Bar dataKey="checkInCount" radius={[0, 4, 4, 0]} fill="#22c55e" opacity={0.75} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Accessibility scores */}
        <div className="rounded-xl p-5 mb-5" style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.70)' }}>
            <TrendingUp size={14} style={{ color: '#22c55e' }} />
            Fitness Accessibility by Area
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {accessibility.map((area, i) => (
              <motion.div
                key={area.area}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-lg p-3.5"
                style={{ background: '#161e28', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>{area.area}</span>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                    style={{ color: SCORE_COLORS[area.label], background: SCORE_COLORS[area.label] + '18' }}
                  >
                    {area.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${area.score}%` }}
                      transition={{ delay: i * 0.04 + 0.2, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: SCORE_COLORS[area.label] }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-7 text-right" style={{ color: 'rgba(255,255,255,0.55)' }}>{area.score}</span>
                </div>
                <div className="flex gap-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
                  <span>{area.breakdown.gyms}g</span>
                  <span>{area.breakdown.parks}p</span>
                  <span>{area.breakdown.courts}c</span>
                  <span>{area.breakdown.stores}s</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-xl p-5" style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(255,255,255,0.70)' }}>Recent Activity</h3>
          {!dashboard?.recentActivity?.length ? (
            <p className="text-sm text-center py-6" style={{ color: 'rgba(255,255,255,0.28)' }}>No activity yet</p>
          ) : (
            <div className="space-y-3">
              {dashboard.recentActivity.map((ci) => {
                const CatIcon = CAT_ICONS[ci.locationId?.category];
                return (
                  <div key={ci._id} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                      style={{ background: 'rgba(34,197,94,0.12)', color: 'rgba(74,222,128,0.80)' }}
                    >
                      {ci.userId?.name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
                        <span className="font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>{ci.userId?.name || 'Someone'}</span>
                        {' checked in at '}
                        <Link to={`/location/${ci.locationId?._id}`} className="transition-colors" style={{ color: 'rgba(74,222,128,0.75)' }}>
                          {ci.locationId?.name}
                        </Link>
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {new Date(ci.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {CatIcon && <CatIcon size={13} style={{ color: 'rgba(255,255,255,0.22)' }} className="flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
