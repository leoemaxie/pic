import { ReactNode } from "react";

export function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div className="self-end max-w-[80%] bg-cta-bg text-cta-fg rounded-[22px] rounded-br-[6px] px-4 py-3 text-[14px] leading-[1.45] font-medium">
      {children}
    </div>
  );
}