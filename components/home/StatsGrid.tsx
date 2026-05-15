"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { homeProducts } from "@/components/home/homeData";
import { ProductSelector } from "@/components/home/ProductSelector";

export function StatsGrid() {
  const [selectedProduct, setSelectedProduct] = useState<string>(
    homeProducts[0].name,
  );
  const product =
    homeProducts.find((item) => item.name === selectedProduct) ??
    homeProducts[0];

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionLabel>Overview</SectionLabel>
        <ProductSelector
          value={selectedProduct}
          onChange={setSelectedProduct}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-text-subtle">
            {product.stats.lastBuyLabel}
          </div>
          <div className="mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-text">
            {product.stats.lastBuy}
          </div>
          <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
            {product.stats.lastBuyNote}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-text-subtle">
            {product.stats.cheapestLabel}
          </div>
          <div className="mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-good-fg">
            {product.stats.cheapest}
          </div>
          <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
            {product.stats.cheapestNote}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-text-subtle">
            {product.stats.rhythmLabel}
          </div>
          <div className="mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-text">
            {product.stats.rhythm}
          </div>
          <div className="mt-1 text-[12px] leading-[1.45] text-text-muted">
            {product.stats.rhythmNote}
          </div>
        </Card>
      </div>
    </div>
  );
}
