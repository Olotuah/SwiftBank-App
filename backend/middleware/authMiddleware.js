// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Not authorized" });

    // ✅ keep req.user.id for your existing routes
    // ✅ add role + accountNumber for transfer/admin checks
    req.user = {
      id: user._id.toString(),
      role: user.role,
      accountNumber: user.accountNumber,
      email: user.email,
      fullName: user.fullName,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token failed" });
  }
};

export default protect;
