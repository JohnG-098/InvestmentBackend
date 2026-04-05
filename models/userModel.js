const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
    default: null,
  },
  country: {
    type: String,
    required: false,
    default: null,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    validate: {
      validator: function (value) {
        return (
          /[A-Z]/.test(value) && // uppercase
          /[a-z]/.test(value) && // lowercase
          /[0-9]/.test(value) && // number
          /[^A-Za-z0-9]/.test(value) // special character
        );
      },
      message:
        "Password must include uppercase, lowercase, number and special character",
    },
  },
  Amount: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  OTP: {
    type: String,
    default: null,
  },
  OTPExpires: {
    type: Date,
    default: null,
  },
  idSubmitted: {
    type: Boolean,
    default: false,
  },
  idUrl: {
    type: String,
    default: null,
  },
  idVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
