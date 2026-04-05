const Transaction = require("../models/transactionModel");
const userModel = require("../models/userModel");

const investMore = async (req, res) => {
  try {
    const { email, amountInvested, userId } = req.body;

    // ✅ Validate input
    if (!email || !amountInvested || !userId) {
      return res.status(400).json({
        success: false,
        message: "email, amountInvested, and userId are required",
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

    // ✅ Convert amount to number
    const newAmount = Number(amountInvested);

    if (isNaN(newAmount) || newAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid investment amount",
      });
    }

    // ✅ Create transaction (NO plan field → defaults to "None")
    const newTransaction = new Transaction({
      email,
      userId,
      name: "Invest More",   // 🔥 label for this type of transaction
      amount: newAmount,
      // plan not included → defaults to "None"
      // status defaults to "pending"
    });

    // ✅ Save transaction
    await newTransaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction recorded successfully",
      data: newTransaction,
    });

  } catch (error) {
    console.error("Invest More Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = investMore;