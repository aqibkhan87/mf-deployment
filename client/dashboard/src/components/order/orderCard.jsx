import React, { useState } from "react";
import OrderDetails from "./orderDetails";
import "./order.scss";

const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="order-card" key={`"${order?._id}-key"`}>
      <div className="order-summary" onClick={() => setOpen(!open)}>
        <div>
          <strong>Order ID:</strong> #{order?._id.slice(-6)}
        </div>

        <div>
          <strong>Date:</strong>{" "}
          {new Date(order?.paidAt).toLocaleDateString()}
        </div>

        <div>
          <strong>Total:</strong> ₹{order?.amount}
        </div>

        <div className={`status ${order?.status.toLowerCase()}`}>
          Status: {order?.status}
        </div>
      </div>

      {open && <OrderDetails cart={order?.cartId} order={order} />}
    </div>
  );
};

export default OrderCard;
