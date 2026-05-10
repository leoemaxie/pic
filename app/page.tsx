'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push("/onboarding/1"), 2100);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-bg fade-in py-20 lg:py-24">
      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <div
          className="absolute top-[12%] left-[18%] w-12 h-14 bg-gold rounded-xl flex items-center justify-center text-gold-fg text-[22px] font-extrabold shadow-float float-soft"
          style={{ ["--r" as never]: "-12deg", transform: "rotate(-12deg)" }}
        >
          ₦
        </div>
        <div
          className="absolute top-[20%] right-[18%] w-9 h-9 rounded-full bg-rose shadow-float float-soft"
          style={{ animationDelay: "0.6s" }}
        />
        <div
          className="absolute bottom-[18%] right-[16%] w-[68px] h-7 bg-good-bg border border-good-bd rounded-full flex items-center justify-center text-[10px] font-bold tracking-[0.04em] text-good-fg shadow-float float-soft"
          style={{ ["--r" as never]: "10deg", transform: "rotate(10deg)", animationDelay: "1.2s" }}
        >
          ₦68k
        </div>

        <div className="text-center relative z-10">
          <div className="text-[80px] font-extrabold text-brand tracking-[-0.05em] leading-none">
            PIC
          </div>
          <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-text-subtle mt-3">
            Price Intelligence
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-1 rounded-full bg-bd-strong overflow-hidden">
          <div className="h-full bg-text loading-bar rounded-full" />
        </div>
        <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-text-faint">
          Connecting market network…
        </div>
      </div>
    </div>
  );
}
