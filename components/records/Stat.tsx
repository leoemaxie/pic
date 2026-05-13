'use client';

interface StatProps {
  label: string;
  value: string;
  tone?: "good" | "alert";
}

export function Stat({ label, value, tone }: StatProps) {
  const colorMap = {
    good: "text-good-fg",
    alert: "text-alert-fg",
  };
  
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
        {label}
      </div>
      <div
        className={`text-[20px] font-extrabold tracking-[-0.02em] mt-0.5 leading-none ${
          tone ? colorMap[tone] : "text-text"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
