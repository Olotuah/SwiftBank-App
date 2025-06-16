import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import api from "../utils/api";

export default function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const accountMeta = {
    "Main Account": { acct: "0123456789" },
    "Savings": { acct: "0987654321" },
    "Dollar Wallet": { acct: "USD-7765432" },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await api.get("/accounts");
        const txRes = await api.get("/transactions");

        setAccounts(accRes.data);
        setTransactions(txRes.data.slice(0, 4)); // only show 4 most recent
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen text-white bg-gradient-to-br from-black via-gray-900 to-gray-800 font-manrope">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4">
        <button onClick={() => setShowSidebar(!showSidebar)} className="text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed z-50 md:relative md:translate-x-0 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 w-64 p-6 bg-white/10 backdrop-blur-md border-r border-white/10`}>
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

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 mt-4 md:mt-0">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold font-inter">Welcome back 👋</h1>
          <p className="text-gray-300 text-sm sm:text-base">Here’s your account snapshot</p>
        </header>

        {/* Account Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {accounts.map((acct, i) => (
            <div key={i} className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-base sm:text-lg font-semibold">{acct.name}</h3>
              <p className="text-xl sm:text-2xl mt-2">${parseFloat(acct.balance).toLocaleString()}</p>
              <span className="text-sm text-gray-400">Acct No: {accountMeta[acct.name]?.acct || "****"}</span>
            </div>
          ))}
        </div>

        {/* Recent Transactions Preview */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 font-inter">Recent Transactions</h2>
          <ul className="divide-y divide-white/10 text-sm sm:text-base">
            {transactions.length === 0 ? (
              <li className="py-3 text-gray-400">No recent transactions found</li>
            ) : (
              transactions.map((tx, i) => (
                <li key={i} className="flex justify-between py-3">
                  <span>{tx.description}</span>
                  <span className={tx.type === 'Credit' ? 'text-green-400' : 'text-red-400'}>
                    {tx.type === 'Credit' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
