"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Mic, PhoneCall } from "lucide-react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { haptic } from "@/lib/haptics";

interface VoiceCardProps {
  listening: boolean;
  voiceDraft: string;
  onStartStop: () => void;
  onContactsOpen: () => void;
}

export function VoiceCard({
  listening,
  voiceDraft,
  onStartStop,
  onContactsOpen,
}: VoiceCardProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-surface to-surface-2">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-[30rem]">
          <SectionLabel>Speak first</SectionLabel>
          <div className="mt-2 text-[24px] font-extrabold tracking-[-0.04em] leading-[1.05] text-text sm:text-[28px]">
            Tap the mic and say what you need.
          </div>
          <p className="mt-2 text-[14px] leading-[1.55] text-text-muted">
            Compare prices, find retailers, or ask for help without hunting
            through tabs.
          </p>
        </div>

        <button
          onClick={onStartStop}
          aria-pressed={listening}
          className={
            "relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full shadow-float active:scale-95 transition-transform " +
            (listening ? "bg-alert-fg text-white" : "bg-brand text-white")
          }
        >
          <Mic size={28} strokeWidth={2.2} />
          <span className="absolute inset-0 rounded-full border border-white/20" />
          {listening && (
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-surface bg-white" />
          )}
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => {
            haptic("medium");
            router.push("/chat");
          }}
          className="rounded-[18px] border border-bd bg-surface p-4 text-left active:scale-[0.99] transition-transform"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-subtle">
                Ask in chat
              </div>
              <div className="mt-1 text-[16px] font-extrabold text-text">
                Type or speak a question
              </div>
            </div>
            <ArrowRight size={16} className="mt-0.5 text-text-muted" />
          </div>
        </button>

        <button
          onClick={() => {
            haptic("light");
            onContactsOpen();
          }}
          className="rounded-[18px] border border-bd bg-surface p-4 text-left active:scale-[0.99] transition-transform"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-subtle">
                Retailer contact
              </div>
              <div className="mt-1 text-[16px] font-extrabold text-text">
                Call or chat now
              </div>
            </div>
            <PhoneCall size={16} className="mt-0.5 text-text-muted" />
          </div>
        </button>
      </div>

      {listening && (
        <div className="mt-4 rounded-[18px] border border-bd bg-surface-2 p-4">
          <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-text-subtle">
            Voice note
          </div>
          <div className="mt-1 text-[15px] font-semibold leading-[1.5] text-text">
            {voiceDraft || "Listening... speak naturally."}
          </div>
        </div>
      )}
    </Card>
  );
}
