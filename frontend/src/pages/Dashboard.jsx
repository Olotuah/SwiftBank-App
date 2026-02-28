import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  CreditCard,
  FileText,
  Settings,
  Bell,
  UserCircle,
} from "lucide-react";
import api from "../utils/api";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await api.get("/accounts");
        const txRes = await api.get("/transactions");
        setAccounts(accRes.data);
        setTransactions(txRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-gray-200">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111827] p-6 flex flex-col justify-between border-r border-gray-800">
        <div>
          <h2 className="text-2xl font-bold mb-10 text-white">SwiftBank</h2>

          <nav className="space-y-6">
            <SidebarItem icon={<LayoutDashboard size={20} />} text="Overview" active />
            <SidebarItem icon={<ArrowRightLeft size={20} />} text="Transfers" />
            <SidebarItem icon={<CreditCard size={20} />} text="Cards" />
            <SidebarItem icon={<FileText size={20} />} text="Transactions" />
            <SidebarItem icon={<Settings size={20} />} text="Settings" />
          </nav>
        </div>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} SwiftBank
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        {/* TOPBAR */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
            <p className="text-gray-400 text-sm">Real-time account insights</p>
          </div>

          <div className="flex items-center gap-6">
            <Bell className="cursor-pointer hover:text-blue-400" />
            <UserCircle className="cursor-pointer hover:text-blue-400" size={28} />
          </div>
        </div>

        {/* ACCOUNT CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {accounts.map((acct, i) => (
            <div
              key={i}
              className="bg-[#1F2937] p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition"
            >
              <h3 className="text-lg font-semibold">{acct.name}</h3>
              <p className="text-2xl font-bold mt-3">
                ${parseFloat(acct.balance).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Account No: {acct.accountNumber}
              </p>
            </div>
          ))}
        </div>

        {/* ANALYTICS + ACTIVITY */}
        <div className="grid grid-cols-3 gap-6 mb-10">

          <div className="col-span-2 bg-[#1F2937] p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Spending Trend</h3>
            <div className="h-40 flex items-center justify-center text-gray-500">
              Chart placeholder (Recharts coming next)
            </div>
          </div>

          <div className="bg-[#1F2937] p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-3 text-sm">
              <li>✔ Login detected</li>
              <li>✔ Transfer initiated</li>
              <li>✔ Account balance updated</li>
              <li>✔ OTP verified</li>
            </ul>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-[#1F2937] p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>

          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="text-left py-2">Description</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-3">{tx.description}</td>
                  <td className="text-center">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-600">
                      {tx.status || "Completed"}
                    </span>
                  </td>
                  <td className={`text-right ${tx.type === "Credit" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "Credit" ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function SidebarItem({ icon, text, active }) {
  return (
    <div
      className={`flex items-center gap-3 cursor-pointer transition ${
        active
          ? "text-blue-400"
          : "text-gray-300 hover:text-blue-400"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
