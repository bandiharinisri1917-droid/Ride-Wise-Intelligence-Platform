const trafficPatterns = [0.9, 1, 1.15, 1.3];

export const generateRouteMetrics = (pickup, destination, time = new Date()) => {
  const seed = `${pickup}-${destination}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const distanceKm = 3 + (seed % 18);

  const hour = time.getHours();
  const baseTraffic = trafficPatterns[(seed + hour) % trafficPatterns.length];
  const peakBoost = (hour >= 8 && hour < 11) || (hour >= 17 && hour < 21) ? 1.2 : 0.95;
  const trafficFactor = Number((baseTraffic * peakBoost).toFixed(2));
  const etaMin = Math.max(8, Math.round(distanceKm * 2.9 * trafficFactor));

  return {
    distanceKm,
    trafficFactor,
    etaMin
  };
};
