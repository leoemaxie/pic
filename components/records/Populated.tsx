'use client';

import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { DealRow } from "@/components/DealRow";
import { Pill } from "@/components/Pill";
import { Stat } from "./Stat";

const DEALS = [
  {
    product: "Rice · 5 bags",
    date: "Nov 28",
    price: "₦74k",
    wholesaler: "Lagos Wholesaler",
    marketAvg: "₦73.5k",
    assessment: "fair",
  },
  {
    product: "Tomatoes · 3 crates",
    date: "Nov 26",
    price: "₦9.5k",
    wholesaler: "Local market",
    marketAvg: "₦8.8k",
    assessment: "overpaid",
  },
  {
    product: "Palm oil · 4 jugs",
    date: "Nov 24",
    price: "₦18.2k",
    wholesaler: "Ibadan Wholesaler",
    marketAvg: "₦18.5k",
    assessment: "fair",
  },
  {
    product: "Rice · 5 bags",
    date: "Nov 21",
    price: "₦74k",
    wholesaler: "Lagos Wholesaler",
    marketAvg: "₦73.0k",
    assessment: "fair",
  },
  {
    product: "Rice · 5 bags",
    date: "Nov 14",
    price: "₦72k",
    wholesaler: "Ibadan Wholesaler",
    marketAvg: "₦72.5k",
    assessment: "opportunity",
  },
  {
    product: "Tomatoes · 4 crates",
    date: "Nov 12",
    price: "₦9.2k",
    wholesaler: "Local market",
    marketAvg: "₦9.0k",
    assessment: "fair",
  },
  {
    product: "Rice · 4 bags",
    date: "Nov 7",
    price: "₦70k",
    wholesaler: "Kano Wholesaler",
    marketAvg: "₦71.0k",
    assessment: "opportunity",
  },
];

export function Populated() {
  return (
    <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-3 pb-2 fade-in">
      <Card>
        <SectionLabel>November · summary</SectionLabel>
        <div className="grid grid-cols-3 gap-2.5 mt-3.5">
          <Stat label="Spent" value="₦184k" />
          <Stat label="Saved" value="₦12k" tone="good" />
          <Stat label="Overpaid" value="₦4k" tone="alert" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <SectionLabel>Recent purchases · 7</SectionLabel>
          <Pill variant="alert">Rice price history</Pill>
        </div>
        <div className="mt-2">
          {DEALS.map((deal, idx) => (
            <DealRow
              key={idx}
              product={deal.product}
              date={deal.date}
              price={deal.price}
              wholesaler={deal.wholesaler}
              marketAvg={deal.marketAvg}
              assessment={deal.assessment as any}
            />
          ))}
        </div>
      </Card>

      <div className="text-center text-[11px] text-text-subtle py-2 italic">
        Purchases and comparisons are logged together for easier review.
      </div>
    </div>
  );
}
