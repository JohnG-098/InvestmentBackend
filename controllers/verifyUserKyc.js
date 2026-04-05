const sendEmail = require("../helpers/sendEmail");
const User = require("../models/userModel");

const verifyIdController = async (req, res) => {
  try {
    const { email, userId } = req.body;

    // Validate input
    if (!email || !userId) {
      return res.status(400).json({
        success: false,
        message: "Email and User ID are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ _id: userId, email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Ensure ID has been submitted first
    if (!user.idSubmitted) {
      return res.status(400).json({
        success: false,
        message: "User has not submitted ID yet",
      });
    }

    // Toggle idVerified
    user.idVerified = !user.idVerified;
    await sendEmail(user.email, `Your ID verification has been ${user.idVerified ? "approved" : "rejected"}`);

    await user.save();

    return res.status(200).json({
      success: true,
      message: `ID verification ${
        user.idVerified ? "enabled" : "disabled"
      } successfully`,
      data: {
        idVerified: user.idVerified,
      },
    });

  } catch (error) {
    console.error("Verify ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = verifyIdController;