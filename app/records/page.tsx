'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { BottomNav } from "@/components/BottomNav";
import { RecordsHeader } from "@/components/records/RecordsHeader";
import { ViewTabs } from "@/components/records/ViewTabs";
import { Populated } from "@/components/records/Populated";
import { TrendsView } from "@/components/records/TrendsView";
import { Empty } from "@/components/records/Empty";

export default function Records() {
  const { hasRecords, setHasRecords } = useTheme();
  const router = useRouter();
  const [view, setView] = useState<"purchases" | "trends">("purchases");

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-bg lg:pl-24 lg:pr-8 lg:py-8">
      <RecordsHeader onReset={() => setHasRecords(!hasRecords)} />

      {hasRecords && <ViewTabs view={view} onViewChange={setView} />}

      {hasRecords && view === "purchases" && <Populated />}
      {hasRecords && view === "trends" && <TrendsView />}
      {!hasRecords && <Empty onAsk={() => router.push("/chat")} />}

      <BottomNav />
    </div>
  );
}