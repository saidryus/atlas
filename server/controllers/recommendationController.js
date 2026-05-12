const Location = require('../models/Location');
const { getDistance } = require('../utils/distance');

exports.getRecommendations = async (req, res) => {
  try {
    const { lat, lng, categoryPreference } = req.query;
    const userLat = parseFloat(lat) || 10.3157;
    const userLng = parseFloat(lng) || 123.8854;

    const hour = new Date().getHours();
    const isWeekend = [0, 6].includes(new Date().getDay());
    const all = await Location.find();

    const withDist = all.map(loc => ({
      ...loc.toObject(),
      distance: getDistance(userLat, userLng, loc.latitude, loc.longitude),
    }));

    const nearby = withDist.filter(l => l.distance <= 5).sort((a, b) => a.distance - b.distance);
    const suggestions = [];

    // Personalized preference boost
    if (categoryPreference) {
      const preferred = nearby.filter(l => l.category === categoryPreference).slice(0, 3);
      if (preferred.length) suggestions.push({ label: 'Top picks for you', items: preferred });
    }

    // Time-based
    if (hour >= 5 && hour < 10) {
      const parks = nearby.filter(l => l.category === 'park').slice(0, 3);
      if (parks.length) suggestions.push({ label: 'Great morning outdoor spots near you', items: parks });
    }
    if (hour >= 10 && hour < 14) {
      const gyms = nearby.filter(l => l.category === 'gym').slice(0, 3);
      if (gyms.length) suggestions.push({ label: 'Best nearby gym right now', items: gyms });
    }
    if (hour >= 14 && hour < 19) {
      const courts = nearby.filter(l => l.category === 'court').slice(0, 3);
      if (courts.length) suggestions.push({ label: 'Afternoon sports courts near you', items: courts });
    }

    // Weekend parks
    if (isWeekend) {
      const parks = nearby.filter(l => l.category === 'park').slice(0, 3);
      if (parks.length && !suggestions.find(s => s.label.includes('outdoor')))
        suggestions.push({ label: 'Perfect weekend outdoor spots', items: parks });
    }

    // Affordable
    const affordable = nearby.filter(l => l.priceLevel <= 2).slice(0, 3);
    if (affordable.length) suggestions.push({ label: 'Affordable options near you', items: affordable });

    // Nutrition
    const stores = nearby.filter(l => l.category === 'store').slice(0, 2);
    if (stores.length) suggestions.push({ label: 'Nutrition stores nearby', items: stores });

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
