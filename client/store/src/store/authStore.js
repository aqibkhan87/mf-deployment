import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : "",
  address: localStorage.getItem("address") ? JSON.parse(localStorage.getItem("address")) : "",
  addresses: [],
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
  setAddresses: (addresses) => set({ addresses }),
}));
