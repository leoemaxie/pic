import { useRouter } from "next/navigation";
import { ArrowLeft, Mic } from "lucide-react";

interface ChatHeaderProps {
  listening: boolean;
  onMicClick: () => void;
}

export function ChatHeader({ listening, onMicClick }: ChatHeaderProps) {
  const router = useRouter();

  const backButtonClass =
    "w-9 h-9 rounded-full bg-surface border border-bd flex items-center justify-center " +
    "active:scale-90 transition-transform";

  const micButtonClass =
    "w-9 h-9 rounded-full flex items-center justify-center relative " +
    (listening ? "bg-red-600 text-white" : "bg-cta-bg");

  const micIconClass = listening ? "text-white" : "text-cta-fg";

  return (
    <div
      className="flex items-center gap-2.5 px-5 pt-4 pb-3.5 border-b "
      style={{ borderColor: "var(--border-color)" }}
    >
      <button onClick={() => router.push("/home")} className={backButtonClass}>
        <ArrowLeft size={15} strokeWidth={2} className="text-text" />
      </button>

      <div className="flex-1">
        <div className="text-[16px] font-extrabold tracking-[-0.01em] text-text">
          Ask PIC
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={onMicClick}
          aria-pressed={listening}
          className={micButtonClass}
        >
          <Mic size={15} strokeWidth={2.2} className={micIconClass} />
        </button>
        {listening && (
          <span
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full "
            style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
          >
            <span
              className="block w-1.5 h-1.5 rounded-full bg-red-500 "
              style={{ animation: "pulse 2s infinite" }}
            />
          </span>
        )}
      </div>
    </div>
  );
}
