'use client';

import { ThemeToggle } from "@/components/ThemeToggle";

export function StaplesHeader() {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <div className="text-[12px] font-bold tracking-[0.06em] uppercase text-text-subtle">
          Staple basket
        </div>
        <div className="text-[26px] font-extrabold tracking-[-0.025em] leading-[1.12] text-text mt-0.5">
          Your food <br />items
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}
