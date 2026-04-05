const investmentModel = require("../models/investModel");
const userModel = require("../models/userModel");

const createInvestment = async (req, res) => {
  try {
    const { email, planName, amountInvested } = req.body;

    // ✅ Validate required fields
    if (!email || !planName || !amountInvested) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Convert amount to number
    const amount = Number(amountInvested);

    if (isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid investment amount",
      });
    }

    // ✅ Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Define plans
    const plans = {
      "SHORT TERM": {
        name: "SHORT TERM",
        return: "10.00%",
        returnTime: "Every HOUR",
        returnLasting: "For 24 HOUR",
        totalReturn: "240% + Capital",
      },
      "CLASSIC PLAN": {
        name: "CLASSIC PLAN",
        return: "20.00%",
        returnTime: "Every HOUR",
        returnLasting: "For 48 HOUR",
        totalReturn: "960% + Capital",
      },
      "PRO PLAN": {
        name: "PRO PLAN",
        return: "25.00%",
        returnTime: "Every WEEK",
        returnLasting: "For 168 WEEK",
        totalReturn: "4200% + Capital",
      },
      "Deriv Bot": {
        name: "Deriv Bot",
        return: "50.00%",
        returnTime: "Every HOUR",
        returnLasting: "For Life Time",
        totalReturn: "Life Time% + Capital",
      },
    };

    // ✅ Check plan
    const selectedPlan = plans[planName];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    // ✅ Create investment
    const newInvestment = new investmentModel({
      email,
      userId: user._id,
      plan: selectedPlan,
      amountInvested: amount,
      updatedAmount: amount,
      startDate: new Date(),
      status: "pending",
    });

    await newInvestment.save();

    // 🔥 UPDATE USER AMOUNT USING EMAIL
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { $inc: { Amount: amount } },
      { new: true }
    );

    console.log("Updated user amount:", updatedUser.Amount);

    return res.status(201).json({
      success: true,
      message: "Investment created successfully",
    });

  } catch (error) {
    console.error("Create Investment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = createInvestment;