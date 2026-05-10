type Assessment = "fair" | "opportunity" | "overpaid";

export function DealRow({
  product,
  date,
  price,
  wholesaler,
  marketAvg,
  assessment,
}: {
  product: string;
  date: string;
  price: string;
  wholesaler: string;
  marketAvg: string;
  assessment: Assessment;
}) {
  const badges: Record<Assessment, { bg: string; fg: string; label: string }> = {
    fair: { bg: "bg-surface-2 border border-bd", fg: "text-text-muted", label: "Fair" },
    opportunity: { bg: "bg-good-bg border border-good-bd", fg: "text-good-fg", label: "Opportunity" },
    overpaid: { bg: "bg-alert-bg", fg: "text-alert-fg", label: "Overpaid" },
  };
  const b = badges[assessment];
  return (
    <div className="py-3.5 border-b border-bd last:border-b-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[15px] font-bold text-text truncate">{product}</div>
        <div className="text-[18px] font-extrabold text-text tracking-[-0.01em] flex-shrink-0">
          {price}
        </div>
      </div>
      <div className="flex items-center justify-between mt-1 gap-3">
        <div className="text-[11px] text-text-subtle truncate">
          {date} · {wholesaler}
        </div>
        <span
          className={`text-[10px] font-bold tracking-[0.04em] uppercase px-2 py-[3px] rounded-full whitespace-nowrap ${b.bg} ${b.fg}`}
        >
          {b.label}
        </span>
      </div>
      <div className="text-[11px] text-text-subtle mt-1">market avg {marketAvg}</div>
    </div>
  );
}