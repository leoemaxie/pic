'use client';

import { RotateCcw, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { DealRow } from "@/components/DealRow";
import { Pill } from "@/components/Pill";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Records() {
  const { hasRecords, setHasRecords } = useTheme();
  const router = useRouter();

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-bg lg:pl-24 lg:pr-8 lg:py-8">
      <div className="px-5 pt-5 pb-3 flex justify-between items-start">
        <div>
          <div className="text-[12px] font-bold tracking-[0.06em] uppercase text-text-subtle">
            Records
          </div>
          <div className="text-[26px] font-extrabold tracking-[-0.025em] leading-[1.12] text-text mt-0.5">
            Auto-logged
            <br />
            purchases
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHasRecords(!hasRecords)}
            aria-label="Reset demo"
            className="w-10 h-10 rounded-full bg-surface border border-bd flex items-center justify-center active:scale-90 transition-transform"
          >
            <RotateCcw size={14} strokeWidth={2} className="text-text-muted" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {hasRecords ? <Populated /> : <Empty onAsk={() => router.push("/chat")} />}

      <BottomNav />
    </div>
  );
}

function Populated() {
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
          <Pill variant="alert">▲ Rice trend</Pill>
        </div>
        <div className="mt-2">
          <DealRow
            product="Rice · 5 bags"
            date="Nov 28"
            price="₦74k"
            wholesaler="Lagos Wholesaler"
            marketAvg="₦73.5k"
            assessment="fair"
          />
          <DealRow
            product="Tomatoes · 3 crates"
            date="Nov 26"
            price="₦9.5k"
            wholesaler="Local market"
            marketAvg="₦8.8k"
            assessment="overpaid"
          />
          <DealRow
            product="Palm oil · 4 jugs"
            date="Nov 24"
            price="₦18.2k"
            wholesaler="Ibadan Wholesaler"
            marketAvg="₦18.5k"
            assessment="fair"
          />
          <DealRow
            product="Rice · 5 bags"
            date="Nov 21"
            price="₦74k"
            wholesaler="Lagos Wholesaler"
            marketAvg="₦73.0k"
            assessment="fair"
          />
          <DealRow
            product="Rice · 5 bags"
            date="Nov 14"
            price="₦72k"
            wholesaler="Ibadan Wholesaler"
            marketAvg="₦72.5k"
            assessment="opportunity"
          />
          <DealRow
            product="Tomatoes · 4 crates"
            date="Nov 12"
            price="₦9.2k"
            wholesaler="Local market"
            marketAvg="₦9.0k"
            assessment="fair"
          />
          <DealRow
            product="Rice · 4 bags"
            date="Nov 7"
            price="₦70k"
            wholesaler="Kano Wholesaler"
            marketAvg="₦71.0k"
            assessment="opportunity"
          />
        </div>
      </Card>

      <div className="text-center text-[11px] text-text-subtle py-2 italic">
        All purchases auto-logged from your chat with PIC.
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "alert";
}) {
  const colorMap = {
    good: "text-good-fg",
    alert: "text-alert-fg",
  };
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
        {label}
      </div>
      <div
        className={`text-[20px] font-extrabold tracking-[-0.02em] mt-0.5 leading-none ${tone ? colorMap[tone] : "text-text"
          }`}
      >
        {value}
      </div>
    </div>
  );
}

function Empty({ onAsk }: { onAsk: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 fade-in">
      <div className="relative w-[180px] h-[160px] mb-7">
        <div
          className="absolute top-0 right-0 w-[40px] h-[46px] bg-gold rounded-xl flex items-center justify-center text-gold-fg text-[18px] font-extrabold shadow-float float-soft z-10"
          style={{ ["--r" as never]: "-12deg", transform: "rotate(-12deg)" }}
        >
          ₦
        </div>
        <div
          className="absolute bottom-2 left-0 w-[30px] h-[30px] bg-rose rounded-full shadow-float float-soft z-10"
          style={{ animationDelay: "0.5s" }}
        />
        <div className="bg-surface border border-bd rounded-[24px] rounded-bl-[6px] px-4 py-3.5 absolute inset-x-5 top-1/2 -translate-y-1/2 shadow-float">
          <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
            YOU
          </div>
          <div className="text-[13px] text-text leading-[1.45] mt-1">
            Bought rice today…
          </div>
          <div className="flex gap-1 mt-2">
            <span className="w-1 h-1 rounded-full bg-text typing-dot" />
            <span className="w-1 h-1 rounded-full bg-text typing-dot" />
            <span className="w-1 h-1 rounded-full bg-text typing-dot" />
          </div>
        </div>
      </div>
      <h2 className="text-[26px] font-extrabold tracking-[-0.025em] text-text text-center leading-[1.15]">
        No purchases
        <br />
        logged yet.
      </h2>
      <p className="text-[14px] text-text-muted text-center leading-[1.55] mt-3 max-w-[280px]">
        Chat with PIC about what you buy, and your history will appear here.
      </p>
      <button
        onClick={onAsk}
        className="mt-7 bg-cta-bg text-cta-fg rounded-full py-3.5 px-7 font-bold text-[14px] tracking-[-0.01em] flex items-center gap-2 active:scale-95 transition-transform"
      >
        <MessageCircle size={16} strokeWidth={2.2} />
        Start asking
      </button>
    </div>
  );
}