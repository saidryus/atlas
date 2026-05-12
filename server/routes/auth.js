const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { googleCallback, getMe, logout, signUp, signIn } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const googleConfigured =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID';

// Email/password
router.post('/signup', signUp);
router.post('/signin', signIn);

// Google OAuth
router.get('/google', (req, res, next) => {
  if (!googleConfigured)
    return res.status(503).json({ error: 'Google OAuth not configured' });
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!googleConfigured) return res.redirect(`${process.env.CLIENT_URL}/login?error=1`);
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=1` })(req, res, next);
}, googleCallback);

router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, logout);

module.exports = router;
