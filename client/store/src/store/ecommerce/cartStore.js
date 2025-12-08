// Zustand singleton store for auth/theme/settings
import { create } from "zustand";

console.log("Inside Cart Store");

export const useCartStore = create((set, get) => ({
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  cartId: localStorage.getItem("cartId")
    ? JSON.parse(localStorage.getItem("cartId"))
    : "",
  cartCount: localStorage.getItem("cartCount")
    ? JSON.parse(localStorage.getItem("cartCount"))
    : 0,
  wishlistCount: localStorage.getItem("wishlistCount") || 0,  
  wishlist: localStorage.getItem("wishlist")
    ? JSON.parse(localStorage.getItem("wishlist") || [])
    : [],

  setCart: (cart) => set({ cart }),
  setCartId: (cartId) => set({ cartId }),
  setCartCount: (cartCount) => set({ cartCount }),
  setWishlist: (wishlist) => set({ wishlist }), 
}));
