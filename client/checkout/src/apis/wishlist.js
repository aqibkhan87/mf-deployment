import { useWishlistStore } from "store/wishlistStore";
import httpRequest from "../helper/httpMethods";

export const getWishlistProducts = async () => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "get",
    `/api/ecommerce/wishlist?userId=${userId}`
  );
  if (response?.data) {
    useWishlistStore.setState((state) => ({
      ...state,
      wishlist: response.data?.wishlist || [],
      wishlistCount: response.data?.wishlist?.length || 0,
    }));
    return response.data;
  }
};

export const addToWishlist = async (productId) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "post",
    `/api/ecommerce/wishlist/add?userId=${userId}`,
    JSON.stringify({ productId })
  );
  if (response?.data?.success) {
    await getWishlistProducts();
    return response.data;
  }
};

