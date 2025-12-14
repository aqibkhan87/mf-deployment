import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {},
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : "",
  address: localStorage.getItem("address")
    ? JSON.parse(localStorage.getItem("address"))
    : "",
  addresses: [],
  theme: "light",
  settings: {},

  setUser: (user) => set({ user }),
  setAddress: (address) => {
    const {
      line1 = "",
      line2 = "",
      city = "",
      pincode = "",
      state = "",
      country = "",
    } = address;
    let updatedAddress = `${line1}, ${line2}, ${city}, ${state}, ${country}, ${pincode}`;
    localStorage.setItem("address", JSON.stringify(updatedAddress));
    return set({ ...state, address: updatedAddress });
  },
  logout: () => set({ user: null }),
  setToken: (token) => set({ token }),
  setAddresses: (addresses) => set({ addresses }),
}));
