'use client';

import { Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { DemandSignalCard } from "@/components/DemandSignalCard";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";

export default function Wholesaler() {
  const { setPersona } = useTheme();
  const router = useRouter();

  const goBack = () => {
    setPersona("retailer");
    router.push("/home");
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-bg lg:min-h-[calc(100dvh-3rem)] lg:my-6 lg:max-w-[460px] lg:mx-auto lg:rounded-[36px] lg:border lg:border-bd/80 lg:shadow-float lg:overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex justify-between items-start">
        <div className="flex items-start gap-3">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-surface border border-bd flex items-center justify-center active:scale-90 transition-transform mt-0.5"
          >
            <ArrowLeft size={14} strokeWidth={2} className="text-text" />
          </button>
          <div>
            <div className="text-[12px] font-bold tracking-[0.06em] uppercase text-text-subtle">
              Wholesaler · Kano
            </div>
            <div className="text-[24px] font-extrabold tracking-[-0.025em] leading-[1.12] text-text mt-0.5">
              Ibrahim
              <br />
              Trading Co.
            </div>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-3 pb-2">
        <SectionLabel className="mt-1">Demand signals · this week</SectionLabel>

        <DemandSignalCard
          count={5}
          product="Looking for rice"
          meta="under ₦72k · 50kg bag"
          helper="your price ₦68k beats demand →"
          good
        />
        <DemandSignalCard
          count={2}
          product="Seeking tomatoes"
          meta="crate · Lagos & Ibadan"
          helper="you don't list this — add inventory?"
        />

        <Card className="flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <SectionLabel>Your inventory</SectionLabel>
            <button className="flex items-center gap-1 text-[11px] font-extrabold text-brand uppercase tracking-[0.06em] active:scale-95 transition-transform">
              <Plus size={12} strokeWidth={2.6} /> Add
            </button>
          </div>
          <div className="mt-3.5 flex flex-col gap-3 flex-1">
            <InvRow
              product="Rice · 50kg"
              stock="120 bags · live"
              price="₦68k"
              tag="cheapest in market"
              tone="good"
            />
            <InvRow
              product="Beans · 100kg"
              stock="40 bags · live"
              price="₦92k"
              tag="market avg ₦91k · fair"
            />
            <InvRow
              product="Garri · 50kg"
              stock="8 bags · low stock"
              price="₦42k"
              tag="₦3k above market"
              tone="alert"
            />
          </div>
        </Card>

        <div className="text-center text-[11px] text-text-subtle py-1 italic">
          5 retailers viewed your rice today.
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function InvRow({
  product,
  stock,
  price,
  tag,
  tone,
}: {
  product: string;
  stock: string;
  price: string;
  tag: string;
  tone?: "good" | "alert";
}) {
  const priceColor =
    tone === "good" ? "text-good-fg" : "text-text";
  const tagColor =
    tone === "good"
      ? "text-good-fg"
      : tone === "alert"
        ? "text-alert-fg"
        : "text-text-subtle";
  return (
    <div className="flex justify-between items-center border-b border-bd pb-3 last:border-b-0 last:pb-0">
      <div>
        <div className="text-[14px] font-bold text-text">{product}</div>
        <div className="text-[11px] text-text-subtle mt-0.5">{stock}</div>
      </div>
      <div className="text-right">
        <div
          className={`text-[18px] font-extrabold tracking-[-0.01em] ${priceColor}`}
        >
          {price}
        </div>
        <div className={`text-[10px] mt-0.5 font-medium ${tagColor}`}>{tag}</div>
      </div>
    </div>
  );
}