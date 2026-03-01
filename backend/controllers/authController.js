// controllers/authController.js
import User from "../models/User.js";
import Account from "../models/Account.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const generateAccountNumber = async () => {
  // 10-digit number, retry if collision
  while (true) {
    const acct = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const exists = await User.findOne({ accountNumber: acct });
    if (!exists) return acct;
  }
};

const safeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  accountNumber: user.accountNumber,
  accountType: user.accountType,
  createdAt: user.createdAt,
  admin: !!user.admin,
});

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const accountNumber = await generateAccountNumber();

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      phone: phone || "",
      accountNumber,
      accountType: "Main Account",
    });

    // ✅ Create default accounts (important for dashboard)
    await Account.create([
      { user: user._id, name: "Main Account", balance: 0 },
      { user: user._id, name: "Savings", balance: 0 },
      { user: user._id, name: "Dollar Wallet", balance: 0 },
    ]);

    return res.status(201).json({
      token: generateToken(user._id),
      user: safeUser(user),
    });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        token: generateToken(user._id),
        user: safeUser(user),
      });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};
