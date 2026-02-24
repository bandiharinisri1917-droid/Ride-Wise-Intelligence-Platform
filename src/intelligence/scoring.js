import { RIDE_TYPES } from '../data/rideProviders';

export const PREFERENCE_WEIGHTS = {
  saveMoney: { price: 0.4, eta: 0.15, rating: 0.15, cancellation: 0.15, carbon: 0.15 },
  saveTime: { price: 0.15, eta: 0.4, rating: 0.15, cancellation: 0.15, carbon: 0.15 },
  safetyFirst: { price: 0.1, eta: 0.15, rating: 0.35, cancellation: 0.3, carbon: 0.1 },
  noStress: { price: 0.15, eta: 0.2, rating: 0.25, cancellation: 0.3, carbon: 0.1 }
};

export const normalizePrice = (price, min, max) => {
  if (max === min) return 1;
  return 1 - (price - min) / (max - min);
};

export const normalizeETA = (eta, min, max) => {
  if (max === min) return 1;
  return 1 - (eta - min) / (max - min);
};

export const calculateCancellationRisk = (baseRisk, safetyMode) => {
  let modifier = 1;
  if (safetyMode.nightMode) modifier += 0.15;
  if (safetyMode.womenMode) modifier += 0.1;
  if (safetyMode.elderMode) modifier += 0.1;
  return Math.min(baseRisk * modifier, 0.95);
};

export const calculateCarbonImpact = (ride, distanceKm) => {
  const emissionRate = RIDE_TYPES[ride.vehicleType]?.emission ?? 120;
  const grams = emissionRate * distanceKm;
  const baselineGrams = RIDE_TYPES.standard.emission * distanceKm;
  const savedKg = (baselineGrams - grams) / 1000;
  return {
    grams,
    savedKg
  };
};

const isPeakHour = (hour) => (hour >= 8 && hour < 11) || (hour >= 17 && hour < 21);

export const calculateRideScore = ({
  ride,
  context,
  bounds
}) => {
  const {
    preference,
    safetyMode,
    carbonMode,
    route,
    currentHour,
    userHistory
  } = context;

  const peak = isPeakHour(currentHour);
  const weights = { ...PREFERENCE_WEIGHTS[preference] };

  if (safetyMode.nightMode || safetyMode.womenMode || safetyMode.elderMode) {
    weights.rating += 0.1;
    weights.cancellation += 0.1;
    weights.price -= 0.05;
    weights.eta -= 0.05;
  }

  if (carbonMode) {
    weights.carbon += 0.2;
    weights.price -= 0.1;
    weights.eta -= 0.1;
  }

  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
  Object.keys(weights).forEach((key) => {
    weights[key] = Math.max(weights[key], 0) / totalWeight;
  });

  const surgeAdjustedPrice = ride.basePrice * ride.surgeMultiplier;
  const peakAdjustedPrice = peak ? surgeAdjustedPrice * 1.08 : surgeAdjustedPrice;

  const priceScore = normalizePrice(peakAdjustedPrice, bounds.minPrice, bounds.maxPrice);
  const etaScore = normalizeETA(ride.eta, bounds.minEta, bounds.maxEta);
  const ratingScore = Math.min(ride.driverRating / 5, 1);
  const cancellationRisk = calculateCancellationRisk(ride.cancellationRisk, safetyMode);
  const cancellationScore = 1 - cancellationRisk;

  const { savedKg } = calculateCarbonImpact(ride, route.distanceKm);
  const carbonScore = Math.max(0, Math.min((savedKg + 0.8) / 1.4, 1));

  let score =
    priceScore * weights.price +
    etaScore * weights.eta +
    ratingScore * weights.rating +
    cancellationScore * weights.cancellation +
    carbonScore * weights.carbon;

  if (peak && ride.vehicleType === 'bike') score += 0.03;
  if (ride.surgeMultiplier > 1.2) score -= 0.04;
  if (route.distanceKm > 12 && ride.vehicleType === 'bike') score -= 0.05;

  if (userHistory?.mostFrequentRideType === ride.vehicleType) score += 0.04;
  if (userHistory?.lastBookedRide?.provider === ride.provider) score += 0.02;

  return Number((score * 100).toFixed(2));
};

export const isPeakTime = (date = new Date()) => isPeakHour(date.getHours());

export const getNextWindowChange = (date = new Date()) => {
  const now = new Date(date);
  const candidates = [8, 11, 17, 21]
    .map((hour) => {
      const candidate = new Date(now);
      candidate.setHours(hour, 0, 0, 0);
      if (candidate <= now) candidate.setDate(candidate.getDate() + 1);
      return candidate;
    })
    .sort((a, b) => a - b);

  return candidates[0];
};
