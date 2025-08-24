import React, { useState, useContext } from "react";
import { ProductContext } from "store/productContext";

const CheckoutForm = ({ total }) => {
  const { placeOrder, cart } = useContext(ProductContext);
  const [paid, setPaid] = useState(false);

  const handlePayment = () => {
    const newOrder = { id: Date.now(), items: cart, total, status: "Paid" };
    placeOrder(newOrder);
    setPaid(true);
  };

  return (
    <div className="p-4 border rounded mt-4">
      {paid ? <p className="text-green-600">Payment successful! 🎉</p> : (
        <>
          <h3 className="font-bold mb-2">Payment</h3>
          <p>Total: ${total}</p>
          <button onClick={handlePayment} className="bg-green-500 text-white px-3 py-1 rounded">
            Pay Now
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutForm;
