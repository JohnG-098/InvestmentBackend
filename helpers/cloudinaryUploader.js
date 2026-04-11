const cloudinary = require("cloudinary").v2;

// ✅ Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload function
const uploadToCloudinary = async (file, folder = "kyc_uploads") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
    });

    return result.secure_url; // ✅ return image URL
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = { uploadToCloudinary };
