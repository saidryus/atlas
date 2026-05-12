const PEAK_HOURS = {
  gym:   { peak: [6,7,17,18,19,20], moderate: [8,9,10,11,12,16], low: [0,1,2,3,4,5,13,14,15,21,22,23] },
  park:  { peak: [5,6,7,17,18,19], moderate: [8,9,16,20], low: [0,1,2,3,4,10,11,12,13,14,15,21,22,23] },
  court: { peak: [14,15,16,17,18,19,20], moderate: [9,10,11,12,13], low: [0,1,2,3,4,5,6,7,8,21,22,23] },
  store: { peak: [11,12,17,18,19], moderate: [10,13,14,15,16,20], low: [0,1,2,3,4,5,6,7,8,9,21,22,23] },
};

export function getDailyForecast(category, isWeekend = false) {
  const hours = PEAK_HOURS[category] || PEAK_HOURS.gym;
  return Array.from({ length: 24 }, (_, hour) => {
    let score = hours.peak.includes(hour) ? 75 : hours.moderate.includes(hour) ? 45 : 20;
    if (isWeekend) {
      if (category === 'park') score += 15;
      if (category === 'court') score += 10;
      if (category === 'gym') score -= 10;
    }
    score = Math.min(100, Math.max(0, score));
    const color = score >= 65 ? '#ef4444' : score >= 35 ? '#f59e0b' : '#22c55e';
    return { hour, label: `${hour.toString().padStart(2,'0')}:00`, score, color };
  });
}
