const CheckIn = require('../models/CheckIn');
const Location = require('../models/Location');

// POST /api/checkins/:locationId
exports.createCheckIn = async (req, res) => {
  try {
    const { crowdLevel, note } = req.body;
    const { locationId } = req.params;

    if (!['low', 'medium', 'high'].includes(crowdLevel))
      return res.status(400).json({ error: 'Invalid crowd level' });

    const location = await Location.findById(locationId);
    if (!location) return res.status(404).json({ error: 'Location not found' });

    const checkIn = await CheckIn.create({
      userId: req.user._id,
      locationId,
      crowdLevel,
      note: note?.trim() || '',
    });

    // Increment location check-in count
    await Location.findByIdAndUpdate(locationId, { $inc: { checkInCount: 1 } });

    const populated = await checkIn.populate('userId', 'name profilePic');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/checkins/:locationId — recent check-ins for a location
exports.getLocationCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ locationId: req.params.locationId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'name profilePic');
    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/checkins/stats/:locationId — crowd stats for prediction
exports.getCheckInStats = async (req, res) => {
  try {
    const { locationId } = req.params;
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const [total, recent, distribution] = await Promise.all([
      CheckIn.countDocuments({ locationId }),
      CheckIn.countDocuments({ locationId, createdAt: { $gte: twoHoursAgo } }),
      CheckIn.aggregate([
        { $match: { locationId: require('mongoose').Types.ObjectId.createFromHexString(locationId) } },
        { $group: { _id: '$crowdLevel', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({ total, recent, distribution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/checkins/user — current user's check-ins
exports.getUserCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('locationId', 'name category area images');
    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
