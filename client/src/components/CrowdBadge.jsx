const STYLES = {
  low:      { dot: '#22c55e', text: 'rgba(74,222,128,0.85)',  bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.20)' },
  moderate: { dot: '#f59e0b', text: 'rgba(251,191,36,0.85)',  bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)' },
  high:     { dot: '#ef4444', text: 'rgba(248,113,113,0.85)', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.20)' },
  medium:   { dot: '#f59e0b', text: 'rgba(251,191,36,0.85)',  bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)' },
};

export default function CrowdBadge({ level, label, compact = false }) {
  const s = STYLES[level] || STYLES.low;

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md"
        style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
        {label}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {label}
    </span>
  );
}
