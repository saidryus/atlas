const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false }, // only for email/password auth
    googleId: { type: String, unique: true, sparse: true },
    profilePic: String,
    authProvider: { type: String, enum: ['google', 'local'], default: 'local' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    preferences: {
      categories: [{ type: String, enum: ['gym', 'park', 'court', 'store'] }],
      preferredAreas: [String],
      budgetLevel: { type: Number, min: 1, max: 4, default: 2 },
      workoutTimes: [String], // e.g. ['morning', 'evening']
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
