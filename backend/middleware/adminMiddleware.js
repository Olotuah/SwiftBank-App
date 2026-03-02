// middleware/adminMiddleware.js
const adminOnly = (req, res, next) => {
  // accept either admin boolean OR role=admin
  const isAdmin = req.user?.admin === true || req.user?.role === "admin";

  if (!isAdmin) {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }

  next();
};

export default adminOnly;
