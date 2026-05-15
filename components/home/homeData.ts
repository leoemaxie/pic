import { CalendarDays, FileText, Leaf, MessageCircle } from "lucide-react";

export const shortcuts = [
  {
    label: "Ask PIC",
    helper: "Talk or type a question",
    icon: MessageCircle,
    href: "/chat",
  },
  {
    label: "Market briefing",
    helper: "What changed today",
    icon: CalendarDays,
    href: "/briefing",
  },
  {
    label: "Staples",
    helper: "Food items at a glance",
    icon: Leaf,
    href: "/staples",
  },
  {
    label: "Records",
    helper: "Your purchases and trends",
    icon: FileText,
    href: "/records",
  },
] as const;

export const retailers = [
  {
    name: "Ibrahim",
    place: "Oyo",
    phone: "+2348000111111",
    price: "₦68k",
    tone: "good",
  },
  {
    name: "Aisha",
    place: "Ibadan",
    phone: "+2348000222222",
    price: "₦71.5k",
    tone: "neutral",
  },
  {
    name: "Salako",
    place: "Iseyin",
    phone: "+2348000333333",
    price: "₦74k",
    tone: "alert",
  },
] as const;

export const staplesItems = [
  "Golden Penny Spaghetti",
  "Milo",
  "Three Crowns Milk",
  "Rice (Local)",
];

