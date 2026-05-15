"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mic, PhoneCall, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { Pill } from "@/components/Pill";
import { PriceRow } from "@/components/PriceRow";
import { MiniBarChart } from "@/components/MiniBarChart";
import { QuickAskBar } from "@/components/QuickAskBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PersonaSheet } from "@/components/PersonaSheet";
import { HomeContactSheet } from "@/components/HomeContactSheet";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { haptic } from "@/lib/haptics";
import { retailers, shortcuts } from "@/components/home/homeData";

export function HomeHub() {
  const router = useRouter();
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
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute -top-24 left-12 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(0.75rem+env(safe-area-inset-top))] sm:px-5 lg:px-8 lg:py-8 lg:pb-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-text-subtle">
                  Good {new Date().getHours() < 12 ? "Morning" : "Evening"}
                </div>
                <div className="mt-1 text-[30px] font-extrabold tracking-[-0.05em] leading-[1.02] text-text sm:text-[34px]">
                  Ngozi
                </div>
                <div className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-text-subtle">
                  <span className="h-2 w-2 rounded-full bg-good-fg" />
                  Ogbomoso
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => {
                    haptic("light");
                    setSheetOpen(true);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-rose text-[15px] font-extrabold text-rose-fg active:scale-90 transition-transform shadow-card"
                >
                  N
                </button>
              </div>
            </div>

            <Card className="overflow-hidden bg-gradient-to-br from-surface to-surface-2">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-[30rem]">
                  <SectionLabel>Speak first</SectionLabel>
                  <div className="mt-2 text-[24px] font-extrabold tracking-[-0.04em] leading-[1.05] text-text sm:text-[28px]">
                    Tap the mic and say what you need.
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.55] text-text-muted">
                    Compare prices, find retailers, or ask for help without
                    hunting through tabs.
                  </p>
                </div>

                <button
                  onClick={startStopListening}
                  aria-pressed={listening}
                  className={
                    "relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full shadow-float active:scale-95 transition-transform " +
                    (listening
                      ? "bg-alert-fg text-white"
                      : "bg-brand text-white")
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
                    setContactsOpen(true);
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

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="p-4">
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-text-subtle">
                  Last rice buy
                </div>
                <div className="mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-text">
                  ₦74k
                </div>
                <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
                  50kg bag in Ogbomoso.
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-text-subtle">
                  Cheapest nearby
                </div>
                <div className="mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-good-fg">
                  ₦68k
                </div>
                <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
                  Ilorin has the lowest price.
                </div>
              </Card>

              <Card className="p-4">
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-text-subtle">
                  Buying rhythm
                </div>
                <div className="mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-text">
                  2 weeks
                </div>
                <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
                  Based on your recent purchases.
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SectionLabel>Market now</SectionLabel>
                  <div className="mt-2 text-[18px] font-extrabold tracking-[-0.03em] text-text">
                    Nearby prices at a glance
                  </div>
                </div>
                <Pill variant="alert">▲ moving up</Pill>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <PriceRow location="Oyo" price="₦74k" />
                <PriceRow location="Iseyin" price="₦71.5k" />
                <PriceRow
                  location="Ilorin"
                  price="₦68k"
                  badge="cheapest"
                  variant="highlight"
                />
              </div>
            </Card>

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
          </div>

          <div className="space-y-4">
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SectionLabel>Price trend</SectionLabel>
                  <div className="mt-2 text-[18px] font-extrabold tracking-[-0.03em] text-text">
                    Your rice over time
                  </div>
                </div>
                <TrendingUp size={18} className="mt-1 text-good-fg" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-text-subtle">
                    Last buy
                  </div>
                  <div className="mt-1 text-[30px] font-extrabold tracking-[-0.04em] text-text leading-none">
                    ₦74k
                  </div>
                </div>
                <Pill variant="alert">▲ ₦4k</Pill>
              </div>
              <div className="mt-5">
                <MiniBarChart
                  bars={[
                    { label: "₦70k", barHeight: 22 },
                    { label: "₦72k", barHeight: 30 },
                    { label: "₦74k", barHeight: 38 },
                    { label: "now", barHeight: 38, active: true },
                  ]}
                />
              </div>
              <div className="mt-4 rounded-[18px] bg-cta-bg p-4 text-cta-fg">
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase opacity-60">
                  Simple compare
                </div>
                <div className="mt-1 text-[15px] leading-[1.55]">
                  You usually pay <b>₦72k</b>. Ilorin is <b>₦68k</b>. That is{" "}
                  <b>₦4k less</b> per bag.
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SectionLabel>Retailers</SectionLabel>
                  <div className="mt-2 text-[18px] font-extrabold tracking-[-0.03em] text-text">
                    Contact people fast
                  </div>
                </div>
                <button
                  onClick={() => setContactsOpen(true)}
                  className="text-[11px] font-bold tracking-[0.08em] uppercase text-brand active:scale-95 transition-transform"
                >
                  See all
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {retailers.map((contact) => (
                  <div
                    key={contact.phone}
                    className="rounded-[18px] border border-bd bg-surface-2 p-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[15px] font-extrabold text-text">
                          {contact.name}
                        </div>
                        <div className="mt-0.5 text-[12px] text-text-subtle">
                          {contact.place}
                        </div>
                      </div>
                      <Pill
                        variant={
                          contact.tone === "good"
                            ? "good"
                            : contact.tone === "alert"
                              ? "alert"
                              : "neutral"
                        }
                      >
                        {contact.price}
                      </Pill>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex-1 rounded-full bg-good-bg px-3 py-2.5 text-center text-[12px] font-bold text-good-fg"
                      >
                        Call
                      </a>
                      <a
                        href="/chat"
                        className="flex-1 rounded-full bg-cta-bg px-3 py-2.5 text-center text-[12px] font-bold text-cta-fg"
                      >
                        Chat
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setContactsOpen(true)}
                className="mt-3 flex w-full items-center justify-between rounded-full border border-bd bg-surface px-4 py-3 text-left active:scale-[0.99] transition-transform"
              >
                <span className="text-[13px] font-semibold text-text-muted">
                  Open the full contact sheet
                </span>
                <ArrowRight size={15} className="text-text-muted" />
              </button>
            </Card>

            <Card>
              <SectionLabel>Market pulse</SectionLabel>
              <div className="mt-3 space-y-3">
                <div className="rounded-[16px] bg-surface-2 border border-bd p-3">
                  <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
                    Cheapest today
                  </div>
                  <div className="mt-1 text-[16px] font-extrabold text-good-fg">
                    Ilorin · ₦68k
                  </div>
                  <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
                    Your last buy was ₦74k, so this is lower right now.
                  </div>
                </div>
                <div className="rounded-[16px] bg-surface-2 border border-bd p-3">
                  <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
                    What changed
                  </div>
                  <div className="mt-1 text-[16px] font-extrabold text-text">
                    Rice is moving up
                  </div>
                  <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
                    The gap between nearby markets is easier to spot here.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-4 lg:hidden">
          <QuickAskBar />
        </div>

        <PersonaSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
        <HomeContactSheet
          open={contactsOpen}
          onClose={() => setContactsOpen(false)}
        />
      </div>
    </div>
  );
}
