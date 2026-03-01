import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  RefreshCcw,
  Search,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock3,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { getStoredUser } from "../services/authService";
import {
  fetchPendingTransfers,
  approveTransfer,
  rejectTransfer,
} from "../services/adminTransferService";

export default function AdminTransfers() {
  const navigate = useNavigate();
  const user = useMemo(() => getStoredUser(), []);
  const isAdmin = !!user?.isAdmin || !!user?.admin; // depending on how you store it

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);

  const [q, setQ] = useState("");
  const [rejectModal, setRejectModal] = useState({
    open: false,
    id: "",
    ref: "",
    reason: "",
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  // ✅ guard: only admin should access
  useEffect(() => {
    if (!isAdmin) {
      toast.error("Admin access required");
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const load = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      if (silent) setRefreshing(true);

      const data = await fetchPendingTransfers();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to load pending transfers");
    } finally {
      if (!silent) setLoading(false);
      if (silent) setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // auto refresh every 8s
    const t = setInterval(() => load({ silent: true }), 8000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;

    return items.filter((x) => {
      const fromName = x?.fromUser?.fullName?.toLowerCase?.() || "";
      const fromEmail = x?.fromUser?.email?.toLowerCase?.() || "";
      const fromAcct = x?.fromUser?.accountNumber?.toLowerCase?.() || "";
      const toName = x?.toUser?.fullName?.toLowerCase?.() || "";
      const toEmail = x?.toUser?.email?.toLowerCase?.() || "";
      const toAcct = x?.toUser?.accountNumber?.toLowerCase?.() || "";
      const ref = (x?.reference || "").toLowerCase();
      return (
        fromName.includes(s) ||
        fromEmail.includes(s) ||
        fromAcct.includes(s) ||
        toName.includes(s) ||
        toEmail.includes(s) ||
        toAcct.includes(s) ||
        ref.includes(s)
      );
    });
  }, [items, q]);

  const onApprove = async (id) => {
    const ok = window.confirm("Approve this transfer?");
    if (!ok) return;

    try {
      toast.loading("Approving transfer...", { id: "approve" });
      await approveTransfer(id);
      toast.success("Transfer approved ✅", { id: "approve" });

      // optimistic remove from list
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to approve transfer", { id: "approve" });
    }
  };

  const openReject = (t) => {
    setRejectModal({
      open: true,
      id: t._id,
      ref: t.reference,
      reason: "",
    });
  };

  const onReject = async () => {
    if (!rejectModal.reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      toast.loading("Rejecting transfer...", { id: "reject" });
      await rejectTransfer(rejectModal.id, rejectModal.reason.trim());
      toast.success("Transfer rejected ✅", { id: "reject" });

      setItems((prev) => prev.filter((x) => x._id !== rejectModal.id));
      setRejectModal({ open: false, id: "", ref: "", reason: "" });
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to reject transfer", { id: "reject" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP BAR */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition"
                title="Back"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" />
                  Admin Transfers
                </h1>
                <p className="text-slate-400 text-sm">Approve / reject pending transfers</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => load({ silent: true })}
                className="px-3 py-2 rounded-2xl border border-slate-700 hover:bg-slate-800 transition inline-flex items-center gap-2"
                title="Refresh"
              >
                <RefreshCcw size={18} className={refreshing ? "animate-spin" : ""} />
                <span className="text-sm">{refreshing ? "Refreshing" : "Refresh"}</span>
              </button>

              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition text-sm"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </motion.div>

        {/* SEARCH + COUNT */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.05, duration: 0.5 }}>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock3 size={18} />
              <span className="text-sm">
                Pending: <span className="font-semibold text-white">{items.length}</span>
              </span>
            </div>

            <div className="relative w-full md:w-[420px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, email, account number or reference..."
                className="w-full bg-slate-800/70 border border-slate-700 rounded-2xl pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </motion.div>

        {/* LIST */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.1, duration: 0.5 }}>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 text-xs text-slate-400 border-b border-slate-800">
              <div className="col-span-3">From</div>
              <div className="col-span-3">To</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Reference</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {loading ? (
              <div className="p-6 text-slate-400">Loading pending transfers...</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-slate-400">No pending transfers found.</div>
            ) : (
              <div className="divide-y divide-slate-800">
                {filtered.map((t) => (
                  <div key={t._id} className="px-5 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* FROM */}
                    <div className="md:col-span-3">
                      <p className="font-semibold">{t?.fromUser?.fullName || "Unknown"}</p>
                      <p className="text-xs text-slate-400">
                        {t?.fromUser?.email || ""}
                        {t?.fromUser?.accountNumber ? ` • ${t.fromUser.accountNumber}` : ""}
                      </p>
                    </div>

                    {/* TO */}
                    <div className="md:col-span-3">
                      <p className="font-semibold">{t?.toUser?.fullName || "Unknown"}</p>
                      <p className="text-xs text-slate-400">
                        {t?.toUser?.email || ""}
                        {t?.toUser?.accountNumber ? ` • ${t.toUser.accountNumber}` : ""}
                      </p>
                    </div>

                    {/* AMOUNT */}
                    <div className="md:col-span-2">
                      <p className="text-lg font-bold">${Number(t?.amount || 0).toLocaleString()}</p>
                      <p className="text-xs text-slate-400">
                        {t?.note ? `Note: ${t.note}` : "No note"}
                      </p>
                    </div>

                    {/* REF */}
                    <div className="md:col-span-2">
                      <p className="font-mono text-sm">{t?.reference}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(t?.createdAt || Date.now()).toLocaleString()}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="md:col-span-2 flex md:justify-end gap-2">
                      <button
                        onClick={() => onApprove(t._id)}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-sm inline-flex items-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        Approve
                      </button>

                      <button
                        onClick={() => openReject(t)}
                        className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 transition text-sm inline-flex items-center gap-2"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* REJECT MODAL */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold">Reject Transfer</h3>
            <p className="text-sm text-slate-400">
              Reference: <span className="font-mono text-slate-200">{rejectModal.ref}</span>
            </p>

            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal((p) => ({ ...p, reason: e.target.value }))}
              placeholder="Enter a reason for rejecting (e.g. suspicious activity, limit exceeded, etc.)"
              className="w-full min-h-[110px] bg-slate-800/70 border border-slate-700 rounded-2xl p-3 text-sm outline-none focus:ring-2 focus:ring-rose-600"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModal({ open: false, id: "", ref: "", reason: "" })}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={onReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 transition text-sm font-semibold"
              >
                Reject Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
