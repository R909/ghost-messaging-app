import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GhostChat",
  description: "A ghost-inspired private messaging UI with static demo data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
