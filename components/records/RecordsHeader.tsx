"use client";

import { Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

interface RecordsHeaderProps {
  onReset: () => void;
}

export function RecordsHeader({ onReset }: RecordsHeaderProps) {
  const router = useRouter();

  return (
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
          onClick={() => router.push("/home")}
          aria-label="Go to home"
          className="w-10 h-10 rounded-full bg-surface border border-bd flex items-center justify-center active:scale-90 transition-transform"
        >
          <Home size={14} strokeWidth={2} className="text-text-muted" />
        </button>
        <button
          onClick={onReset}
          aria-label="Reset demo"
          className="w-10 h-10 rounded-full bg-surface border border-bd flex items-center justify-center active:scale-90 transition-transform"
        >
          <RotateCcw size={14} strokeWidth={2} className="text-text-muted" />
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
