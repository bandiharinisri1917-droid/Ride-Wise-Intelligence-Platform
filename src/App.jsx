import { useEffect, useMemo, useState } from 'react';
import { BASE_RIDES } from './data/rideProviders';
import { calculateCarbonImpact, calculateCancellationRisk, calculateRideScore, getNextWindowChange, isPeakTime } from './intelligence/scoring';
import { generateRouteMetrics } from './utils/route';
import { loadPersistedState, persistState } from './state/storage';
import { LocationPanel } from './components/LocationPanel';
import { ControlsPanel } from './components/ControlsPanel';
import { LiveStatus, SurgeBanner, CarbonSummary } from './components/StatusCards';
import { SurgeHeatmap } from './components/Heatmap';
import { RideList } from './components/RideList';
import { ComparisonModal } from './components/ComparisonModal';
import { BookingModal } from './components/BookingModal';

const defaultSafety = { nightMode: false, womenMode: false, elderMode: false };

const pad = (n) => `${Math.floor(n)}`.padStart(2, '0');
const formatCountdown = (ms) => {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export default function App() {
  const persisted = loadPersistedState();
  const [pickup, setPickup] = useState('Koramangala');
  const [destination, setDestination] = useState('Indiranagar');
  const [preference, setPreference] = useState(persisted.preference ?? 'saveMoney');
  const [safetyMode, setSafetyMode] = useState(persisted.safetyMode ?? defaultSafety);
  const [carbonMode, setCarbonMode] = useState(Boolean(persisted.carbonMode));
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [highlightedId, setHighlightedId] = useState('');
  const [bookingRide, setBookingRide] = useState(null);
  const [now, setNow] = useState(new Date());
  const [lastBookedRide, setLastBookedRide] = useState(persisted.lastBookedRide ?? null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const route = useMemo(() => generateRouteMetrics(pickup, destination, now), [pickup, destination, now]);

  const rides = useMemo(() => {
    const hour = now.getHours();
    const surgeSeed = (route.distanceKm + hour) % 4;

    const generated = BASE_RIDES.map((ride, index) => {
      const dynamicSurge = 1 + (surgeSeed === index % 4 ? 0.35 : 0) + (isPeakTime(now) ? 0.1 : 0);
      const surgeMultiplier = Number(dynamicSurge.toFixed(2));
      const eta = Math.max(4, Math.round(ride.eta + route.trafficFactor * (index % 3)));
      const adjustedCancellationRisk = calculateCancellationRisk(ride.cancellationRisk + route.distanceKm / 200, safetyMode);
      const finalPrice = ride.basePrice * surgeMultiplier * (1 + route.distanceKm / 40);
      const base = { ...ride, surgeMultiplier, eta, adjustedCancellationRisk, finalPrice };
      const score = calculateRideScore({
        ride: { ...base, cancellationRisk: adjustedCancellationRisk },
        context: {
          preference,
          safetyMode,
          carbonMode,
          route,
          currentHour: hour,
          userHistory: persisted
        },
        bounds: {
          minPrice: 50,
          maxPrice: 280,
          minEta: 4,
          maxEta: 35
        }
      });
      const carbon = calculateCarbonImpact(base, route.distanceKm);
      const safetyCompliant = (!safetyMode.womenMode && !safetyMode.elderMode) || base.driverRating >= 4.2;
      return { ...base, score, carbon, safetyCompliant };
    }).filter((ride) => (safetyMode.womenMode || safetyMode.elderMode ? ride.driverRating >= 4.2 : true));

    const sorted = generated.sort((a, b) => b.score - a.score);
    return sorted.map((ride, idx) => ({ ...ride, isRecommended: idx === 0 }));
  }, [now, route, preference, safetyMode, carbonMode, persisted]);

  const bestRide = rides[0];

  useEffect(() => {
    persistState({
      preference,
      safetyMode,
      carbonMode,
      lastBookedRide,
      mostFrequentRideType: lastBookedRide?.vehicleType ?? persisted.mostFrequentRideType
    });
  }, [preference, safetyMode, carbonMode, lastBookedRide]);

  const onCompareToggle = (id) => {
    setSelectedCompareIds((curr) => curr.includes(id) ? curr.filter((item) => item !== id) : curr.length < 3 ? [...curr, id] : curr);
  };

  const handleBook = (ride) => {
    setBookingRide(ride);
    setLastBookedRide({ provider: ride.provider, vehicleType: ride.vehicleType, timestamp: Date.now() });
  };

  const handleBookBest = () => {
    if (!bestRide) return;
    setHighlightedId(bestRide.id);
    document.getElementById(`ride-${bestRide.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    handleBook(bestRide);
  };

  const nextChange = getNextWindowChange(now);
  const countdown = formatCountdown(nextChange - now);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 md:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Ride Wise Intelligence Platform</h1>
            <p className="text-sm text-slate-400">AI-powered commute decisions with dynamic scoring, safety, and sustainability intelligence.</p>
          </div>
          <button onClick={handleBookBest} className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400">Book Best Ride</button>
        </header>

        <LocationPanel
          pickup={pickup}
          destination={destination}
          route={route}
          onPickupChange={setPickup}
          onDestinationChange={setDestination}
          onSwap={() => {
            setPickup(destination);
            setDestination(pickup);
          }}
          onUseCurrent={() => setPickup('Current Location')}
        />

        <ControlsPanel
          preference={preference}
          onPreferenceChange={setPreference}
          safetyMode={safetyMode}
          onSafetyChange={(key, value) => setSafetyMode((curr) => ({ ...curr, [key]: value }))}
          carbonMode={carbonMode}
          onCarbonChange={setCarbonMode}
        />

        <LiveStatus now={now} peak={isPeakTime(now)} countdown={countdown} />
        <SurgeBanner surgeRide={rides.find((ride) => ride.surgeMultiplier > 1.2)} distanceKm={route.distanceKm} />
        <CarbonSummary bestRide={bestRide} />

        {persisted.lastBookedRide && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
            Pattern insight: You recently booked <span className="font-semibold text-white">{persisted.lastBookedRide.provider}</span> and tend to prefer <span className="font-semibold text-white">{persisted.mostFrequentRideType ?? 'standard'}</span> rides.
          </section>
        )}

        <RideList rides={rides} selectedIds={selectedCompareIds} onCompareToggle={onCompareToggle} onBook={handleBook} highlightedId={highlightedId} />
        <SurgeHeatmap />

        <ComparisonModal rides={rides.filter((ride) => selectedCompareIds.includes(ride.id))} onClose={() => setSelectedCompareIds([])} />
        <BookingModal ride={bookingRide} onClose={() => setBookingRide(null)} />
      </div>
    </main>
  );
}
