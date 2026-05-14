import { CalendarDays, FileText, Leaf, MessageCircle } from "lucide-react";

export const shortcuts = [
  {
    label: "Ask PIC",
    helper: "Talk or type a question",
    icon: MessageCircle,
    href: "/chat",
  },
  {
    label: "Market briefing",
    helper: "What changed today",
    icon: CalendarDays,
    href: "/briefing",
  },
  {
    label: "Staples",
    helper: "Food items at a glance",
    icon: Leaf,
    href: "/staples",
  },
  {
    label: "Records",
    helper: "Your purchases and trends",
    icon: FileText,
    href: "/records",
  },
] as const;

export const retailers = [
  {
    name: "Ibrahim",
    place: "Kano",
    phone: "+2348000111111",
    price: "₦68k",
    tone: "good",
  },
  {
    name: "Aisha",
    place: "Ibadan",
    phone: "+2348000222222",
    price: "₦71.5k",
    tone: "neutral",
  },
  {
    name: "Chukwu",
    place: "Lagos",
    phone: "+2348000333333",
    price: "₦74k",
    tone: "alert",
  },
] as const;
