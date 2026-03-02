import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { getStoredUser, logout as doLogout } from "../services/authService";

export default function AccountDetails() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getStoredUser();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/accounts");
        setAccounts(res.data || []);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
          doLogout();
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        toast.error("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-300 hover:text-white">
            <ArrowLeft size={18} /> Back
          </Link>
          <h1 className="text-2xl font-bold">Account Details</h1>
          <div />
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl p-6 space-y-4">
          <div>
            <p className="text-slate-400 text-sm">Account Holder</p>
            <p className="text-lg font-semibold">{user?.fullName || "—"}</p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">Email</p>
            <p className="text-lg font-medium">{user?.email || "—"}</p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">Account Number</p>
            <p className="text-lg font-mono tracking-wider">{user?.accountNumber || "—"}</p>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <p className="text-slate-400 text-sm mb-3">Your Wallets</p>

            {loading ? (
              <p className="text-slate-400">Loading...</p>
            ) : accounts.length === 0 ? (
              <p className="text-slate-400">No accounts found.</p>
            ) : (
              <div className="grid sm:grid-cols-3 gap-3">
                {accounts.map((a) => (
                  <div key={a._id} className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
                    <p className="text-sm text-slate-300">{a.name}</p>
                    <p className="text-xl font-bold mt-1">${Number(a.balance || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              to="/fund-account"
              className="inline-flex items-center justify-center w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 transition py-3 font-semibold"
            >
              Fund an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
