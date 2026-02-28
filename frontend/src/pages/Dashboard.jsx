import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, CreditCard, PiggyBank, Landmark, TrendingUp, MapPin, Smartphone, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PremiumBankDashboard() {
  const [hideBalance, setHideBalance] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.6 }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome back 👋</h1>
              <p className="text-slate-400">Here’s your financial overview</p>
            </div>
            <div className="flex gap-3">
              <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700">Profile</Button>
              <Button variant="outline" className="rounded-2xl border-slate-700">Logout</Button>
            </div>
          </div>
        </motion.div>

        {/* BALANCE + LIMIT ALERT */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-2xl bg-slate-900 border-slate-800 shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400">Total Balance</p>
                  <h2 className="text-3xl font-bold">
                    {hideBalance ? "••••••••" : "$24,890.50"}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setHideBalance(!hideBalance)}
                  className="rounded-full"
                >
                  {hideBalance ? <Eye /> : <EyeOff />}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl">
                  <p className="text-sm text-slate-400">Savings</p>
                  <p className="text-xl font-semibold">$10,200</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl">
                  <p className="text-sm text-slate-400">Checking</p>
                  <p className="text-xl font-semibold">$14,690</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-gradient-to-br from-red-600 to-red-500 shadow-xl border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Need Higher Limits?</h3>
              <p className="text-sm">You can adjust your transaction limits easily in your profile settings.</p>
              <Button className="bg-white text-red-600 hover:bg-slate-200 rounded-2xl">Adjust Limits</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* SHORTCUTS */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold mb-4">Shortcuts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Smartphone />, label: "Top-Up" },
              { icon: <RefreshCcw />, label: "FX Sales" },
              { icon: <MapPin />, label: "Near Me" },
              { icon: <ArrowUpRight />, label: "Buy Data" },
              { icon: <ArrowDownLeft />, label: "Transfer" },
              { icon: <CreditCard />, label: "Cards" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer shadow-lg"
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* INVESTMENTS */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-bold mb-4">Investments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-xl">
              <CardContent className="p-6 space-y-3">
                <TrendingUp className="text-green-500" />
                <h3 className="text-lg font-bold">Wealth Portfolio</h3>
                <p className="text-sm text-slate-400">Diversified global investments curated for long-term growth.</p>
                <Button className="rounded-2xl bg-indigo-600">Open Account</Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-xl">
              <CardContent className="p-6 space-y-3">
                <PiggyBank className="text-yellow-500" />
                <h3 className="text-lg font-bold">Savings Plan</h3>
                <p className="text-sm text-slate-400">Automate savings and earn competitive interest rates.</p>
                <Button className="rounded-2xl bg-indigo-600">Start Saving</Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-xl">
              <CardContent className="p-6 space-y-3">
                <Landmark className="text-blue-500" />
                <h3 className="text-lg font-bold">Pension</h3>
                <p className="text-sm text-slate-400">Secure your future with flexible pension contributions.</p>
                <Button className="rounded-2xl bg-indigo-600">Link Accounts</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CREDIT + LOANS */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl border-0">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-bold">Quick Credit</h3>
              <p className="text-sm">Get instant loans with minimal paperwork.</p>
              <Button className="bg-white text-indigo-600 rounded-2xl">Apply Now</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-xl">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-bold">Loan Calculator</h3>
              <Input placeholder="Enter Amount" className="bg-slate-800 border-slate-700" />
              <Button className="rounded-2xl bg-indigo-600">Calculate</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* FX + FINANCES */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-xl">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-bold">FX Stats</h3>
              <p className="text-sm text-slate-400">USD/EUR: 0.92</p>
              <p className="text-sm text-slate-400">USD/GBP: 0.78</p>
              <p className="text-sm text-slate-400">USD/NGN: 1500</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-xl flex items-center justify-center">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold">Finances</h3>
              <p className="text-slate-400">Coming Soon</p>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
