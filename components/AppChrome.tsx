"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname === "/" || pathname.startsWith("/onboarding");

  return (
    <>
      {children}
      {!hideChrome && <BottomNav />}
    </>
  );
}