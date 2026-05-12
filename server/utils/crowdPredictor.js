/**
 * Rule-based crowd prediction engine.
 * Uses time of day, day of week, category, and historical check-in data.
 */

const PEAK_HOURS = {
  gym:   { peak: [6, 7, 17, 18, 19, 20], moderate: [8, 9, 10, 11, 12, 16], low: [0,1,2,3,4,5,13,14,15,21,22,23] },
  park:  { peak: [5, 6, 7, 17, 18, 19], moderate: [8, 9, 16, 20], low: [0,1,2,3,4,10,11,12,13,14,15,21,22,23] },
  court: { peak: [14, 15, 16, 17, 18, 19, 20], moderate: [9, 10, 11, 12, 13], low: [0,1,2,3,4,5,6,7,8,21,22,23] },
  store: { peak: [11, 12, 17, 18, 19], moderate: [10, 13, 14, 15, 16, 20], low: [0,1,2,3,4,5,6,7,8,9,21,22,23] },
};

const BEST_TIME_LABELS = {
  gym:   'Before 9 AM or after 9 PM',
  park:  'Before 7 AM or after 7 PM',
  court: 'Before 2 PM on weekdays',
  store: 'Mid-morning (10–11 AM)',
};

const PEAK_LABEL = {
  gym:   '5 PM – 8 PM weekdays',
  park:  '6 AM – 8 AM weekends',
  court: '3 PM – 7 PM daily',
  store: '11 AM – 1 PM & 5–7 PM',
};

/**
 * Predict crowd level for a location at a given time.
 * @param {string} category
 * @param {number} hour - 0-23
 * @param {boolean} isWeekend
 * @param {number} recentCheckIns - check-ins in last 2 hours
 * @returns {{ level: 'low'|'moderate'|'high', label: string, color: string, score: number }}
 */
function predictCrowd(category, hour, isWeekend, recentCheckIns = 0) {
  const hours = PEAK_HOURS[category] || PEAK_HOURS.gym;

  let baseScore = 0;
  if (hours.peak.includes(hour)) baseScore = 75;
  else if (hours.moderate.includes(hour)) baseScore = 45;
  else baseScore = 20;

  // Weekend modifier
  if (isWeekend) {
    if (category === 'park') baseScore += 15;
    if (category === 'court') baseScore += 10;
    if (category === 'gym') baseScore -= 10;
  }

  // Recent check-in boost (each check-in in last 2h adds ~5 points, capped at 20)
  baseScore += Math.min(recentCheckIns * 5, 20);
  baseScore = Math.min(100, Math.max(0, baseScore));

  let level, label, color;
  if (baseScore >= 65) { level = 'high'; label = 'Usually busy'; color = '#ef4444'; }
  else if (baseScore >= 35) { level = 'moderate'; label = 'Moderately busy'; color = '#f59e0b'; }
  else { level = 'low'; label = 'Not too busy'; color = '#22c55e'; }

  return {
    level,
    label,
    color,
    score: baseScore,
    bestTime: BEST_TIME_LABELS[category] || 'Early morning',
    peakHours: PEAK_LABEL[category] || 'Evening hours',
  };
}

/**
 * Generate hourly crowd forecast for a full day (0–23)
 */
function getDailyForecast(category, isWeekend = false) {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: `${hour.toString().padStart(2, '0')}:00`,
    ...predictCrowd(category, hour, isWeekend, 0),
  }));
}

/**
 * Compute Fitness Accessibility Score for an area
 * @param {Array} locations - all locations in the area
 * @returns {{ score: number, label: string, breakdown: object }}
 */
function computeAccessibilityScore(locations) {
  const gyms   = locations.filter(l => l.category === 'gym').length;
  const parks  = locations.filter(l => l.category === 'park').length;
  const courts = locations.filter(l => l.category === 'court').length;
  const stores = locations.filter(l => l.category === 'store').length;
  const affordable = locations.filter(l => l.priceLevel <= 2).length;

  const gymScore    = Math.min(gyms * 12, 25);
  const parkScore   = Math.min(parks * 10, 20);
  const courtScore  = Math.min(courts * 10, 20);
  const storeScore  = Math.min(stores * 8, 15);
  const affordScore = Math.min(affordable * 4, 20);

  const total = gymScore + parkScore + courtScore + storeScore + affordScore;
  const score = Math.min(100, total);

  let label;
  if (score >= 80) label = 'Excellent';
  else if (score >= 60) label = 'Good';
  else if (score >= 40) label = 'Moderate';
  else label = 'Poor';

  return {
    score,
    label,
    breakdown: { gyms, parks, courts, stores, affordable },
  };
}

module.exports = { predictCrowd, getDailyForecast, computeAccessibilityScore };
