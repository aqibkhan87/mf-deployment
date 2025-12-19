import httpRequest from "../helper/httpMethods";
import { useCartStore } from "store/cartStore";
import { useLoaderStore } from "store/loaderStore";

export const addToCart = async (products = []) => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "";
  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))?._id
    : "anonymous";
  let items = products?.map((product) => {
    return {
      _id: product._id,
      quantity: product.quantity,
    };
  });
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("post", `/api/ecommerce/cart`, {
      products: items,
      userId,
      cartId,
    });
    if (response?.data && response?.status === 200) {
      localStorage.setItem("cartId", JSON.stringify(response?.data?.cartId));
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

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
  } catch (error) {
    console.error("Error fetching cart:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const updateInCart = async (products) => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "";
  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest("put", `/api/ecommerce/cart/update`, {
      products,
      cartId,
    });
    if (response?.data && response?.status === 200) {
      getCart();
    }
  } catch (error) {
    console.error("Error updating cart:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const removeItemFromCart = async (productId) => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "";

  useLoaderStore.getState().setLoading(true);
  try {
    const response = await httpRequest(
      "delete",
      `/api/ecommerce/cart/${cartId}/product/${productId}`
    );
    if (response?.data && response?.status === 200) {
      getCart();
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
  } finally {
    useLoaderStore.getState().setLoading(false);
  }
};

export const createBooking = (payload) =>
  axios.post("/api/ecommerce/bookings/create", payload);
