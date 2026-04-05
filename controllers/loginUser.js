const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    //console.log("Login request received with body:", req.body);

    let { email, password } = req.body || {};

    // ✅ Normalize input (VERY IMPORTANT)
    email = email?.trim().toLowerCase();
    password = password?.trim();

    // ✅ Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ Find user (case-insensitive safe)
    const user = await User.findOne({ email });

    //console.log("User found:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Check email verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        redirect: "/verify-email",
      });
    }

    // ✅ Compare passwords (plain text for now)
    if (password !== user.password) {
      //console.log("Password mismatch:", password, user.password);

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

    const tokenOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    };

    // ✅ Remove password before sending user
    const userData = user.toObject();
    delete userData.password;

    res.cookie("token", token, tokenOption).json({
      message: "Login Successful",
      data: token,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = loginUser;
