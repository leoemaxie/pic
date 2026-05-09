import { ReactNode } from "react";

export function PicBubble({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`self-start max-w-[92%] bg-surface border border-bd rounded-[22px] rounded-bl-[6px] p-[18px] flex flex-col gap-3.5 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

export function PicBubbleSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-bd pt-3.5 first:border-t-0 first:pt-0">
      <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
        {label}
      </div>
      <div className="text-[14px] leading-[1.5] mt-1 text-text">{children}</div>
    </div>
  );
}