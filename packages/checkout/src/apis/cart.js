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
  debugger;
  const response = await httpRequest("post", `/apis/add-to-cart`, {
    products: items,
    userId,
    cartId,
  });
  debugger;
  if (response?.data && response?.status === 200) {
    localStorage.setItem("cartId", JSON.stringify(response?.data?.cartId));
  }
};

export const getCart = async () => {
  const cartId = localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "anonymous";
  const response = await httpRequest("get", `/apis/get-cart/${cartId}`);
  if (response?.data && response?.status === 200) {
    debugger;
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
  debugger;
  const response = await httpRequest("put", `/apis/update-cart`, {
    products,
    cartId,
  });
  if (response?.data && response?.status === 200) {
    getCart();
  }
};
