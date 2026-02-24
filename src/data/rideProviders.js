export const RIDE_TYPES = {
  standard: { emission: 120, capacity: 4 },
  bike: { emission: 40, capacity: 1 },
  electric: { emission: 10, capacity: 4 },
  shared: { emission: 55, capacity: 2 }
};

export const BASE_RIDES = [
  {
    id: 'uber-go',
    provider: 'Uber',
    vehicleType: 'standard',
    displayVehicle: 'Uber Go',
    basePrice: 95,
    eta: 8,
    driverRating: 4.5,
    surgeMultiplier: 1.0,
    cancellationRisk: 0.14
  },
  {
    id: 'ola-mini',
    provider: 'Ola',
    vehicleType: 'standard',
    displayVehicle: 'Ola Mini',
    basePrice: 88,
    eta: 10,
    driverRating: 4.3,
    surgeMultiplier: 1.0,
    cancellationRisk: 0.16
  },
  {
    id: 'rapido-bike',
    provider: 'Rapido',
    vehicleType: 'bike',
    displayVehicle: 'Rapido Bike',
    basePrice: 62,
    eta: 7,
    driverRating: 4.4,
    surgeMultiplier: 1.0,
    cancellationRisk: 0.2
  },
  {
    id: 'electra-prime',
    provider: 'Electric Ride',
    vehicleType: 'electric',
    displayVehicle: 'Electra Prime',
    basePrice: 104,
    eta: 9,
    driverRating: 4.7,
    surgeMultiplier: 1.0,
    cancellationRisk: 0.1
  },
  {
    id: 'shared-pool',
    provider: 'Shared Ride',
    vehicleType: 'shared',
    displayVehicle: 'City Pool',
    basePrice: 70,
    eta: 12,
    driverRating: 4.2,
    surgeMultiplier: 1.0,
    cancellationRisk: 0.18
  },
  {
    id: 'bike-flex',
    provider: 'Bike Option',
    vehicleType: 'bike',
    displayVehicle: 'Bike Flex',
    basePrice: 58,
    eta: 6,
    driverRating: 4.1,
    surgeMultiplier: 1.0,
    cancellationRisk: 0.24
  }
];
