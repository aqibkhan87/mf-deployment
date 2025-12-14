import React, { useEffect } from "react";
import { Typography } from "@mui/material"
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
      {orderHistory?.length === 0 ? <Typography>No orders yet</Typography> :
        orderHistory?.map((order) => (
          <OrderCard order={order} key={order._id} />
        ))
      }
    </div>
  );
};

export default OrderHistory;
