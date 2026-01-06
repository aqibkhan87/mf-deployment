import httpRequest from "../../helper/httpMethods";
import { useLoaderStore } from "store/loaderStore";
import { useCartStore } from "store/cartStore";

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

export const updateUserIdInCart = async (
  userId,
  cartId,
  SyncProducts = true
) => {
  useLoaderStore.getState().setLoading(true);
  try {
    return await httpRequest(
      "put",
      `/api/ecommerce/cart/update-userid-in-cart`,
      {
        userId,
        guestCartId: cartId,
        SyncProducts,
      }
    );
  } catch (error) {
    console.error("Error updating userId in cart:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
