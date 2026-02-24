export function LiveStatus({ now, peak, countdown }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Live Clock</p>
          <p className="text-2xl font-bold">{now.toLocaleTimeString()}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Fare Window</p>
          <p className={`font-semibold ${peak ? 'text-rose-400' : 'text-emerald-400'}`}>{peak ? '🔴 Peak Time' : '🟢 Off-Peak'}</p>
          <p className="text-sm text-slate-300">Next change in {countdown}</p>
        </div>
      </div>
    </section>
  );
}

export function SurgeBanner({ surgeRide, distanceKm }) {
  if (!surgeRide || surgeRide.surgeMultiplier <= 1.2) return null;
  const savings = Math.round((surgeRide.basePrice * surgeRide.surgeMultiplier - surgeRide.basePrice) * 0.8 + distanceKm * 2);
  return (
    <section className="rounded-2xl border border-amber-600/40 bg-amber-900/20 p-4 text-amber-100">
      Surge active ({surgeRide.surgeMultiplier.toFixed(1)}x). Waiting 5–10 minutes may save ₹{savings}.
    </section>
  );
}

export function CarbonSummary({ bestRide }) {
  return (
    <section className="rounded-2xl border border-emerald-700/50 bg-emerald-900/20 p-4 text-emerald-100">
      You save <span className="font-bold">{bestRide?.carbon.savedKg.toFixed(2) ?? '0.00'} kg CO₂</span> compared to a petrol car.
    </section>
  );
}
