const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['gym', 'park', 'court', 'store'],
    required: true,
  },
  address: String,
  area: String,
  city: { type: String, default: 'Cebu City' },
  latitude: Number,
  longitude: Number,
  rating: { type: Number, min: 0, max: 5 },
  priceLevel: { type: Number, min: 1, max: 4 },
  description: String,
  images: [String],
  openingHours: {
    weekdays: String,
    weekends: String,
    is24Hours: { type: Boolean, default: false },
  },
  amenities: {
    airConditioned: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    shower: { type: Boolean, default: false },
    beginnerFriendly: { type: Boolean, default: false },
  },
  checkInCount: { type: Number, default: 0 },
}, { timestamps: true });

locationSchema.index({ area: 1, category: 1 });
locationSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Location', locationSchema);
