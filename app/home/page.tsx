import { HomeHub } from "@/components/home/HomeHub";

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute -top-24 left-12 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(0.75rem+env(safe-area-inset-top))] sm:px-5 lg:px-8 lg:py-8 lg:pb-8">
        <HomeHub />
      </div>
    </div>
  );
}
