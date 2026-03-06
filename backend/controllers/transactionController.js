import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

export const createTransaction = async (req, res) => {
  try {
    const { amount, type, description, fromAccount } = req.body;

    if (!fromAccount) {
      return res.status(400).json({ message: "fromAccount is required." });
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: "Valid amount is required." });
    }

    const account = await Account.findOne({
      user: req.user.id,
      name: fromAccount,
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    if (type === "Debit" && account.balance < numericAmount) {
      return res.status(400).json({ message: "Insufficient funds." });
    }

    if (type === "Debit") {
      account.balance -= numericAmount;
    } else if (type === "Credit") {
      account.balance += numericAmount;
    } else {
      return res.status(400).json({ message: "Invalid transaction type." });
    }

    await account.save();

    const transaction = new Transaction({
      user: req.user.id,
      amount: numericAmount,
      type,
      description,
      fromAccount,
      timestamp: new Date(),
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create transaction." });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      timestamp: -1,
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions." });
  }
};
