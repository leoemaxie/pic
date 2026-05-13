'use client';

interface ViewTabsProps {
  view: "purchases" | "trends";
  onViewChange: (view: "purchases" | "trends") => void;
}

export function ViewTabs({ view, onViewChange }: ViewTabsProps) {
  return (
    <div className="px-5 pt-3 pb-3 flex gap-2 border-b border-bd">
      <button
        onClick={() => onViewChange("purchases")}
        className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
          view === "purchases"
            ? "bg-cta-bg text-cta-fg"
            : "bg-surface border border-bd text-text"
        }`}
      >
        Purchases
      </button>
      <button
        onClick={() => onViewChange("trends")}
        className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
          view === "trends"
            ? "bg-cta-bg text-cta-fg"
            : "bg-surface border border-bd text-text"
        }`}
      >
        Trends
      </button>
    </div>
  );
}
