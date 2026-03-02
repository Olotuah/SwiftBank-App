// routes/userRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { setTransferPin } from "../controllers/userController.js";

const router = express.Router();

router.put("/pin", authMiddleware, setTransferPin);

export default router;
