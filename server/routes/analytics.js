const express = require('express');
const router = express.Router();
const { getDashboard, getAccessibilityScores, getHeatmapData } = require('../controllers/analyticsController');

router.get('/dashboard', getDashboard);
router.get('/accessibility', getAccessibilityScores);
router.get('/heatmap', getHeatmapData);

module.exports = router;
