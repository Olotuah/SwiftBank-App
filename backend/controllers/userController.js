// controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const safeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  accountNumber: user.accountNumber,
  accountType: user.accountType,
  createdAt: user.createdAt,
  admin: !!user.admin,
  role: user.role || "user",
  pinSet: !!user.transferPinHash,
});

// ✅ GET /api/auth/me  (or /api/users/me depending on how you route it)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: safeUser(user) });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ✅ PUT /api/users/pin
export const setTransferPin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pin } = req.body;

    const clean = String(pin || "").trim();

    if (!/^\d{4}$/.test(clean)) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(clean, salt);

    const user = await User.findByIdAndUpdate(
      userId,
      { transferPinHash: hash },
      { new: true }
    );

    return res.json({
      message: "Transfer PIN set successfully",
      pinSet: true,
      user: safeUser(user),
    });
  } catch (err) {
    console.error("setTransferPin error:", err);
    return res.status(500).json({ message: "Failed to set PIN" });
  }
};
