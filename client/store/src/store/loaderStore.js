import { create } from "zustand";

export const useLoaderStore = create((set, get) => ({
  loading: false,

  setLoading: (loading) => set({ loading }),
}));
