import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProfRate",
  description: "Rate and review your professors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}