const User = require("../models/userModel");

const verifyCode = async (req, res) => {
  try {
    let { email, code } = req.body;

    email = email?.trim().toLowerCase();
    code = code?.trim();

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and code are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Check if OTP exists
    if (!user.OTP) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one",
      });
    }

    // 🔥 Check expiry
    if (user.OTPExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one",
      });
    }

    // 🔥 Compare OTP
    if (user.OTP !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // ✅ SUCCESS → verify user
    user.isVerified = true;

    // 🔥 cleanup
    user.OTP = undefined;
    user.OTPExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error verifying code",
    });
  }
};

module.exports = verifyCode;