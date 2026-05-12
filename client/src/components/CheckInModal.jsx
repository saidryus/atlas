import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, CheckCircle } from 'lucide-react';
import { createCheckIn } from '../services/api';
import toast from 'react-hot-toast';

const CROWD_OPTIONS = [
  { value: 'low',    label: 'Quiet',    desc: 'Plenty of space',    dot: '#22c55e' },
  { value: 'medium', label: 'Moderate', desc: 'Some people around', dot: '#f59e0b' },
  { value: 'high',   label: 'Busy',     desc: 'Crowded right now',  dot: '#ef4444' },
];

export default function CheckInModal({ locationId, locationName, onClose, onSuccess }) {
  const [crowdLevel, setCrowdLevel] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!crowdLevel) { toast.error('Select a crowd level'); return; }
    setLoading(true);
    try {
      await createCheckIn(locationId, { crowdLevel, note });
      setDone(true);
      toast.success('Checked in');
      setTimeout(() => { onSuccess?.(); onClose(); }, 1400);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm rounded-2xl p-5"
          style={{ background: '#161e28', border: '1px solid rgba(255,255,255,0.10)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {done ? (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 350, damping: 22 }}>
                <CheckCircle size={40} style={{ color: '#22c55e' }} className="mx-auto mb-3" />
              </motion.div>
              <p className="font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Checked in</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.40)' }}>{locationName}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.90)' }}>Check In</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{locationName}</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/6"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs mb-3 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <Users size={12} /> How busy is it right now?
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {CROWD_OPTIONS.map((opt) => {
                  const active = crowdLevel === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setCrowdLevel(opt.value)}
                      className="p-3 rounded-xl text-center transition-all duration-150"
                      style={{
                        background: active ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? opt.dot + '55' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full mx-auto block mb-1.5" style={{ background: opt.dot }} />
                      <p className="text-xs font-medium" style={{ color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)' }}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              <textarea
                placeholder="Optional note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
                rows={2}
                className="input w-full text-sm resize-none mb-4"
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !crowdLevel}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Check In'}
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
