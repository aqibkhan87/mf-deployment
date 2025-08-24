// Zustand singleton store for auth/theme/settings
import { create } from "zustand";

console.log("Inside Store");
export const useAuthStore = create((set, get) => ({
  user: null,
  theme: "light",
  settings: {},

  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  setSetting: (key, value) =>
    set({ settings: { ...get().settings, [key]: value } }),
}));
