"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { homeProducts } from "@/components/home/homeData";
import { ProductSelector } from "@/components/home/ProductSelector";

export function MarketPulseCard() {
  const [selectedProduct, setSelectedProduct] = useState<string>(
    homeProducts[0].name,
  );
  const product =
    homeProducts.find((item) => item.name === selectedProduct) ??
    homeProducts[0];

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionLabel>Market pulse</SectionLabel>
        <ProductSelector
          value={selectedProduct}
          onChange={setSelectedProduct}
        />
      </div>
      <div className="mt-3 space-y-3">
        <div className="rounded-[16px] bg-surface-2 border border-bd p-3">
          <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
            Cheapest today
          </div>
          <div className="mt-1 text-[16px] font-extrabold text-good-fg">
            {product.pulse.cheapest}
          </div>
          <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
            {product.pulse.note}
          </div>
        </div>
        <div className="rounded-[16px] bg-surface-2 border border-bd p-3">
          <div className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-subtle">
            What changed
          </div>
          <div className="mt-1 text-[16px] font-extrabold text-text">
            {product.pulse.whatChanged}
          </div>
          <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
            {product.pulse.context}
          </div>
        </div>
      </div>
    </Card>
  );
}
