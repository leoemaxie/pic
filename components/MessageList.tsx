import { RefObject, useEffect } from "react";
import { UserBubble } from "@/components/UserBubble";
import { PicBubble, PicBubbleSection } from "@/components/PicBubble";
import { WholesalerCard } from "@/components/WholesalerCard";

type Phase = 0 | 1 | 2 | 3;

interface MessageListProps {
  messages: string[];
  phase: Phase;
  onPhaseChange: (phase: Phase) => void;
  scrollRef: RefObject<HTMLDivElement>;
}

function TypingBubble() {
  const typingDotClass = "w-2 h-2 rounded-full bg-text-subtle typing-dot";

  return (
    <div
      className="self-start bg-surface border border-bd rounded-[22px] "
      style={{ borderBottomLeftRadius: "6px" }}
    >
      <div className="px-5 py-4 flex items-center gap-1.5 shadow-card fade-in">
        <span className={typingDotClass} />
        <span className={typingDotClass} />
        <span className={typingDotClass} />
      </div>
    </div>
  );
}

function PriceHistorySection() {
  return (
    <PicBubbleSection label="1 · Your history">
      ₦70k <span className="text-text-subtle">(2w ago)</span> → ₦72k → ₦74k →{" "}
      <b>₦74k</b> last buy
    </PicBubbleSection>
  );
}

function MarketNowSection() {
  return (
    <PicBubbleSection label="2 · Market now">
      Most wholesalers <b>₦74k–₦76k</b>. Ilorin still{" "}
      <b className="text-good-fg">₦68k</b>.
    </PicBubbleSection>
  );
}

function PatternSection() {
  return (
    <PicBubbleSection label="3 · Your pattern">
      You buy every 2 weeks. Wait for Ilorin{" "}
      <b className="text-good-fg">(saves ₦6k/bag)</b> or secure stock this week.
    </PicBubbleSection>
  );
}

function CallToActionBox() {
  const containerClass =
    "bg-surface-2 border border-bd rounded-[14px] px-3.5 py-3 " +
    "text-[14px] italic text-text-muted flex items-center " +
    "justify-between gap-3";

  const labelClass =
    "not-italic text-[10px] tracking-[0.04em] uppercase " +
    "font-bold text-text-subtle whitespace-nowrap";

  return (
    <div className={containerClass}>
      <span>Your call.</span>
      <span className={labelClass}>your decision</span>
    </div>
  );
}

function ActionButtons({
  onFindWholesalers,
}: {
  onFindWholesalers: () => void;
}) {
  const buttonClass =
    "text-[12px] font-semibold text-text bg-surface border " +
    "border-bd-strong rounded-full px-3.5 py-2 " +
    "active:scale-95 transition-transform";

  return (
    <div className="flex gap-2 flex-wrap slide-up">
      <button onClick={onFindWholesalers} className={buttonClass}>
        Find cheaper wholesalers →
      </button>
      <button className={buttonClass}>Compare Spaghetti</button>
    </div>
  );
}

export function MessageList({
  messages,
  phase,
  onPhaseChange,
  scrollRef,
}: MessageListProps) {
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [phase, messages.length, scrollRef]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-3.5">
      {messages.map((m, i) => (
        <UserBubble key={i}>{m}</UserBubble>
      ))}

      {phase === 0 && <TypingBubble />}

      {phase >= 1 && (
        <PicBubble className="slide-up">
          <PriceHistorySection />
          <MarketNowSection />
          <PatternSection />
          <CallToActionBox />
        </PicBubble>
      )}

      {phase === 1 && (
        <ActionButtons onFindWholesalers={() => onPhaseChange(2)} />
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
            name="Ilorin Wholesaler A"
            location="Ilorin"
            price="₦68k"
            unit="bag"
            buyers="12 retailers bought last week"
            delivery="2–3 day delivery"
            highlight
          />
          <WholesalerCard
            name="Iseyin Wholesaler B"
            location="Iseyin"
            price="₦71.5k"
            unit="bag"
            delivery="Available today"
          />
          <div
            className="bg-surface-2 border border-bd rounded-[14px] "
            style={{ padding: "14px" }}
          >
            <p className="text-[14px] italic text-text-muted">
              Tap a card to message them. Your call.
            </p>
          </div>
        </PicBubble>
      )}
    </div>
  );
}
