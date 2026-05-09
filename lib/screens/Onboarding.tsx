'use client';

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";
import { DotIndicator } from "../../app/components/DotIndicator";
import { ThemeToggle } from "../../app/components/ThemeToggle";

type Slide = {
  title: ReactNode;
  body: string;
  illo: "chat" | "compare" | "network";
};

const SLIDES: Slide[] = [
  {
    title: (
      <>
        Log your purchases.
        <br />
        Not manually — just chat.
      </>
    ),
    body: "Tell PIC what you bought and at what price. Your history becomes your planning reference.",
    illo: "chat",
  },
  {
    title: (
      <>
        See market context.
        <br />
        Then you decide.
      </>
    ),
    body: "See what wholesalers are selling. What you paid before. Then plan your next restock.",
    illo: "compare",
  },
  {
    title: (
      <>
        The network
        <br />
        gets smarter.
      </>
    ),
    body: "Fair prices win. Transparent competition helps everyone.",
    illo: "network",
  },
];

export function Onboarding({ step }: { step: string }) {
  const router = useRouter();
  const idx = Math.max(0, Math.min(2, parseInt(step ?? "1") - 1));
  const slide = SLIDES[idx];
  const isLast = idx === 2;

  const next = () => {
    if (isLast) router.push("/home");
    else router.push(`/onboarding/${idx + 2}`);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-bg" key={idx}>
      <div className="flex justify-between items-start px-5 pt-4 pb-1">
        <div className="w-10" />
        <div className="text-center">
          <div className="text-[14px] font-extrabold text-brand tracking-[-0.02em] leading-none">
            PIC
          </div>
          <div className="text-[8px] font-bold tracking-[0.12em] uppercase text-text-subtle mt-0.5">
            Price Intelligence
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 relative fade-in">
        {slide.illo === "chat" && <ChatIllo />}
        {slide.illo === "compare" && <CompareIllo />}
        {slide.illo === "network" && <NetworkIllo />}
      </div>

      <div className="px-8 text-center">
        <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.025em] text-text">
          {slide.title}
        </h1>
        <p className="text-[14px] text-text-muted leading-[1.55] mt-3.5">{slide.body}</p>
      </div>

      <div className="py-5 flex justify-center">
        <DotIndicator total={3} active={idx} />
      </div>

      <div className="px-6 pb-7 flex flex-col gap-1">
        <button
          onClick={next}
          className="w-full bg-cta-bg text-cta-fg rounded-full py-4 font-bold text-[15px] tracking-[-0.01em] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {isLast ? "Get started" : "Continue"}
          <ArrowRight size={16} strokeWidth={2.4} />
        </button>
        <button
          onClick={() => router.push("/home")}
          className="text-[13px] font-medium text-text-muted py-2.5"
        >
          {isLast ? "—" : "I'll skip the tour"}
        </button>
      </div>
    </div>
  );
}

function ChatIllo() {
  return (
    <>
      <div
        className="absolute top-2 left-6 w-[42px] h-[50px] bg-gold rounded-xl flex items-center justify-center text-gold-fg text-[20px] font-extrabold shadow-float float-soft"
        style={{ ["--r" as never]: "-12deg", transform: "rotate(-12deg)" }}
      />
      <div
        className="absolute top-2 left-6 w-[42px] h-[50px] flex items-center justify-center text-gold-fg text-[20px] font-extrabold pointer-events-none"
        style={{ transform: "rotate(-12deg)" }}
      >
        ₦
      </div>
      <div
        className="absolute top-8 right-6 w-[34px] h-[34px] bg-rose rounded-full shadow-float float-soft"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-6 right-2 w-[110px] h-[28px] bg-good-bg border border-good-bd rounded-full flex items-center justify-center text-[10px] font-bold tracking-[0.04em] text-good-fg shadow-float float-soft"
        style={{ ["--r" as never]: "8deg", transform: "rotate(8deg)", animationDelay: "1s" }}
      >
        RICE 50KG · ₦74k
      </div>
      <div
        className="absolute bottom-10 left-2 w-[34px] h-[20px] bg-cta-bg rounded-full shadow-float float-soft"
        style={{ ["--r" as never]: "-10deg", transform: "rotate(-10deg)", animationDelay: "0.3s" }}
      />
      <div className="bg-surface border border-bd rounded-[24px] rounded-bl-[6px] px-5 py-4 max-w-[230px] shadow-float relative z-10">
        <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">YOU</div>
        <div className="text-[14px] text-text leading-[1.5] mt-1">
          Bought 5 bags rice at ₦74k from Lagos wholesaler today
        </div>
        <div className="flex gap-1 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-text typing-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-text typing-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-text typing-dot" />
        </div>
      </div>
    </>
  );
}

