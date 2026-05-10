import { ReactNode } from "react";

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle ${className}`}>
      {children}
    </div>
  );
}