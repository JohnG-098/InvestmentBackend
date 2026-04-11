const sendEmail = require("../helpers/sendEmail");
const Transaction = require("../models/transactionModel");
const Investment = require("../models/investModel");

const adminVerifyTransaction = async (req, res) => {
  try {
    let { transactionId, email, status } = req.body || {};

    // ✅ Validate required fields
    if (!transactionId || !email || !status) {
      return res.status(400).json({
        success: false,
        message: "transactionId, email and status are required",
      });
    }

    // ✅ Normalize inputs
    email = email.trim().toLowerCase();
    status = status.trim().toLowerCase();

    // ✅ Validate allowed status values
    const allowedStatus = ["pending", "active", "cancelled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // ✅ Find transaction
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // ✅ Verify email matches transaction
    if (transaction.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Email does not match this transaction",
      });
    }

    // ✅ If no change needed
    if (transaction.status === status) {
      return res.status(200).json({
        success: true,
        message: `Transaction already ${status}`,
        data: transaction,
      });
    }

    // ✅ Update transaction status
    transaction.status = status;
    await transaction.save();

    // ==============================
    // 🔥 INVESTMENT SYNC LOGIC (FIXED)
    // ==============================

    const allowedPlans = [
      "SHORT TERM",
      "CLASSIC PLAN",
      "PRO PLAN",
      "DERIV BOT",
    ];

    let investmentUpdateMessage = null;

    const txnName = (transaction.name || "").trim().toUpperCase();

    if (allowedPlans.includes(txnName)) {
      const investment = await Investment.findOne({
        email: transaction.email,
        amountInvested: transaction.amount,
        "plan.name": { $regex: new RegExp(`^${txnName}$`, "i") },
      });

      if (!investment) {
        investmentUpdateMessage = "was not recorded in Investment";
      } else {
        investment.status = transaction.status;
        investment.lastCalculatedAt = new Date();

        await investment.save();

        investmentUpdateMessage = "Investment updated successfully";
      }
    }

    // ==============================
    // 📧 EMAIL NOTIFICATIONS
    // ==============================

    let subject = "";
    let message = "";

    if (status === "active") {
      subject = "Investment Activated";
      message = `
Hello ,

Good news! Your investment plan "${transaction.plan}" has been ACTIVATED.

Amount: $${transaction.amount}

Your investment is now live and running.

Thank you for investing with us.
      `;
    }

    if (status === "cancelled") {
      subject = "Investment Cancelled";
      message = `
Hello ,

We regret to inform you that your investment plan "${transaction.plan}" has been CANCELLED.

If this was unexpected, please contact support.

Thank you.
      `;
    }

    if (status === "pending") {
      subject = "Investment Status Pending";
      message = `
Hello ,

Your investment plan "${transaction.plan}" is currently set to PENDING.

We will update you once it is reviewed.

Thank you.
      `;
    }

    // ✅ Send email only if message exists
    if (message) {
      await sendEmail(email, message);
    }

    return res.status(200).json({
      success: true,
      message: `Transaction status updated to ${status}`,
      data: transaction,
      investmentUpdate: investmentUpdateMessage,
    });
  } catch (error) {
    console.error("Admin Verify Transaction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = adminVerifyTransaction;