function CompareIllo() {
  return (
    <>
      <div
        className="absolute top-4 left-4 w-[36px] h-[36px] bg-gold rounded-[10px] flex items-center justify-center text-gold-fg text-[15px] font-extrabold shadow-float float-soft"
        style={{ ["--r" as never]: "-10deg", transform: "rotate(-10deg)" }}
      >
        ₦
      </div>
      <div
        className="absolute bottom-6 right-4 w-[44px] h-[20px] bg-rose rounded-full shadow-float float-soft"
        style={{
          ["--r" as never]: "15deg",
          transform: "rotate(15deg)",
          animationDelay: "0.6s",
        }}
      />
      <div className="flex items-center gap-2 relative z-10">
        <div className="bg-surface border border-bd rounded-[18px] p-3.5 w-[122px] shadow-float">
          <div className="text-[9px] font-bold tracking-[0.06em] uppercase text-text-subtle">
            YOU PAID
          </div>
          <div className="text-[22px] font-extrabold text-text mt-0.5 tracking-[-0.02em]">
            ₦74k
          </div>
          <div className="flex items-end gap-1 h-7 mt-2.5">
            <div className="flex-1 bg-bd-strong rounded h-3" />
            <div className="flex-1 bg-bd-strong rounded h-4" />
            <div className="flex-1 bg-bd-strong rounded h-5" />
            <div className="flex-1 bg-text rounded h-5" />
          </div>
          <div className="text-[10px] text-text-subtle mt-2">your last 4 buys</div>
        </div>
        <ArrowRight size={14} className="text-text-subtle flex-shrink-0" strokeWidth={2.4} />
        <div className="bg-surface border border-bd rounded-[18px] p-3.5 w-[122px] shadow-float">
          <div className="text-[9px] font-bold tracking-[0.06em] uppercase text-text-subtle">
            MARKET LOW
          </div>
          <div className="text-[22px] font-extrabold text-good-fg mt-0.5 tracking-[-0.02em]">
            ₦68k
          </div>
          <div className="text-[10px] text-good-fg font-bold mt-2.5">Kano wholesaler</div>
          <div className="text-[10px] text-text-subtle mt-1">save ₦6k/bag</div>
        </div>
      </div>
    </>
  );
}

function NetworkIllo() {
  return (
    <>
      <div
        className="absolute top-6 right-8 w-[30px] h-[30px] bg-gold rounded-[10px] flex items-center justify-center text-gold-fg text-[13px] font-extrabold shadow-float float-soft"
        style={{ ["--r" as never]: "12deg", transform: "rotate(12deg)" }}
      >
        ₦
      </div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 300 280"
        preserveAspectRatio="none"
      >
        <path
          d="M 70 70 Q 150 30 230 70"
          fill="none"
          stroke="var(--bd-strong)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
        <path
          d="M 230 210 Q 150 250 70 210"
          fill="none"
          stroke="var(--bd-strong)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
      </svg>
      <div className="relative flex flex-col items-center gap-3.5 w-full max-w-[260px]">
        <div className="bg-surface border border-bd rounded-[18px] px-3.5 py-2.5 shadow-float flex items-center gap-2.5 self-start">
          <div className="w-8 h-8 rounded-full bg-rose flex items-center justify-center text-[12px] font-extrabold text-rose-fg">
            N
          </div>
          <div>
            <div className="text-[12px] font-bold text-text">Ngozi · retailer</div>
            <div className="text-[10px] text-text-subtle">looking · ₦72k</div>
          </div>
        </div>
        <div className="bg-cta-bg text-cta-fg rounded-full px-4 py-2 text-[11px] font-extrabold tracking-[0.02em] shadow-float">
          RICE · 50KG · ₦68k–₦74k
        </div>
        <div className="bg-surface border border-bd rounded-[18px] px-3.5 py-2.5 shadow-float flex items-center gap-2.5 self-end">
          <div className="w-8 h-8 rounded-full bg-good-bg border border-good-bd flex items-center justify-center text-[12px] font-extrabold text-good-fg">
            I
          </div>
          <div>
            <div className="text-[12px] font-bold text-text">Ibrahim · wholesaler</div>
            <div className="text-[10px] text-text-subtle">Kano · ₦68k</div>
          </div>
        </div>
      </div>
    </>
  );
}