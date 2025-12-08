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


  setCart: (cart) => set({ cart }),
  setCartId: (cartId) => set({ cartId }),
  setCartCount: (cartCount) => set({ cartCount }),
});
