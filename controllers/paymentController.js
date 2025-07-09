// controllers/paymentController.js
const Payment = require("../models/Payment");
const logger = require("../utils/logger");

exports.addPayment = async (req, res) => {
  try {
    console.log("req.body-->> ", req.body);
    const payment = new Payment(req.body);
    await payment.save();
    logger.info("Payment added", { user_id: req.body.user_id });
    res.status(201).json(payment);
  } catch (err) {
    logger.error("Error adding payment", { error: err.message });
    res.status(400).json({ error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { user_id, payment_method, status } = req.body;
    let filter = {};
    if (user_id) filter.user_id = user_id;
    if (payment_method) filter.payment_method = payment_method;
    if (status) filter.status = status;
    const payments = await Payment.find(filter);
    logger.info("Payments fetched", { filter });
    res.json(payments);
  } catch (err) {
    logger.error("Error fetching payments", { error: err.message });
    res.status(400).json({ error: err.message });
  }
};

exports.getAllPaymentsGroupedByDate = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$datetime" }
          },
          count: { $sum: 1 },
          data: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
          data: 1
        }
      },
      { $sort: { date: -1 } } // Sort by latest date first
    ]);

    logger.info("Fetched all payment data grouped by date", { days: result.length });
    res.status(200).json(result);
  } catch (err) {
    logger.error("Failed to fetch payments grouped by date", { error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
};

// controllers/paymentController.js
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    const updatedData = await Payment.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedData) {
      logger.warn("Payment not found for update", { id });
      return res.status(404).json({ error: "Payment not found" });
    }

    logger.info("Payment status updated", { id, status });
    res.json({ updatedData });
  } catch (err) {
    logger.error("Error updating payment status", { error: err.message });
    res.status(400).json({ error: err.message });
  }
};
