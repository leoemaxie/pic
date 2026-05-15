"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { shortcuts } from "@/components/home/homeData";

export function QuickActionsCard() {
  const router = useRouter();

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <SectionLabel>Quick actions</SectionLabel>
        </div>
        <Sparkles size={18} className="mt-1 text-text-muted" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="rounded-[18px] border border-bd bg-surface-2 p-4 text-left active:scale-[0.99] transition-transform"
            >
              <Icon size={18} className="text-brand" />
              <div className="mt-3 text-[16px] font-extrabold text-text">
                {item.label}
              </div>
              <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
                {item.helper}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
