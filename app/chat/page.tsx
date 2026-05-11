'use client';

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserBubble } from "@/components/UserBubble";
import { PicBubble, PicBubbleSection } from "@/components/PicBubble";
import { WholesalerCard } from "@/components/WholesalerCard";
import { ThemeToggle } from "@/components/ThemeToggle";

type Phase = 0 | 1 | 2 | 3;

export default function Chat() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === 0) {
      const t = setTimeout(() => setPhase(1), 1500);
      return () => clearTimeout(t);
    }
    if (phase === 2) {
      const t = setTimeout(() => setPhase(3), 1300);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [phase]);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-bg lg:pl-24 lg:pr-8 lg:py-8">
      <div className="flex items-center gap-2.5 px-5 pt-4 pb-3.5 border-b border-bd">
        <button
          onClick={() => router.push("/home")}
          className="w-9 h-9 rounded-full bg-surface border border-bd flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft size={15} strokeWidth={2} className="text-text" />
        </button>
        <div className="flex-1">
          <div className="text-[16px] font-extrabold tracking-[-0.01em] text-text">
            Ask PIC
          </div>
          <div className="text-[11px] text-text-subtle">
            history · market · your call
          </div>
        </div>
        <ThemeToggle />
        <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-[12px] font-extrabold text-white">
          P
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5"
      >
        <UserBubble>
          Rice prices have been going up. When should I restock?
        </UserBubble>

        {phase === 0 && <TypingBubble />}

        {phase >= 1 && (
          <PicBubble className="slide-up">
            <PicBubbleSection label="1 · Your history">
              ₦70k <span className="text-text-subtle">(2w ago)</span> → ₦72k → ₦74k →{" "}
              <b>₦74k</b> last buy
            </PicBubbleSection>
            <PicBubbleSection label="2 · Market now">
              Most wholesalers <b>₦74k–₦76k</b>. Kano still{" "}
              <b className="text-good-fg">₦68k</b>.
            </PicBubbleSection>
            <PicBubbleSection label="3 · Your pattern">
              You buy every 2 weeks. Wait for Kano{" "}
              <b className="text-good-fg">(saves ₦6k/bag)</b> or secure stock this week.
            </PicBubbleSection>
            <div className="bg-surface-2 border border-bd rounded-[14px] px-3.5 py-3 text-[14px] italic text-text-muted flex items-center justify-between gap-3">
              <span>Your call.</span>
              <span className="not-italic text-[10px] tracking-[0.04em] uppercase font-bold text-text-subtle whitespace-nowrap">
                facts · your decision
              </span>
            </div>
          </PicBubble>
        )}

        {phase === 1 && (
          <div className="flex gap-2 flex-wrap slide-up">
            <button
              onClick={() => setPhase(2)}
              className="text-[12px] font-semibold text-text bg-surface border border-bd-strong rounded-full px-3.5 py-2 active:scale-95 transition-transform"
            >
              Find cheaper wholesalers →
            </button>
            <button className="text-[12px] font-semibold text-text bg-surface border border-bd-strong rounded-full px-3.5 py-2">
              Compare tomatoes
            </button>
          </div>
        )}

        {phase >= 2 && (
          <UserBubble>How can I find wholesalers cheaper than ₦74k?</UserBubble>
        )}

        {phase === 2 && <TypingBubble />}

        {phase === 3 && (
          <PicBubble className="slide-up">
            <div className="text-[14px] leading-[1.5] text-text">
              Two on the network are below ₦74k right now:
            </div>
            <WholesalerCard
              name="Kano Wholesaler A"
              location="Kano"
              price="₦68k"
              unit="bag"
              buyers="12 retailers bought last week"
              delivery="2–3 day delivery"
              highlight
            />
            <WholesalerCard
              name="Ibadan Wholesaler B"
              location="Ibadan"
              price="₦71.5k"
              unit="bag"
              delivery="Available today"
            />
            <div className="bg-surface-2 border border-bd rounded-[14px] px-3.5 py-3 text-[14px] italic text-text-muted">
              Tap a card to message them. Your call.
            </div>
          </PicBubble>
        )}
      </div>

      <div className="px-5 pt-3 pb-4 border-t border-bd bg-bg-deep">
        <div className="flex items-center gap-2.5 bg-surface border border-bd-strong rounded-full pl-[18px] pr-[6px] py-[6px] shadow-card">
          <span className="text-text-subtle text-[14px] flex-1 font-medium">
            Ask a follow-up…
          </span>
          <span className="w-9 h-9 rounded-full bg-cta-bg flex items-center justify-center">
            <Mic size={15} strokeWidth={2.2} className="text-cta-fg" />
          </span>
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="self-start bg-surface border border-bd rounded-[22px] rounded-bl-[6px] px-5 py-4 flex items-center gap-1.5 shadow-card fade-in">
      <span className="w-2 h-2 rounded-full bg-text-subtle typing-dot" />
      <span className="w-2 h-2 rounded-full bg-text-subtle typing-dot" />
      <span className="w-2 h-2 rounded-full bg-text-subtle typing-dot" />
    </div>
  );
}
