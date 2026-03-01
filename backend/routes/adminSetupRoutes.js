import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /api/admin/setup/promote
 * Headers:
 *  Authorization: Bearer <token>
 * Body:
 *  { "key": "ADMIN_SETUP_KEY_VALUE" }
 */
router.post("/setup/promote", authMiddleware, async (req, res) => {
  try {
    const { key } = req.body;

    if (!process.env.ADMIN_SETUP_KEY) {
      return res.status(500).json({ message: "ADMIN_SETUP_KEY is not set on server" });
    }

    if (!key || key !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: "Invalid setup key" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();

    return res.json({
      message: "You are now an admin",
      admin: true,
      email: user.email,
      fullName: user.fullName,
    });
  } catch (err) {
    console.error("admin promote error:", err);
    res.status(500).json({ message: "Failed to promote admin" });
  }
});

export default router;
