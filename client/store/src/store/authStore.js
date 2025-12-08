import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || {},
  token: JSON.parse(localStorage.getItem("token")) || "",
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
  logout: () => set({ user: null, }),
  setToken: (token) => set({ token }),
  // toggleTheme: () =>
  //   set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  // setSetting: (key, value) =>
  //   set({ settings: { ...get().settings, [key]: value } }),
}));
