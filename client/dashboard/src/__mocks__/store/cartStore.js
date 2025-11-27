export const useCartStore = () => ({
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  cartId: localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "",
  cartCount: localStorage.getItem("cartCount")
    ? JSON.parse(localStorage.getItem("cartCount"))
    : 0,
  totalAmount: localStorage.getItem("totalAmount")
    ? JSON.parse(localStorage.getItem("totalAmount"))
    : 0,
  discountedAmount: localStorage.getItem("discountedAmount")
    ? JSON.parse(localStorage.getItem("discountedAmount"))
    : 0,
  wishlist: localStorage.getItem("wishlist")
    ? JSON.parse(localStorage.getItem("wishlist") || [])
    : [],
});
