import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateStatementPdf } from "../controllers/statementController.js";

const router = express.Router();

router.get("/pdf", authMiddleware, generateStatementPdf);

export default router;
