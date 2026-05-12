const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites, trackView, updatePreferences } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.get('/favorites', requireAuth, getFavorites);
router.post('/favorites/:id', requireAuth, toggleFavorite);
router.delete('/favorites/:id', requireAuth, toggleFavorite);
router.post('/viewed/:id', requireAuth, trackView);
router.put('/preferences', requireAuth, updatePreferences);

module.exports = router;
