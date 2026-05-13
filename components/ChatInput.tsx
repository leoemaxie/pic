import { FormEvent, useRef } from "react";
import { Mic, Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e?: FormEvent) => void;
  sending: boolean;
  listening: boolean;
  onMicClick: () => void;
}

export function ChatInput({
  input,
  onInputChange,
  onSend,
  sending,
  listening,
  onMicClick,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSend();
    }
  };

  const isDisabled = sending || input.trim() === "";

  const formClass =
    "flex items-center gap-2.5 bg-surface border border-bd-strong " +
    "rounded-full pl-[12px] pr-[6px] py-[6px] shadow-card";

  const sendButtonClass =
    "w-9 h-9 rounded-full flex items-center justify-center " +
    "transition-opacity ml-2 " +
    (isDisabled ? "opacity-40 pointer-events-none" : "opacity-100");

  const micButtonClass =
    "w-9 h-9 rounded-full bg-cta-bg flex items-center justify-center ml-2";

  const micIconClass = listening ? "text-white animate-pulse" : "text-cta-fg";

  return (
    <div className="px-5 pt-3 pb-4 border-t border-bd bg-bg-deep">
      <form onSubmit={onSend} className={formClass}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a follow-up…"
          className="flex-1 bg-transparent outline-none text-[14px] px-3 py-2"
        />

        <button
          type="button"
          onClick={onMicClick}
          aria-pressed={listening}
          className={micButtonClass}
        >
          <Mic size={15} strokeWidth={2.2} className={micIconClass} />
        </button>

        <button
          type="submit"
          disabled={isDisabled}
          className={sendButtonClass}
          aria-label="Send message"
        >
          <Send size={16} strokeWidth={2} className="text-text" />
        </button>
      </form>
    </div>
  );
}
