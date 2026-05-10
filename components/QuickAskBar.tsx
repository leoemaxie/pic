'use client';

import { Mic } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickAskBar({
  placeholder = "Ask about rice, tomatoes…",
  onClick,
}: {
  placeholder?: string;
  onClick?: () => void;
}) {
  const router = useRouter();
  const handle = onClick ?? (() => router.push("/chat"));
  return (
    <button
      onClick={handle}
      className="w-full flex items-center gap-2.5 bg-surface border border-bd-strong rounded-full pl-[18px] pr-[6px] py-[6px] shadow-card active:scale-[0.98] transition-transform"
    >
      <span className="text-text-subtle text-[14px] flex-1 text-left font-medium">
        {placeholder}
      </span>
      <span className="w-9 h-9 rounded-full bg-cta-bg flex items-center justify-center">
        <Mic size={15} strokeWidth={2.2} className="text-cta-fg" />
      </span>
    </button>
  );
}