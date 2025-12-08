import httpRequest from "../helper/httpMethods";
import { useCartStore } from "store/cartStore";

export const addToCart = async (products = []) => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "";
  const userId = localStorage.getItem("userId")
    ? JSON.parse(localStorage.getItem("userId"))
    : "anonymous";
  let items = products?.map((product) => {
    return {
      _id: product._id,
      quantity: product.quantity,
    };
  });
  const response = await httpRequest("post", `/api/ecommerce/cart`, {
    products: items,
    userId,
    cartId,
  });
  if (response?.data && response?.status === 200) {
    localStorage.setItem("cartId", JSON.stringify(response?.data?.cartId));
  }
};

export const getCart = async () => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "";
  console.log("Fetching cart for cartId:", cartId);
  const response = await httpRequest("get", `/api/ecommerce/cart/${cartId}`);
  if (response?.data && response?.status === 200) {
    useCartStore.setState((state) => ({
      ...state,
      cart: response.data?.cart,
      cartCount: response.data?.cartCount,
    }));
  }
};

export const updateInCart = async (products) => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "";
  const response = await httpRequest("put", `/api/ecommerce/cart/update`, {
    products,
    cartId,
  });
  if (response?.data && response?.status === 200) {
    getCart();
  }
};

export const createBooking = (payload) =>
  axios.post("/api/ecommerce/bookings/create", payload);
