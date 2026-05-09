type Variant = "neutral" | "highlight";

export function PriceRow({
  location,
  price,
  variant = "neutral",
  badge,
}: {
  location: string;
  price: string;
  variant?: Variant;
  badge?: string;
}) {
  if (variant === "highlight") {
    return (
      <div className="flex justify-between items-center bg-good-bg border border-good-bd -mx-2 px-3 py-2 rounded-[12px]">
        <span className="text-[14px] font-semibold text-good-fg">{location}</span>
        <span className="text-[20px] font-extrabold text-good-fg tracking-[-0.01em]">
          {price}
          {badge && <span className="text-[11px] font-semibold ml-1.5">{badge}</span>}
        </span>
      </div>
    );
  }
  return (
    <div className="flex justify-between items-center">
      <span className="text-[14px] text-text-muted font-medium">{location}</span>
      <span className="text-[18px] font-bold text-text tracking-[-0.01em]">{price}</span>
    </div>
  );
}