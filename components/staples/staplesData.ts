"use client";

type Staple = {
  name: string;
  unit: string;
  lastPrice: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  marketRange: string;
  cheapestLocation: string;
  priceHistory: { label: string; barHeight: number }[];
};

export const STAPLES: Staple[] = [
  {
    name: "Rice",
    unit: "50kg bag",
    lastPrice: "₦74k",
    trend: "up",
    trendValue: "₦4k · 4 buys",
    marketRange: "₦68k–₦76k",
    cheapestLocation: "Kano",
    priceHistory: [
      { label: "₦70k", barHeight: 22 },
      { label: "₦72k", barHeight: 30 },
      { label: "₦74k", barHeight: 38 },
      { label: "now", barHeight: 38 },
    ],
  },
  {
    name: "Golden Penny Spaghetti",
    unit: "carton",
    lastPrice: "₦1.1k",
    trend: "up",
    trendValue: "₦100 · 3 buys",
    marketRange: "₦1.05k–₦1.15k",
    cheapestLocation: "Ibadan",
    priceHistory: [
      { label: "₦1.05k", barHeight: 20 },
      { label: "₦1.08k", barHeight: 22 },
      { label: "₦1.1k", barHeight: 28 },
      { label: "₦1.1k", barHeight: 35 },
    ],
  },
  {
    name: "Milo",
    unit: "400g tin",
    lastPrice: "₦490",
    trend: "down",
    trendValue: "₦20 · 3 buys",
    marketRange: "₦450–₦500",
    cheapestLocation: "Ogbomoso",
    priceHistory: [
      { label: "₦500", barHeight: 35 },
      { label: "₦495", barHeight: 32 },
      { label: "₦492", barHeight: 28 },
      { label: "₦490", barHeight: 25 },
    ],
  },
  {
    name: "Three Crowns Milk",
    unit: "tin",
    lastPrice: "₦950",
    trend: "stable",
    trendValue: "₦50 · 2 buys",
    marketRange: "₦800–₦1,000",
    cheapestLocation: "Lagos",
    priceHistory: [
      { label: "₦980", barHeight: 30 },
      { label: "₦970", barHeight: 32 },
      { label: "₦960", barHeight: 30 },
      { label: "₦950", barHeight: 30 },
    ],
  },
  {
    name: "Sugar",
    unit: "50kg bag",
    lastPrice: "₦78k",
    trend: "up",
    trendValue: "₦2k · 2 buys",
    marketRange: "₦75k–₦81k",
    cheapestLocation: "Ibadan",
    priceHistory: [
      { label: "₦75k", barHeight: 24 },
      { label: "₦76.5k", barHeight: 26 },
      { label: "₦77.5k", barHeight: 34 },
      { label: "₦78k", barHeight: 36 },
    ],
  },
  {
    name: "Vegetable Oil",
    unit: "25L jug",
    lastPrice: "₦32k",
    trend: "stable",
    trendValue: "₦500 · 3 buys",
    marketRange: "₦31k–₦34k",
    cheapestLocation: "Iseyin",
    priceHistory: [
      { label: "₦31k", barHeight: 32 },
      { label: "₦31.5k", barHeight: 30 },
      { label: "₦31.8k", barHeight: 30 },
      { label: "₦32k", barHeight: 30 },
    ],
  },
  {
    name: "Flour",
    unit: "50kg bag",
    lastPrice: "₦28.5k",
    trend: "up",
    trendValue: "₦1.2k · 2 buys",
    marketRange: "₦27k–₦30k",
    cheapestLocation: "Iseyin",
    priceHistory: [
      { label: "₦27k", barHeight: 22 },
      { label: "₦27.8k", barHeight: 26 },
      { label: "₦28.2k", barHeight: 30 },
      { label: "₦28.5k", barHeight: 32 },
    ],
  },
  {
    name: "Salt",
    unit: "25kg bag",
    lastPrice: "₦6.2k",
    trend: "stable",
    trendValue: "₦200 · 2 buys",
    marketRange: "₦6k–₦6.5k",
    cheapestLocation: "Ilorin",
    priceHistory: [
      { label: "₦6k", barHeight: 22 },
      { label: "₦6.1k", barHeight: 26 },
      { label: "₦6.2k", barHeight: 30 },
      { label: "₦6.2k", barHeight: 32 },
    ],
  },
];
