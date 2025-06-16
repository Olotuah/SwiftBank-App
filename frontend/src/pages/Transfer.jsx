import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import api from "../utils/api";

export default function Transfer() {
  const [form, setForm] = useState({
    fromAccount: "Main Account",
    toAccount: "",
    amount: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [expectedOtp] = useState("123456");
  const [showSuccess, setShowSuccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 🔥 for mobile toggle

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowOTPModal(true);
    toast("A one-time code has been sent to your email");
  };

  const verifyAndSubmit = async () => {
    if (otpInput !== expectedOtp) {
      toast.error("Incorrect OTP. Please try again.");
      return;
    }
    setLoading(true);
    try {
      const data = {
        description: form.note || `Transfer to ${form.toAccount}`,
        type: "Debit",
        amount: parseFloat(form.amount),
        fromAccount: form.fromAccount,
      };
      await api.post("/transactions", data);
      setShowOTPModal(false);
      setOtpInput("");
      setForm({ fromAccount: "Main Account", toAccount: "", amount: "", note: "" });
      setShowSuccess(true);
      toast.success("Transfer successful!");
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error("Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen text-white bg-gradient-to-br from-black via-gray-900 to-gray-800 font-manrope relative">
      <Toaster position="top-right" />

      {/* ✅ Mobile Hamburger Toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden absolute top-4 left-4 z-50 bg-white/10 p-2 rounded"
      >
        <Menu size={24} />
      </button>

      {/* ✅ Fullscreen Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <svg
              className="animate-spin h-12 w-12 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-xl font-semibold">Processing Transfer...</p>
          </div>
        </div>
      )}

      {/* ✅ Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-green-600 bg-opacity-95 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="text-center text-white animate-bounce">
            <svg
              className="h-20 w-20 mx-auto mb-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm4.707-12.707a1 1 0 00-1.414-1.414L11 12.586 8.707 10.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l5-5z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-2xl font-bold">Transfer Successful</h2>
          </div>
        </div>
      )}

      {/* ✅ Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 w-64 p-6 bg-white/10 backdrop-blur-md border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-8 font-inter">SwiftBank</h2>
        <nav className="space-y-4">
          <Link to="/dashboard" className="block hover:text-blue-400">🏠 Dashboard</Link>
          <Link to="/transactions" className="block hover:text-blue-400">💳 Transactions</Link>
          <Link to="/transfer" className="block hover:text-blue-400">💸 Transfer</Link>
          <Link to="/bills" className="block hover:text-blue-400">📥 Bills</Link>
          <Link to="/cards" className="block hover:text-blue-400">💳 Cards</Link>
          <Link to="/profile" className="block hover:text-blue-400">👤 Profile</Link>
        </nav>
      </aside>

      {/* ✅ Main Content */}
      <main className="flex-1 p-6 sm:p-8 mt-16 md:mt-0">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold font-inter">Transfer Funds</h1>
          <p className="text-gray-300">Send money instantly to any account</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-xl space-y-4 max-w-lg w-full">
          <div>
            <label className="block mb-1 text-sm font-inter">From Account</label>
            <select
              name="fromAccount"
              value={form.fromAccount}
              onChange={handleChange}
              className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white border rounded p-2"
            >
              <option>Main Account</option>
              <option>Savings</option>
              <option>Dollar Wallet</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-inter">To Account (Email or Acct No)</label>
            <input
              type="text"
              name="toAccount"
              value={form.toAccount}
              onChange={handleChange}
              className="w-full bg-white/20 text-white p-3 rounded"
              placeholder="e.g. user@email.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-inter">Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full bg-white/20 text-white p-3 rounded"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-inter">Note (optional)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full bg-white/20 text-white p-3 rounded"
              placeholder="Description or purpose"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded font-inter flex justify-center items-center gap-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Send Money"
            )}
          </button>
        </form>

        {/* ✅ OTP Modal */}
        {showOTPModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm space-y-4">
              <h3 className="text-xl font-bold font-inter text-white">Enter OTP</h3>
              <p className="text-gray-300 text-sm">A code was sent to your email. Enter it to continue.</p>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full p-3 rounded bg-white/20 text-white"
                placeholder="Enter 6-digit code"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowOTPModal(false)}
                  className="px-4 py-2 bg-gray-500 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyAndSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
