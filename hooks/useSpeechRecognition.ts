import { useEffect, useRef, useState } from "react";

export function useSpeechRecognition() {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      return { interim, final };
    };

    recog.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recog;
  }, []);

  const startStopListening = () => {
    const recog = recognitionRef.current;
    if (!recog) return;
    if (listening) {
      recog.stop();
      setListening(false);
    } else {
      try {
        recog.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  return { listening, startStopListening, recognitionRef };
}
