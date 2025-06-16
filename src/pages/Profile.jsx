import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-manrope relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden absolute top-4 left-4 z-50 bg-white/10 p-2 rounded"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 mt-16 md:mt-0">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 font-inter">Profile Settings</h1>
        <div className="bg-white/5 p-6 sm:p-8 rounded-2xl shadow-xl max-w-3xl space-y-6 backdrop-blur-lg border border-white/10">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src="https://i.pravatar.cc/100?img=52"
              alt="User Profile"
              className="w-24 h-24 rounded-full border-4 border-white/20 shadow-md"
            />
            <div className="text-center sm:text-left">
              <p className="text-2xl font-semibold font-inter">John Doe</p>
              <p className="text-gray-400">Premium Customer</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-lg font-medium">john@swiftbank.com</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Phone</p>
              <p className="text-lg font-medium">+1 (555) 234-5678</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">User ID</p>
              <p className="text-lg font-medium">USR876219</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Account Tier</p>
              <p className="text-lg font-medium">Gold</p>
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 text-sm font-semibold rounded-lg transition font-inter"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
