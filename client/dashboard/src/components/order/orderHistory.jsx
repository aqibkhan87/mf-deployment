import React, { useEffect, useState } from "react";
import { useOrderStore } from "store/orderStore";
import { getAllOrders } from "../../apis/orders";
import OrderCard from "./orderCard";
import "./order.scss";

const OrderHistory = () => {
  const { orderHistory } = useOrderStore();

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="p-4 order-card">
      <h2 className="font-bold text-xl mb-2">Order History</h2>
      {orderHistory?.length === 0 ? <p>No orders yet</p> : (
        orderHistory?.map((order) => (
          <OrderCard order={order} />
        ))
      )}
    </div>
  );
};

export default OrderHistory;
