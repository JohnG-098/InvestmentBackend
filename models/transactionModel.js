const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "cancelled"],
    default: "pending",
  },
  plan: {
    type: String,
    default: "None",
  },
  isAdded: {
    type: Boolean,
    default: false,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
