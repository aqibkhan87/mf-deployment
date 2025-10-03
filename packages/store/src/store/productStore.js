// Zustand singleton store for auth/theme/settings
import { create } from "zustand";

console.log("Inside Products Store");

export const useProductStore = create((set, get) => ({
  allCategories: [],
  productsByCategory: {},
  product: {},

  setAllCategories: (items) => {
    set({ allCategories: [...items] });
  },
  setProductsByCategories: (item) => {
    set({ productsByCategory: item });
  },
  setProduct: (item) => {
    set({ product: item });
  },
}));
