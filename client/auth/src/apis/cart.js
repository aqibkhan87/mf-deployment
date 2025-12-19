import httpRequest from "../helper/httpMethods.js";
import { useLoaderStore } from "store/loaderStore";

export const updateUserIdInCart = async (userId, cartId) => {
  useLoaderStore.getState().setLoading(true);
  try {
    return await httpRequest(
      "put",
      `/api/ecommerce/cart/update-userid-in-cart`,
      {
        userId,
        cartId,
      }
    );
  } catch (error) {
    console.error("Error updating userId in cart:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
