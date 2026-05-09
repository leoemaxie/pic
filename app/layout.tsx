import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "PIC",
  description: "Price Intelligence & Commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
