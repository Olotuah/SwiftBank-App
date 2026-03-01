import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  createTransfer,
  getMyTransfers,
  getPendingTransfers,
  approveTransfer,
  rejectTransfer,
} from "../controllers/transferController.js";

const router = express.Router();

// user
router.post("/", authMiddleware, createTransfer);
router.get("/mine", authMiddleware, getMyTransfers);

// admin
router.get("/pending", authMiddleware, adminOnly, getPendingTransfers);
router.post("/:id/approve", authMiddleware, adminOnly, approveTransfer);
router.post("/:id/reject", authMiddleware, adminOnly, rejectTransfer);

export default router;
