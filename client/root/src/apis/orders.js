import { useOrderStore } from "store/orderStore";
import httpRequest from "../helper/httpMethods";

export const getAllOrders = async () => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "get",
    `/api/ecommerce/order?userId=${userId}`
  );
  if (response?.data?.success) {
    useOrderStore.setState((state) => ({
      ...state,
      orderHistory: response.data?.orders || [],
    }));
  }
};

export const getOrderById = async (orderId) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "get",
    `/api/ecommerce/order/${orderId}?userId=${userId}`
  );
  if (response?.data) {
    useOrderStore.setState((state) => ({
      ...state,
      orderDetails: response.data?.orderDetails || {},
    }));
  }
};
