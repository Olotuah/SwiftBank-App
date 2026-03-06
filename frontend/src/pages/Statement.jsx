import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Statement() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    from: "",
    to: today,
    accountName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generatePdf = async () => {
    if (!form.from || !form.to) {
      toast.error("Please select both from and to dates.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        from: form.from,
        to: form.to,
      });

      if (form.accountName) {
        params.append("accountName", form.accountName);
      }

      const res = await api.get(`/statements/pdf?${params.toString()}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `suissbank-statement-${form.from}-${form.to}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Statement downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to generate statement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <FileText className="text-indigo-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Statement of Account</h1>
              <p className="text-slate-400 text-sm">
                Generate and download your SuissBank statement in PDF format.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">From Date</label>
              <input
                type="date"
                name="from"
                value={form.from}
                onChange={handleChange}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">To Date</label>
              <input
                type="date"
                name="to"
                value={form.to}
                onChange={handleChange}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Account Scope (optional)
            </label>
            <select
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700"
            >
              <option value="">All Accounts</option>
              <option value="Main Account">Main Account</option>
              <option value="Savings">Savings</option>
              <option value="Dollar Wallet">Dollar Wallet</option>
            </select>
          </div>

          <button
            onClick={generatePdf}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold p-3 rounded-2xl disabled:opacity-60"
          >
            <Download size={18} />
            {loading ? "Generating PDF..." : "Download Statement PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
