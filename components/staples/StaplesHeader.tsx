"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export function StaplesHeader() {
  const router = useRouter();

  return (
    <div className="flex justify-between items-start mb-6 gap-3">
      <div>
        <div className="text-[12px] font-bold tracking-[0.06em] uppercase text-text-subtle">
          Staple basket
        </div>
        <div className="text-[26px] font-extrabold tracking-[-0.025em] leading-[1.12] text-text mt-0.5">
          Your food <br />
          items
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/home")}
          aria-label="Go to home"
          className="w-10 h-10 rounded-full bg-surface border border-bd flex items-center justify-center active:scale-90 transition-transform"
        >
          <Home size={14} strokeWidth={2} className="text-text-muted" />
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
