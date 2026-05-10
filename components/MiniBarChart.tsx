type Bar = { label: string; barHeight: number; active?: boolean };

export function MiniBarChart({ bars }: { bars: Bar[] }) {
  return (
    <div className="flex items-end gap-2.5">
      {bars.map((b, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className={`w-full rounded-md ${b.active ? "bg-text" : "bg-bd-strong"}`}
            style={{ height: `${b.barHeight}px` }}
          />
          <span
            className={`text-[9px] ${
              b.active ? "text-text font-bold" : "text-text-subtle font-medium"
            }`}
          >
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}