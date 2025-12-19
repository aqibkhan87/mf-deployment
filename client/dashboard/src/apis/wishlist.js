import httpRequest from "../helper/httpMethods";
import { useWishlistStore } from "store/wishlistStore";
import { useLoaderStore } from "store/loaderStore";

export const getWishlistProducts = async () => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  useLoaderStore.getState().setLoading(true);
  try {
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
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const deleteFromWishlist = async (productId) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  useLoaderStore.getState().setLoading(true);
  try {
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
  } catch (error) {
    console.error("Error deleting wishlist product:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const deleteItemFromWishlist = async (productId) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "delete",
      `/api/ecommerce/wishlist/${productId}?userId=${userId}`
    );
    if (response?.data?.success) {
      await getWishlistProducts();
    }
  } catch (error) {
    console.error("Error deleting item from wishlist:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
