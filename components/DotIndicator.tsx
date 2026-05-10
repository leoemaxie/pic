export function DotIndicator({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 bg-text ${
            i === active ? "w-5 opacity-100" : "w-1.5 opacity-25"
          }`}
        />
      ))}
    </div>
  );
}