const User = require('../models/User');
const { signToken } = require('../utils/jwt');

// ── Google OAuth callback ──────────────────────────────────────────────────
exports.googleCallback = (req, res) => {
  const token = signToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
};

// ── Email/Password Sign Up ─────────────────────────────────────────────────
exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists' });

    const user = await User.create({ name, email, password, authProvider: 'local' });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, profilePic: user.profilePic } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Email/Password Sign In ─────────────────────────────────────────────────
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password)
      return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await user.comparePassword(password);
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(user._id);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, profilePic: user.profilePic } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Get current user ───────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'name category area rating priceLevel images')
      .populate('recentlyViewed', 'name category area rating priceLevel images');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (_req, res) => res.json({ message: 'Logged out' });
