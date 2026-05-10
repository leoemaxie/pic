'use client';

import { Sun, Moon, User, Store, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";

export function PersonaSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, toggleTheme, persona, setPersona, hasRecords, setHasRecords } = useTheme();
  const router = useRouter();

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:justify-end lg:px-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 fade-in" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full bg-surface border-t border-bd rounded-t-[28px] p-5 slide-up lg:max-w-[420px] lg:rounded-[28px] lg:border lg:border-bd/80 lg:shadow-float lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto"
      >
        <div className="flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-bd-strong" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[16px] font-extrabold text-text tracking-[-0.01em]">
              Demo controls
            </div>
            <div className="text-[11px] text-text-subtle mt-0.5">
              Theme · persona · reset
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-2 border border-bd flex items-center justify-center"
          >
            <X size={14} className="text-text-muted" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 p-3 rounded-[14px] bg-surface-2 border border-bd active:scale-[0.99] transition-transform"
          >
            {theme === "light" ? (
              <Moon size={18} className="text-text" strokeWidth={2} />
            ) : (
              <Sun size={18} className="text-text" strokeWidth={2} />
            )}
            <div className="flex-1 text-left">
              <div className="text-[14px] font-bold text-text">
                {theme === "light" ? "Switch to dark" : "Switch to light"}
              </div>
              <div className="text-[11px] text-text-subtle">Currently {theme}</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (persona === "retailer") {
                setPersona("wholesaler");
                router.push("/wholesaler");
              } else {
                setPersona("retailer");
                router.push("/home");
              }
              onClose();
            }}
            className="flex items-center gap-3 p-3 rounded-[14px] bg-surface-2 border border-bd active:scale-[0.99] transition-transform"
          >
            {persona === "retailer" ? (
              <Store size={18} className="text-text" strokeWidth={2} />
            ) : (
              <User size={18} className="text-text" strokeWidth={2} />
            )}
            <div className="flex-1 text-left">
              <div className="text-[14px] font-bold text-text">
                {persona === "retailer"
                  ? "View as wholesaler (Ibrahim)"
                  : "View as retailer (Ngozi)"}
              </div>
              <div className="text-[11px] text-text-subtle">Switch demo persona</div>
            </div>
          </button>

          <button
            onClick={() => {
              setHasRecords(!hasRecords);
              onClose();
              router.push("/records");
            }}
            className="flex items-center gap-3 p-3 rounded-[14px] bg-surface-2 border border-bd active:scale-[0.99] transition-transform"
          >
            <RotateCcw size={18} className="text-text" strokeWidth={2} />
            <div className="flex-1 text-left">
              <div className="text-[14px] font-bold text-text">
                {hasRecords ? "Clear records (preview empty)" : "Restore records"}
              </div>
              <div className="text-[11px] text-text-subtle">Demo affordance</div>
            </div>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-bd text-center text-[11px] text-text-subtle italic">
          PIC · Wicked Lab Hackathon · 2026
        </div>
      </div>
    </div>
  );
}