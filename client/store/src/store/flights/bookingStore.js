import { create } from "zustand";

export const useBookingStore = create((set, get) => ({
  selectedFlight: null,
  sourceAirport: {},
  destinationAirport: {},
  passengers: [], // [{ id, type: 'adult'|'infant', name }]
  selectedAddons: {}, // { passengerId: { meals: [], baggage: null, extras: [] } }
  bookingId: null,
  paymentStatus: null,
  bookingDetails: null,
  addons: [],
  seatMaps: [],
  searchEditing: false,
  itineraryDetails: {},
  destinationListDetails: {},
  checkinDetails: {},

  setSearchEditing: (val) => set({ searchEditing: val }),
  setAddons: (addons) => set({ addons: addons }),
  setSeatMaps: (seatMaps) => set({ seatMaps: seatMaps }),
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),
  setBookingId: (id) => set({ bookingId: id }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setCheckinDetails: (checkinDetails) => set({ checkinDetails: checkinDetails }),
}));
