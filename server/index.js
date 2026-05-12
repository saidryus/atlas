const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('./config/passport');
require('dotenv').config();

const app = express();

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));

// Rate limiting
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { error: 'Too many requests' } }));

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    /\.vercel\.app$/,   // allow any vercel preview URL
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/analytics', require('./routes/analytics'));

// One-time seed endpoint — hit this URL once to populate the database
// Protected by a secret key so random people can't wipe your data
app.post('/api/admin/seed', async (req, res) => {
  const { secret } = req.body;
  if (secret !== process.env.SEED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const Location = require('./models/Location');
    const count = await Location.countDocuments();
    if (count > 0) {
      return res.json({ message: `Already seeded — ${count} locations exist. Send force:true to reseed.`, count });
    }
    const seedFn = require('./seed/seed');
    await seedFn();
    const newCount = await Location.countDocuments();
    res.json({ message: `Seeded successfully`, count: newCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Force reseed endpoint
app.post('/api/admin/reseed', async (req, res) => {
  const { secret } = req.body;
  if (secret !== process.env.SEED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const Location = require('./models/Location');
    await Location.deleteMany({});
    const seedFn = require('./seed/seed');
    await seedFn();
    const count = await Location.countDocuments();
    res.json({ message: `Reseeded successfully`, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Auto-seed if SEED_ON_START=true is set in environment
    if (process.env.SEED_ON_START === 'true') {
      try {
        const Location = require('./models/Location');
        const count = await Location.countDocuments();
        if (count === 0) {
          console.log('No locations found — running seed...');
          require('./seed/seed.js');
        } else {
          console.log(`Seed skipped — ${count} locations already exist`);
        }
      } catch (e) {
        console.error('Seed error:', e.message);
      }
    }

    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error(err));
