import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('All fields are required'); return; }
    setLoading(true);
    try {
      await loginWithEmail(form.email, form.password);
      toast.success('Welcome back');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0d1117' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-2xl p-7" style={{ background: '#111820', border: '1px solid rgba(255,255,255,0.09)' }}>
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center mx-auto mb-3">
              <MapPin size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>Sign in to Atlas</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>Cebu Fitness & Sports</p>
          </div>

          {/* Google */}
          <button
            onClick={() => { window.location.href = '/api/auth/google'; }}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150 mb-4"
            style={{ background: '#fff', color: '#1a1a1a', border: '1px solid rgba(0,0,0,0.08)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {error && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', color: 'rgba(248,113,113,0.90)' }}>
                {error}
              </div>
            )}
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.25)' }} />
              <input type="email" placeholder="Email address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input w-full pl-8 text-sm" />
            </div>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.25)' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input w-full pl-8 pr-9 text-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'rgba(255,255,255,0.25)' }}>
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed mt-1">
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign in</span><ArrowRight size={14} /></>
              }
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              No account?{' '}
              <Link to="/signup" className="font-medium transition-colors" style={{ color: 'rgba(74,222,128,0.80)' }}>
                Sign up
              </Link>
            </p>
            <Link to="/" className="block text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Continue as guest
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
