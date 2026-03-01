import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function NearMe() {
  const [status, setStatus] = useState("Checking location…");
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("Location found.");
        toast.success("Location detected");
      },
      () => {
        setStatus("Location permission denied.");
        toast.error("Enable location to use Near Me");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <Toaster position="top-right" />
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Near Me</h1>
        <p className="text-slate-400 text-sm mt-1">ATMs, Agents, Branches (simulation).</p>

        <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-sm">{status}</p>
          {coords && (
            <p className="text-xs text-slate-400 mt-2">
              Lat: {coords.lat.toFixed(5)} • Lng: {coords.lng.toFixed(5)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
