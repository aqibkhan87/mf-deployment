import { create } from "zustand";

export const useOrderStore = create((set, get) => ({
  orderHistory: [],
  orderDetails: {},

  getAllOrders: (items) => {
    set({ orders: [...items] });
  },
  setOrderDetails: (details) => {
    set({ orderDetails: { ...details } });
  },
}));
