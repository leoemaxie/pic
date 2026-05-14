"use client";

import { useState } from "react";
import { StaplesHeader } from "@/components/staples/StaplesHeader";
import { StapleCard } from "@/components/staples/StapleCard";
import { StapleDetail } from "@/components/staples/StapleDetail";
import { STAPLES } from "@/components/staples/staplesData";

export default function Staples() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const selected = selectedItem
    ? STAPLES.find((s) => s.name === selectedItem)
    : null;

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-bg">
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-5 pb-24 pt-5 lg:px-8 lg:pl-24 lg:pr-8 lg:py-8">
        <StaplesHeader />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STAPLES.map((staple) => (
            <StapleCard
              key={staple.name}
              staple={staple}
              isSelected={selectedItem === staple.name}
              onSelect={setSelectedItem}
            />
          ))}
        </div>

        {selected && <StapleDetail staple={selected} />}
      </div>
    </div>
  );
}
