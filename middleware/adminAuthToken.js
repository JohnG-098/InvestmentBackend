const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function adminAuthToken(req, res, next) {
  try {
    // ✅ Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login",
        error: true,
        success: false,
      });
    }

    // ✅ Verify token
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid or expired token",
          error: true,
          success: false,
        });
      }

      // ✅ Get user from DB
      const user = await User.findById(decoded?.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          error: true,
          success: false,
        });
      }

      // ✅ Check admin role
      if (user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. Admins only",
          error: true,
          success: false,
        });
      }

      // ✅ Attach user info to request
      req.userId = user._id;
      req.user = user;

      next();
    });
  } catch (err) {
    console.error("Admin Auth Error:", err);

    return res.status(500).json({
      message: err.message || "Server error",
      error: true,
      success: false,
    });
  }
}

module.exports = adminAuthToken;
