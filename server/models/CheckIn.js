const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    crowdLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
    note: { type: String, maxlength: 200, trim: true },
  },
  { timestamps: true }
);

// Index for fast crowd queries
checkInSchema.index({ locationId: 1, createdAt: -1 });
checkInSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CheckIn', checkInSchema);
