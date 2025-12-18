import { create } from "zustand";

console.log("Inside Order Store");

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
