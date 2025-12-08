import { useWishlistStore } from "store/wishlistStore";
import httpRequest from "../helper/httpMethods";

export const getWishlistProducts = async () => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "get",
    `/api/ecommerce/wishlist?userId=${userId}`
  );
  if (response?.data?.success) {
    useWishlistStore.setState((state) => ({
      ...state,
      wishlist: response.data?.wishlist || [],
      wishlistCount: response.data?.wishlist?.length || 0,
    }));
    return response.data;
  }
};

export const deleteFromWishlist = async (productId) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  const response = await httpRequest(
    "delete",
    `/api/ecommerce/wishlist/${productId}?userId=${userId}`
  );
  if (response?.data?.data && response?.status === 200) {
    useWishlistStore.setState((state) => ({
      ...state,
      wishlist: response.data?.data?.wishlist || [],
      wishlistCount: response.data?.data?.wishlist?.length || 0,
    }));
    return response.data;
  }
};
