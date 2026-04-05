const investmentModel = require("../models/investModel");

const fetchInvestments = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ✅ Fetch investments for this email
    const investments = await investmentModel.find({ email }).sort({ createdAt: -1 });

    // ✅ Handle no data found
    if (!investments || investments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No investments found for this email",
        data: [],
      });
    }

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "Investments fetched successfully",
      data: investments,
    });

  } catch (error) {
    console.error("Fetch Investments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching investments",
    });
  }
};

module.exports = fetchInvestments;