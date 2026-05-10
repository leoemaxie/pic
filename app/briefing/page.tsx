'use client';

import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { Pill } from "@/components/Pill";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Briefing() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-bg lg:min-h-[calc(100dvh-3rem)] lg:my-6 lg:max-w-[460px] lg:mx-auto lg:rounded-[36px] lg:border lg:border-bd/80 lg:shadow-float lg:overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex justify-between items-start">
        <div>
          <div className="text-[12px] font-bold tracking-[0.06em] uppercase text-text-subtle flex items-center gap-1.5">
            <Calendar size={11} strokeWidth={2.2} /> Evening briefing
          </div>
          <div className="text-[26px] font-extrabold tracking-[-0.025em] leading-[1.12] text-text mt-0.5">
            Your market
            <br />
            & your history
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <ThemeToggle />
          <span className="bg-surface border border-bd rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.04em] uppercase text-text-subtle flex items-center gap-1">
            <Clock size={9} strokeWidth={2.2} /> 2h ago
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-3 pb-2">
        <Card>
          <SectionLabel>1 · Your purchases this week</SectionLabel>
          <div className="mt-3.5 flex flex-col gap-3">
            <ItemRow product="Rice" sub="5 bags · 50kg" price="₦74k" />
            <ItemRow product="Tomatoes" sub="3 crates" price="₦9.5k" />
            <ItemRow product="Palm oil" sub="4 jugs · 25L" price="₦18.2k" />
          </div>
          <div className="mt-3.5 pt-3 border-t border-bd flex justify-between text-[11px]">
            <span className="text-text-subtle italic">auto-logged from chat</span>
            <span className="text-text font-bold">3 items · ₦101.7k total</span>
          </div>
        </Card>

        <Card>
          <SectionLabel>2 · How you're doing</SectionLabel>
          <div className="mt-3.5 flex flex-col gap-3.5">
            <AssessmentRow
              product="Rice"
              paid="₦74k"
              market="₦73.5k"
              verdict="fair"
              detail="Aligned with market average."
            />
            <AssessmentRow
              product="Tomatoes"
              paid="₦9.5k"
              market="₦8.8k"
              verdict="opportunity"
              detail="Cheapest at ₦8.8k. Your call next buy."
            />
            <AssessmentRow
              product="Palm oil"
              paid="₦18.2k"
              market="₦18.5k"
              verdict="fair"
              detail="Slightly under market."
            />
          </div>
        </Card>

        <Card>
          <SectionLabel>3 · Market moves</SectionLabel>
          <div className="mt-3.5 flex flex-col gap-2.5">
            <div className="text-[14px] text-text leading-[1.55]">
              <b className="text-text-muted font-semibold text-[12px] uppercase tracking-[0.04em] block mb-0.5">
                Rice
              </b>
              Wholesalers holding <b>₦74k–₦76k</b>. Kano{" "}
              <b className="text-good-fg">₦68k</b>.
            </div>
            <div className="text-[14px] text-text leading-[1.55] pt-2.5 border-t border-bd">
              <b className="text-text-muted font-semibold text-[12px] uppercase tracking-[0.04em] block mb-0.5">
                Tomatoes
              </b>
              Range <b>₦8.2k–₦10.5k</b>. Lagos cheapest at{" "}
              <b className="text-good-fg">₦8.8k</b>.
            </div>
            <div className="text-[14px] text-text leading-[1.55] pt-2.5 border-t border-bd">
              <b className="text-text-muted font-semibold text-[12px] uppercase tracking-[0.04em] block mb-0.5">
                Palm oil
              </b>
              Range <b>₦17.5k–₦19.5k</b>. Stable across the week.
            </div>
          </div>
        </Card>

        <div className="text-center text-[11px] text-text-subtle py-2 italic">
          No forecasts. Just facts and comparisons.
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function ItemRow({ product, sub, price }: { product: string; sub: string; price: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <div>
        <div className="text-[15px] font-bold text-text">{product}</div>
        <div className="text-[11px] text-text-subtle mt-0.5">{sub}</div>
      </div>
      <div className="text-[18px] font-extrabold text-text tracking-[-0.01em]">
        {price}
      </div>
    </div>
  );
}

function AssessmentRow({
  product,
  paid,
  market,
  verdict,
  detail,
}: {
  product: string;
  paid: string;
  market: string;
  verdict: "fair" | "opportunity";
  detail: string;
}) {
  return (
    <div className="border-b border-bd pb-3.5 last:border-b-0 last:pb-0">
      <div className="flex justify-between items-baseline gap-3">
        <div className="text-[15px] font-bold text-text">{product}</div>
        <Pill variant={verdict === "fair" ? "neutral" : "good"}>
          {verdict === "fair" ? "Fair deal" : "Opportunity"}
        </Pill>
      </div>
      <div className="text-[13px] text-text-muted mt-1">
        You paid <b className="text-text">{paid}</b> · market avg {market}
      </div>
      <div className="text-[11px] text-text-subtle mt-0.5">{detail}</div>
    </div>
  );
}