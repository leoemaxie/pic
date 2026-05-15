"use client";

import { useEffect, useState } from "react";
import { PersonaSheet } from "@/components/PersonaSheet";
import { HomeContactSheet } from "@/components/HomeContactSheet";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { HeaderSection } from "./HeaderSection";
import { VoiceCard } from "./VoiceCard";
import { StatsGrid } from "./StatsGrid";
import { MarketCard } from "./MarketCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { PriceTrendCard } from "./PriceTrendCard";
import { RetailersCard } from "./RetailersCard";
import { MarketPulseCard } from "./MarketPulseCard";

export function HomeHub() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [voiceDraft, setVoiceDraft] = useState("");
  const { listening, startStopListening, recognitionRef } =
    useSpeechRecognition();

  useEffect(() => {
    const recog = recognitionRef.current;
    if (!recog) return;

    recog.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }

      setVoiceDraft((final || interim || "").trim());
    };
  }, [recognitionRef]);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <div className="space-y-4">
        <HeaderSection onPersonaClick={() => setSheetOpen(true)} />

        <VoiceCard
          listening={listening}
          voiceDraft={voiceDraft}
          onStartStop={startStopListening}
          onContactsOpen={() => setContactsOpen(true)}
        />

        <StatsGrid />
        <MarketCard />
        <RetailersCard onSeeAll={() => setContactsOpen(true)} />
      </div>

      <div className="space-y-4">
        <PriceTrendCard />
        <MarketPulseCard />
        <QuickActionsCard />
      </div>

      <PersonaSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      <HomeContactSheet
        open={contactsOpen}
        onClose={() => setContactsOpen(false)}
      />
    </div>
  );
}
