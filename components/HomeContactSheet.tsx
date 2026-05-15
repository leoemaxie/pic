"use client";

import { useRef, useEffect, useState } from "react";
import { MessageCircle, PhoneCall, X } from "lucide-react";
import { haptic } from "@/lib/haptics";

const contacts = [
  { name: "Ibrahim", place: "Kano", phone: "+2348000111111" },
  { name: "Aisha", place: "Ibadan", phone: "+2348000222222" },
  { name: "Chukwu", place: "Lagos", phone: "+2348000333333" },
];

export function HomeContactSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStart === null) return;
      const touchEnd = e.changedTouches[0].clientY;
      const distance = touchEnd - touchStart;

      if (distance > 80) {
        haptic("light");
        onClose();
      }
      setTouchStart(null);
    };

    if (open && sheetRef.current) {
      sheetRef.current.addEventListener("touchstart", handleTouchStart);
      sheetRef.current.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (sheetRef.current) {
        sheetRef.current.removeEventListener("touchstart", handleTouchStart);
        sheetRef.current.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [open, touchStart, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/45 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:items-center lg:justify-end lg:px-6"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="w-full max-w-md rounded-[28px] bg-surface p-4 text-left shadow-float border border-bd/80 touch-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[16px] font-extrabold text-text">
              Quick contacts
            </div>
            <div className="text-[11px] text-text-subtle">
              Call or open chat
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-bd bg-surface-2"
          >
            <X size={14} className="text-text-muted" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.phone}
              className="rounded-[18px] border border-bd bg-surface-2 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[15px] font-bold text-text">
                    {contact.name}
                  </div>
                  <div className="text-[12px] text-text-subtle">
                    {contact.place}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${contact.phone}`}
                    onClick={() => haptic("light")}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-good-bg text-good-fg"
                  >
                    <PhoneCall size={15} />
                  </a>
                  <a
                    href="/chat"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-cta-bg text-cta-fg"
                  >
                    <MessageCircle size={15} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
