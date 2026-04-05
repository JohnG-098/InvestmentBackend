const Transaction = require("../models/transactionModel");

const getUserTransactions = async (req, res) => {
  try {
    const { email, userId } = req.body;

    // ✅ Validate input
    if (!email || !userId) {
      return res.status(400).json({
        success: false,
        message: "email and userId are required",
      });
    }

    // ✅ Fetch transactions
    const transactions = await Transaction.find({ email, userId })
      .sort({ createdAt: -1 }); // latest first

    // ✅ If no transactions found
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found",
        data: [],
      });
    }

    // ✅ Return transactions
    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      count: transactions.length,
      data: transactions,
    });

  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = getUserTransactions;