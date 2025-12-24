import { create } from "zustand";

export const useProductStore = create((set, get) => ({
  
  allCategories: [],
  productsByCategory: [],
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
