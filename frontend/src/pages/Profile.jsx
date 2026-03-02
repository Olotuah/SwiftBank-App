import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LogOut,
  Shield,
  SlidersHorizontal,
  User,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { getStoredUser, logout as doLogout } from "../services/authService";
import { toast, Toaster } from "react-hot-toast";
import api from "../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = useMemo(() => getStoredUser(), []);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "profile";
  });

  const [pinForm, setPinForm] = useState({
    pin: "",
    confirmPin: "",
  });
  const [savingPin, setSavingPin] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const firstName = storedUser?.fullName?.split?.(" ")?.[0] || "User";

  const handleLogout = () => {
    doLogout();
    toast.success("Logged out");
    navigate("/login");
  };

  const setTab = (tab) => {
    setActiveTab(tab);
    navigate(`/profile?tab=${tab}`);
  };

  const handlePinChange = (e) => {
    setPinForm({ ...pinForm, [e.target.name]: e.target.value });
  };

  const saveTransferPin = async () => {
    const pin = pinForm.pin.trim();
    const confirm = pinForm.confirmPin.trim();

    if (!/^\d{4}$/.test(pin)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    if (pin !== confirm) {
      toast.error("PINs do not match");
      return;
    }

    setSavingPin(true);
    try {
      const res = await api.post("/auth/pin", { pin });

      toast.success(res?.data?.message || "Transfer PIN set successfully");

      // ✅ update local user object so Transfer page can detect PIN exists
      const updated = {
        ...(storedUser || {}),
        hasTransferPin: true,
      };
      localStorage.setItem("user", JSON.stringify(updated));

      setPinForm({ pin: "", confirmPin: "" });
      setShowPin(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to set PIN");
    } finally {
      setSavingPin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 transition text-sm font-semibold"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* HEADER CARD */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <User className="text-indigo-300" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {storedUser?.fullName || "Your Profile"}
                </h1>
                <p className="text-slate-400 text-sm">
                  Welcome, {firstName}. Manage your account settings.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTab("profile")}
                className={`px-4 py-2 rounded-2xl text-sm transition border ${
                  activeTab === "profile"
                    ? "bg-white text-slate-900 border-white"
                    : "border-slate-700 hover:bg-slate-800"
                }`}
              >
                Profile
              </button>

              <button
                onClick={() => setTab("limits")}
                className={`px-4 py-2 rounded-2xl text-sm transition border ${
                  activeTab === "limits"
                    ? "bg-white text-slate-900 border-white"
                    : "border-slate-700 hover:bg-slate-800"
                }`}
              >
                Limits
              </button>

              <button
                onClick={() => setTab("security")}
                className={`px-4 py-2 rounded-2xl text-sm transition border ${
                  activeTab === "security"
                    ? "bg-white text-slate-900 border-white"
                    : "border-slate-700 hover:bg-slate-800"
                }`}
              >
                Security
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl p-6 space-y-6">
              <h2 className="text-xl font-bold">Account Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoItem label="Full Name" value={storedUser?.fullName || "—"} />
                <InfoItem label="Email" value={storedUser?.email || "—"} />
                <InfoItem label="Account Number" value={storedUser?.accountNumber || "—"} />
                <InfoItem label="Account Type" value={storedUser?.accountType || "Main Account"} />
              </div>

              <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4">
                <p className="text-sm text-slate-300 font-medium">Profile Updates</p>
                <p className="text-xs text-slate-400 mt-1">
                  Editing name/email will be enabled when we add an “Update Profile” API endpoint.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <input
                    disabled
                    placeholder="Change Full Name (coming soon)"
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 opacity-60"
                  />
                  <input
                    disabled
                    placeholder="Change Email (coming soon)"
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 opacity-60"
                  />
                </div>

                <button
                  disabled
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 opacity-50 cursor-not-allowed text-sm font-semibold"
                >
                  Save Changes (Coming Soon)
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-indigo-600/25 to-slate-900 border border-indigo-500/20 shadow-xl p-6 space-y-4">
              <h3 className="text-lg font-bold">Account Tier</h3>
              <p className="text-slate-200/90 text-sm">
                You’re currently on <span className="font-semibold">Standard</span>.
              </p>

              <div className="rounded-2xl bg-slate-900/60 border border-slate-700 p-4">
                <p className="text-sm font-semibold">Upgrade Benefits</p>
                <ul className="text-xs text-slate-400 mt-2 space-y-1">
                  <li>• Higher transfer limits</li>
                  <li>• Faster approvals</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              <button
                onClick={() => toast("Upgrade flow coming soon")}
                className="w-full px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-200 transition text-sm font-semibold"
              >
                Upgrade Tier
              </button>
            </div>
          </div>
        )}

        {activeTab === "limits" && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl p-6 space-y-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-amber-300" />
              <h2 className="text-xl font-bold">Transaction Limits</h2>
            </div>

            <p className="text-sm text-slate-400">
              These limits control how much you can transfer within SwiftBank.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <LimitCard title="Daily Limit" value="$5,000" hint="Total per day" />
              <LimitCard title="Single Transfer" value="$1,000" hint="Per transaction" />
              <LimitCard title="Monthly Limit" value="$20,000" hint="Total per month" />
            </div>

            <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-4">
              <p className="text-amber-200 font-semibold">Need higher limits?</p>
              <p className="text-xs text-slate-300 mt-1">
                Complete profile verification and upgrade your tier to unlock higher limits.
              </p>
              <button
                onClick={() => toast("Verification coming soon")}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 transition text-sm font-semibold"
              >
                Start Verification
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Shield className="text-emerald-400" />
              <h2 className="text-xl font-bold">Security</h2>
            </div>

            {/* ✅ Transfer PIN Card */}
            <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <KeyRound size={16} className="text-indigo-300" />
                    Transfer PIN
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Set a 4-digit PIN you’ll use to confirm transfers.
                  </p>
                </div>

                <div className="text-xs px-3 py-1 rounded-full border border-slate-600">
                  {storedUser?.hasTransferPin ? "PIN Set" : "Not Set"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    name="pin"
                    maxLength={4}
                    inputMode="numeric"
                    value={pinForm.pin}
                    onChange={handlePinChange}
                    placeholder="Enter 4-digit PIN"
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                    title={showPin ? "Hide PIN" : "Show PIN"}
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <input
                  type={showPin ? "text" : "password"}
                  name="confirmPin"
                  maxLength={4}
                  inputMode="numeric"
                  value={pinForm.confirmPin}
                  onChange={handlePinChange}
                  placeholder="Confirm PIN"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700"
                />
              </div>

              <button
                onClick={saveTransferPin}
                disabled={savingPin}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-sm font-semibold disabled:opacity-60"
              >
                {savingPin ? "Saving..." : storedUser?.hasTransferPin ? "Update PIN" : "Set PIN"}
              </button>

              <p className="text-xs text-slate-400 mt-2">
                Tip: Use a PIN you can remember, and don’t share it.
              </p>
            </div>

            {/* Existing security cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SecurityCard
                title="Login Alerts"
                desc="Get notified when a new device logs in."
                action={() => toast("Login alerts coming soon")}
              />
              <SecurityCard
                title="Change Password"
                desc="Update your password to keep your account safe."
                action={() => toast("Change password coming soon")}
              />
              <SecurityCard
                title="2-Step Verification"
                desc="Extra protection for transfers and sensitive actions."
                action={() => toast("2-step verification coming soon")}
              />
              <SecurityCard
                title="Devices"
                desc="Manage devices signed into your account."
                action={() => toast("Devices page coming soon")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-base font-semibold mt-1 break-words">{value}</p>
    </div>
  );
}

function LimitCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{hint}</p>
    </div>
  );
}

function SecurityCard({ title, desc, action }) {
  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-5">
      <p className="font-semibold">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{desc}</p>
      <button
        onClick={action}
        className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-sm font-semibold"
      >
        Manage
      </button>
    </div>
  );
}
