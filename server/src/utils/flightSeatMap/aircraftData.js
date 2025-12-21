export const AIRCRAFT_DATA = [
  {
    code: "B737",
    family: "Boeing 737",
    cabins: [
      {
        cabin: "ECONOMY",
        rows: 30,
        columns: ["A", "B", "C", "D", "E", "F"],
        seatPricing: {
          window: 1000,
          aisle: 900,
          middle: 800,
          extraLegroom: 1500,
        },
      },
      {
        cabin: "BUSINESS",
        rows: 6,
        columns: ["A", "C", "D", "F"],
        seatPricing: {
          window: 2500,
          aisle: 2200,
          middle: 0,
          extraLegroom: 3000,
        },
      },
    ],
  },
  {
    code: "A320",
    family: "Airbus A320",
    cabins: [
      {
        cabin: "ECONOMY",
        rows: 28,
        columns: ["A", "B", "C", "D", "E", "F"],
        seatPricing: {
          window: 950,
          aisle: 900,
          middle: 850,
          extraLegroom: 1400,
        },
      },
      {
        cabin: "BUSINESS",
        rows: 4,
        columns: ["A", "C", "D", "F"],
        seatPricing: {
          window: 2400,
          aisle: 2200,
          middle: 0,
          extraLegroom: 2900,
        },
      },
    ],
  },
  {
    code: "B777",
    family: "Boeing 777",
    cabins: [
      {
        cabin: "ECONOMY",
        rows: 40,
        columns: ["A", "B", "C", "D", "E", "F", "G", "H", "J"],
        seatPricing: {
          window: 1200,
          aisle: 1100,
          middle: 1000,
          extraLegroom: 1800,
        },
      },
      {
        cabin: "BUSINESS",
        rows: 10,
        columns: ["A", "C", "D", "F", "G", "J"],
        seatPricing: {
          window: 3500,
          aisle: 3200,
          middle: 0,
          extraLegroom: 4000,
        },
      },
    ],
  },
  {
    code: "B787",
    family: "Boeing 787",
    cabins: [
      {
        cabin: "ECONOMY",
        rows: 32,
        columns: ["A", "B", "C", "D", "E", "F", "G", "H", "J"],
        seatPricing: {
          window: 1150,
          aisle: 1100,
          middle: 1000,
          extraLegroom: 1750,
        },
      },
      {
        cabin: "BUSINESS",
        rows: 8,
        columns: ["A", "C", "D", "F", "G", "J"],
        seatPricing: {
          window: 3400,
          aisle: 3200,
          middle: 0,
          extraLegroom: 3900,
        },
      },
    ],
  },
  {
    code: "A330",
    family: "Airbus A330",
    cabins: [
      {
        cabin: "ECONOMY",
        rows: 35,
        columns: ["A", "B", "C", "D", "E", "F", "G", "H", "J"],
        seatPricing: {
          window: 1200,
          aisle: 1100,
          middle: 1000,
          extraLegroom: 1800,
        },
      },
      {
        cabin: "BUSINESS",
        rows: 12,
        columns: ["A", "C", "D", "F", "G", "J"],
        seatPricing: {
          window: 3600,
          aisle: 3300,
          middle: 0,
          extraLegroom: 4200,
        },
      },
    ],
  },
  {
    code: "ATR72",
    family: "ATR 72",
    cabins: [
      {
        cabin: "ECONOMY",
        rows: 20,
        columns: ["A", "B", "C", "D"],
        seatPricing: {
          window: 500,
          aisle: 450,
          middle: 400,
          extraLegroom: 800,
        },
      },
    ],
  },
  {
    code: "CRJ900",
    family: "Bombardier CRJ",
    cabins: [
      {
        cabin: "ECONOMY",
        rows: 24,
        columns: ["A", "B", "C", "D"],
        seatPricing: {
          window: 600,
          aisle: 550,
          middle: 500,
          extraLegroom: 900,
        },
      },
    ],
  },
];
