import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "store/productContext";

const OrderDetails = () => {
  const { orderid } = useParams();
  const { orders } = useContext(ProductContext);
  const order = orders?.find((o) => o.id.toString() === orderid);

  if (!order) return <p>Order not found</p>;

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">Order #{order?.id}</h2>
      <p>Total: ${order?.total}</p>
      <h3 className="font-bold mt-2">Items:</h3>
      {order?.items?.map((item) => (
        <div key={item.id}>{item.name} - ${item.price}</div>
      ))}
    </div>
  );
};

export default OrderDetails;
