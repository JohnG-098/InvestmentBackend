const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body || {};

    // Normalize input
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    if (password !== user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ✅ COOKIE OPTIONS (VERY IMPORTANT)
    const tokenOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      domain: ".vercel.app", // 🔥 THIS IS THE FIX
    };

    const userData = user.toObject();
    delete userData.password;

    res.cookie("token", token, tokenOption).status(200).json({
      success: true,
      message: "Login Successful",
      data: userData,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = loginUser;
