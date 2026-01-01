import httpRequest from "../../helper/httpMethods";
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
    if (response?.data) {
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

export const addToWishlist = async (productId) => {
  const userId = JSON.parse(localStorage.getItem("user"))?._id || "";

  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "post",
      `/api/ecommerce/wishlist/add?userId=${userId}`,
      JSON.stringify({ productId })
    );
    if (response?.data?.success) {
      await getWishlistProducts();
      return response.data;
    }
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};
