import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ticket", protect, async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) return res.status(400).json({ message: "Subject and message required" });

  // TODO: Save to DB (SupportTicket model) or send email
  console.log("SUPPORT TICKET:", { userId: req.user.id, subject, message });

  return res.json({ message: "Support ticket received" });
});

export default router;
