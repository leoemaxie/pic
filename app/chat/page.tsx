"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type Phase = 0 | 1 | 2 | 3;

export default function Chat() {
  const [phase, setPhase] = useState<Phase>(0);
  const scrollRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Rice prices have been going up. When should I restock?",
  ]);
  const { listening, startStopListening, recognitionRef } =
    useSpeechRecognition();
  const [sending, setSending] = useState(false);

  // Handle phase transitions
  useEffect(() => {
    if (phase === 0) {
      const t = setTimeout(() => setPhase(1), 1500);
      return () => clearTimeout(t);
    }
    if (phase === 2) {
      const t = setTimeout(() => setPhase(3), 1300);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Update speech recognition callback with input state
  useEffect(() => {
    const recog = recognitionRef.current;
    if (!recog) return;

    recog.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      setInput((prev) =>
        final ? prev + final : interim ? prev + interim : prev,
      );
    };
  }, [recognitionRef]);

  async function handleSend(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    // Optimistic UI: append user message
    setMessages((s) => [...s, text]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      const reply = typeof data === "string" ? data : data?.reply || "";
      if (reply) setMessages((s) => [...s, reply]);
    } catch (err) {
      setMessages((s) => [...s, "Sorry, I couldn't send that. Try again."]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-hidden bg-bg"
      style={{
        paddingLeft: "0",
        paddingRight: "0",
        paddingTop: "0",
      }}
    >
      <div
        className="lg:pl-24 lg:pr-8 lg:py-8 flex flex-col h-screen"
        style={{ height: "100dvh" }}
      >
        <ChatHeader listening={listening} onMicClick={startStopListening} />

        <MessageList
          messages={messages}
          phase={phase}
          onPhaseChange={setPhase}
          scrollRef={scrollRef}
        />

        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          sending={sending}
          listening={listening}
          onMicClick={startStopListening}
        />
      </div>
    </div>
  );
}
