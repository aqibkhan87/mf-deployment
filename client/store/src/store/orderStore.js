// Zustand singleton store for auth/theme/settings
import { create } from "zustand";

console.log("Inside Order Store");

export const useOrderStore = create((set, get) => ({
  orders: [],

  addAllOrders: (items) => {
    set({ orders: [...items] });
  },
}));
