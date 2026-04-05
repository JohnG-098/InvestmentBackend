const Transaction = require("../models/transactionModel");
const userModel = require("../models/userModel");

const investmentTransaction = async (req, res, next) => {
  try {
    const { email, userId, planName, amountInvested } = req.body;

    // ✅ Validate required fields
    if (!email || !userId || !planName || !amountInvested) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (transaction)",
      });
    }

    // ✅ Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Create transaction
    const newTransaction = new Transaction({
      email,
      userId,
      name: planName,          // plan name as name
      amount: amountInvested,  // amount invested
      plan: planName,          // 🔥 NEW: save planName instead of default "None"
      // status will default to "pending"
    });

    // ✅ Save transaction
    await newTransaction.save();

    // ✅ Continue to next controller
    next();

  } catch (error) {
    console.error("Transaction Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error (transaction)",
    });
  }
};

module.exports = investmentTransaction;