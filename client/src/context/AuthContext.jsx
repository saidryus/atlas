import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Point all axios requests to the Render backend in production
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('atlas_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/auth/me')
        .then((r) => setUser(r.data))
        .catch(() => {
          localStorage.removeItem('atlas_token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const _applyToken = (token) => {
    localStorage.setItem('atlas_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const loginWithToken = (token) => {
    _applyToken(token);
    return axios.get('/api/auth/me').then((r) => { setUser(r.data); return r.data; });
  };

  const loginWithEmail = async (email, password) => {
    const { token, user: u } = await axios.post('/api/auth/signin', { email, password }).then(r => r.data);
    _applyToken(token);
    setUser(u);
    return u;
  };

  const registerWithEmail = async (name, email, password) => {
    const { token, user: u } = await axios.post('/api/auth/signup', { name, email, password }).then(r => r.data);
    _applyToken(token);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('atlas_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Signed out');
  };

  const toggleFavorite = async (locationId) => {
    if (!user) return false;
    const res = await axios.post(`/api/user/favorites/${locationId}`);
    setUser((u) => ({ ...u, favorites: res.data.favorites }));
    return res.data.isFavorite;
  };

  const isFavorite = (locationId) =>
    user?.favorites?.some((f) => (f._id || f).toString() === locationId) ?? false;

  return (
    <AuthContext.Provider value={{
      user, loading,
      loginWithToken, loginWithEmail, registerWithEmail,
      logout, toggleFavorite, isFavorite,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
