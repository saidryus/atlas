const express = require('express');
const router = express.Router();
const { createCheckIn, getLocationCheckIns, getCheckInStats, getUserCheckIns } = require('../controllers/checkInController');
const { requireAuth } = require('../middleware/auth');

router.post('/:locationId', requireAuth, createCheckIn);
router.get('/user/me', requireAuth, getUserCheckIns);
router.get('/stats/:locationId', getCheckInStats);
router.get('/:locationId', getLocationCheckIns);

module.exports = router;
