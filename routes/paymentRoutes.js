// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/add', paymentController.addPayment);
router.post('/get', paymentController.getPayments);
router.post('/count-by-date', paymentController.getAllPaymentsGroupedByDate);
router.put('/status-update', paymentController.updatePaymentStatus);

module.exports = router;
