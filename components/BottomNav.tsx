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
} from "lucide-react";
import { useTheme } from "@/lib/theme";

const retailerNav = [
  { to: "/home", label: "Home", icon: HomeIcon },
  { to: "/chat", label: "Ask PIC", icon: MessageCircle },
  { to: "/briefing", label: "Briefing", icon: Calendar },
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

  if (persona === "wholesaler") {
    return (
      <div className="flex border-t border-bd bg-bg-deep px-2 pt-2 pb-3.5">
        {wholesalerNav.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-0.5">
              <Icon
                size={20}
                strokeWidth={item.active ? 2.4 : 1.7}
                className={item.active ? "text-text" : "text-text-faint"}
              />
              <span
                className={`text-[10px] tracking-[0.02em] ${
                  item.active ? "text-text font-bold" : "text-text-faint font-medium"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex border-t border-bd bg-bg-deep px-2 pt-2 pb-3.5">
      {retailerNav.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.to;
        return (
          <button
            key={item.label}
            onClick={() => router.push(item.to)}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 active:scale-95 transition-transform"
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.4 : 1.7}
              className={active ? "text-text" : "text-text-faint"}
            />
            <span
              className={`text-[10px] tracking-[0.02em] ${
                active ? "text-text font-bold" : "text-text-faint font-medium"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}