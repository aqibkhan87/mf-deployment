// Zustand singleton store for auth/theme/settings
import { create } from "zustand";

console.log("Inside Cart Store");

const updateCartDetails = (cart) => {
  let cartCount = 0;
  let totalAmount = 0;
  let discountedAmount = 0;
  cart?.forEach((item) => {
    cartCount = cartCount + Number(item?.quantity);
    totalAmount =
      totalAmount + Number(Number(item?.price) * Number(item?.quantity));
    discountedAmount =
      discountedAmount +
      Number(
        Number(item?.quantity) * Number(item?.oldPrice) -
          Number(item?.quantity) * Number(item?.price)
      );
  });
  return {
    cartCount,
    totalAmount,
    discountedAmount,
  };
};

export const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  cartCount: JSON.parse(localStorage.getItem("cartCount")) || 0,
  totalAmount: JSON.parse(localStorage.getItem("totalAmount")) || 0,
  discountedAmount: JSON.parse(localStorage.getItem("discountedAmount")) || 0,

  addToCart: (item) => {
    set({ cart: [...get().cart, item] });
    set({ ...updateCartDetails([...get().cart]) });
    localStorage.setItem("cart", JSON.stringify([...get().cart]));
    for (const [key, value] of Object.entries(
      updateCartDetails([...get().cart])
    )) {
      localStorage.setItem(key, value);
    }
  },
  updateQuantityInCart: (cart) => {
    set({ cart: [...cart] });
    set({ ...updateCartDetails([...cart]) });
    localStorage.setItem("cart", JSON.stringify([...cart]));
    for (const [key, value] of Object.entries(
      updateCartDetails([...get().cart])
    )) {
      localStorage.setItem(key, value);
    }
  },
}));
