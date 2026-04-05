const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// GET ALL USERS
const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};



// INVEST
const Invest = async (req, res) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Login to Invest",
      });
    }

    const { amount } = req.body || {};

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid investment amount",
      });
    }

    const token = auth.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.Amount += amount;
    await user.save();

    res.json({
      success: true,
      message: "Investment successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// REGISTER USER
const addUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    await User.create({ firstName, lastName, email, password });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  allUsers,
  addUser,
  Invest,
};