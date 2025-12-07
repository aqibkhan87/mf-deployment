import React from "react";
import { useHistory } from "react-router-dom";
import { useBookingStore } from "store/bookingStore";
import { loadRazorpay } from "../../utils/loadRazorpay.js";
import { createPaymentOrder, verifyPayment } from "../../apis/payment.js";

const PaymentPage = () => {
  const { bookingId, setPaymentStatus } = useBookingStore();
  const history = useHistory();

  const handlePayment = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) return alert("Razorpay SDK failed");

    // ✅ Create Razorpay order
    const { data } = await createPaymentOrder(bookingId);

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      name: "Flight Booking",
      order_id: data.order.id,
      amount: data.order.amount,
      currency: "INR",

      handler: async (response) => {
        // ✅ Verify payment
        const verifyRes = await verifyPayment({
          bookingId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verifyRes.data.success) {
          setPaymentStatus("PAID");
          history.push("/success");
        } else {
          setPaymentStatus("FAILED");
          alert("Payment verification failed");
        }
      },

      theme: { color: "#2563eb" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-700 text-white px-6 py-3 rounded"
    >
      Pay Now
    </button>
  );
}

export default PaymentPage;