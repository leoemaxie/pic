'use client';

import { useState } from "react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { Pill } from "@/components/Pill";
import { PriceRow } from "@/components/PriceRow";
import { MiniBarChart } from "@/components/MiniBarChart";
import { QuickAskBar } from "@/components/QuickAskBar";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PersonaSheet } from "@/components/PersonaSheet";

export default function Home() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute -top-24 left-12 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-5 pb-24 pt-5 lg:px-8 lg:pl-24 lg:pr-8 lg:py-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_360px] xl:grid-cols-[minmax(0,1.2fr)_400px]">
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[12px] font-bold tracking-[0.06em] uppercase text-text-subtle">
                  Good {new Date().getHours() < 12 ? "Morning" : "Evening"}
                </div>
                <div className="text-[26px] font-extrabold tracking-[-0.025em] leading-[1.12] text-text mt-0.5">
                  Ngozi
                </div>
                <div className="text-[11px] text-text-subtle mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-good-fg" />
                  Ogbomoso
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
                <PriceRow location="Oyo" price="₦74k" />
                <PriceRow location="Iseyin" price="₦71.5k" />
                <PriceRow location="Ilorin" price="₦68k" badge="cheapest" variant="highlight" />
              </div>
            </Card>

            <div className="bg-cta-bg rounded-[20px] p-[18px]">
              <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-cta-fg opacity-50">
                Comparison
              </div>
              <div className="text-[15px] leading-[1.5] mt-1.5 text-cta-fg">
                You usually pay <b>₦72k</b>. Ilorin has{" "}
                <b className="text-inv-good">₦68k</b>. That's{" "}
                <b className="text-inv-good">₦4k per bag</b>.{" "}
                <span className="italic opacity-60">Your choice.</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:flex-col lg:gap-4 lg:sticky lg:top-8">
            <Card>
              <SectionLabel>Quick ask</SectionLabel>
              <div className="mt-3">
                <QuickAskBar placeholder="Ask about rice, tomatoes…" />
              </div>
              <p className="mt-4 text-[13px] leading-[1.55] text-text-muted">
                Open chat, compare nearby prices, or jump to the briefing from the same canvas.
              </p>
            </Card>

            <Card>
              <SectionLabel>Market pulse</SectionLabel>
              <div className="mt-3.5 space-y-3">
                <div className="rounded-[16px] bg-surface-2 border border-bd p-3">
                  <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
                    Cheapest today
                  </div>
                  <div className="mt-1 text-[16px] font-extrabold text-good-fg">
                    Ilorin · ₦68k
                  </div>
                  <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
                    Your last buy was ₦74k, so this is ₦6 per bag lower.
                  </div>
                </div>
                <div className="rounded-[16px] bg-surface-2 border border-bd p-3">
                  <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
                    Your buying pattern
                  </div>
                  <div className="mt-1 text-[16px] font-extrabold text-text">
                    Every 2 weeks
                  </div>
                  <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
                    Based on your 4 rice purchases over the last month.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-5 lg:hidden">
          <QuickAskBar />
        </div>

        <BottomNav />

        <PersonaSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      </div>
    </div>
  );
}