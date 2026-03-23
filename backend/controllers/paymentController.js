const Booking = require("../models/Booking");
const razorpayInstance = require("../config/razorpay");
const crypto = require("crypto");

// CREATE Razorpay ORDER
exports.createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, totalAmount } = req.body;

    if (!bookingId || !totalAmount) {
      return res.status(400).json({ message: "Booking ID and amount required" });
    }

    // Amount in paise (₹1 = 100 paise)
    const amountInPaise = Math.round(totalAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${bookingId}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: totalAmount,
      currency: "INR",
      bookingId,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Payment order error:", err);
    res.status(500).json({ message: "Failed to create payment order", error: err.message });
  }
};

// VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingId } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Verify signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isSignatureValid = expectedSignature === signature;

    if (!isSignatureValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update booking with payment details
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "completed",
        paymentId,
        orderId,
        status: "confirmed",
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
};

// GET PAYMENT STATUS
exports.getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      bookingId,
      paymentStatus: booking.paymentStatus,
      amount: booking.totalPrice,
      paymentMethod: booking.paymentMethod,
      createdAt: booking.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching payment status", error: err.message });
  }
};

// REFUND PAYMENT
exports.refundPayment = async (req, res) => {
  try {
    const { bookingId, refundAmount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.paymentId) {
      return res.status(400).json({ message: "No payment found for this booking" });
    }

    if (booking.paymentStatus !== "completed") {
      return res.status(400).json({ message: "Cannot refund unpaid booking" });
    }

    // Create refund
    const refund = await razorpayInstance.payments.refund(booking.paymentId, {
      amount: Math.round(refundAmount * 100),
      notes: { bookingId },
    });

    // Update booking
    await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "refunded",
        refundId: refund.id,
        status: "cancelled",
      }
    );

    res.json({
      success: true,
      message: "Refund processed successfully",
      refundId: refund.id,
      amount: refundAmount,
    });
  } catch (err) {
    console.error("Refund error:", err);
    res.status(500).json({ message: "Refund failed", error: err.message });
  }
};
