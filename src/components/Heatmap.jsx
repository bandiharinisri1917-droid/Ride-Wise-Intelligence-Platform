const zones = [
  ['🟢 Low', '🟡 Moderate', '🔴 High'],
  ['🟡 Moderate', '🔴 High', '🟢 Low'],
  ['🔴 High', '🟡 Moderate', '🟢 Low']
];

export function SurgeHeatmap() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-6">
      <h3 className="mb-3 text-lg font-semibold">City Surge Heatmap</h3>
      <div className="grid grid-cols-3 gap-2">
        {zones.flat().map((zone, index) => (
          <div key={`${zone}-${index}`} className={`rounded-lg p-4 text-center text-sm ${zone.includes('Low') ? 'bg-emerald-700/30' : zone.includes('Moderate') ? 'bg-yellow-700/30' : 'bg-rose-700/30'}`}>
            {zone}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">Legend: 🟢 Low | 🟡 Moderate | 🔴 High</p>
    </section>
  );
}
