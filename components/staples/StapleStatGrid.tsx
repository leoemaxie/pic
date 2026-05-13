"use client";

type Staple = {
  name: string;
  unit: string;
  lastPrice: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  marketRange: string;
  cheapestLocation: string;
};

interface StapleStatGridProps {
  staple: Staple;
}

export function StapleStatGrid({ staple }: StapleStatGridProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rounded-[12px] bg-surface-2 border border-bd p-3">
        <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
          Last you paid
        </div>
        <div className="mt-1 text-[18px] font-extrabold text-text">
          {staple.lastPrice}
        </div>
      </div>
      <div className="rounded-[12px] bg-surface-2 border border-bd p-3">
        <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
          Market range
        </div>
        <div className="mt-1 text-[14px] font-extrabold text-text">
          {staple.marketRange}
        </div>
      </div>
      <div className="rounded-[12px] bg-surface-2 border border-bd p-3">
        <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
          Cheapest now
        </div>
        <div className="mt-1 text-[14px] font-extrabold text-good-fg">
          {staple.cheapestLocation}
        </div>
      </div>
      <div className="rounded-[12px] bg-surface-2 border border-bd p-3">
        <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
          Movement
        </div>
        <div className="mt-1 text-[14px] font-extrabold">
          {staple.trend === "up" ? (
            <span className="text-alert-fg">↑ Rising</span>
          ) : staple.trend === "down" ? (
            <span className="text-good-fg">↓ Falling</span>
          ) : (
            <span className="text-text">→ Stable</span>
          )}
        </div>
      </div>
    </div>
  );
}
