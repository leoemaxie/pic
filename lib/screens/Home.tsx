'use client';

import { useState } from "react";
import { Card } from "@/app/components/Card";
import { SectionLabel } from "@/app/components/SectionLabel";
import { Pill } from "@/app/components/Pill";
import { PriceRow } from "@/app/components/PriceRow";
import { MiniBarChart } from "@/app/components/MiniBarChart";
import { QuickAskBar } from "@/app/components/QuickAskBar";
import { BottomNav } from "@/app/components/BottomNav";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { PersonaSheet } from "@/app/components/PersonaSheet";

export function Home() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="h-screen w-full flex flex-col bg-bg">
      <div className="px-5 pt-5 pb-3 flex justify-between items-start">
        <div>
          <div className="text-[12px] font-bold tracking-[0.06em] uppercase text-text-subtle">
            Good evening
          </div>
          <div className="text-[26px] font-extrabold tracking-[-0.025em] leading-[1.12] text-text mt-0.5">
            Ngozi's
            <br />
            Provision
          </div>
          <div className="text-[11px] text-text-subtle mt-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-good-fg" />
            Lagos · synced 2 min ago
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setSheetOpen(true)}
            className="w-11 h-11 rounded-full bg-rose flex items-center justify-center text-[15px] font-extrabold text-rose-fg active:scale-90 transition-transform"
          >
            N
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-3 pb-2">
        <Card>
          <div className="flex justify-between items-start gap-3">
            <div>
              <SectionLabel>Your rice · 50kg</SectionLabel>
              <div className="text-[28px] font-extrabold tracking-[-0.025em] mt-1 text-text leading-none">
                ₦74k
                <span className="text-[13px] font-semibold text-text-subtle ml-2">
                  last buy
                </span>
              </div>
            </div>
            <Pill variant="alert">▲ ₦4k · 4 buys</Pill>
          </div>
          <div className="mt-5">
            <MiniBarChart
              bars={[
                { label: "₦70k", barHeight: 22 },
                { label: "₦72k", barHeight: 30 },
                { label: "₦74k", barHeight: 38 },
                { label: "now", barHeight: 38, active: true },
              ]}
            />
          </div>
        </Card>

        <Card>
          <SectionLabel>Market now · nearby</SectionLabel>
          <div className="mt-3.5 flex flex-col gap-3">
            <PriceRow location="Lagos" price="₦74k" />
            <PriceRow location="Ibadan" price="₦71.5k" />
            <PriceRow location="Kano" price="₦68k" badge="cheapest" variant="highlight" />
          </div>
        </Card>

        <div className="bg-cta-bg rounded-[20px] p-[18px]">
          <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-cta-fg opacity-50">
            Comparison
          </div>
          <div className="text-[15px] leading-[1.5] mt-1.5 text-cta-fg">
            You usually pay <b>₦72k</b>. Kano{" "}
            <b className="text-inv-good">₦4k cheaper</b>.{" "}
            <span className="italic opacity-60">Your call.</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-3 pb-2">
        <QuickAskBar />
      </div>

      <BottomNav />

      <PersonaSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}