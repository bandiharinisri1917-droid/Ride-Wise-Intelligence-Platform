import { AnimatePresence, motion } from 'framer-motion';

export function RideList({ rides, selectedIds, onCompareToggle, onBook, highlightedId }) {
  return (
    <section className="space-y-3">
      <AnimatePresence>
        {rides.map((ride, idx) => (
          <motion.article
            layout
            key={ride.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-2xl border p-4 ${highlightedId === ride.id ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/70'}`}
            id={`ride-${ride.id}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">#{idx + 1} {ride.provider} • {ride.displayVehicle}</h3>
                <p className="text-sm text-slate-400">ETA {ride.eta} min • Rating {ride.driverRating} • Surge {ride.surgeMultiplier.toFixed(1)}x</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">₹{Math.round(ride.finalPrice)}</p>
                <p className="text-sm text-cyan-300">Score {ride.score}</p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${ride.score}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded bg-slate-800 px-2 py-1">Cancel risk {(ride.adjustedCancellationRisk * 100).toFixed(0)}%</span>
              <span className="rounded bg-slate-800 px-2 py-1">CO₂ {ride.carbon.grams} g</span>
              {ride.isRecommended && <span className="rounded bg-cyan-500/30 px-2 py-1 text-cyan-100">AI Recommended</span>}
              <span className={`rounded px-2 py-1 ${ride.safetyCompliant ? 'bg-emerald-700/40' : 'bg-rose-700/40'}`}>{ride.safetyCompliant ? 'Safety Compliant' : 'Safety Flag'}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => onCompareToggle(ride.id)} className="rounded border border-slate-700 px-3 py-1 text-sm">{selectedIds.includes(ride.id) ? 'Selected' : 'Compare'}</button>
              <button onClick={() => onBook(ride)} className="rounded border border-cyan-500 px-3 py-1 text-sm text-cyan-200">Book</button>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>
    </section>
  );
}
