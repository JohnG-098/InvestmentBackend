const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

const getAllTransactions = async (req, res) => {
  try {
    let { email, userId } = req.body || {};

    // ✅ Validate required fields
    if (!email || !userId) {
      return res.status(400).json({
        success: false,
        message: "Email and userId are required",
      });
    }

    // ✅ Normalize email
    email = email.trim().toLowerCase();

    // ✅ Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Validate email match
    if (user.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or userId",
      });
    }

    // ✅ Check admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only",
      });
    }

    // ✅ Fetch all transactions
    const transactions = await Transaction.find();

    // ✅ Get all unique emails from transactions
    const emails = [...new Set(transactions.map(t => t.email))];

    // ✅ Fetch all users with those emails (ONE query only)
    const users = await User.find({ email: { $in: emails } });

    // ✅ Create a lookup map: email → user
    const userMap = {};
    users.forEach(u => {
      userMap[u.email] = u;
    });

    // ✅ Attach firstName & lastName to each transaction
    const enrichedTransactions = transactions.map(t => {
      const matchedUser = userMap[t.email];

      return {
        ...t._doc,
        firstName: matchedUser?.firstName || null,
        lastName: matchedUser?.lastName || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: enrichedTransactions,
    });

  } catch (error) {
    console.error("Get All Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = getAllTransactions;