export const homeProducts = [
  {
    name: "Rice (Local)",
    marketNow: {
      subtitle: "Nearby prices at a glance",
      rows: [
        { location: "Oyo", price: "₦74k" },
        { location: "Iseyin", price: "₦71.5k" },
        {
          location: "Ilorin",
          price: "₦68k",
          badge: "cheapest",
          variant: "highlight",
        },
      ],
    },
    priceTrend: {
      lastBuy: "₦74k",
      delta: "▲ ₦4k",
      bars: [
        { label: "₦70k", barHeight: 22 },
        { label: "₦72k", barHeight: 30 },
        { label: "₦74k", barHeight: 38 },
        { label: "now", barHeight: 38, active: true },
      ],
      compare:
        "You usually pay <b>₦72k</b>. Ilorin is <b>₦68k</b>. That is <b>₦4k less</b> per bag.",
    },
    pulse: {
      cheapest: "Ilorin · ₦68k",
      whatChanged: "Rice is moving up",
      note: "Your last buy was ₦74k, so this is lower right now.",
      context: "The gap between nearby markets is easier to spot here.",
    },
    stats: {
      lastBuyLabel: "Last rice buy",
      lastBuy: "₦74k",
      lastBuyNote: "50kg bag in Ogbomoso.",
      cheapestLabel: "Cheapest nearby",
      cheapest: "₦68k",
      cheapestNote: "Ilorin has the lowest price.",
      rhythmLabel: "Buying rhythm",
      rhythm: "2 weeks",
      rhythmNote: "Based on your recent purchases.",
    },
    retailers: [
      {
        name: "Ibrahim",
        place: "Kano",
        phone: "+2348000111111",
        price: "₦68k",
        tone: "good",
      },
      {
        name: "Aisha",
        place: "Ibadan",
        phone: "+2348000222222",
        price: "₦71.5k",
        tone: "neutral",
      },
      {
        name: "Chukwu",
        place: "Lagos",
        phone: "+2348000333333",
        price: "₦74k",
        tone: "alert",
      },
    ],
  },
  {
    name: "Golden Penny Spaghetti",
    marketNow: {
      subtitle: "Nearby prices at a glance",
      rows: [
        { location: "Oyo", price: "₦1,100" },
        { location: "Iseyin", price: "₦1,070" },
        {
          location: "Ilorin",
          price: "₦1,050",
          badge: "cheapest",
          variant: "highlight",
        },
      ],
    },
    priceTrend: {
      lastBuy: "₦1,100",
      delta: "▼ ₦20",
      bars: [
        { label: "₦1,120", barHeight: 34 },
        { label: "₦1,105", barHeight: 31 },
        { label: "₦1,100", barHeight: 28 },
        { label: "now", barHeight: 22, active: true },
      ],
      compare:
        "You usually pay <b>₦1,100</b>. Ilorin is <b>₦1,050</b>. That is <b>₦50 less</b> per carton.",
    },
    pulse: {
      cheapest: "Ilorin · ₦1,050",
      whatChanged: "Spaghetti is easing",
      note: "Your last buy was ₦1,100, so this is lower right now.",
      context: "The spread between nearby markets is narrower today.",
    },
    stats: {
      lastBuyLabel: "Last spaghetti buy",
      lastBuy: "₦1,100",
      lastBuyNote: "2 cartons in Ogbomoso.",
      cheapestLabel: "Cheapest nearby",
      cheapest: "₦1,050",
      cheapestNote: "Ilorin has the lowest price.",
      rhythmLabel: "Buying rhythm",
      rhythm: "3 weeks",
      rhythmNote: "Based on your recent purchases.",
    },
    retailers: [
      {
        name: "Fatima",
        place: "Ilorin",
        phone: "+2348000444444",
        price: "₦1,050",
        tone: "good",
      },
      {
        name: "Tunde",
        place: "Iseyin",
        phone: "+2348000555555",
        price: "₦1,070",
        tone: "neutral",
      },
      {
        name: "Mariam",
        place: "Oyo",
        phone: "+2348000666666",
        price: "₦1,100",
        tone: "alert",
      },
    ],
  },
  {
    name: "Milo",
    marketNow: {
      subtitle: "Nearby prices at a glance",
      rows: [
        { location: "Oyo", price: "₦490" },
        { location: "Iseyin", price: "₦470" },
        {
          location: "Ilorin",
          price: "₦450",
          badge: "cheapest",
          variant: "highlight",
        },
      ],
    },
    priceTrend: {
      lastBuy: "₦490",
      delta: "▼ ₦20",
      bars: [
        { label: "₦500", barHeight: 35 },
        { label: "₦495", barHeight: 32 },
        { label: "₦490", barHeight: 30 },
        { label: "now", barHeight: 24, active: true },
      ],
      compare:
        "You usually pay <b>₦490</b>. Ilorin is <b>₦450</b>. That is <b>₦40 less</b> per tin.",
    },
    pulse: {
      cheapest: "Ilorin · ₦450",
      whatChanged: "Milo is softening",
      note: "Your last buy was ₦490, so this is lower right now.",
      context: "The difference between markets is useful for restocking.",
    },
    stats: {
      lastBuyLabel: "Last Milo buy",
      lastBuy: "₦490",
      lastBuyNote: "Tin in Ogbomoso.",
      cheapestLabel: "Cheapest nearby",
      cheapest: "₦450",
      cheapestNote: "Ilorin has the lowest price.",
      rhythmLabel: "Buying rhythm",
      rhythm: "4 weeks",
      rhythmNote: "Based on your recent purchases.",
    },
    retailers: [
      {
        name: "Kemi",
        place: "Iseyin",
        phone: "+2348000777777",
        price: "₦450",
        tone: "good",
      },
      {
        name: "Sola",
        place: "Ibadan",
        phone: "+2348000888888",
        price: "₦470",
        tone: "neutral",
      },
      {
        name: "Bello",
        place: "Oyo",
        phone: "+2348000999999",
        price: "₦490",
        tone: "alert",
      },
    ],
  },
  {
    name: "Three Crowns Milk",
    marketNow: {
      subtitle: "Nearby prices at a glance",
      rows: [
        { location: "Oyo", price: "₦950" },
        { location: "Iseyin", price: "₦910" },
        {
          location: "Ilorin",
          price: "₦800",
          badge: "cheapest",
          variant: "highlight",
        },
      ],
    },
    priceTrend: {
      lastBuy: "₦950",
      delta: "▼ ₦30",
      bars: [
        { label: "₦980", barHeight: 31 },
        { label: "₦960", barHeight: 28 },
        { label: "₦950", barHeight: 26 },
        { label: "now", barHeight: 20, active: true },
      ],
      compare:
        "You usually pay <b>₦950</b>. Ilorin is <b>₦800</b>. That is <b>₦150 less</b> per pack.",
    },
    pulse: {
      cheapest: "Ilorin · ₦800",
      whatChanged: "Milk is cooling off",
      note: "Your last buy was ₦950, so this is lower right now.",
      context: "A small price gap still helps on repeat purchases.",
    },
    stats: {
      lastBuyLabel: "Last milk buy",
      lastBuy: "₦950",
      lastBuyNote: "Pack in Ogbomoso.",
      cheapestLabel: "Cheapest nearby",
      cheapest: "₦800",
      cheapestNote: "Ilorin has the lowest price.",
      rhythmLabel: "Buying rhythm",
      rhythm: "2 weeks",
      rhythmNote: "Based on your recent purchases.",
    },
    retailers: [
      {
        name: "Rukayat",
        place: "Ilorin",
        phone: "+2348010000001",
        price: "₦800",
        tone: "good",
      },
      {
        name: "Abdul",
        place: "Osogbo",
        phone: "+2348010000002",
        price: "₦910",
        tone: "neutral",
      },
      {
        name: "Zainab",
        place: "Iseyin",
        phone: "+2348010000003",
        price: "₦950",
        tone: "alert",
      },
    ],
  },
] as const;

export type HomeProduct = (typeof homeProducts)[number];
