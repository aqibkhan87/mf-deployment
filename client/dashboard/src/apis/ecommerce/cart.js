import { useLoaderStore } from "store/loaderStore";
import { useCartStore } from "store/cartStore";
import httpRequest from "../../helper/httpMethods";

export const getCart = async () => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "";
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("get", `/api/ecommerce/cart/${cartId}`);
    if (response?.data && response?.status === 200) {
      useCartStore.setState((state) => ({
        ...state,
        cart: response?.data?.cart,
        cartCount: response?.data?.cartCount,
      }));
    }
    useLoaderStore.getState().setLoading(false);
  } catch (e) {
    useLoaderStore.getState().setLoading(false);
  }
};

export const updateUserIdInCart = async (userId, cartId) => {
  try {
    useLoaderStore.getState().setLoading(true);
    const response = await httpRequest(
      "put",
      `/api/ecommerce/cart/update-userid-in-cart`,
      {
        userId,
        guestCartId: cartId,
      }
    );
    useLoaderStore.getState().setLoading(false);
    return response;
  } catch (e) {
    useLoaderStore.getState().setLoading(false);
    throw e;
  }
};
