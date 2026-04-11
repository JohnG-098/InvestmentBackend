const User = require("../models/userModel");

const adminChangeRole = async (req, res) => {
  try {
    let { userId, email } = req.body || {};

    // ✅ Validate input
    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        message: "userId and email are required",
      });
    }

    email = email.trim().toLowerCase();

    // ✅ Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Verify email match
    if (user.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Email does not match userId",
      });
    }

    // ✅ Toggle role
    user.role = user.role === "admin" ? "user" : "admin";

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Role updated to ${user.role}`,
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Change Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = adminChangeRole;