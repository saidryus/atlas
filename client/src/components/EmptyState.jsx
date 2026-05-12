import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center text-center py-20 px-4"
    >
      {Icon && (
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Icon size={24} style={{ color: 'rgba(255,255,255,0.20)' }} strokeWidth={1.5} />
        </div>
      )}
      <p className="text-base font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.70)' }}>{title}</p>
      {description && (
        <p className="text-sm mb-6 max-w-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{description}</p>
      )}
      {action && (
        <Link to={action.to} className="btn-primary text-sm">
          {action.label}
        </Link>
      )}
    </motion.div>
  );
}
