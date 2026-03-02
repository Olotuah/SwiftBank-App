// controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const setTransferPin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pin } = req.body;

    const clean = String(pin || "").trim();

    // ✅ 4-digit PIN (like real banks). Change to 6 if you want.
    if (!/^\d{4}$/.test(clean)) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(clean, salt);

    const user = await User.findByIdAndUpdate(
      userId,
      { transferPinHash: hash },
      { new: true }
    ).select("-password -transferPinHash");

    return res.json({
      message: "Transfer PIN set successfully",
      pinSet: true,
      user,
    });
  } catch (err) {
    console.error("setTransferPin error:", err);
    return res.status(500).json({ message: "Failed to set PIN" });
  }
};
