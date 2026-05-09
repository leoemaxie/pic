import { ReactNode } from "react";

type Variant = "alert" | "good" | "neutral" | "outlined";

export function Pill({
  variant = "neutral",
  children,
  className = "",
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  const styles: Record<Variant, string> = {
    alert: "bg-alert-bg text-alert-fg",
    good: "bg-good-bg text-good-fg border border-good-bd",
    neutral: "bg-surface-2 text-text-muted border border-bd",
    outlined: "bg-surface text-text border border-bd-strong",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[10px] font-bold tracking-[0.04em] uppercase whitespace-nowrap ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}