// Zustand singleton store for auth/theme/settings
import { create } from "zustand";

console.log("Inside Store");
export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || {},
  address: JSON.parse(localStorage.getItem("address")) || "",
  theme: "light",
  settings: {},

  setUser: (user) => set({ user }),
  setNewAddress: (address) => {
    const {
      name,
      address: addressField,
      locality,
      city,
      pincode,
      mobile,
    } = address;
    let updatedAddress = `${name}, ${addressField}, ${locality}, ${city}, ${pincode}, ${mobile}`;
    set(updatedAddress);
  },
  logout: () => set({ user: null }),
  // toggleTheme: () =>
  //   set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  // setSetting: (key, value) =>
  //   set({ settings: { ...get().settings, [key]: value } }),
}));
