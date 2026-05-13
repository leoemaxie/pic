'use client';

import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { MiniBarChart } from "@/components/MiniBarChart";
import { StapleStatGrid } from "./StapleStatGrid";

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

interface StapleDetailProps {
  staple: Staple;
}

export function StapleDetail({ staple }: StapleDetailProps) {
  const [lower, upper] = staple.marketRange.split("–");

  return (
    <Card className="mt-6">
      <SectionLabel>{staple.name} · Price trend</SectionLabel>

      <StapleStatGrid staple={staple} />

      <div className="mt-6">
        <div className="text-[14px] font-bold text-text mb-3">
          Your purchase history
        </div>
        <MiniBarChart bars={staple.priceHistory} />
      </div>

      <div className="mt-4 p-4 rounded-[12px] bg-surface-2 border border-bd">
        <div className="text-[13px] leading-[1.5] text-text">
          <b>Historical facts:</b> You bought {staple.name.toLowerCase()} at varying
          prices. The market currently ranges from <b className="text-good-fg">{lower}</b> to{" "}
          <b className="text-alert-fg">{upper}</b>. Use this to inform your next
          purchase decision.
        </div>
      </div>
    </Card>
  );
}
