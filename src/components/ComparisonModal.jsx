export function ComparisonModal({ rides, onClose }) {
  if (!rides.length) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border border-slate-700 bg-slate-950 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ride Comparison</h3>
          <button onClick={onClose} className="rounded border border-slate-700 px-3 py-1">Close</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400"><tr><th>Metric</th>{rides.map((r) => <th key={r.id}>{r.displayVehicle}</th>)}</tr></thead>
          <tbody>
            {[
              ['Price', (r) => `₹${Math.round(r.finalPrice)}`],
              ['ETA', (r) => `${r.eta} min`],
              ['Rating', (r) => r.driverRating],
              ['Cancellation risk', (r) => `${(r.adjustedCancellationRisk * 100).toFixed(0)}%`],
              ['Carbon impact', (r) => `${r.carbon.grams} g`],
              ['Surge multiplier', (r) => `${r.surgeMultiplier.toFixed(1)}x`],
              ['Final score', (r) => r.score],
              ['Safety compliance', (r) => (r.safetyCompliant ? 'Yes' : 'No')]
            ].map(([label, fn]) => (
              <tr key={label} className="border-t border-slate-800">
                <td className="py-2 pr-2 text-slate-300">{label}</td>
                {rides.map((r) => <td key={`${r.id}-${label}`} className="py-2">{fn(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
