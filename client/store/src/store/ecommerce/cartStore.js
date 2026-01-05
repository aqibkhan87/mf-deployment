import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : {},
  cartId: localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "",
  cartCount: 0,

  setCart: (cart) => set({ cart }),
  setCartId: (cartId) => set({ cartId }),
  setCartCount: (cartCount) => set({ cartCount }),
}));
