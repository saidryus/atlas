import axios from 'axios';

// In production, VITE_API_URL points to the Render backend.
// In development, Vite's proxy forwards /api to localhost:5000.
const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// ── Locations ──────────────────────────────────────────────────────────────
export const fetchLocations = (params) =>
  axios.get(`${BASE}/locations`, { params }).then((r) => r.data);

export const fetchLocationById = (id) =>
  axios.get(`${BASE}/locations/${id}`).then((r) => r.data);

// ── Recommendations ────────────────────────────────────────────────────────
export const fetchRecommendations = (lat, lng, categoryPreference) =>
  axios.get(`${BASE}/recommendations`, { params: { lat, lng, categoryPreference } }).then((r) => r.data);

// ── Auth ───────────────────────────────────────────────────────────────────
export const signUp = (data) =>
  axios.post(`${BASE}/auth/signup`, data).then((r) => r.data);

export const signIn = (data) =>
  axios.post(`${BASE}/auth/signin`, data).then((r) => r.data);

// ── User ───────────────────────────────────────────────────────────────────
export const fetchFavorites = () =>
  axios.get(`${BASE}/user/favorites`).then((r) => r.data);

export const trackView = (id) =>
  axios.post(`${BASE}/user/viewed/${id}`).catch(() => {});

export const updatePreferences = (prefs) =>
  axios.put(`${BASE}/user/preferences`, prefs).then((r) => r.data);

// ── Check-ins ──────────────────────────────────────────────────────────────
export const createCheckIn = (locationId, data) =>
  axios.post(`${BASE}/checkins/${locationId}`, data).then((r) => r.data);

export const fetchLocationCheckIns = (locationId) =>
  axios.get(`${BASE}/checkins/${locationId}`).then((r) => r.data);

export const fetchCheckInStats = (locationId) =>
  axios.get(`${BASE}/checkins/stats/${locationId}`).then((r) => r.data);

export const fetchUserCheckIns = () =>
  axios.get(`${BASE}/checkins/user/me`).then((r) => r.data);

// ── Analytics ──────────────────────────────────────────────────────────────
export const fetchDashboard = () =>
  axios.get(`${BASE}/analytics/dashboard`).then((r) => r.data);

export const fetchAccessibilityScores = () =>
  axios.get(`${BASE}/analytics/accessibility`).then((r) => r.data);

export const fetchHeatmapData = () =>
  axios.get(`${BASE}/analytics/heatmap`).then((r) => r.data);
