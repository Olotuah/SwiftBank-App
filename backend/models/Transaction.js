// models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Credit", "Debit"], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Completed" },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Transaction", TransactionSchema);