"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Warehouse } from "lucide-react";
import { ChatIllo, CompareIllo, NetworkIllo } from "./Illos";
import { DotIndicator } from "@/components/DotIndicator";
import { ThemeToggle } from "@/components/ThemeToggle";

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

const AUTO_ADVANCE_MS = 2600;

export function Onboarding({ step }: { step: string }) {
  const router = useRouter();
  const initialIndex = Math.max(
    0,
    Math.min(SLIDES.length - 1, parseInt(step ?? "1", 10) - 1),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (activeIndex >= SLIDES.length - 1) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => Math.min(current + 1, SLIDES.length - 1));
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  const chooseRole = (role: "retailer" | "wholesaler") => {
    if (role === "wholesaler") {
      router.push("/wholesaler");
      return;
    }
    router.push("/home");
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-bg">
      <div className="flex justify-between items-start px-5 pt-4 pb-1">
        <div className="w-10" />
        <div className="text-center">
          <div className="text-2xl font-extrabold text-brand tracking-[-0.02em] leading-none">
            PIC
          </div>
          <div className="text-[12px] font-bold tracking-[0.12em] uppercase text-text-subtle mt-0.5">
            Price Intelligence
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-2">
        <div
          className="flex h-full transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {SLIDES.map((slide, index) => (
            <section
              key={index}
              className="flex h-full w-full shrink-0 flex-col px-5 pb-6 pt-3 text-center"
            >
              <div className="flex flex-1 items-center justify-center relative fade-in px-1">
                {slide.illo === "chat" && <ChatIllo />}
                {slide.illo === "compare" && <CompareIllo />}
                {slide.illo === "network" && <NetworkIllo />}
              </div>

              <div className="px-5 text-center">
                <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.025em] text-text">
                  {slide.title}
                </h1>
                <p className="text-[14px] text-text-muted leading-[1.55] mt-3.5">
                  {slide.body}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="py-5 flex justify-center">
        <DotIndicator total={SLIDES.length} active={activeIndex} />
      </div>

      <div className="px-6 pb-7 flex flex-col gap-2">
        <p className="text-center text-[12px] font-semibold tracking-[0.01em] text-text-subtle mb-1">
          Choose how you want to use PIC
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => chooseRole("retailer")}
            className="bg-surface border border-bd rounded-2xl px-3 py-3.5 text-left active:scale-[0.98] transition-transform shadow-float"
            aria-label="Continue as Retailer"
            type="button"
          >
            <div className="w-9 h-9 rounded-xl bg-good-bg border border-good-bd flex items-center justify-center text-good-fg">
              <Store size={17} strokeWidth={2.2} />
            </div>
            <div className="mt-2 text-[14px] font-extrabold text-text tracking-[-0.01em]">
              Buyer (Retailer)
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              Buy smarter for your shop
            </div>
          </button>

          <button
            onClick={() => chooseRole("wholesaler")}
            className="bg-surface border border-bd rounded-2xl px-3 py-3.5 text-left active:scale-[0.98] transition-transform shadow-float"
            aria-label="Continue as Wholesaler"
            type="button"
          >
            <div className="w-9 h-9 rounded-xl bg-rose flex items-center justify-center text-rose-fg">
              <Warehouse size={17} strokeWidth={2.2} />
            </div>
            <div className="mt-2 text-[14px] font-extrabold text-text tracking-[-0.01em]">
              Seller (Wholesaler)
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              Sell and reach more retailers
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage({
  params,
}: {
  params: Promise<{ step?: string | string[] }>;
}) {
  const resolved = React.use(params);
  const raw = resolved?.step;
  const step = Array.isArray(raw) ? raw[0] : (raw ?? "1");
  return <Onboarding step={step} />;
}

/* Illo components moved to ./Illos */
