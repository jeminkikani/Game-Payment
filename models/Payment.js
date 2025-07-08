// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  datetime: { type: Date, default: Date.now },
  user_id: { type: String, required: true },
  total_amount: { type: Number, required: true },
  withdrawal_amount: { type: Number, required: true },
  withdrawal_rupees: { type: Number, required: true },
  charges: { type: Number, required: true },
  payment_method: { type: String, required: true },
  payment_details: { type: String },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
