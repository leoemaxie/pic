"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { haptic } from "@/lib/haptics";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  helper?: string;
  active?: boolean;
  disabled?: boolean;
};

const retailerNav: NavItem[] = [
  { to: "/home", label: "Home", icon: HomeIcon },
  { to: "/chat", label: "Ask PIC", icon: MessageCircle },
  { to: "/briefing", label: "Briefing", icon: Calendar },
  { to: "/staples", label: "Staples", icon: Leaf },
  { to: "/records", label: "Records", icon: FileText },
];

const wholesalerNav: NavItem[] = [
  { to: "/wholesaler", label: "Demand", icon: BarChart3, active: true },
  { to: "/wholesaler", label: "Inventory", icon: Package, disabled: true },
  { to: "/wholesaler", label: "Orders", icon: ShoppingBag, disabled: true },
  { to: "/wholesaler", label: "Profile", icon: User, disabled: true },
];

export function BottomNav() {
  const { persona } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const hideMobileLauncher =
    pathname === "/" || pathname.startsWith("/onboarding") || pathname.startsWith("/chat");

  const items = persona === "wholesaler" ? wholesalerNav : retailerNav;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, persona]);

  const title = useMemo(() => {
    if (persona === "wholesaler") return "Wholesaler cockpit";
    if (pathname === "/chat") return "Ask PIC";
    if (pathname === "/briefing") return "Briefing";
    if (pathname === "/staples") return "Staples";
    if (pathname === "/records") return "Records";
    return "Home";
  }, [persona, pathname]);

  const navigate = (to: string) => {
    setMenuOpen(false);
    router.push(to);
  };

  const currentPath = pathname;

  return (
    <>
      {!hideMobileLauncher && (
        <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => {
            haptic("light");
            setMenuOpen(true);
          }}
          className="flex items-center gap-2 rounded-full border border-bd/80 bg-surface/90 px-4 py-3 shadow-float backdrop-blur-md active:scale-95 transition-transform"
          aria-label="Open app navigation"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-deep border border-bd">
            <span className="block h-2 w-2 rounded-full bg-brand" />
          </span>
          <span className="text-[12px] font-extrabold tracking-[0.04em] uppercase text-text">
            {title}
          </span>
        </button>
        </div>
      )}

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/45 px-3 pb-3 lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full rounded-[30px] border border-bd/80 bg-surface/96 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 shadow-float backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center py-2">
              <div className="h-1.5 w-12 rounded-full bg-bd-strong" />
            </div>

            <div className="px-2 pb-2 pt-1">
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-text-subtle">
                Mobile navigation
              </div>
              <div className="mt-1 text-[18px] font-extrabold tracking-[-0.03em] text-text">
                {title}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const active =
                  persona === "wholesaler"
                    ? Boolean(item.active)
                    : currentPath === item.to;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.disabled ? undefined : () => {
                      haptic("medium");
                      navigate(item.to);
                    }}
                    disabled={item.disabled}
                    className={
                      "flex items-center gap-3 rounded-[20px] border px-4 py-3 text-left transition-transform active:scale-[0.99] " +
                      (active ? "border-text bg-bg-deep" : "border-bd bg-surface-2") +
                      (item.disabled ? " opacity-55" : "")
                    }
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface border border-bd">
                      <Icon
                        size={18}
                        strokeWidth={active ? 2.4 : 1.8}
                        className={active ? "text-text" : "text-text-faint"}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-extrabold text-text">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-[1.35] text-text-subtle">
                        {item.disabled ? "Planned section" : "Open section"}
                      </span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-faint">
                      {active ? "Open" : item.disabled ? "Soon" : "Go"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 px-1">
              <button
                type="button"
                onClick={() => {
                  haptic("light");
                  navigate(persona === "wholesaler" ? "/home" : "/chat");
                }}
                className="rounded-[18px] border border-bd bg-surface-2 px-4 py-3 text-left active:scale-[0.99] transition-transform"
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-subtle">
                  Quick action
                </div>
                <div className="mt-1 text-[14px] font-extrabold text-text">
                  {persona === "wholesaler" ? "Back to retail view" : "Open chat"}
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  haptic("light");
                  setMenuOpen(false);
                }}
                className="rounded-[18px] border border-bd bg-surface-2 px-4 py-3 text-left active:scale-[0.99] transition-transform"
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-subtle">
                  Close
                </div>
                <div className="mt-1 text-[14px] font-extrabold text-text">
                  Dismiss sheet
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:flex">
        <div className="flex flex-col gap-2 rounded-[24px] border border-bd/80 bg-surface/90 p-2 shadow-float backdrop-blur-md">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              persona === "wholesaler"
                ? Boolean(item.active)
                : currentPath === item.to;

            return (
              <button
                key={item.label}
                type="button"
                onClick={
                  persona === "wholesaler"
                    ? undefined
                    : () => {
                        haptic("medium");
                        router.push(item.to);
                      }
                }
                className="w-12 h-12 rounded-[16px] flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-95"
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={active ? "text-text" : "text-text-faint"}
                />
                <span
                  className={
                    active
                      ? "text-[9px] tracking-[0.06em] uppercase whitespace-nowrap text-text font-bold"
                      : "text-[9px] tracking-[0.06em] uppercase whitespace-nowrap text-text-faint font-medium"
                  }
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
