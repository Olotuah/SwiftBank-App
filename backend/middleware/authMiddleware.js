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

    // ✅ include admin info
    req.user = {
      id: user._id.toString(),
      admin: !!user.admin,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token failed" });
  }
};

export default protect;
