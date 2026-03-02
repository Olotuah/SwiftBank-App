import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getMe, setTransferPin, verifyTransferPin } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.post("/set-pin", protect, setTransferPin);
router.post("/verify-pin", protect, verifyTransferPin);

export default router;
