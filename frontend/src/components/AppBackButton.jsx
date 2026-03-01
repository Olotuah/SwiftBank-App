import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AppBackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition text-sm"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}
