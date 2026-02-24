export function LocationPanel({ pickup, destination, onPickupChange, onDestinationChange, onSwap, onUseCurrent, route }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-6">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_auto] md:items-end">
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-slate-400">Pickup</span>
          <input value={pickup} onChange={(e) => onPickupChange(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
        </label>
        <button onClick={onSwap} className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-cyan-400">⇅ Swap</button>
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-slate-400">Destination</span>
          <input value={destination} onChange={(e) => onDestinationChange(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
        </label>
        <button onClick={onUseCurrent} className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-emerald-400">Use Current</button>
        <div className="rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
          <p>Distance: <span className="font-semibold text-white">{route.distanceKm} km</span></p>
          <p>Route ETA: <span className="font-semibold text-white">{route.etaMin} min</span></p>
        </div>
      </div>
    </section>
  );
}
