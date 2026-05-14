"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackToHome({
  onClick,
  className = "",
  ariaLabel = "Go to home",
}: {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const handle = () => {
    if (onClick) {
      onClick();
      return;
    }
    router.push("/home");
  };

  return (
    <button
      onClick={handle}
      aria-label={ariaLabel}
      className={
        "w-10 h-10 rounded-full bg-surface border border-bd flex items-center justify-center active:scale-90 transition-transform " +
        className
      }
    >
      <ArrowLeft size={14} strokeWidth={2} className="text-text" />
    </button>
  );
}
