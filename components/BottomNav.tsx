'use client';

import { useRouter, usePathname } from "next/navigation";
import {
  Home as HomeIcon,
  MessageCircle,
  Calendar,
  FileText,
  BarChart3,
  Package,
  ShoppingBag,
  User,
  Leaf,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

const retailerNav = [
  { to: "/home", label: "Home", icon: HomeIcon },
  { to: "/chat", label: "Ask PIC", icon: MessageCircle },
  { to: "/briefing", label: "Briefing", icon: Calendar },
  { to: "/staples", label: "Staples", icon: Leaf },
  { to: "/records", label: "Records", icon: FileText },
];

const wholesalerNav = [
  { to: "/wholesaler", label: "Demand", icon: BarChart3, active: true },
  { to: "/wholesaler", label: "Inventory", icon: Package, active: false },
  { to: "/wholesaler", label: "Orders", icon: ShoppingBag, active: false },
  { to: "/wholesaler", label: "Profile", icon: User, active: false },
];

export function BottomNav() {
  const { persona } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const items = persona === "wholesaler" ? wholesalerNav : retailerNav;

  return (
    <>
      <div className="flex border-t border-bd bg-bg-deep px-2 pt-2 pb-3.5 lg:hidden">
        {items.map((item) => {
          const Icon = item.icon;
          const active = persona === "wholesaler" ? Boolean((item as { active?: boolean }).active) : pathname === item.to;
          return (
            <button
              key={item.label}
              onClick={persona === "wholesaler" ? undefined : () => router.push(item.to)}
              aria-label={item.label}
              className={"flex-1 flex flex-col items-center gap-0.5 " +
                (persona !== "wholesaler" ? "py-1 active:scale-95 transition-transform" : "")
              }
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.4 : 1.7}
                className={active ? "text-text" : "text-text-faint"}
              />
              <span
                className={active ? "text-[10px] tracking-[0.02em] text-text font-bold" : "text-[10px] tracking-[0.02em] text-text-faint font-medium"}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:flex">
        <div className="flex flex-col gap-2 rounded-[24px] border border-bd/80 bg-surface/90 p-2 shadow-float backdrop-blur-md">
          {items.map((item) => {
            const Icon = item.icon;
            const active = persona === "wholesaler" ? Boolean((item as { active?: boolean }).active) : pathname === item.to;
            return (
              <button
                key={item.label}
                onClick={persona === "wholesaler" ? undefined : () => router.push(item.to)}
                className="w-12 h-12 rounded-[16px] flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-95"
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={active ? "text-text" : "text-text-faint"}
                />
                <span
                  className={active ? "text-[9px] tracking-[0.06em] uppercase whitespace-nowrap text-text font-bold" : "text-[9px] tracking-[0.06em] uppercase whitespace-nowrap text-text-faint font-medium"}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}