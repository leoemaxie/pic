import { MapPin, Truck, ChevronRight } from "lucide-react";

export function WholesalerCard({
  name,
  location,
  price,
  unit,
  buyers,
  delivery,
  highlight,
}: {
  name: string;
  location: string;
  price: string;
  unit: string;
  buyers?: string;
  delivery: string;
  highlight?: boolean;
}) {
  return (
    <button
      className={`w-full text-left bg-surface-2 border ${
        highlight ? "border-good-bd" : "border-bd"
      } rounded-[16px] p-3.5 active:scale-[0.99] transition-transform`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-text truncate">{name}</div>
          <div className="text-[11px] text-text-subtle mt-0.5 flex items-center gap-1">
            <MapPin size={10} strokeWidth={2} />
            {location}
          </div>
        </div>
        <div
          className={`text-[20px] font-extrabold tracking-[-0.01em] flex-shrink-0 ${
            highlight ? "text-good-fg" : "text-text"
          }`}
        >
          {price}
          <span className="text-[10px] font-semibold ml-1 opacity-60">/{unit}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-bd">
        {buyers && <span className="text-[11px] text-text-muted">{buyers}</span>}
        <span className="text-[11px] text-text-muted flex items-center gap-1">
          <Truck size={11} strokeWidth={1.8} />
          {delivery}
        </span>
        <span className="ml-auto text-[11px] font-bold text-brand flex items-center gap-0.5">
          Contact
          <ChevronRight size={12} strokeWidth={2.5} />
        </span>
      </div>
    </button>
  );
}