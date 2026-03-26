import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TruthLens V2 — Live News + Fact Verification",
  description: "Live news dashboard with explainable credibility analysis, admin dashboard, saved analyses, and AI claim extraction."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
