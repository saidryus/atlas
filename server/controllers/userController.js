const User = require('../models/User');
const Location = require('../models/Location');

exports.toggleFavorite = async (req, res) => {
  try {
    const user = req.user;
    const locationId = req.params.id;
    const location = await Location.findById(locationId);
    if (!location) return res.status(404).json({ error: 'Location not found' });

    const isFav = user.favorites.some(f => f.toString() === locationId);
    if (isFav) {
      user.favorites = user.favorites.filter(f => f.toString() !== locationId);
    } else {
      user.favorites.push(locationId);
    }
    await user.save();
    res.json({ favorites: user.favorites, isFavorite: !isFav });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.trackView = async (req, res) => {
  try {
    const user = req.user;
    const locationId = req.params.id;
    user.recentlyViewed = [
      locationId,
      ...user.recentlyViewed.filter(id => id.toString() !== locationId),
    ].slice(0, 10);
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { categories, preferredAreas, budgetLevel, workoutTimes } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: { categories, preferredAreas, budgetLevel, workoutTimes } },
      { new: true }
    );
    res.json(user.preferences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
