// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AdminTransfers from "./services/AdminTransfers";
import Transfer from "./pages/Transfer";
import Bills from "./pages/Bills";
import Cards from "./pages/Cards";
import Profile from "./pages/Profile";
import TopUp from "./pages/TopUp";
import FxSales from "./pages/FxSales";
import BuyData from "./pages/BuyData";
import NearMe from "./pages/NearMe";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/admin/transfers" element={<AdminTransfers />} />
      <Route path="/transfer" element={<Transfer />} />
      <Route path="/bills" element={<Bills />} />
      <Route path="/cards" element={<Cards />} />
      <Route path="/topup" element={<TopUp />} />
      <Route path="/fx" element={<FxSales />} />
      <Route path="/buy-data" element={<BuyData />} />
      <Route path="/near-me" element={<NearMe />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
