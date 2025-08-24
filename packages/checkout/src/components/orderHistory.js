import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "store/productContext";

const OrderHistory = () => {
  const { orders } = useContext(ProductContext);

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">Order History</h2>
      {orders.length === 0 ? <p>No orders yet</p> : (
        orders.map((order) => (
          <div key={order.id} className="border-b py-2">
            <Link to={`/orders/${order.id}`} className="text-blue-600">
              Order #{order.id}
            </Link> - ${order.total} ({order.status})
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
