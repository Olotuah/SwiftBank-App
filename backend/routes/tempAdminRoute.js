// routes/tempAdminRoute.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/force-admin", async (req, res) => {
  const email = "gbengaolotuah@gmail.com";

  const user = await User.findOneAndUpdate(
    { email },
    { admin: true },
    { new: true }
  );

  res.json({ message: "Admin granted", admin: user.admin });
});

export default router;
