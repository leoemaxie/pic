"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { Pill } from "@/components/Pill";
import { homeProducts } from "@/components/home/homeData";
import { ProductSelector } from "@/components/home/ProductSelector";

interface RetailersCardProps {
  onSeeAll: () => void;
}

export function RetailersCard({ onSeeAll }: RetailersCardProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>(
    homeProducts[0].name,
  );
  const product =
    homeProducts.find((item) => item.name === selectedProduct) ??
    homeProducts[0];

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <SectionLabel>Retailers</SectionLabel>
          <div className="mt-2 text-[18px] font-extrabold tracking-[-0.03em] text-text">
            Contact people fast
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ProductSelector
            value={selectedProduct}
            onChange={setSelectedProduct}
          />
          <button
            onClick={onSeeAll}
            className="mt-6 text-[11px] font-bold tracking-[0.08em] uppercase text-brand active:scale-95 transition-transform"
          >
            See all
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {product.retailers.map((contact) => (
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
        onClick={onSeeAll}
        className="mt-3 flex w-full items-center justify-between rounded-full border border-bd bg-surface px-4 py-3 text-left active:scale-[0.99] transition-transform"
      >
        <span className="text-[13px] font-semibold text-text-muted">
          Open the full contact sheet
        </span>
        <ArrowRight size={15} className="text-text-muted" />
      </button>
    </Card>
  );
}
