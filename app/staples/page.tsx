'use client';

import { useState } from "react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { Pill } from "@/components/Pill";
import { MiniBarChart } from "@/components/MiniBarChart";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";

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

const STAPLES: Staple[] = [
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

export default function Staples() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const selected = selectedItem ? STAPLES.find((s) => s.name === selectedItem) : null;

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-bg">
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-5 pb-24 pt-5 lg:px-8 lg:pl-24 lg:pr-8 lg:py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-[12px] font-bold tracking-[0.06em] uppercase text-text-subtle">
              Staple basket
            </div>
            <div className="text-[26px] font-extrabold tracking-[-0.025em] leading-[1.12] text-text mt-0.5">
              Your food <br />items
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STAPLES.map((staple) => (
            <button
              key={staple.name}
              onClick={() => setSelectedItem(staple.name)}
              className={`rounded-[16px] border p-3.5 transition-all ${
                selectedItem === staple.name
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
          ))}
        </div>

        {selected && (
          <Card className="mt-6">
            <SectionLabel>{selected.name} · Price trend</SectionLabel>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-[12px] bg-surface-2 border border-bd p-3">
                <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
                  Last you paid
                </div>
                <div className="mt-1 text-[18px] font-extrabold text-text">
                  {selected.lastPrice}
                </div>
              </div>
              <div className="rounded-[12px] bg-surface-2 border border-bd p-3">
                <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
                  Market range
                </div>
                <div className="mt-1 text-[14px] font-extrabold text-text">
                  {selected.marketRange}
                </div>
              </div>
              <div className="rounded-[12px] bg-surface-2 border border-bd p-3">
                <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
                  Cheapest now
                </div>
                <div className="mt-1 text-[14px] font-extrabold text-good-fg">
                  {selected.cheapestLocation}
                </div>
              </div>
              <div className="rounded-[12px] bg-surface-2 border border-bd p-3">
                <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
                  Movement
                </div>
                <div className="mt-1 text-[14px] font-extrabold">
                  {selected.trend === "up" ? (
                    <span className="text-alert-fg">↑ Rising</span>
                  ) : selected.trend === "down" ? (
                    <span className="text-good-fg">↓ Falling</span>
                  ) : (
                    <span className="text-text">→ Stable</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[14px] font-bold text-text mb-3">Your purchase history</div>
              <MiniBarChart bars={selected.priceHistory} />
            </div>

            <div className="mt-4 p-4 rounded-[12px] bg-surface-2 border border-bd">
              <div className="text-[13px] leading-[1.5] text-text">
                <b>Historical facts:</b> You bought {selected.name.toLowerCase()} at varying
                prices. The market currently ranges from{" "}
                <b className="text-good-fg">{selected.marketRange.split("–")[0]}</b> to{" "}
                <b className="text-alert-fg">{selected.marketRange.split("–")[1]}</b>. Use
                this to inform your next purchase decision.
              </div>
            </div>
          </Card>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
