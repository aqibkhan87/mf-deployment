import httpRequest from "../helper/httpMethods.js";

export const updateUserIdInCart = async (userId, cartId) => {
  return await httpRequest("put", `/api/ecommerce/cart/update-userid-in-cart`, {
    userId,
    cartId,
  });
};
