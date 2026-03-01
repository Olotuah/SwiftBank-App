import mongoose from "mongoose";

const TransferSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, required: true },

    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    toAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },

    amount: { type: Number, required: true },
    note: { type: String, default: "" },

    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    decisionReason: { type: String, default: "" },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    decidedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Transfer", TransferSchema);
