// models/Account.js
import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    type: String,
    enum: ["Main Account", "Savings", "Dollar Wallet"],
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("Account", AccountSchema);
