import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Account from '../models/Account.js';

const router = express.Router();

// Get all accounts for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load accounts.' });
  }
});

export default router;
