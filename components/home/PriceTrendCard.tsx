"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/Card";
import { Pill } from "@/components/Pill";
import { MiniBarChart } from "@/components/MiniBarChart";
import { SectionLabel } from "@/components/SectionLabel";
import { homeProducts } from "@/components/home/homeData";
import { ProductSelector } from "@/components/home/ProductSelector";

export function PriceTrendCard() {
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
          <SectionLabel>Price trend</SectionLabel>
          <div className="mt-2 text-[18px] font-extrabold tracking-[-0.03em] text-text">
            {product.name} over time
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ProductSelector
            value={selectedProduct}
            onChange={setSelectedProduct}
          />
          <TrendingUp size={18} className="mt-2 text-good-fg" />
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-text-subtle">
            Last buy
          </div>
          <div className="mt-1 text-[30px] font-extrabold tracking-[-0.04em] text-text leading-none">
            {product.priceTrend.lastBuy}
          </div>
        </div>
        <Pill variant="alert">{product.priceTrend.delta}</Pill>
      </div>
      <div className="mt-5">
        <MiniBarChart bars={[...product.priceTrend.bars]} />
      </div>
      <div className="mt-4 rounded-[18px] bg-cta-bg p-4 text-cta-fg">
        <div className="text-[10px] font-bold tracking-[0.08em] uppercase opacity-60">
          Simple compare
        </div>
        <div
          className="mt-1 text-[15px] leading-[1.55]"
          dangerouslySetInnerHTML={{ __html: product.priceTrend.compare }}
        />
      </div>
    </Card>
  );
}
