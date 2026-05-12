import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <p className="text-7xl font-bold mb-3" style={{ color: 'rgba(255,255,255,0.06)' }}>404</p>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Page not found</h2>
        <p className="text-sm mb-7 max-w-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          This spot doesn't exist on the map yet.
        </p>
        <Link to="/" className="btn-primary text-sm inline-flex items-center gap-1.5">
          <Home size={14} /> Back to home
        </Link>
      </motion.div>
    </div>
  );
}
