'use client';

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
    name: "Tomatoes",
    unit: "crate",
    lastPrice: "₦9.5k",
    trend: "up",
    trendValue: "₦0.3k · 3 buys",
    marketRange: "₦8.2k–₦10.5k",
    cheapestLocation: "Lagos",
    priceHistory: [
      { label: "₦8.8k", barHeight: 20 },
      { label: "₦9.0k", barHeight: 22 },
      { label: "₦9.2k", barHeight: 28 },
      { label: "₦9.5k", barHeight: 35 },
    ],
  },
  {
    name: "Onions",
    unit: "50kg bag",
    lastPrice: "₦18k",
    trend: "down",
    trendValue: "₦2k · 3 buys",
    marketRange: "₦16k–₦20k",
    cheapestLocation: "Ibadan",
    priceHistory: [
      { label: "₦20k", barHeight: 35 },
      { label: "₦19k", barHeight: 32 },
      { label: "₦18.5k", barHeight: 28 },
      { label: "₦18k", barHeight: 25 },
    ],
  },
  {
    name: "Pepper",
    unit: "kg",
    lastPrice: "₦2.8k",
    trend: "stable",
    trendValue: "₦0.1k · 2 buys",
    marketRange: "₦2.5k–₦3.2k",
    cheapestLocation: "Kano",
    priceHistory: [
      { label: "₦2.8k", barHeight: 30 },
      { label: "₦2.9k", barHeight: 32 },
      { label: "₦2.8k", barHeight: 30 },
      { label: "₦2.8k", barHeight: 30 },
    ],
  },
  {
    name: "Beans",
    unit: "100kg bag",
    lastPrice: "₦92k",
    trend: "up",
    trendValue: "₦3k · 2 buys",
    marketRange: "₦88k–₦95k",
    cheapestLocation: "Lagos",
    priceHistory: [
      { label: "₦89k", barHeight: 24 },
      { label: "₦90k", barHeight: 26 },
      { label: "₦91.5k", barHeight: 34 },
      { label: "₦92k", barHeight: 36 },
    ],
  },
  {
    name: "Vegetable Oil",
    unit: "25L jug",
    lastPrice: "₦18.2k",
    trend: "stable",
    trendValue: "₦0.5k · 3 buys",
    marketRange: "₦17.5k–₦19.5k",
    cheapestLocation: "Ibadan",
    priceHistory: [
      { label: "₦18.5k", barHeight: 32 },
      { label: "₦18.3k", barHeight: 30 },
      { label: "₦18.2k", barHeight: 30 },
      { label: "₦18.2k", barHeight: 30 },
    ],
  },
  {
    name: "Eggs",
    unit: "crate · 30pcs",
    lastPrice: "₦4.2k",
    trend: "down",
    trendValue: "₦0.4k · 2 buys",
    marketRange: "₦3.8k–₦4.8k",
    cheapestLocation: "Kano",
    priceHistory: [
      { label: "₦4.8k", barHeight: 35 },
      { label: "₦4.6k", barHeight: 32 },
      { label: "₦4.3k", barHeight: 28 },
      { label: "₦4.2k", barHeight: 25 },
    ],
  },
  {
    name: "Flour",
    unit: "50kg bag",
    lastPrice: "₦28.5k",
    trend: "up",
    trendValue: "₦1.2k · 2 buys",
    marketRange: "₦27k–₦30k",
    cheapestLocation: "Lagos",
    priceHistory: [
      { label: "₦27k", barHeight: 22 },
      { label: "₦27.8k", barHeight: 26 },
      { label: "₦28.2k", barHeight: 30 },
      { label: "₦28.5k", barHeight: 32 },
    ],
  },
];
