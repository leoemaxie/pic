"use client";

import { homeProducts } from "@/components/home/homeData";

interface ProductSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSelector({ value, onChange }: ProductSelectorProps) {
  return (
    <label className="flex w-full flex-col gap-1.5 sm:w-[180px]">
      <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-text-subtle">
        Item
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-full border border-bd bg-surface-2 px-4 text-[13px] font-semibold text-text outline-none transition focus:border-brand"
      >
        {homeProducts.map((product) => (
          <option key={product.name} value={product.name}>
            {product.name}
          </option>
        ))}
      </select>
    </label>
  );
}
