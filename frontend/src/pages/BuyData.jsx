import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function BuyData() {
  const [phone, setPhone] = useState("");
  const [bundle, setBundle] = useState("1GB");

  const submit = (e) => {
    e.preventDefault();
    toast.success(`Data purchase requested: ${bundle} for ${phone}`);
    setPhone("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <Toaster position="top-right" />
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Buy Data</h1>
        <p className="text-slate-400 text-sm mt-1">Purchase bundles (simulation).</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Phone number"
            required
          />

          <select value={bundle} onChange={(e) => setBundle(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700">
            <option>1GB</option>
            <option>2GB</option>
            <option>5GB</option>
            <option>10GB</option>
          </select>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-xl p-3 font-semibold">
            Buy
          </button>
        </form>
      </div>
    </div>
  );
}
