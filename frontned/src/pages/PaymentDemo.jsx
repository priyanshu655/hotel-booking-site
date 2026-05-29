import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { API } from "../config";

export default function PaymentDemo() {
  const [amount, setAmount] = useState(5000);
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in first");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Razorpay checkout failed to load");
      return;
    }

    setLoading(true);
    try {
      const { data: order } = await axios.post(
        `${API}/payments/create-order`,
        {
          amount: Number(amount),
          bookingId: bookingId.trim() || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Planora",
        description: "Hotel booking payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post(
              `${API}/payments/verify`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                bookingId: bookingId.trim() || undefined,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            toast.success("Payment verified successfully");
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
          contact: "9000090000",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        toast.error(response.error?.description || "Payment failed");
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "linear-gradient(135deg, #fff6f0 0%, #f7fbff 100%)" }}>
        <div style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: 24, boxShadow: "0 16px 50px rgba(0,0,0,0.08)", padding: 28, border: "1px solid #eee" }}>
          <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.1 }}>Razorpay Checkout</h1>
          <p style={{ color: "#666", marginTop: 8 }}>Create an order, open Razorpay, and verify the payment signature.</p>

          <label style={{ display: "block", marginTop: 20, fontWeight: 600 }}>Amount</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "100%", marginTop: 8, padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
          />

          <label style={{ display: "block", marginTop: 16, fontWeight: 600 }}>Booking ID (optional)</label>
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="For booking-linked payments"
            style={{ width: "100%", marginTop: 8, padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
          />

          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            style={{ marginTop: 20, width: "100%", border: 0, borderRadius: 12, padding: "14px 18px", fontWeight: 700, color: "#fff", background: loading ? "#89c5dd" : "#3399cc", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Preparing payment..." : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </>
  );
}