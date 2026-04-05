const investmentModel = require("../models/investModel");
const User = require("../models/userModel");

const getAllUsersWithInvestments = async (req, res) => {
  try {
    // 1. Fetch all users
    const users = await User.find().lean();

    // 2. Fetch all investments
    const investments = await investmentModel.find().lean();

    // 3. Attach investments to users
    const usersWithInvestments = users.map((user) => {
      const userInvestments = investments.filter(
        (inv) => inv.userId.toString() === user._id.toString()
      );

      // Optional: calculate totals (VERY useful for admin)
      const totalInvested = userInvestments.reduce(
        (acc, item) => acc + (item.amountInvested || 0),
        0
      );

      const totalProfit = userInvestments.reduce((acc, item) => {
        const updated = item.updatedAmount ?? item.amountInvested ?? 0;
        return acc + (updated - (item.amountInvested ?? 0));
      }, 0);

      return {
        ...user,
        investments: userInvestments,
        totalInvested,
        totalProfit,
        walletBalance: totalInvested + totalProfit,
      };
    });

    return res.status(200).json({
      success: true,
      count: usersWithInvestments.length,
      data: usersWithInvestments,
    });
  } catch (error) {
    console.error("Fetch users with investments error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = getAllUsersWithInvestments;