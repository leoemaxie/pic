export function DemandSignalCard({
  count,
  product,
  meta,
  helper,
  good,
}: {
  count: number;
  product: string;
  meta: string;
  helper?: string;
  good?: boolean;
}) {
  return (
    <div className="bg-surface border border-bd rounded-[20px] p-4 flex items-center gap-3.5 shadow-card">
      <div
        className={`w-[58px] h-[58px] rounded-[14px] flex flex-col items-center justify-center flex-shrink-0 border ${
          good ? "bg-good-bg border-good-bd" : "bg-surface-2 border-bd-strong"
        }`}
      >
        <div
          className={`text-[24px] font-extrabold leading-none tracking-[-0.02em] ${
            good ? "text-good-fg" : "text-text"
          }`}
        >
          {count}
        </div>
        <div
          className={`text-[9px] font-bold mt-0.5 uppercase tracking-[0.04em] ${
            good ? "text-good-fg" : "text-text-subtle"
          }`}
        >
          retailers
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-bold text-text">{product}</div>
        <div className="text-[12px] text-text-muted mt-0.5">{meta}</div>
        {helper && (
          <div
            className={`text-[11px] mt-1 font-medium ${
              good ? "text-good-fg" : "text-text-subtle"
            }`}
          >
            {helper}
          </div>
        )}
      </div>
    </div>
  );
}