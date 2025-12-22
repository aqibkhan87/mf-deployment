import { create } from "zustand";

export const useBookingStore = create((set, get) => ({
  selectedFlight: null,
  passengers: [], // [{ id, type: 'adult'|'infant', name }]
  selectedAddons: {}, // { passengerId: { meals: [], baggage: null, extras: [] } }
  bookingId: null,
  paymentStatus: null,
  bookingDetails: null,
  addons: [],
  seatMap: {},
  searchEditing: false,

  setSearchEditing: (val) => set({ searchEditing: val }),
  setAddons: (addons) => set({ addons: addons }),
  setSeatMap: (seatMap) => set({ seatMap: seatMap }),
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),
  setBookingId: (id) => set({ bookingId: id }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),

  resetBooking: () =>
    set({
      selectedFlight: null,
      bookingId: null,
      paymentStatus: null,
    }),

  // initialize
  init: ({ flight, passengers }) =>
    set({
      selectedFlight: flight,
      passengers,
      selectedAddons: passengers.reduce((acc, p) => {
        acc[p.id] = { meals: [], baggage: null, extras: [] };
        return acc;
      }, {}),
    }),
  // meal toggles
  toggleMeal: (passengerId, meal) =>
    set((state) => {
      const cur = { ...state.selectedAddons };
      const list = cur[passengerId].meals || [];
      const exists = list.find((m) => m.id === meal.id);
      cur[passengerId].meals = exists
        ? list.filter((m) => m.id !== meal.id)
        : [...list, meal];
      return { selectedAddons: cur };
    }),
  // baggage select (single choice)
  setBaggage: (passengerId, baggageOption) =>
    set((state) => {
      const cur = { ...state.selectedAddons };
      cur[passengerId].baggage = baggageOption;
      return { selectedAddons: cur };
    }),
  // extras add/remove (e.g., sports equipment, add piece)
  toggleExtra: (passengerId, extra) =>
    set((state) => {
      const cur = { ...state.selectedAddons };
      const list = cur[passengerId].extras || [];
      const exists = list.find((e) => e.id === extra.id);
      cur[passengerId].extras = exists
        ? list.filter((e) => e.id !== extra.id)
        : [...list, extra];
      return { selectedAddons: cur };
    }),
  // price calculation
  getTotalAddonsPrice: () => {
    const state = get();
    const flightPrice = state.selectedFlight?.fare?.price || 0;
    let addons = 0;
    Object.values(state.selectedAddons).forEach((p) => {
      (p.meals || []).forEach((m) => (addons += m.price));
      if (p.baggage) addons += p.baggage.price;
      (p.extras || []).forEach((e) => (addons += e.price));
    });
    return { baseFare: flightPrice, addons, total: flightPrice + addons };
  },
}));
