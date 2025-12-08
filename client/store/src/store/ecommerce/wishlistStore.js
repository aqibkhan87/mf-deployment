// Zustand singleton store for auth/theme/settings
import { create } from "zustand";

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  wishlistCount: 0,

  setWishlist: (items) => {
    set({ wishlist: items });
  },
  setWishlistCount: (wishlistCount) => {
    set({ wishlistCount });
  },
}));
