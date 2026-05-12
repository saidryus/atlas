const Location = require('../models/Location');
const CheckIn = require('../models/CheckIn');
const { computeAccessibilityScore } = require('../utils/crowdPredictor');

// GET /api/analytics/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalLocations,
      totalCheckIns,
      topCheckedIn,
      categoryBreakdown,
      recentActivity,
    ] = await Promise.all([
      Location.countDocuments(),
      CheckIn.countDocuments(),

      // Most checked-in locations
      Location.find().sort({ checkInCount: -1 }).limit(5)
        .select('name category area rating checkInCount images'),

      // Category breakdown
      Location.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
        { $sort: { count: -1 } },
      ]),

      // Recent check-ins
      CheckIn.find().sort({ createdAt: -1 }).limit(10)
        .populate('userId', 'name profilePic')
        .populate('locationId', 'name category area'),
    ]);

    res.json({ totalLocations, totalCheckIns, topCheckedIn, categoryBreakdown, recentActivity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/accessibility
exports.getAccessibilityScores = async (req, res) => {
  try {
    const locations = await Location.find().select('category area priceLevel');
    const areas = [...new Set(locations.map(l => l.area).filter(Boolean))];

    const scores = areas.map(area => {
      const areaLocs = locations.filter(l => l.area === area);
      return { area, ...computeAccessibilityScore(areaLocs) };
    }).sort((a, b) => b.score - a.score);

    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/heatmap — check-in density per location
exports.getHeatmapData = async (req, res) => {
  try {
    const locations = await Location.find({ checkInCount: { $gt: 0 } })
      .select('latitude longitude checkInCount name category');

    const points = locations.map(l => ({
      lat: l.latitude,
      lng: l.longitude,
      intensity: Math.min(l.checkInCount / 10, 1), // normalize 0–1
      name: l.name,
      category: l.category,
    }));

    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
