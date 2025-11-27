export const useAuthStore = () => ({
  addItem: jest.fn(),
  removeItem: jest.fn(),
  user: JSON.parse(localStorage.getItem("user")) || {},
  address: JSON.parse(localStorage.getItem("address")) || "",
  theme: "light",
  settings: {},

  setUser: jest.fn(),
  setNewAddress: jest.fn(),
  logout: jest.fn(),
});
