const Transaction = require("../models/transactionModel");
const investmentModel = require("../models/investModel");

const syncTransactionsToInvestment = async (req, res, next) => {
  try {
    // 1️⃣ Fetch all transactions for the sync process
    const transactions = await Transaction.find({
      plan: "None",
    });

    for (const tx of transactions) {
      const { email, userId, amount, _id, status, isAdded } = tx;

      // ✅ Find user's investment
      const investment = await investmentModel.findOne({ email, userId });
      if (!investment) continue;

      // Ensure amount is a valid number
      const amt = Number(amount);
      if (isNaN(amt) || amt <= 0) continue;

      // Initialize updatedAmount if null
      if (investment.updatedAmount === null) {
        investment.updatedAmount = investment.amountInvested;
      }

      // 2️⃣ If transaction is active and not yet added
      if (status === "active" && !isAdded) {
        investment.amountInvested += amt;
        investment.updatedAmount += amt;

        // Mark transaction as processed
        await Transaction.findByIdAndUpdate(_id, {
          isAdded: true,
        });

        await investment.save();
      }

      // 3️⃣ If transaction is NOT active but was previously added
      if (status !== "active" && isAdded) {
        investment.amountInvested -= amt;
        investment.updatedAmount -= amt;

        // Prevent negative balances
        if (investment.amountInvested < 0) investment.amountInvested = 0;
        if (investment.updatedAmount < 0) investment.updatedAmount = 0;

        // Update transaction flag
        await Transaction.findByIdAndUpdate(_id, {
          isAdded: false,
        });

        await investment.save();
      }
    }

    next();
  } catch (error) {
    console.error("Sync Transaction Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error syncing transactions",
    });
  }
};

module.exports = syncTransactionsToInvestment;