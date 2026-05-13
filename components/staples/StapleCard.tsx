'use client';

import { Pill } from "@/components/Pill";

type Staple = {
  name: string;
  unit: string;
  lastPrice: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
};

interface StapleCardProps {
  staple: Staple;
  isSelected: boolean;
  onSelect: (name: string) => void;
}

export function StapleCard({ staple, isSelected, onSelect }: StapleCardProps) {
  return (
    <button
      onClick={() => onSelect(staple.name)}
      className={`rounded-[16px] border p-3.5 transition-all ${
        isSelected
          ? "border-brand bg-surface-2"
          : "border-bd bg-surface hover:border-bd-strong"
      }`}
    >
      <div className="text-[12px] font-bold text-text-subtle tracking-[0.04em] uppercase">
        {staple.name}
      </div>
      <div className="mt-1.5 text-[14px] font-extrabold text-text">
        {staple.lastPrice}
      </div>
      <div className="mt-1 text-[10px] text-text-muted">{staple.unit}</div>
      <div className="mt-2 flex items-center gap-1">
        <Pill
          variant={
            staple.trend === "up"
              ? "alert"
              : staple.trend === "down"
                ? "good"
                : "neutral"
          }
        >
          {staple.trend === "up" ? "↑" : staple.trend === "down" ? "↓" : "→"}{" "}
          {staple.trendValue.split(" ·")[0]}
        </Pill>
      </div>
    </button>
  );
}
