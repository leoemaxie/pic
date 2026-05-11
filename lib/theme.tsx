'use client';

import { createContext, useContext, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type Persona = "retailer" | "wholesaler";

type Ctx = {
  theme: Theme;
  toggleTheme: () => void;
  persona: Persona;
  setPersona: (p: Persona) => void;
  hasRecords: boolean;
  setHasRecords: (b: boolean) => void;
  userId: string;
  setUserId: (id: string) => void;
};

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [persona, setPersona] = useState<Persona>("retailer");
  const [hasRecords, setHasRecords] = useState(true);
  const [userId, setUserId] = useState<string>("");

  const value: Ctx = {
    theme,
    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    persona,
    setPersona,
    hasRecords,
    setHasRecords,
    userId,
    setUserId,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme} className="bg-bg text-text min-h-full h-full w-full">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
