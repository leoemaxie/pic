import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-surface border border-bd rounded-[20px] p-[18px] shadow-card ${className}`}
    >
      {children}
    </div>
  );
}