"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { SectionLabel } from "@/components/SectionLabel";
import { PriceRow } from "@/components/PriceRow";
import { homeProducts } from "@/components/home/homeData";
import { ProductSelector } from "@/components/home/ProductSelector";

export function MarketCard() {
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
          <SectionLabel>Market now</SectionLabel>
          <div className="mt-2 text-[18px] font-extrabold tracking-[-0.03em] text-text">
            {product.marketNow.subtitle}
          </div>
        </div>
        <ProductSelector
          value={selectedProduct}
          onChange={setSelectedProduct}
        />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {product.marketNow.rows.map((row) => (
          <PriceRow
            key={row.location}
            location={row.location}
            price={row.price}
            badge={"badge" in row ? row.badge : undefined}
            variant={"variant" in row ? row.variant : undefined}
          />
        ))}
      </div>
    </Card>
  );
}
