const User = require("../models/userModel");
const { generateOTP } = require("../helpers/genOtp");
const sendOTPEmail = require("../helpers/mailer");

// Controller function for sending OTP
const sendVerification = async (req, res) => {
  const { email } = req.body; // get email from request body

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  //console.log("Attempting to send OTP to:", email);

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Generate OTP
    const otp = generateOTP();

    // 3. Save OTP in DB with expiry
    user.OTP = otp;
    user.OTPExpires = Date.now() + 5 * 60 * 1000; // expires in 5 minutes
    await user.save();

    //console.log("Generated OTP:", otp);

    // 4. Send OTP via email
    await sendOTPEmail(email, otp);
    //console.log("OTP sent to email:", email);

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

module.exports = sendVerification;