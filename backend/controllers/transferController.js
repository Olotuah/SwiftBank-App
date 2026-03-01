import mongoose from "mongoose";
import User from "../models/User.js";
import Account from "../models/Account.js";
import Transfer from "../models/Transfer.js";
import Transaction from "../models/Transaction.js";

const makeRef = () => {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `TRF-${Date.now()}-${rand}`;
};

const findRecipient = async (toAccountOrEmail) => {
  // allow either accountNumber or email
  const key = (toAccountOrEmail || "").trim();
  if (!key) return null;

  const byAcct = await User.findOne({ accountNumber: key });
  if (byAcct) return byAcct;

  const byEmail = await User.findOne({ email: key.toLowerCase() });
  return byEmail;
};

// ✅ user creates transfer request (PENDING)
export const createTransfer = async (req, res) => {
  try {
    const { fromAccountName = "Main Account", toAccount, amount, note = "" } = req.body;

    const amt = Number(amount);
    if (!toAccount || !amt || amt <= 0) {
      return res.status(400).json({ message: "toAccount and valid amount are required" });
    }

    const senderId = req.user.id;

    const recipient = await findRecipient(toAccount);
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });
    if (recipient._id.toString() === senderId) {
      return res.status(400).json({ message: "You cannot transfer to yourself" });
    }

    const fromAcc = await Account.findOne({ user: senderId, name: fromAccountName });
    if (!fromAcc) return res.status(404).json({ message: "Sender account not found" });

    // default destination: recipient Main Account
    const toAcc = await Account.findOne({ user: recipient._id, name: "Main Account" });
    if (!toAcc) return res.status(404).json({ message: "Recipient account not found" });

    // We don't debit yet (admin will approve). But we can still validate “likely”
    if (fromAcc.balance < amt) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const transfer = await Transfer.create({
      reference: makeRef(),
      fromUser: senderId,
      toUser: recipient._id,
      fromAccount: fromAcc._id,
      toAccount: toAcc._id,
      amount: amt,
      note,
      status: "PENDING",
    });

    return res.status(201).json({
      message: "Transfer request submitted for approval",
      transfer,
    });
  } catch (err) {
    console.error("createTransfer error:", err);
    return res.status(500).json({ message: "Failed to create transfer" });
  }
};

// ✅ user views their transfers
export const getMyTransfers = async (req, res) => {
  try {
    const userId = req.user.id;

    const transfers = await Transfer.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("fromUser", "fullName accountNumber")
      .populate("toUser", "fullName accountNumber");

    res.json(transfers);
  } catch (err) {
    console.error("getMyTransfers error:", err);
    res.status(500).json({ message: "Failed to load transfers" });
  }
};

// ✅ admin: list pending transfers
export const getPendingTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({ status: "PENDING" })
      .sort({ createdAt: -1 })
      .populate("fromUser", "fullName accountNumber email")
      .populate("toUser", "fullName accountNumber email");

    res.json(transfers);
  } catch (err) {
    console.error("getPendingTransfers error:", err);
    res.status(500).json({ message: "Failed to load pending transfers" });
  }
};

export const approveTransfer = async (req, res) => {
  try {
    const { id } = req.params;

    const transfer = await Transfer.findById(id);
    if (!transfer) return res.status(404).json({ message: "Transfer not found" });

    if (transfer.status !== "PENDING") {
      return res.status(400).json({ message: "Transfer already decided" });
    }

    const fromAcc = await Account.findById(transfer.fromAccount);
    const toAcc = await Account.findById(transfer.toAccount);

    if (!fromAcc || !toAcc) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Re-check balance at approval time
    if (Number(fromAcc.balance) < Number(transfer.amount)) {
      transfer.status = "REJECTED";
      transfer.decisionReason = "Insufficient balance at approval time";
      transfer.decidedBy = req.user.id;         // ✅ standard field
      transfer.decidedAt = new Date();
      await transfer.save();

      return res.status(400).json({ message: "Rejected: insufficient balance", transfer });
    }

    // ✅ move balances
    fromAcc.balance = Number(fromAcc.balance) - Number(transfer.amount);
    toAcc.balance = Number(toAcc.balance) + Number(transfer.amount);

    await fromAcc.save();
    await toAcc.save();

    // ✅ create transactions (ledger)
    await Transaction.create([
      {
        user: transfer.fromUser,
        type: "Debit",
        amount: transfer.amount,
        description: transfer.note || "Transfer",
        status: "Completed",
        timestamp: new Date(),
      },
      {
        user: transfer.toUser,
        type: "Credit",
        amount: transfer.amount,
        description: transfer.note || "Transfer",
        status: "Completed",
        timestamp: new Date(),
      },
    ]);

    // ✅ finalize transfer
    transfer.status = "APPROVED";
    transfer.decidedBy = req.user.id;          // ✅ standard field
    transfer.decidedAt = new Date();
    await transfer.save();

    return res.json({ message: "Transfer approved", transfer });
  } catch (err) {
    console.error("approveTransfer error:", err);
    return res.status(500).json({ message: "Failed to approve transfer" });
  }
};

// ✅ admin: reject transfer
export const rejectTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "Rejected by admin" } = req.body;

    const transfer = await Transfer.findById(id);
    if (!transfer) return res.status(404).json({ message: "Transfer not found" });
    if (transfer.status !== "PENDING") {
      return res.status(400).json({ message: "Transfer already decided" });
    }

    transfer.status = "REJECTED";
    transfer.decisionReason = reason;
    transfer.decidedBy = req.user.id;         // ✅ standard field
    transfer.decidedAt = new Date();
    await transfer.save();

    return res.json({ message: "Transfer rejected", transfer });
  } catch (err) {
    console.error("rejectTransfer error:", err);
    return res.status(500).json({ message: "Failed to reject transfer" });
  }
};
