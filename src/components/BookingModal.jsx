export function BookingModal({ ride, onClose }) {
  if (!ride) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-950 p-5">
        <h3 className="text-lg font-semibold text-emerald-300">Booking Confirmed</h3>
        <p className="mt-2 text-sm text-slate-300">{ride.provider} • {ride.displayVehicle} arriving in {ride.eta} min for ₹{Math.round(ride.finalPrice)}.</p>
        <button onClick={onClose} className="mt-4 rounded border border-emerald-500 px-3 py-1">Done</button>
      </div>
    </div>
  );
}
