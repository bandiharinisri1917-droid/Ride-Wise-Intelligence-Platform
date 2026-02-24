const MODES = [
  { key: 'saveMoney', label: 'Save Money' },
  { key: 'saveTime', label: 'Save Time' },
  { key: 'safetyFirst', label: 'Safety First' },
  { key: 'noStress', label: 'No Stress' }
];

export function ControlsPanel({ preference, onPreferenceChange, safetyMode, onSafetyChange, carbonMode, onCarbonChange }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-6">
      <div className="flex flex-wrap gap-2">
        {MODES.map((mode) => (
          <button key={mode.key} onClick={() => onPreferenceChange(mode.key)} className={`rounded-full px-4 py-2 text-sm transition ${preference === mode.key ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 hover:border-cyan-400'}`}>
            {mode.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-4">
        {['nightMode', 'womenMode', 'elderMode'].map((key) => (
          <label key={key} className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm">
            <span>{key.replace('Mode', ' Mode').replace('women', 'Women').replace('elder', 'Elder').replace('night', 'Night')}</span>
            <input type="checkbox" checked={safetyMode[key]} onChange={(e) => onSafetyChange(key, e.target.checked)} />
          </label>
        ))}
        <label className="flex items-center justify-between rounded-lg border border-emerald-700/70 bg-emerald-900/20 px-3 py-2 text-sm">
          <span>🌱 Carbon Friendly Mode</span>
          <input type="checkbox" checked={carbonMode} onChange={(e) => onCarbonChange(e.target.checked)} />
        </label>
      </div>
    </section>
  );
}
