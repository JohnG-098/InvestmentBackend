const investmentModel = require("../models/investModel");

const calculatorController = async (req, res) => {
  try {
    const { email, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({
        message: "Email and userId are required",
      });
    }

    const investment = await investmentModel.findOne({ email, userId });

    if (!investment) {
      return res.status(404).json({
        message: "Investment not found",
      });
    }

    const { status, amountInvested, updatedAmount } = investment;

    // =========================
    // PENDING
    // =========================
    if (status === "pending") {
      return res.json({
        email,
        userId,
        balance: amountInvested,
        investedAmount: amountInvested,
        profit: 0,
      });
    }

    // =========================
    // CANCELLED
    // =========================
    if (status === "cancelled") {
      return res.json({
        email,
        userId,
        balance: 0,
        investedAmount: 0,
        profit: 0,
      });
    }

    // =========================
    // ACTIVE (NO CALCULATION HERE)
    // =========================
    if (status === "active") {
      const balance =
        updatedAmount !== null && updatedAmount !== undefined
          ? updatedAmount
          : amountInvested;

      return res.json({
        email,
        userId,
        balance,
        amountInvested,
        profit: balance - amountInvested,
      });
    }

    return res.status(400).json({
      message: "Invalid status",
    });
  } catch (error) {
    console.error("Calculator Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = calculatorController;