'use client';

import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { MiniBarChart } from "@/components/MiniBarChart";

interface TrendEntry {
  date: string;
  price: string;
}

interface TrendCardProps {
  product: string;
  entries: TrendEntry[];
}

export function TrendCard({ product, entries }: TrendCardProps) {
  return (
    <Card>
      <SectionLabel>{product} · Price history</SectionLabel>
      <div className="mt-4">
        <MiniBarChart
          bars={entries.map((e, idx) => ({
            label: e.price,
            barHeight: 20 + idx * 8,
            active: idx === entries.length - 1,
          }))}
        />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {entries.map((entry, idx) => (
          <div key={idx} className="flex justify-between items-center text-[13px]">
            <span className="text-text-subtle">{entry.date}</span>
            <span className="font-bold text-text">{entry.price}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-[12px] bg-surface-2 border border-bd">
        <div className="text-[12px] leading-[1.5] text-text-muted">
          You've paid varying prices for {product.toLowerCase()} across{" "}
          {entries.length} purchases. This history helps you recognize when prices
          are favorable.
        </div>
      </div>
    </Card>
  );
}
