const express = require("express");
const { createPaymentOrder, verifyPayment, getPaymentStatus, refundPayment } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create payment order
router.post("/create-order", authMiddleware, createPaymentOrder);

// Verify payment
router.post("/verify", authMiddleware, verifyPayment);

// Get payment status
router.get("/status/:bookingId", authMiddleware, getPaymentStatus);

// Refund payment
router.post("/refund", authMiddleware, refundPayment);

module.exports = router;
