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
  const key = (toAccountOrEmail || "").trim();
  if (!key) return null;

  const byAcct = await User.findOne({ accountNumber: key });
  if (byAcct) return byAcct;

  const byEmail = await User.findOne({ email: key.toLowerCase() });
  return byEmail;
};

// ✅ CREATE TRANSFER (deduct immediately, but keep status PENDING)
export const createTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      fromAccountName = "Main Account",
      toAccount,
      amount,
      note = "",
    } = req.body;

    const amt = Number(amount);

    if (!toAccount || !amt || amt <= 0) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "toAccount and valid amount are required" });
    }

    const senderId = req.user.id;

    const recipient = await findRecipient(toAccount);
    if (!recipient) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Recipient not found" });
    }
    if (recipient._id.toString() === senderId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "You cannot transfer to yourself" });
    }

    const fromAcc = await Account.findOne({
      user: senderId,
      name: fromAccountName,
    }).session(session);

    if (!fromAcc) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Sender account not found" });
    }

    // receiver main account
    const toAcc = await Account.findOne({
      user: recipient._id,
      name: "Main Account",
    }).session(session);

    if (!toAcc) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Recipient account not found" });
    }

    // ✅ deduct now (real bank feel)
    if (Number(fromAcc.balance) < amt) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    fromAcc.balance = Number(fromAcc.balance) - amt;
    await fromAcc.save({ session });

    const transfer = await Transfer.create(
      [
        {
          reference: makeRef(),
          fromUser: senderId,
          toUser: recipient._id,
          fromAccount: fromAcc._id,
          toAccount: toAcc._id,
          amount: amt,
          note,
          status: "PENDING",
        },
      ],
      { session }
    );

    // ✅ optional: log a pending transaction immediately
    await Transaction.create(
      [
        {
          user: senderId,
          type: "Debit",
          amount: amt,
          description: note || `Transfer to ${recipient.accountNumber || recipient.email}`,
          status: "Pending",
          transferRef: transfer[0].reference,
          timestamp: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      message: "Transfer submitted and amount deducted (Pending approval)",
      transfer: transfer[0],
    });
  } catch (err) {
    console.error("createTransfer error:", err);
    await session.abortTransaction();
    return res.status(500).json({ message: "Failed to create transfer" });
  } finally {
    session.endSession();
  }
};

// ✅ ADMIN: list pending
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

// ✅ MY TRANSFERS
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

// ✅ ADMIN APPROVE: only credit receiver (sender already deducted)
export const approveTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const transfer = await Transfer.findById(id).session(session);
    if (!transfer) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Transfer not found" });
    }
    if (transfer.status !== "PENDING") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Transfer already decided" });
    }

    const toAcc = await Account.findById(transfer.toAccount).session(session);
    if (!toAcc) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Recipient account not found" });
    }

    // ✅ credit receiver
    toAcc.balance = Number(toAcc.balance) + Number(transfer.amount);
    await toAcc.save({ session });

    // ✅ mark sender pending tx as completed + create receiver credit tx
    await Transaction.updateMany(
      { transferRef: transfer.reference, user: transfer.fromUser, status: "Pending" },
      { $set: { status: "Completed" } },
      { session }
    );

    await Transaction.create(
      [
        {
          user: transfer.toUser,
          type: "Credit",
          amount: transfer.amount,
          description: transfer.note || "Transfer received",
          status: "Completed",
          transferRef: transfer.reference,
          timestamp: new Date(),
        },
      ],
      { session }
    );

    transfer.status = "APPROVED";
    transfer.approvedBy = req.user.id;
    transfer.decidedAt = new Date();
    await transfer.save({ session });

    await session.commitTransaction();
    return res.json({ message: "Transfer approved", transfer });
  } catch (err) {
    console.error("approveTransfer error:", err);
    await session.abortTransaction();
    return res.status(500).json({ message: "Failed to approve transfer" });
  } finally {
    session.endSession();
  }
};

// ✅ ADMIN REJECT: refund sender
export const rejectTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { reason = "Rejected by admin" } = req.body;

    const transfer = await Transfer.findById(id).session(session);
    if (!transfer) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Transfer not found" });
    }
    if (transfer.status !== "PENDING") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Transfer already decided" });
    }

    const fromAcc = await Account.findById(transfer.fromAccount).session(session);
    if (!fromAcc) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Sender account not found" });
    }

    // ✅ refund sender
    fromAcc.balance = Number(fromAcc.balance) + Number(transfer.amount);
    await fromAcc.save({ session });

    // ✅ mark pending tx as rejected
    await Transaction.updateMany(
      { transferRef: transfer.reference, user: transfer.fromUser },
      { $set: { status: "Rejected" } },
      { session }
    );

    transfer.status = "REJECTED";
    transfer.decisionReason = reason;
    transfer.approvedBy = req.user.id;
    transfer.decidedAt = new Date();
    await transfer.save({ session });

    await session.commitTransaction();
    return res.json({ message: "Transfer rejected and refunded", transfer });
  } catch (err) {
    console.error("rejectTransfer error:", err);
    await session.abortTransaction();
    return res.status(500).json({ message: "Failed to reject transfer" });
  } finally {
    session.endSession();
  }
};
