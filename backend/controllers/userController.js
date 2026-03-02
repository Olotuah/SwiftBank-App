// controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const setTransferPin = async (req, res) => {
  try {
    const { pin } = req.body;

    // pin must be exactly 4 digits (common banking style)
    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "PIN must be 4 digits" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.transferPinHash = await bcrypt.hash(pin, salt);
    await user.save();

    return res.json({ message: "Transfer PIN set successfully" });
  } catch (err) {
    console.error("setTransferPin error:", err);
    return res.status(500).json({ message: "Failed to set PIN" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -transferPinHash");
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load profile" });
  }
};
