const userModel = require("../models/userModel");
const { uploadToCloudinary } = require("../helpers/cloudinaryUploader");

const uploadIdController = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Validate
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!req.files || req.files.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please upload two images",
      });
    }

    // ✅ Upload both images
    const frontImage = await uploadToCloudinary(req.files[0].path);
    const backImage = await uploadToCloudinary(req.files[1].path);

    // ✅ Update user
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        idSubmitted: true,
        idUrl: JSON.stringify({
          front: frontImage,
          back: backImage,
        }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "ID uploaded successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = uploadIdController;
