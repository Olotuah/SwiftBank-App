// controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const safeMe = (u) => ({
  id: u._id,
  fullName: u.fullName,
  email: u.email,
  phone: u.phone,
  accountNumber: u.accountNumber,
  accountType: u.accountType,
  admin: !!u.admin || u.role === "admin",
  role: u.role,
  hasTransferPin: !!u.transferPinHash,
  createdAt: u.createdAt,
});

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(safeMe(user));
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ message: "Failed to load user" });
  }
};

export const setTransferPin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) return res.status(400).json({ message: "PIN is required" });
    const clean = String(pin).trim();

    // allow 4 or 6 digits
    if (!/^\d{4}$/.test(clean) && !/^\d{6}$/.test(clean)) {
      return res.status(400).json({ message: "PIN must be 4 or 6 digits" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.transferPinHash = await bcrypt.hash(clean, salt);
    await user.save();

    return res.json({ message: "Transfer PIN set", user: safeMe(user) });
  } catch (err) {
    console.error("setTransferPin error:", err);
    return res.status(500).json({ message: "Failed to set PIN" });
  }
};

export const verifyTransferPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const clean = String(pin || "").trim();
    if (!clean) return res.status(400).json({ message: "PIN is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.transferPinHash) {
      return res.status(400).json({ message: "Transfer PIN not set" });
    }

    const ok = await bcrypt.compare(clean, user.transferPinHash);
    if (!ok) return res.status(401).json({ message: "Invalid PIN" });

    return res.json({ message: "PIN verified" });
  } catch (err) {
    console.error("verifyTransferPin error:", err);
    return res.status(500).json({ message: "Failed to verify PIN" });
  }
};
