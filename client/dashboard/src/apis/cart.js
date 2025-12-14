import { useCartStore } from "store/cartStore";
import httpRequest from "../helper/httpMethods.js";

export const getCart = async () => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "";
  const response = await httpRequest("get", `/api/ecommerce/cart/${cartId}`);
  if (response?.data && response?.status === 200) {
    useCartStore.setState((state) => ({
      ...state,
      cart: response?.data?.cart,
      cartCount: response?.data?.cartCount,
    }));
  }
};

export const updateUserIdInCart = async (userId, cartId) => {
  return await httpRequest("put", `/api/ecommerce/cart/update-userid-in-cart`, {
    userId,
    cartId,
  });
};
