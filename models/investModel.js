const mongoose = require("mongoose");
const investSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  plan: {
    name: {
      type: String,
      default: null,
    },
    return: {
      type: String,
      default: null,
    },
    returnTime: {
      type: String,
      default: null,
    },
    returnLasting: {
      type: String,
      default: null,
    },
    totalReturn: {
      type: String,
      default: null,
    },
  },
  amountInvested: {
    type: Number,
    required: true,
  },
  updatedAmount: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "active", "cancelled"],
    default: "pending",
  },
  startDate: {
    type: Date,
    required: true,
  },
  lastCalculatedAt: {
    type: Date,
    default: Date.now,
  },
  
  
},
{  timestamps: true,}
);
const Investment = mongoose.model("Investment", investSchema);
module.exports = Investment;
//module.exports = mongoose.model("Investments", investSchema);
