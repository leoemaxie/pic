'use client';

import { TrendCard } from "./TrendCard";

const TRENDS_DATA = [
  {
    product: "Rice",
    entries: [
      { date: "Nov 7", price: "₦70k" },
      { date: "Nov 14", price: "₦72k" },
      { date: "Nov 21", price: "₦74k" },
      { date: "Nov 28", price: "₦74k" },
    ],
  },
  {
    product: "Tomatoes",
    entries: [
      { date: "Nov 12", price: "₦9.2k" },
      { date: "Nov 26", price: "₦9.5k" },
    ],
  },
  {
    product: "Palm oil",
    entries: [{ date: "Nov 24", price: "₦18.2k" }],
  },
];

export function TrendsView() {
  return (
    <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-3 pb-2 fade-in">
      {TRENDS_DATA.map((trend) => (
        <TrendCard key={trend.product} product={trend.product} entries={trend.entries} />
      ))}
      <div className="text-center text-[11px] text-text-subtle py-2 italic">
        All data from your actual purchases. Use to compare trends and strategies.
      </div>
    </div>
  );
}
