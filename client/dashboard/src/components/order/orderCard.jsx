import React, { useState } from "react";
import OrderDetails from "./orderDetails.jsx";
import "./order.scss";

const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="order-card" key={order?.createdAt}>
      <div className="order-summary" onClick={() => setOpen(!open)}>
        <div>
          <strong>Order ID:</strong> #{order._id.slice(-6)}
        </div>

        <div>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </div>

        <div>
          <strong>Total:</strong> ₹{order.amount}
        </div>

        <div className={`status ${order.status.toLowerCase()}`}>
          {order.status}
        </div>
      </div>

      {open && <OrderDetails cart={order?.cartId} order={order} />}
    </div>
  );
};

export default OrderCard;
