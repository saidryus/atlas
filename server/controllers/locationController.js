const Location = require('../models/Location');
const CheckIn = require('../models/CheckIn');
const { getDistance } = require('../utils/distance');
const { predictCrowd } = require('../utils/crowdPredictor');

exports.getLocations = async (req, res) => {
  try {
    const {
      category, area, search, lat, lng, distance,
      priceLevel, rating, amenities,
      openNow, is24Hours, page = 1, limit = 50,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (area) filter.area = new RegExp(area, 'i');
    if (priceLevel) filter.priceLevel = { $lte: Number(priceLevel) };
    if (rating) filter.rating = { $gte: Number(rating) };
    if (is24Hours === 'true') filter['openingHours.is24Hours'] = true;

    // Amenity filters
    if (amenities) {
      const list = amenities.split(',');
      list.forEach(a => { filter[`amenities.${a}`] = true; });
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { area: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    let locations = await Location.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Distance filter
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxDist = distance ? parseFloat(distance) : 10;

      locations = locations
        .map(loc => ({
          ...loc.toObject(),
          distance: getDistance(userLat, userLng, loc.latitude, loc.longitude),
        }))
        .filter(loc => loc.distance <= maxDist)
        .sort((a, b) => a.distance - b.distance);
    }

    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ error: 'Not found' });

    // Attach crowd prediction
    const now = new Date();
    const hour = now.getHours();
    const isWeekend = [0, 6].includes(now.getDay());
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const recentCheckIns = await CheckIn.countDocuments({
      locationId: location._id,
      createdAt: { $gte: twoHoursAgo },
    });

    const crowd = predictCrowd(location.category, hour, isWeekend, recentCheckIns);

    res.json({ ...location.toObject(), crowd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
