const User = require("../models/userModel");

const adminFetchUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -OTP -OTPExpires");

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Fetch Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = adminFetchUsers;