"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { haptic } from "@/lib/haptics";

interface HeaderSectionProps {
  onPersonaClick: () => void;
}

export function HeaderSection({ onPersonaClick }: HeaderSectionProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-text-subtle">
          Good {new Date().getHours() < 12 ? "Morning" : "Evening"}
        </div>
        <div className="mt-1 text-[30px] font-extrabold tracking-[-0.05em] leading-[1.02] text-text sm:text-[34px]">
          Ngozi
        </div>
        <div className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-text-subtle">
          <span className="h-2 w-2 rounded-full bg-good-fg" />
          Ogbomoso
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => {
            haptic("light");
            onPersonaClick();
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-rose text-[15px] font-extrabold text-rose-fg active:scale-90 transition-transform shadow-card"
        >
          N
        </button>
      </div>
    </div>
  );
}
