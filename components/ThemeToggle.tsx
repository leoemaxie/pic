'use client';

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="w-10 h-10 rounded-full bg-surface border border-bd flex items-center justify-center text-text active:scale-90 transition-transform"
    >
      {theme === "light" ? (
        <Moon size={15} strokeWidth={2} />
      ) : (
        <Sun size={15} strokeWidth={2} />
      )}
    </button>
  );
}