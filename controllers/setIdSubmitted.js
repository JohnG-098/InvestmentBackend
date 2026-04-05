const User = require("../models/userModel");
const investmentModel = require("../models/investModel");

const submitIdController = async (req, res) => {
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

    // Find investment
    const investment = await investmentModel.findOne({ userId, email });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    // Check if already submitted
    if (investment.idSubmitted) {
      return res.status(400).json({
        success: false,
        message: "ID already submitted",
      });
    }

    // Update
    investment.idSubmitted = true;

    await investment.save();

    return res.status(200).json({
      success: true,
      message: "ID submitted successfully",
      data: investment,
    });

  } catch (error) {
    console.error("Submit ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = submitIdController;