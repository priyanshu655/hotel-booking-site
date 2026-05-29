const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const getRazorpayInstance = require("../config/razorpay");
const crypto = require("crypto");

// CREATE Razorpay ORDER
exports.createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, totalAmount, amount, currency = "INR" } = req.body;

    const paymentAmount = Number(totalAmount ?? amount);

    if (!paymentAmount || Number.isNaN(paymentAmount)) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const razorpayInstance = getRazorpayInstance();
    if (!razorpayInstance) {
      return res.status(503).json({
        message: "Razorpay is not configured on the server",
      });
    }

    // Amount in paise (₹1 = 100 paise)
    const amountInPaise = Math.round(paymentAmount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: bookingId ? `receipt_${bookingId}` : `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpayInstance.orders.create(options);

    await Payment.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      ...order,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: bookingId || null,
    });
  } catch (err) {
    console.error("Payment order error:", err);
    res.status(500).json({ message: "Failed to create payment order", error: err.message });
  }
};

// VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      signature,
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    const resolvedOrderId = razorpayOrderId || orderId;
    const resolvedPaymentId = razorpayPaymentId || paymentId;
    const resolvedSignature = razorpaySignature || signature;

    if (!resolvedOrderId || !resolvedPaymentId || !resolvedSignature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Verify signature
    const body = resolvedOrderId + "|" + resolvedPaymentId;
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        message: "Razorpay is not configured on the server",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isSignatureValid = expectedSignature === resolvedSignature;

    if (!isSignatureValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await Payment.findOneAndUpdate(
      { orderId: resolvedOrderId },
      {
        paymentId: resolvedPaymentId,
        signature: resolvedSignature,
        status: "completed",
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment order not found" });
    }

    // Update booking with payment details
    const booking = bookingId
      ? await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "completed",
        paymentId: resolvedPaymentId,
        orderId: resolvedOrderId,
        status: "confirmed",
      },
      { new: true }
    )
      : null;

    if (bookingId && !booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment,
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

    const razorpayInstance = getRazorpayInstance();
    if (!razorpayInstance) {
      return res.status(503).json({
        message: "Razorpay is not configured on the server",
      });
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

    await Payment.findOneAndUpdate(
      { orderId: booking.orderId },
      { status: "refunded" }
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
