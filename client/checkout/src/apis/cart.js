import httpRequest from "../helper/httpMethods";
import { useCartStore } from "store/cartStore";

export const addToCart = async (products = []) => {
  const cartId = localStorage.getItem("cartId")
    ? localStorage.getItem("cartId")
    : "";
  const userId = localStorage.getItem("userId")
    ? localStorage.getItem("userId")
    : "anonymous";
  let items = products?.map((product) => {
    return {
      productDetail: product._id,
      quantity: product.quantity,
    };
  });
  const response = await httpRequest("post", `/api/ecommerce/add-to-cart`, {
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
    : "anonymous";
  const response = await httpRequest("get", `/api/ecommerce/get-cart/${cartId}`);
  if (response?.data && response?.status === 200) {
    useCartStore.setState((state) => ({
      ...state,
      cart: response.data?.cart,
      cartCount: response.data?.cartCount
    }));
  }
};

export const updateInCart = async (products) => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "anonymous";
  const response = await httpRequest("put", `/api/ecommerce/update-cart`, {
    products,
    cartId,
  });
  if (response?.data && response?.status === 200) {
    getCart();
  }
};
