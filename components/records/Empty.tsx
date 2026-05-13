'use client';

import { MessageCircle } from "lucide-react";

interface EmptyProps {
  onAsk: () => void;
}

export function Empty({ onAsk }: EmptyProps) {
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
